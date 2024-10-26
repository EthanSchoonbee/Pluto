import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal, Pressable,
} from "react-native";
import LikedAnimalsPageHeader from "../components/LikedAnimalsPageHeader";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import styles from "../styles/LikedAnimalsPageStyle";
import fullScreenStyles from "../styles/FullScreenImageStyle";
import { db, auth } from "../services/firebaseConfig";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getLocalImageUrl } from "../utils/imageUtils";
import { useFocusEffect } from "@react-navigation/native";
import NavbarWrapper from "../components/NavbarWrapper";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Ionicons, Entypo } from "@expo/vector-icons";
import colors from "../styles/colors";

const activityLevelMapping = {
    0: "Couch Cushion",
    1: "Lap Cat",
    2: "Playful Pup",
    3: "Adventure Hound",
};

const LikedAnimalsPage = ({ navigation }) => {

    //all asynchronous states
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Dogs");
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    //state to hold and set the full screen image
    const [fullScreenImage, setFullScreenImage] = useState(null);

    const preloadImages = async (imageUrls) => {
        const storage = getStorage();
        const promises = imageUrls.map(async (imageUrl) => {
            try {
                const storageRef = ref(storage, imageUrl);
                const downloadUrl = await getDownloadURL(storageRef);

                const fileName = imageUrl.split("/").pop().replace(/%2F/g, "_");
                const dirPath = `${FileSystem.cacheDirectory}animals/`;
                const localUri = `${dirPath}${fileName}`;

                await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });

                const fileInfo = await FileSystem.getInfoAsync(localUri);

                if (!fileInfo.exists) {
                    await FileSystem.downloadAsync(downloadUrl, localUri);
                }

                return { uri: localUri };
            } catch (error) {
                console.error("Error downloading or caching image:", error);
                return null;
            }
        });

        return (await Promise.all(promises)).filter(Boolean);
    };

    const fetchLikedAnimals = useCallback(async () => {
        setLoading(true);
        try {
            //creating a reference to the users document
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            //listen for changes to the users document in the firestore database
            const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
                //if the collection document exists
                if (docSnapshot.exists()) {
                    //getting the document data
                    const userData = docSnapshot.data();
                    //gettting all the liked animal ids
                    const likedAnimalIds = userData.likedAnimals || [];

                    //mapping through each liked animal id and fetching the animal data
                    const animalPromises = likedAnimalIds.map(async (animalId) => {
                        //creating a reference to the animal document in the database
                        const animalDocRef = doc(db, "animals", animalId);
                        //asynchronously getting the animal document reference
                        const animalDoc = await getDoc(animalDocRef);
                        //if the animal document exists
                        if (animalDoc.exists()) {
                            //getting the animal document data
                            const animalData = animalDoc.data();
                            //initally setting the local image url to null
                            let localImageUrl = null;
                            try {
                                //calling the method that will preload the images using the image urls found in the database
                                const images = await preloadImages(animalData.imageUrls || []);
                                //setting the local image url to the first image in the array
                                localImageUrl = images[0]?.uri || null;
                                console.log("Local image URL:", localImageUrl);
                            } catch (error) {
                                //if there is an error, log it
                                console.error("Error getting local image URL:", error);
                            }
                            //returning the animal data
                            return {
                                id: animalDoc.id,
                                name: animalData.name,
                                species: animalData.species || "Unknown",
                                imageUrl: localImageUrl,
                                age: animalData.age,
                                gender: animalData.gender,
                                breed: animalData.breed,
                                adoptionStatus: animalData.adoptionStatus,
                            };
                        }
                        //else will return null
                        return null;
                    });
                    //this will return and filter out the array of all liked animals. (will filter out the null values)
                    const animalsList = (await Promise.all(animalPromises)).filter(
                        Boolean
                    );
                    //setting the animals state to the animals list
                    setAnimals(animalsList);
                }
                //will stop loading the page
                setLoading(false);
            });

            //returning the unsubscribe function
            return unsubscribe;
        } catch (error) {
            console.error("Error fetching liked animals:", error);
            setLoading(false);
        }
    }, []);

    //use focus effect to fetch the liked animals when the any changes are detected in the firestore database
    useFocusEffect(
        //using the use callback hook to fetch the liked animals
        useCallback(() => {
            //calling the fetchLikedAnimals function
            const unsubscribe = fetchLikedAnimals();
            //returning the unsubscribe function
            return () => {
                //will call the unsubscribe function if it exists
                if (unsubscribe && typeof unsubscribe === "function") {
                    unsubscribe();
                }
            };
        }, [fetchLikedAnimals])
    );

    const renderGenderIcon = (gender) => {
        if (gender === "M") {
            return (
                <Ionicons
                    style={styles.gender}
                    name="male"
                    size={18}
                    color={colors.genderMaleBlue}
                />
            );
        } else if (gender === "F") {
            return (
                <Ionicons
                    style={styles.gender}
                    name="female"
                    size={18}
                    color={colors.genderFemalePink}
                />
            );
        }
        return null;
    };

    /**
     * AnimalInfoOverlay component that will display the animal information in a modal
     * @param {object} param0 - The animal object and the onClose function
     * @returns
     */
    const AnimalInfoOverlay = ({ animal, onClose }) => (
        //modal that will display the animal information
        <Modal
            transparent={true}
            visible={showOverlay}
            onRequestClose={onClose}
            animationType="fade"
        >
            <View style={styles.overlayContainer}>
                <View style={styles.overlayContent}>
                    <Text style={styles.overlayName}>{animal.name}</Text>
                    <ScrollView
                        contentContainerStyle={{ alignItems: "center" }}
                        style={styles.scrollView}
                    >
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Species</Text>
                            <Text style={styles.overlayDetails}>{animal.species}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Breed</Text>
                            <Text style={styles.overlayDetails}>{animal.breed}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Age</Text>
                            <Text style={styles.overlayDetails}>{animal.age} years</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Gender</Text>
                            <View style={styles.genderOverlayContainer}>
                                {renderGenderIcon(animal.gender)}
                            </View>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Activity Level</Text>
                            <Text style={styles.overlayDetails}>
                                {activityLevelMapping[animal.activityLevel] || "Unknown"}
                            </Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Fur Color</Text>
                            <Text style={styles.overlayDetails}>{animal.furColor}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Location</Text>
                            <Text style={styles.overlayDetails}>{animal.location}</Text>
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldTitle}>Description</Text>
                            <Text style={styles.overlayDetailsDescription}>
                                {animal.description}
                            </Text>
                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    /**
     * Showing the pet item in the flat list
     */
    const showPetItem = ({ item }) => (
        <TouchableOpacity
            style={styles.petItem}
            //when its pressed will open the caht overlay
            onPress={() => {
                setSelectedAnimal(item);
                setShowOverlay(true);
            }}
        >
            {item.imageUrl ? (
                    <TouchableOpacity onPress={() => openFullScreenImage(item.imageUrl)}>
                        <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
                    </TouchableOpacity>
            ) : (
                <View style={[styles.petImage, styles.placeholderImage]}>
                    <Text>No Image</Text>
                </View>
            )}
            <Text style={styles.petName}>{item.name}</Text>
            <TouchableOpacity
                style={styles.infoButton}
                onPress={() => {
                    setSelectedAnimal(item);
                    setShowOverlay(true);
                }}
            >
                <Entypo
                    name="info-with-circle"
                    size={24}
                    color={colors.genderMaleBlue}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    //filters the pets based on the active tab
    const filteredPets = animals.filter((animal) => {
        const species = (animal.species || "").toLowerCase();
        return species + "s" === activeTab.toLowerCase();
    });

    /**
     * If the loading state is true, will display the loading indicator
     */
    if (loading) {
        return (
            <SafeAreaWrapper>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={"#d9cb94"} />
                    <Text>Loading...</Text>
                </View>
            </SafeAreaWrapper>
        );
    }
//******************************************************************************************************************
    //full screen image handling

    /**
     * Function to open full-screen image
     * @param {string} imageUri
     */
    const openFullScreenImage = (imageUri) => {
        setFullScreenImage(imageUri);
    };

    /**
     * Function to close full-screen image
     */
    const closeFullScreenImage = () => {
        setFullScreenImage(null);
    };

    /**
     * Component for full-screen image view
     */
    const FullScreenImageView = ({ imageUri, onClose }) => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={!!imageUri}
            onRequestClose={onClose}
        >
            <View style={fullScreenStyles.fullScreenContainer}>
                <Pressable style={fullScreenStyles.closeFullScreen} onPress={onClose}>
                    <Ionicons name="close" size={30} color="#fff" />
                </Pressable>
                <Image source={{ uri: imageUri }} style={fullScreenStyles.fullScreenImage} />
            </View>
        </Modal>
    );
//******************************************************************************************************************
    return (
        <SafeAreaWrapper>
            <LikedAnimalsPageHeader />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Liked Pets</Text>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "Dogs" && styles.activeTab]}
                        onPress={() => setActiveTab("Dogs")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "Dogs" && styles.activeTabText,
                            ]}
                        >
                            Dogs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "Cats" && styles.activeTab]}
                        onPress={() => setActiveTab("Cats")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "Cats" && styles.activeTabText,
                            ]}
                        >
                            Cats
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredPets}
                    renderItem={showPetItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                />
            </ScrollView>
            <NavbarWrapper />
            {showOverlay && (
                <AnimalInfoOverlay
                    animal={selectedAnimal}
                    onClose={() => setShowOverlay(false)}
                />
            )}

            <FullScreenImageView
                imageUri={fullScreenImage}
                onClose={closeFullScreenImage}
            />
        </SafeAreaWrapper>
    );
};

export default LikedAnimalsPage;
