import React, {useRef, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Image, Modal
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import UserSettingsStyles from "../styles/UserSettingsStyles";
import strings from '../strings/en.js';
import Navbar from "../components/ShelterNavbar";
import SettingsInputValidations from "../services/SettingsInputValidations";
import { Alert } from 'react-native';
import NavbarWrapper from "../components/NavbarWrapper";
import { db, auth } from '../services/firebaseConfig';
import firebaseService from "../services/firebaseService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultProfileImage from "../../assets/handsome_squidward.jpg";
import ShelterSettingsStyles from "../styles/ShelterSettingsStyles";
import * as ImagePicker from "expo-image-picker";
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";
import { getAuth } from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";
import { signOut } from 'firebase/auth';

const defaultprofileImageLocal = require('../../assets/handsome_squidward.jpg');

const UserSettingsScreen = () => {
    const defaultValues = {
        name: "Sample Name",
        surname: "Sample Surname",
        email: "sample@example.com",
        password: "default",
        newPassword: "default",
        location: "Sample Location",
    };

    const [fullName, setfullName] = useState(defaultValues.name);
    const [email, setEmail] = useState(defaultValues.email);
    const [password, setPassword] = useState(defaultValues.password);
    const [newPassword, setNewPassword] = useState(defaultValues.newPassword);
    const [location, setLocation] = useState(defaultValues.location);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);  // Add loading state
    const [userData,setUserData] = useState(null);
    const [profileImageLocal, setprofileImageLocal] = useState(null);
    const storage = getStorage();
    const [imageChanged, setImageChanged] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const defaultprofileImageLocal = require('../../assets/pluto_logo.png');
    const [firebaseURL, setFirebaseURL] = useState(null);
    const profileImageRef = useRef({
        profilesImage: null
    });



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
            setprofileImageLocal(selectedImageUri); // Just set the image URI in the state
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
        const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);

        // Delete old image before uploading a new one
        await clearProfileImage();

        const uploadTask = uploadBytesResumable(imageRef, blob);


        try {
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setprofileImageLocal(downloadURL); // Update local state
                        profileImageRef.current.profilesImage = downloadURL;
                        resolve();
                    }
                );
            });
        } catch (error) {
            Alert.alert('Error', 'There was an issue uploading the image. Please try again.');
            console.error('Image upload error:', error);
        } finally {

        }
    };


    // Delete the old profile image from Firebase Storage
    const clearProfileImage = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'User not authenticated.');
            return;
        }

        const currentImageRef = ref(storage, `users/${user.uid}/profile.jpg`);

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
                                if (profileImageLocal) {
                                    imageUrl = await uploadProfileImage(profileImageLocal);
                                }
                            }
                            const profileImage = await checkImageChangeForAsyncStorage()

                            const updatedUserDetails = {
                                fullName,
                                location,
                                email,
                                profileImage
                            };


                            // Then update the user details, including the image URL if uploaded
                            const finalDetails = {
                                ...updatedUserDetails,
                            };

                            if(!newPassword == password){
                                await firebaseService.changePassword(newPassword);
                            }

                            await firebaseService.updateUserSettings("users", finalDetails);

                            await  updateUserDataToAsyncStorage(finalDetails);

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

    const checkImageChangeForAsyncStorage = async() =>{
        if(imageChanged){
            return profileImageRef.current.profilesImage;
        }else{
            const data = await AsyncStorage.getItem('userData');
            if (data !== null) {
                const userData = JSON.parse(data); // Parse the data into an object
                if (userData) {
                    return userData.profileImage;
                }
            }
        }
    }

    // Check if details inputs are valid
    const checkDetailsInputs = () => {

        if(!newPassword == password){
            if(!SettingsInputValidations.isLongerThanFive(newPassword)){
                Alert.alert(strings.user_settings.validation_error, strings.user_settings.confirm_required);
                return false;
            }
        }


        // Start of checking for null inputs
        if (SettingsInputValidations.isEmptyOrWhitespace(fullName)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.name_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(email)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.email_required);
            return false;
        }

        if (SettingsInputValidations.isEmptyOrWhitespace(location)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.location_required);
            return false;
        }
        // End of checking for null inputs

        // Check email for @ sign
        if(!SettingsInputValidations.containsAtSymbol(email)){
            Alert.alert(strings.user_settings.validation_error,strings.user_settings.valid_email);
            return false;
        }

        if(SettingsInputValidations.containsNumber(location)){
            Alert.alert(strings.user_settings.validation_error,strings.user_settings.location_number)
            return false;
        }


        // If all inputs are valid
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

    const updateUserDataToAsyncStorage = async (newData) =>{
        try {
            // Retrieve existing data
            const existingData = await AsyncStorage.getItem('userData');
            const existingUserData = existingData ? JSON.parse(existingData) : {};

            // Merge existing data with new data
            const mergedData = { ...existingUserData, ...newData };

            // Save merged data to AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(mergedData));
            console.log('User data merged and saved to AsyncStorage');
        } catch (error) {
            console.error('Error saving user data to AsyncStorage:', error);
        }
    }

    // Function to fetch userData from AsyncStorage
    const fetchUserData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data !== null) {
                const parsedData = JSON.parse(data);
                setUserData(parsedData);
                setfullName(parsedData.fullName || defaultValues.name);
                setEmail(parsedData.email || defaultValues.email);
                setLocation(parsedData.location || defaultValues.location);
                setprofileImageLocal(parsedData.profileImage);
                console.log('User data has been fetched');
            }
        } catch (error) {
            console.log('Error retrieving user data:', error);
        } finally {
            setLoading(false);  // Stop loading once data is fetched
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
            return () => {
                // Reset the state when component loses focus
                setfullName('');
                setEmail('');
                setPassword('');
                setNewPassword('');
                setLocation('');
                setIsEditable(false);
            };
        }, [])
    );


    if (loading) {
        // Display a loading spinner or text while data is being fetched
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00C853" />
                <Text>Loading user settings...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={UserSettingsStyles.scrollView} contentContainerStyle={{flexGrow:1}}>

                {/* Centered Image */}
                <View style={UserSettingsStyles.centerImageContainer}>
                    <TouchableOpacity onPress={handleImageSelect}>
                    <Image
                        source={
                            profileImageLocal
                                ? { uri: profileImageLocal }  // Ensure profileImageLocal is treated as a URI
                                : defaultprofileImageLocal     // Fallback to default image
                        }
                        style={UserSettingsStyles.centerImage}
                        onError={() => setprofileImageLocal(null)} // If loading fails, fallback to default
                        resizeMode="cover" // Ensures the image scales properly within the view
                    />
                    </TouchableOpacity>
                </View>


                {/* Username and Location */}
                <View style={UserSettingsStyles.headerSection}>
                    <Text style={UserSettingsStyles.headerText}>{fullName}</Text>
                    <Text style={UserSettingsStyles.headerText}>{location}</Text>
                </View>

                {/* Your Details Section */}
                <Text style={UserSettingsStyles.detailsTitle}>{strings.user_settings.your_details_title}</Text>
                <View style={UserSettingsStyles.detailsContainer}>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.name_label}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={UserSettingsStyles.detailsValue}
                                value={fullName}
                                onChangeText={setfullName}
                                placeholder={strings.user_settings.sample_text}
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.email_label}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={UserSettingsStyles.detailsValue}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="sample@example.com"
                                editable={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.password_label}</Text>
                        <TouchableOpacity>
                            <TextInput
                                style={UserSettingsStyles.detailsValue}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={strings.user_settings.password_placeholder}
                                secureTextEntry={true}
                                editable={false}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.renew_password_label}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={UserSettingsStyles.detailsValue}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder={strings.user_settings.confirm_password_placeholder}
                                secureTextEntry={true}
                                editable={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.location}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={UserSettingsStyles.detailsValue}
                                value={location}
                                onChangeText={setLocation}
                                placeholder={strings.user_settings.sample_text}
                                editable={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                </View>



                {/* Buttons Section */}
                <View style={UserSettingsStyles.buttonContainer}>
                    {/* Update Button */}
                    <TouchableOpacity style={UserSettingsStyles.customButton} onPress={handleUpdate}>
                        <Text style={UserSettingsStyles.customButtonText}>{strings.user_settings.update_button}</Text>
                    </TouchableOpacity>

                    {/* Logout Button */}
                    <TouchableOpacity style={[UserSettingsStyles.customButton, UserSettingsStyles.logoutButton]} onPress={handleLogout}>
                        <Text style={[UserSettingsStyles.customButtonText, UserSettingsStyles.logoutButtonText]}>{strings.user_settings.logout_button}</Text>
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
                            shadowColor: '#ffffff',
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


                <NavbarWrapper/>

        </SafeAreaView>
    );
};

export default UserSettingsScreen;
