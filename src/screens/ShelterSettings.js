import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Modal,
    Button
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ShelterSettingsStyles from "../styles/ShelterSettingsStyles";
import strings from '../strings/en.js';
import Navbar from "../components/ShelterNavbar";
import SettingsInputValidations from "../services/SettingsInputValidations";
import colors from "../styles/colors";
import NavbarWrapper from "../components/NavbarWrapper";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import firebaseService from "../services/firebaseService";
import {launchImageLibrary} from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";
import { signOut } from 'firebase/auth';


const defaultProfileImage = require('../../assets/handsome_squidward.jpg');

const ShelterSettingsScreen = () => {
    const defaultValues = {
        shelterName: "Sample Shelter",
        location: "Sample Location",
        email: "shelter@example.com",
        tel: "+1234567890",
        password: "",
        newPassword: ""
    };

    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [shelterName, setShelterName] = useState(defaultValues.shelterName);
    const [location, setLocation] = useState(defaultValues.location);
    const [email, setEmail] = useState(defaultValues.email);
    const [phoneNumber, setphoneNumber] = useState(defaultValues.phoneNumber);
    const [password, setPassword] = useState(defaultValues.password);
    const [newPassword, setNewPassword] = useState(defaultValues.newPassword);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const storage = getStorage();
    const auth = getAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const [imageChanged, setImageChanged] = useState(false);

    const togglePushNotifications = () => {
        setIsPushNotificationsEnabled(previousState => !previousState);
        setIsEditable(true);
    };

    // Image picker and upload logic
    const handleImageSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need media library permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            setProfileImage(selectedImageUri); // Just set the image URI in the state
            setIsEditable(true);
            setImageChanged(true);
        }
    };

    // Image upload and update logic
    const uploadProfileImage = async (uri) => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'User not authenticated.');
            return;
        }

        const blob = await fetch(uri).then(r => r.blob()); // Convert the image to a blob
        const imageRef = ref(storage, `shelters/${user.uid}/profile.jpg`);

        // Delete old image before uploading a new one
        await clearProfileImage();

        const uploadTask = uploadBytesResumable(imageRef, blob);

        setModalVisible(true); // Show modal during upload

        try {
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        //await firebaseService.updateUserSettings("shelters", { profileImage: downloadURL });
                        setProfileImage(downloadURL); // Update local state
                        resolve();
                    }
                );
            });
        } catch (error) {
            Alert.alert('Error', 'There was an issue uploading the image. Please try again.');
            console.error('Image upload error:', error);
        } finally {
            setModalVisible(false); // Hide modal after upload
        }
    };

    // Delete the old profile image from Firebase Storage
    const clearProfileImage = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'User not authenticated.');
            return;
        }

        const currentImageRef = ref(storage, `shelters/${user.uid}/profile.jpg`);

        try {
            const currentImageUrl = await getDownloadURL(currentImageRef);
            if (currentImageUrl) {
                await deleteObject(currentImageRef); // Delete the old image
                console.log('Previous image deleted successfully.');
            }
        } catch (error) {
            if (error.code !== 'storage/object-not-found') {
                console.error('Error deleting the previous image:', error);
            }
        }
    };





// Handle update button press
    const handleUpdate = async () => {
        if (!isEditable) {
            Alert.alert('Info', "No changes were made.");
            return;
        }

        if (!checkDetailsInputs()) {
            return;
        }

        const updatedUserDetails = {
            shelterName,
            location,
            email,
            phoneNumber,
            profileImage,
            isPushNotificationsEnabled
        };

        Alert.alert(
            "Attention",
            'Are you sure you want to update your details?',
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        setModalVisible(true);
                        try {

                            if(imageChanged){
                                // First upload the image if a new one is selected
                                let imageUrl = null;
                                if (profileImage) {
                                    imageUrl = await uploadProfileImage(profileImage);
                                }
                            }

                            // Then update the user details, including the image URL if uploaded
                            const finalDetails = {
                                ...updatedUserDetails,
                            };

                            if(!newPassword ==  password){
                                await firebaseService.changePassword(newPassword);
                            }

                            await firebaseService.updateUserSettings("shelters", finalDetails);

                            Alert.alert("Success", "Your profile has been updated.");
                        } catch (error) {
                            Alert.alert("Error", "There was an issue updating your profile. Please try again.");
                        } finally {
                            setModalVisible(false);
                        }
                    }
                }
            ]
        );
    };

    const checkDetailsInputs = () => {

        if(!SettingsInputValidations.isLongerThanFive(newPassword)){
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.confirm_required);
            return false;
        }

        if (SettingsInputValidations.isEmptyOrWhitespace(shelterName)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.name_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(location)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.location_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(email)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.email_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(phoneNumber)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.phone_required);
            return false;
        }
        if (!SettingsInputValidations.containsAtSymbol(email)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.valid_email);
            return false;
        }
        if (!SettingsInputValidations.isValidNumberInput(phoneNumber)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.valid_number);
            return false;
        }
        return true;
    };



    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };


    const handleDoubleClick = () => {
        setIsEditable(prev => !prev);
    };

    // Function to fetch user data from AsyncStorage
    const fetchUserDataFromAsyncStorage = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data !== null) {
                const userData = JSON.parse(data); // Parse the data into an object
                if (userData) {
                    setIsPushNotificationsEnabled(userData.isPushNotificationsEnabled);
                    setShelterName(userData.shelterName);
                    setLocation(userData.location);
                    setEmail(userData.email);
                    setphoneNumber(userData.phoneNumber);
                    setProfileImage(userData.profileImage || null);
                    setPassword('');  // Clear password fields for security
                    setNewPassword('');
                    setIsEditable(false);
                }
            }
        } catch (error) {
            console.log('Error retrieving shelter data:', error);
        } finally {
            setLoading(false);  // Stop loading once data is fetched
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserDataFromAsyncStorage();
            return () => {
                setIsPushNotificationsEnabled(false);
                setShelterName('');
                setEmail('');
                setPassword('');
                setNewPassword('');
                setLocation('');
                setProfileImage(null);
                setIsEditable(false);
            };
        }, [])
    );



    if (loading) {
        // Display a loading spinner or text while data is being fetched
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00C853" />
                <Text>Loading shelter settings...</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={ShelterSettingsStyles.container} contentContainerStyle={{flexGrow:1}}>
                {/* Centered Image */}
                <View style={ShelterSettingsStyles.centerImageContainer}>
                    <TouchableOpacity onPress={handleImageSelect}>
                    <Image
                        source={profileImage ? { uri: profileImage } : defaultProfileImage}
                        style={ShelterSettingsStyles.centerImage}
                        editable ={true}
                    />
                    </TouchableOpacity>
                </View>

                {/* Shelter Details Section */}
                <Text style={ShelterSettingsStyles.detailsTitle}>{strings.shelter_settings.shelter_details_title}</Text>
                <View style={ShelterSettingsStyles.detailsContainer}>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_name}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={shelterName}
                                onChangeText={setShelterName}
                                placeholder={strings.shelter_settings.shelter_sample_text}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_location}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={location}
                                onChangeText={setLocation}
                                placeholder={strings.shelter_settings.shelter_sample_text}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_email}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={strings.shelter_settings.shelter_email_placeholder}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_tel}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={phoneNumber}
                                onChangeText={setphoneNumber}
                                placeholder={strings.shelter_settings.shelter_tel_placeholder}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_password}</Text>
                        <TouchableOpacity >
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={strings.shelter_settings.shelter_password_placeholder}
                                secureTextEntry={true}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_renew_password}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder={strings.shelter_settings.shelter_confirm_password_placeholder}
                                secureTextEntry={true}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Privacy Section */}
                <Text style={ShelterSettingsStyles.privacyTitle}>{strings.shelter_settings.shelter_privacy_title}</Text>
                <View style={ShelterSettingsStyles.privacyContainer}>
                    <View style={ShelterSettingsStyles.notificationRow}>
                        <Text style={ShelterSettingsStyles.notificationText}>{strings.shelter_settings.shelter_push_notifications}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isPushNotificationsEnabled ? '#00C853' : "#f4f3f4"}
                            onValueChange={togglePushNotifications}
                            value={isPushNotificationsEnabled}
                        />
                    </View>
                </View>



                {/* Buttons Section */}
                <View style={ShelterSettingsStyles.buttonContainer}>
                    {/* Update Button */}
                    <TouchableOpacity style={ShelterSettingsStyles.customButton} onPress={handleUpdate}>
                        <Text style={ShelterSettingsStyles.customButtonText}>{strings.shelter_settings.shelter_update_button}</Text>
                    </TouchableOpacity>

                    {/* Logout Button */}
                    <TouchableOpacity style={[ShelterSettingsStyles.customButton, ShelterSettingsStyles.logoutButton]} onPress={handleLogout}>
                        <Text style={[ShelterSettingsStyles.customButtonText, ShelterSettingsStyles.logoutButtonText]}>{strings.shelter_settings.shelter_logout_button}</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal component */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            width: '80%',
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 20,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5
                        }}>
                            <Text>Updating your settings!</Text>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
            <NavbarWrapper />
        </SafeAreaView>
    );
};

export default ShelterSettingsScreen;
