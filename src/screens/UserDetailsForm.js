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
    ActivityIndicator, Pressable,
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
import { db, storage } from "../services/firebaseConfig";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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

    //state to hold and set the full screen image
    const [fullScreenImage, setFullScreenImage] = useState(null);

    //fetching the user details and the animal details
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); //setting the current loading state to true
            const userUnsubscribe = onSnapshot(
                doc(db, "users", userId),
                async (userDoc) => {
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userImage = await fetchAndCacheImage(
                            userData.profileImage,
                            "user"
                        );
                        setUserDetails({ ...userData, image: userImage });
                    } else {
                        console.warn("User document does not exist");
                        setUserDetails(null);
                    }
                },
                (error) => {
                    console.error("Error fetching user data:", error);
                    setUserDetails(null);
                }
            );

            const animalUnsubscribe = onSnapshot(
                doc(db, "animals", animalId),
                async (animalDoc) => {
                    if (animalDoc.exists()) {
                        const animalData = animalDoc.data();
                        const animalImage = await fetchAndCacheImage(
                            animalData.imageUrls && animalData.imageUrls.length > 0
                                ? animalData.imageUrls[0]
                                : null,
                            "animal"
                        );
                        setAnimalDetails({ ...animalData, image: animalImage });
                    } else {
                        console.warn("Animal document does not exist");
                        setAnimalDetails(null);
                    }
                },
                (error) => {
                    console.error("Error fetching animal data:", error);
                    setAnimalDetails(null);
                }
            );

            //will stop the loading state
            setLoading(false);

            //unsubscribing from the user and animal data
            return () => {
                userUnsubscribe();
                animalUnsubscribe();
                console.log("Unsubscribed from user and animal data");
            };
        };

        //fetching the data
        fetchData().then(r => console.log("Data fetched"));
    }, [userId, animalId]);

    const fetchAndCacheImage = async (imageUrl, type) => {
        if (!imageUrl) return null;

        const storage = getStorage();
        const cacheDir = `${FileSystem.cacheDirectory}${type}_images/`;
        const fileName = imageUrl.split("/").pop().replace(/%2F/g, "_");
        const cacheFilePath = `${cacheDir}${fileName}`;

        try {
            await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
            const fileInfo = await FileSystem.getInfoAsync(cacheFilePath);

            //if the cached file exists, will return the cached file uri
            if (fileInfo.exists) {
                return fileInfo.uri;
            }

            //referencing the image url in the storage
            const storageRef = ref(storage, imageUrl);
            //getting the download url of the image
            const downloadUrl = await getDownloadURL(storageRef);
            //downloading the image and caching it
            const downloadResult = await FileSystem.downloadAsync(
                downloadUrl,
                cacheFilePath
            );
            return downloadResult.uri;
        } catch (error) {
            console.warn(`Error caching ${type} image:`, error.message);
            return null;
        }
    };

    /**
     * if the loading state, user details, or animal details are not loaded, will return a loading indicator
     */
    if (loading || !userDetails || !animalDetails) {
        return (
            <SafeAreaWrapper>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
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
                <Image source={{ uri: imageUri }} style={fullScreenStyles.fullScreenImage} />
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
                animalDetails.name
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
                        <TouchableOpacity onPress={() => openFullScreenImage(animalDetails.image)}>
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
                            <TouchableOpacity onPress={() => openFullScreenImage(userDetails.image)}>
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
