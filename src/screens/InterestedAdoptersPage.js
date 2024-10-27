import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
//styling for the shelter chats screen
import styles from "../styles/InterestedAdoptersPageStyle";
import fullScreenStyles from "../styles/FullScreenImageStyle";
import { db } from "../services/firebaseConfig";
import {
    doc,
    onSnapshot,
    updateDoc,
    getDoc,
    setDoc,
    arrayUnion,
} from "firebase/firestore";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { ProgressBar } from "react-native-paper";
import { getRandomAdoptionMessage } from "../utils/adoptionMessages";

//constant for the default adopter image/ if the image is not found
const DEFAULT_ADOPTER_IMAGE =
    "https://firebasestorage.googleapis.com/v0/b/pluto-2b00c.appspot.com/o/default_animal_image.png?alt=media&token=94dbc329-5848-4dfc-8a93-fe806a48b4bd";

//Entire shelter chats component
const InterestedAdoptersPage = ({ route }) => {
    //getting the pet name and pet image from the pet page screen
    const { animalId } = route.params;
    //allows for navigation between screens
    const navigation = useNavigation();
    //state to hold the adopters data
    const [adopters, setAdopters] = useState([]);
    //state to hold the pet info
    const [petInfo, setPetInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adopterImages, setAdopterImages] = useState({});
    const isFocused = useIsFocused();
    const adopterUnsubscribesRef = useRef([]);
    // New ref to store the main unsubscribe function
    const unsubscribeRef = useRef(null);
    const [loadingMessages, setLoadingMessages] = useState({});
    const updatingRef = useRef({});
    //state to update the adoption message
    const [updatingMessages, setUpdatingMessages] = useState({});
    //This state will hold pending updates for adoption messages
    const [pendingUpdates, setPendingUpdates] = useState([]);
    //state to hold and set the full screen image
    const [fullScreenImage, setFullScreenImage] = useState(null);

    /**
     * Function to preload the images
     */
    const preloadImages = async (imageUrls) => {
        //storage reference to the firebase storage
        const storage = getStorage();
        //mapping through each image url found inside the image urls array
        const promises = imageUrls.map(async (imageUrl) => {
            //try to get the download url for the image
            try {
                //creating a reference to the image in the storage
                const storageRef = ref(storage, imageUrl);
                //getting the download url for the storage reference
                const downloadUrl = await getDownloadURL(storageRef);

                //if the download url is not null
                if (downloadUrl != null) {
                    console.log("download url: ", downloadUrl);
                }

                //getting the file name by splitting the image url into an array of strings (the last element of the array is the file name)
                const fileName = imageUrl.split("/").pop().replace(/%2F/g, "_");
                //creating a directory path for the image
                const dirPath = `${FileSystem.cacheDirectory}animals/${animalId}`;
                //creating a local uri for the image
                const localUri = `${dirPath}/${fileName}`;

                // Create the directory path to store the cached images if it doesn't already exist
                await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });

                //checks if the file exists in the local cache to prevent unnecessary redownloading
                const fileInfo = await FileSystem.getInfoAsync(localUri);

                //if the file does not already exist in the local cache
                if (!fileInfo.exists) {
                    //will download the file from the remote url and save it to the local cache
                    await FileSystem.downloadAsync(downloadUrl, localUri);
                }

                //returning the local uri of the cached image
                return { uri: localUri };
            } catch (error) {
                //if an error occured, will log the specific error with caching the data
                console.error("Error downloading or caching image:", error);
                //returns null if the image could not be cached
                return null;
            }
        });

        //returns the array of all cached images
        //waits for all promises to resolve (the image caching operations)
        return (
            (await Promise.all(promises))
                // Filter out any null values from the array
                .filter(Boolean)
        ); //finally returns the array of cached images
    };

    /**
     * Function to fetch and cache the adopter's image
     * @param {*} userId
     * @param {*} imageUrl
     * @returns
     */
    const fetchAndCacheAdopterImage = async (userId, imageUrl) => {
        //if the image url is null, will return the default adopter image
        if (!imageUrl) {
            return DEFAULT_ADOPTER_IMAGE;
        }

        //reference to the storage
        const storage = getStorage();
        //creating the cache directory for the adopter images
        const cacheDir = `${FileSystem.cacheDirectory}adopter_images/`;
        //getting the file name of image url.
        const fileName = imageUrl.split("/").pop().replace(/%2F/g, "_");
        //creating the cache file path for the adopter image
        const cacheFilePath = `${cacheDir}${fileName}`;

        if (cacheFilePath != null) {
            console.log("cache file path: ", cacheFilePath);
        }

        try {
            //creating the cache directory for the adopter images. will create the directory if it does not exist
            await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
            //getting the file info of the cache file path
            const fileInfo = await FileSystem.getInfoAsync(cacheFilePath);

            if (fileInfo.exists) {
                console.log("file exists: ", fileInfo.uri);
                return fileInfo.uri;
            }

            //creating a reference to the image in the storage
            const storageRef = ref(storage, imageUrl);
            //getting the download url for the storage reference
            const downloadUrl = await getDownloadURL(storageRef);

            //downloading the image from the remote url and saving it to the cache file path
            const downloadResult = await FileSystem.downloadAsync(
                downloadUrl,
                cacheFilePath
            );
            return downloadResult.uri;
        } catch (error) {
            console.warn(
                `Error caching adopter image for user ${userId}:`,
                error.message
            );
            //will return the default adopter image if there is an error
            return DEFAULT_ADOPTER_IMAGE;
        }
    };

    /**
     * Function to fetch the adopter info
     */
    const fetchAdopterInfo = useCallback(
        async (userId) => {
            //creating a reference to the users document in the database
            const userDocRef = doc(db, "users", userId);

            // Set up a real-time listener for changes to the user document
            return onSnapshot(userDocRef, async (userDoc) => {
                // Check if the user document exists
                if (userDoc.exists()) {
                    // Extract the user data from the document
                    const userData = userDoc.data();

                    // Initialize the image URL with a default value
                    let imageUrl = DEFAULT_ADOPTER_IMAGE;

                    // If the user has a profile image, fetch and cache it
                    if (userData.profileImage) {
                        imageUrl = await fetchAndCacheAdopterImage(
                            userId,
                            userData.profileImage
                        );
                    }

                    let adoptionMessage = userData.adoptionMessages?.[animalId];

                    setAdopters((prev) => {
                        //checks to see if the adopter object already exists
                        const existingAdopterIndex = prev.findIndex(
                            (adopter) => adopter.id === userId
                        );

                        //creating a new adoption object
                        const newAdopter = {
                            id: userId,
                            name: userData.fullName || "",
                            email: userData.email || "",
                            location: userData.selectedProvince || "",
                            phoneNo: userData.phoneNo || "",
                            adoptionMessage: adoptionMessage || "",
                            image: imageUrl,
                        };

                        //if the adopter already exists in the current state, then will update the adopter information
                        if (existingAdopterIndex !== -1) {
                            // Create a new array with the updated adopter information
                            const updatedAdopters = [...prev];
                            updatedAdopters[existingAdopterIndex] = newAdopter;
                            return updatedAdopters;
                        } else {
                            // If it's a new adopter, add them to the existing array
                            return [...prev, newAdopter];
                        }
                    });

                    // If the message is missing or contains "PetName", add to pending updates
                    if (!adoptionMessage || adoptionMessage.includes("PetName")) {
                        setPendingUpdates((prev) => [...prev, userId]);
                    }
                }
            });
        },
        [animalId, fetchAndCacheAdopterImage]
    );

    /**
     * Use effect to fetch the animal info and the adopters info
     */
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!isMounted) {
                return;
            }

            //setting the loading state to true
            setLoading(true);
            //referencing the animal found in the database with the animal id
            const animalDocRef = doc(db, "animals", animalId);

            const unsubscribe = onSnapshot(animalDocRef, async (docSnapshot) => {
                if (!isMounted) return;

                if (docSnapshot.exists()) {
                    const animalData = docSnapshot.data();
                    let localImageUrl = null; //the image url set intially to null

                    //if the animal data has an image url
                    if (animalData.imageUrls && animalData.imageUrls.length > 0) {
                        const images = await preloadImages(animalData.imageUrls); //preloading the images (calling the fucntion to download the image url to local storage)
                        localImageUrl = images[0]?.uri || null; //setting the local image url to the first image in the array
                    }

                    /**
                     * Setting the pet info state to the pet name, species, and image url
                     */
                    setPetInfo({
                        name: animalData.name,
                        species: animalData.species,
                        image: localImageUrl,
                    });

                    //If the notifications count from the animal document is greater than 0
                    if (animalData.notificationCount > 0) {
                        //update the notification count to 0
                        await updateDoc(animalDocRef, {
                            notificationCount: 0,
                        });
                    }

                    //clearing all the previous adopters
                    setAdopters([]);

                    //if the animal data has liked by users array of elements
                    if (animalData.likedByUsers && animalData.likedByUsers.length > 0) {
                        //looping through those values and fetching the info for all the users
                        animalData.likedByUsers.forEach((userId) => {
                            fetchAdopterInfo(userId);
                        });
                    }
                }
                //setting the loading state to false
                setLoading(false);
            });

            unsubscribeRef.current = unsubscribe;
        };

        //calling the fetch data function
        fetchData();

        //returning to unsubscribe from the real-time listener
        return () => {
            isMounted = false;
            //unsubscribing from the real-time listener
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [animalId]); //removing the isFocused from dependencies

    /**
     * Use effect to update the adoption messages in the database
     */
    useEffect(() => {
        if (petInfo?.name && pendingUpdates.length > 0) {
            //looping through each pending update for the user id (adopter)
            pendingUpdates.forEach((userId) => {
                //setting the updating message state to true for the adopter
                setUpdatingMessages((prev) => ({ ...prev, [userId]: true }));
                //finding the adopter in the adopters array
                const adopter = adopters.find((a) => a.id === userId);
                //getting a random adoption message
                const updatedMessage = getRandomAdoptionMessage(
                    adopter?.name || "User",
                    petInfo.name //with the adopter name and the pet name
                );
                //calling the function to update the adoption message in the database
                updateAdoptionMessageInDB(userId, updatedMessage);
                //setting the adopters state to the new updated adopters array
                setAdopters((prev) =>
                    //mapping through the adopters array and updating the adoption message for the adopter
                    //this updates the adopters message
                    prev.map((a) =>
                        a.id === userId ? { ...a, adoptionMessage: updatedMessage } : a
                    )
                );
            });
            //setting the pending updates state to an empty array
            setPendingUpdates([]);
        }
    }, [petInfo, pendingUpdates, adopters, updateAdoptionMessageInDB]); //removing the isFocused from dependencies

    /**
     * Function to update the adoption message
     */
    const updateAdoptionMessage = useCallback(
        //
        (userId, currentMessage) => {
            if (
                petInfo?.name &&
                currentMessage.includes("PetName") &&
                !updatingRef.current[userId]
            ) {
                updatingRef.current[userId] = true;
                setLoadingMessages((prev) => ({ ...prev, [userId]: true }));
                const updatedMessage = currentMessage.replace(/PetName/g, petInfo.name);
                updateAdoptionMessageInDB(userId, updatedMessage);
                return updatedMessage;
            }
            return currentMessage;
        },
        [petInfo]
    );

    /**
     * Function to update the adoption message in the database
     */
    const updateAdoptionMessageInDB = useCallback(
        //callback to update the message in the database
        async (userId, updatedMessage) => {
            const userDocRef = doc(db, "users", userId);
            //setting the document in the database to the updated message
            await setDoc(
                userDocRef,
                {
                    adoptionMessages: {
                        [animalId]: updatedMessage,
                    },
                },
                { merge: true }
            );
            //this removes the loading state of updating the messages for the specific adopter
            setUpdatingMessages((prev) => ({ ...prev, [userId]: false }));
        },
        [animalId]
    );
//********************************************************************************************************************
    // functions for full screen view
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
                {/*the */}
                <Pressable style={fullScreenStyles.closeFullScreen} onPress={onClose}>
                    <Ionicons name="close" size={30} color="#fff" />
                </Pressable>
                <Image source={{ uri: imageUri }} style={fullScreenStyles.fullScreenImage} />
            </View>
        </Modal>
    );
//********************************************************************************************************************
    /**
     * Function to render the pet info
     * @returns {JSX.Element}
     */
    const renderPetInfo = () => {
        //if the pet info is not found, will return null
        if (!petInfo) {
            return null;
        }

        /**
         * Returning the pet info as a view tag
         */
        return (
            <View style={styles.petInfoContainer}>
                <TouchableOpacity onPress={() => openFullScreenImage(petInfo.image)}>
                    <Image source={{ uri: petInfo.image }} style={styles.petImage} />
                </TouchableOpacity>
                <Text style={styles.petName}>{petInfo.name}</Text>
                <Text style={styles.petSpecies}>{petInfo.species}</Text>
            </View>
        );
    };

    /**
     * Function to render the adopter info
     * @param item
     * @returns {JSX.Element}
     */
    const renderAdopter = ({ item }) => (
        //the touchable opacity to navigate to the user detail form screen. navigating the user detail form screen with the user id, user name, pet name, pet image, and user image
        <TouchableOpacity
            style={styles.adopterItem}
            onPress={() =>
                navigation.navigate("UserDetailForm", {
                    userId: item.id,
                    animalId: animalId,
                })
            }
        >
            {/* if the adopter image is found, will render the adopter image */}
            {item.image && (
                <TouchableOpacity onPress={() => openFullScreenImage(item.image)}>
                    <Image source={{ uri: item.image }} style={styles.adopterImage} />
                </TouchableOpacity>
            )}
            <View style={styles.adopterInfo}>
                <View style={styles.adopterDetails}>
                    <Text style={styles.adopterName}>{item.name}</Text>
                    {updatingMessages[item.id] ? (
                        <View style={styles.loadingMessageContainer}>
                            <ActivityIndicator size="small" color="#d9cb94" />
                            <Text style={styles.loadingMessageText}>
                                Updating adoption message...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.adopterMessage}>
                            {item.adoptionMessage || "Loading message..."}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    //if the loading state is true, will return the loading screen
    if (loading) {
        return (
            <SafeAreaWrapper>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                    <ActivityIndicator size="large" color="#d9cb94" />
                </View>
            </SafeAreaWrapper>
        );
    }

    return (
        //Safe area wrapper to avoid the notch and bottom bar
        <SafeAreaWrapper>
            {/* container for the shelter chats screen */}
            <View style={styles.container}>
                {/* container for the header */}
                <View style={styles.header}>
                    {/* touchable to go back to the previous screen */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {/* arrow back icon */}
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Interested Adopters</Text>
                    <View style={{ width: 24 }} />
                </View>
                {renderPetInfo()}
                {/* list of adopters messages */}
                <FlatList
                    data={adopters}
                    renderItem={renderAdopter}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
                <FullScreenImageView
                    imageUri={fullScreenImage}
                    onClose={closeFullScreenImage}
                />
            </View>
        </SafeAreaWrapper>
    );
};

export default InterestedAdoptersPage;
