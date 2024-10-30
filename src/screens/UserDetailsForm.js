import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Modal,
    FlatList,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
//imports the safe area wrapper component
import SafeAreaWrapper from "../components/SafeAreaWrapper";
//imports the styles for the user details form
import styles from "../styles/UserDetailsFormStyles";
import fullScreenStyles from "../styles/FullScreenImageStyle";
//imports the linking function to open the email client
import { Linking } from "react-native";
//imports the functions from the notification messages file
import {
    getAdoptionStatuses,
    getRandomEmailSubject,
    getRandomEmailBody,
} from "../utils/notificationMessages";
import { useRoute } from "@react-navigation/native";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

//directory that will hold the cached images for potential adopters as well as for the animals
const POTENTIAL_ADOPTER_CACHE_DIR = `${FileSystem.cacheDirectory}potential_adopters/`;

/**
 * Getting the cache key for the cached images, referencing the animal id and the user id
 * @param {*} animalId
 * @param {*} userId
 * @returns
 */
const getCacheKey = (animalId, userId) => {
    return `${animalId}_${userId}`;
};

/**
 * Function to that loads the cached adopter image and animal image
 * @param animalId
 * @param userId
 * @returns {Promise<any|null>}
 */
const loadCachedImages = async (animalId, userId) => {
    try {
        //creating a cached key using the animal id and the user id
        const cacheKey = getCacheKey(animalId, userId);
        //creating the cached file path using the cache key
        const cacheFile = `${POTENTIAL_ADOPTER_CACHE_DIR}${cacheKey}/cache.json`;
        const fileInfo = await FileSystem.getInfoAsync(cacheFile);//getting the file info

        //if the file info exists, then the cached data is read and returned
        if (fileInfo.exists) {
            const cachedData = JSON.parse(
                await FileSystem.readAsStringAsync(cacheFile)
            );

            if(cachedData !== null){
                console.log("Cached data loaded:", cachedData);
            }

            return cachedData;
        }
    } catch (error) {
        console.warn("Error loading cached images:", error);
    }
    return null;
};

const saveToCache = async (animalId, userId, imageData) => {
    try {
        const cacheKey = getCacheKey(animalId, userId);
        const cacheDir = `${POTENTIAL_ADOPTER_CACHE_DIR}${cacheKey}/`;
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });

        await FileSystem.writeAsStringAsync(
            `${cacheDir}cache.json`,
            JSON.stringify(imageData)
        );
    } catch (error) {
        console.warn("Error saving to cache:", error);
    }
};
//******************************************************************************************************************
/**
 * Function that will fetch and cache any outstanding un-cached images
 * @param {*} imageUrl
 * @param {*} type
 * @param {*} metadata
 * @returns
 */
const fetchAndCacheImage = async (imageUrl, type, metadata) => {
    if (!imageUrl) return null;

    try {
        //referencing the storage
        const storage = getStorage();
        const storageRef = ref(storage, imageUrl);
        const downloadUrl = await getDownloadURL(storageRef);

        //file name for image from the url
        const fileName = `${type}_${imageUrl
            .split("/")
            .pop()
            .replace(/%2F/g, "_")}`;
        //directory for the cached images
        const cacheDir = `${POTENTIAL_ADOPTER_CACHE_DIR}${getCacheKey(
            metadata.animalId,
            metadata.userId
        )}/`;
        const localUri = `${cacheDir}${fileName}`;

        //creating a directory if it does not exist
        const dirInfo = await FileSystem.getInfoAsync(cacheDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
        }

        //checking if the cached version exists and matches the current version
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists && metadata.version === metadata.cachedVersion) {
            return localUri;
        }

        //downloading the new version of the image
        const downloadResult = await FileSystem.downloadAsync(
            downloadUrl,
            localUri
        );
        if (downloadResult.status !== 200) {
            throw new Error(`Download failed with status ${downloadResult.status}`);
        }
        return localUri;
    } catch (error) {
        console.warn(`Error handling ${type} image:`, error);
        return null;
    }
};

const UserDetailForm = ({ route, navigation }) => {
    //passing the user id and animal id from the interested adopters page through navigation
    const { userId, animalId } = route.params;
    //states to hold the user details and animal details
    const [userDetails, setUserDetails] = useState(null);
    const [animalDetails, setAnimalDetails] = useState(null);
    //states to handle the visibility of the notification modal and the selection modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false);
    //state to hold the selected status
    const [selectedStatus, setSelectedStatus] = useState(null);
    //state to handle the loading of the data
    const [loading, setLoading] = useState(true);

    const [shelterName, setShelterName] = useState("");

    //state to hold and set the full screen image
    const [fullScreenImage, setFullScreenImage] = useState(null);

    const [imageLoading, setImageLoading] = useState(true);

    const [cachedImages, setCachedImages] = useState(null);

    /**
     * Fetches the shelter name from the database based on the current user logged in
     */
    useEffect(() => {
        const fetchShelterDetails = async () => {
            try {
                //Get the current user from the auth service
                const currentUser = auth.currentUser;
                //If the current user exists
                if (currentUser) {
                    //extracting the name
                    const shelterDoc = await getDoc(doc(db, "shelters", currentUser.uid));
                    if (shelterDoc.exists()) {
                        //getting the shelter names field value from the document
                        setShelterName(shelterDoc.data().shelterName);
                    }
                }
            } catch (error) {
                console.error("Error fetching shelter details:", error);
            }
        };

        //fetching the shelter details
        fetchShelterDetails();
    }, []);

    //fetching the user details and the animal details
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                //first try to load the cached images
                const cached = await loadCachedImages(animalId, userId);
                if (cached && isMounted) {
                    setCachedImages(cached);
                    // Pre-populate the UI with cached images
                    setUserDetails((prev) => ({
                        ...prev,
                        image: cached.userImage,
                    }));
                    setAnimalDetails((prev) => ({
                        ...prev,
                        image: cached.animalImage,
                    }));
                }

                //real time listener for the user document in the database for any changes that may occur
                const userUnsubscribe = onSnapshot(
                    doc(db, "users", userId),
                    async (userDoc) => {
                        if (!isMounted) return;

                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            const updatedUserDetails = {
                                ...userData,
                                image: userData.profileImage ? null : cached?.userImage, //Temporarily set to null if new image is coming
                            };
                            setUserDetails(updatedUserDetails);

                            //checks to see if it needs to fetch a new image from the database
                            if (userData.profileImage) {
                                setImageLoading(true);
                                const userImage = await fetchAndCacheImage(userData.profileImage, "user", {
                                    animalId,
                                    userId,
                                });

                                if (isMounted) {
                                    setUserDetails((prev) => ({ ...prev, image: userImage }));
                                    await saveToCache(animalId, userId, {
                                        ...cached,
                                        userImage,
                                    });
                                    setImageLoading(false);
                                }
                            }
                        }
                    }
                );

                //Listening to the animal document in the database
                const animalUnsubscribe = onSnapshot(
                    doc(db, "animals", animalId),
                    async (animalDoc) => {
                        if (!isMounted) return;

                        if (animalDoc.exists()) {
                            const animalData = animalDoc.data();
                            const imageVersion = animalData.imageVersion || 0;

                            //setting the initial animal data
                            setAnimalDetails({
                                ...animalData,
                                image: cached?.animalImage || null,
                            });

                            //checks if we need to update the image. (if not cached or the version does not match the cached version)
                            if (
                                animalData.imageUrls?.[0] &&
                                (!cached || imageVersion !== cached.animalImageVersion)
                            ) {
                                const animalImage = await fetchAndCacheImage(
                                    animalData.imageUrls[0],
                                    "animal",
                                    {
                                        animalId,
                                        userId,
                                        version: imageVersion,
                                        cachedVersion: cached?.animalImageVersion,
                                    }
                                );

                                if (isMounted) {
                                    setAnimalDetails((prev) => ({ ...prev, image: animalImage }));
                                    // Update cache
                                    await saveToCache(animalId, userId, {
                                        ...cached,
                                        animalImage,
                                        animalImageVersion: imageVersion,
                                    });
                                }
                            }
                        }
                    }
                );

                setLoading(false);

                return () => {
                    isMounted = false;
                    userUnsubscribe();
                    animalUnsubscribe();
                };
            } catch (error) {
                console.error("Error in fetchData:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, animalId]);

    /**
     * if the loading state, user details, or animal details are not loaded, will return a loading indicator
     */
    if (loading || !userDetails?.fullName || !animalDetails?.name) {
        return (
            <SafeAreaWrapper>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading user details...</Text>
                    <ActivityIndicator size="large" color="#d9cb94" />
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
                <Image
                    source={{ uri: imageUri }}
                    style={fullScreenStyles.fullScreenImage}
                />
            </View>
        </Modal>
    );
    //******************************************************************************************************************

    /**
     * Function that takes a label and value and returns the user details
     * @param {*} label
     * @param {*} value
     * @returns
     */
    const showUserDetails = (label, value) => (
        <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}:</Text>
            <Text style={styles.detailValue}>{value || "Not provided"}</Text>
        </View>
    );

    //function that will open the selection modal when the send adoption status button is pressed
    const openSelectionModal = () => {
        //setting the selection modal to true
        setIsSelectionModalVisible(true);
    };

    //will send the notification when the status is selected
    const sendNotification = (status) => {
        //the selection modal will disappear
        setIsSelectionModalVisible(false);
        setSelectedStatus(status); //sets the selected status to the status that was selected
        setIsModalVisible(true); //sets the notification modal to true

        //Auto hides the adoption status notification modal after 2 seconds
        setTimeout(() => {
            setIsModalVisible(false);

            //will get the random subject
            //eg. "Adoption Status Update: {petName}"
            const subject = getRandomEmailSubject(status.id, animalDetails.name);
            //Getting the random body
            //hi so and so, your adoption status for {petName} is {status}
            const body = getRandomEmailBody(
                status.id,
                userDetails.fullName,
                animalDetails.name,
                shelterName
            );

            // Compose the email
            const to = userDetails.email;
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            //creating the email url
            const openMailAppUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

            //Open the devices default email client
            Linking.openURL(openMailAppUrl).catch((err) =>
                //error catching
                console.error("An error occurred", err)
            );
        }, 2000);
    };

    //Function that will show the available adoption statuses
    const showStatusItem = ({ item }) => (
        <TouchableOpacity
            style={styles.statusItem}
            onPress={() => sendNotification(item)}
        >
            {/* showing the adoption status */}
            <Text style={styles.statusText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* header section */}
                <View style={styles.header}>
                    {/* back button */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    {/* content of the header showing the pet name and image */}
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            onPress={() => openFullScreenImage(animalDetails.image)}
                        >
                            <Image
                                source={{ uri: animalDetails.image }}
                                style={styles.headerPetImage}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerPetName}>{animalDetails.name}</Text>
                    </View>
                    <View style={{ width: 24 }} />
                </View>
                {/* keyboard avoiding view */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.content}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.userInfoContainer}>
                            <TouchableOpacity
                                onPress={() => openFullScreenImage(userDetails.image)}
                            >
                                <Image
                                    source={{ uri: userDetails.image }}
                                    style={styles.userImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.userName}>{userDetails.fullName}</Text>
                        </View>
                        {/* form container showing the user details */}
                        <View style={styles.formContainer}>
                            {showUserDetails("Email", userDetails.email)}
                            {showUserDetails("Phone", userDetails.phoneNo)}
                            {showUserDetails("Address", userDetails.location)}
                        </View>

                        {/* when the notification button is pressed the sendNotification function is called */}
                        <TouchableOpacity
                            style={styles.notificationButton}
                            onPress={openSelectionModal}
                        >
                            <Text style={styles.notificationButtonText}>
                                Send Adoption Status
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Selection Modal */}
                <Modal
                    animationType="slide" //slides up from the bottom
                    transparent={true}
                    visible={isSelectionModalVisible}
                    onRequestClose={() => setIsSelectionModalVisible(false)}
                >
                    {/* The selection modal view for selecting the adoption status */}
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Select Adoption Status</Text>
                            {/* Adoption statuses list */}
                            <FlatList
                                data={getAdoptionStatuses()} //calling the function to get the adoption statuses
                                renderItem={showStatusItem} //function to show the adoption statuses
                                keyExtractor={(item) => item.id} //extracting the id of the status which is found in the getAdoptionStatuses function
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsSelectionModalVisible(false)}
                            >
                                {/* cancel button to close the selection modal */}
                                <Text style={styles.closeButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Notification Sent Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    //when the modal is closed
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    {/* Centered view for the main sent notification modal */}
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                {/* getting selected status and displaying it in the modal */}
                                {selectedStatus
                                    ? `Sending '${selectedStatus.label}' notification to ${userDetails.email}`
                                    : "Notification sent"}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>

            <FullScreenImageView
                imageUri={fullScreenImage}
                onClose={closeFullScreenImage}
            />
        </SafeAreaWrapper>
    );
};

export default UserDetailForm;
