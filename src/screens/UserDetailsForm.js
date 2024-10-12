import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
//imports the safe area wrapper component
import SafeAreaWrapper from "../components/SafeAreaWrapper";
//imports the styles for the user details form
import styles from "../styles/UserDetailsFormStyles";
//imports the linking function to open the email client
import { Linking } from "react-native";
//imports the functions from the notification messages file
import {
    getAdoptionStatuses,
    getRandomEmailSubject,
    getRandomEmailBody,
} from "../utils/notificationMessages";

const UserDetailForm = ({ route, navigation }) => {
    //extracts the pet name, pet image, user name , user image and the user id
    const { petName, petImage, userName, userImage, userId } = route.params;

    // Dummy user details object
    //takes the user id and returns the user details
    const userDetailsDatabase = {
        1: {
            email: "johnsmith@example.com",
            phone: "+1 (555) 123-4567",
            address: "123 Main St, Anytown, USA",
            occupation: "Software Developer",
            reasonForAdoption: "Looking for a loving companion",
            previousPetExperience: "Owned 2 dogs in the past",
        },
        2: {
            email: "janesmith@example.com",
            phone: "+1 (555) 987-6543",
            address: "456 Elm St, Another Town, USA",
            occupation: "Teacher",
            reasonForAdoption: "Want to give a pet a forever home",
            previousPetExperience: "First-time pet owner",
        },
        3: {
            email: "mikejohnson@example.com",
            phone: "+1 (555) 246-8135",
            address: "789 Oak St, Somewhere City, USA",
            occupation: "Nurse",
            reasonForAdoption: "Looking for a companion for my other dog",
            previousPetExperience: "Currently own 1 dog",
        },
        4: {
            email: "emilybrown@example.com",
            phone: "+1 (555) 369-2580",
            address: "101 Pine St, Elsewhere Village, USA",
            occupation: "Graphic Designer",
            reasonForAdoption: "Always wanted a pet since childhood",
            previousPetExperience: "Grew up with family pets",
        },
    };

    //takes the user id and returns the user details
    const userDetails = userDetailsDatabase[userId] || {};

    //Function to that takes label and value and returns the user details
    const showUserDetails = (label, value) => (
        <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}:</Text>
            <Text style={styles.detailValue}>{value || "Not provided"}</Text>
        </View>
    );

    //states for the notification modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    //states for the selection modal
    const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false);
    //state for the selected status
    const [selectedStatus, setSelectedStatus] = useState(null);

    //function that will open the selection modal when the send adoption status button is pressed
    const openSelectionModal = () => {
        //setting the selection modal to true
        setIsSelectionModalVisible(true);
    };

    //function that will send the notification when the status is selected
    const sendNotification = (status) => {
        //dummy test for now

        //the selection modal will disappear
        setIsSelectionModalVisible(false);
        setSelectedStatus(status); //sets the selected status to the status that was selected
        setIsModalVisible(true); //sets the notification modal to true

        //Auto hides the adoption status notification modal after 2 seconds
        setTimeout(() => {
            setIsModalVisible(false);

            //will get the random subject
            //eg. "Adoption Status Update: {petName}"
            const subject = getRandomEmailSubject(status.id, petName);
            //Getting the random body
            //hi so and so, your adoption status for {petName} is {status}
            const body = getRandomEmailBody(status.id, userName, petName);

            // Compose the email
            const to = userDetails.email;
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            //creating the
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
                        <Image source={{ uri: petImage }} style={styles.headerPetImage} />
                        <Text style={styles.headerPetName}>{petName}</Text>
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
                            <Image source={{ uri: userImage }} style={styles.userImage} />
                            <Text style={styles.userName}>{userName}</Text>
                        </View>
                        {/* form container showing the user details */}
                        <View style={styles.formContainer}>
                            {showUserDetails("Email", userDetails.email)}
                            {showUserDetails("Phone", userDetails.phone)}
                            {showUserDetails("Address", userDetails.address)}
                            {showUserDetails("Occupation", userDetails.occupation)}
                            {showUserDetails(
                                "Reason for Adoption",
                                userDetails.reasonForAdoption
                            )}
                            {showUserDetails(
                                "Previous Pet Experience",
                                userDetails.previousPetExperience
                            )}
                        </View>

                        {/* when the notifcation button is pressed the sendNotification function is called */}
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
                    animationType="slide"//slides up from the bottom
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
                                data={getAdoptionStatuses()}//calling the function to get the adoption statuses
                                renderItem={showStatusItem}//function to show the adoption statuses
                                keyExtractor={(item) => item.id}//extracting the id of the status which is found in the getAdoptionStatuses function
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
        </SafeAreaWrapper>
    );
};

export default UserDetailForm;
