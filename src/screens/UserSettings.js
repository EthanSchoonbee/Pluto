import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Image
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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";
import { signOut } from 'firebase/auth';


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
    const [profileImage, setProfileImage] = useState(null);
    const storage = getStorage();

    const navigation = useNavigation();
    const defaultProfileImage = require('../../assets/pluto_logo.png');


    const handleUpdate = () => {
        updateUserSettings()
    };

    // Function to handle image selection
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
            // Set the selected image's URI as the profile image
            setProfileImage(result.assets[0].uri);
            setIsEditable(true); // Mark the form as edited
        }
    };

    // Function to upload image to Firebase Storage
    const uploadImage = async (imageUri) => {
        if (!imageUri) return null;

        const user = auth.currentUser;
        const imageRef = ref(storage, `users/${user.uid}/${Date.now()}_profile.jpg`);
        const blob = await fetch(imageUri).then((r) => r.blob());
        const uploadTask = uploadBytesResumable(imageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };


    // Check if details inputs are valid
    const checkDetailsInputs = () => {

        // Start of checking for null inputs
        if (SettingsInputValidations.isEmptyOrWhitespace(fullName)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.fullName_required);
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


    // Function to validate input and update Firestore
    const updateUserSettings = async () => {
        if (!isEditable) {
            Alert.alert('Info', "No changes were made.");
            return;
        }

        // Validate input fields
        if (!checkDetailsInputs()) {
            return;
        }

        const updatedUserDetails = {
            fullName,
            location,
            email,
            profileImage: ''  // Will update this after image upload
        };

        // Confirm update with the user
        Alert.alert(
            "Attention",
            'Are you sure you want to update your details?',
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            // Push the user data to Firestore
                            await firebaseService.updateUserSettings("users", updatedUserDetails);

                            // Upload the profile image after user data is pushed
                            if (profileImage) {
                                const imageUrl = await uploadImage(profileImage);
                                // Update Firestore document with the image URL
                                await firebaseService.updateUserSettings("users", { profileImage: imageUrl });
                            }

                            if (!SettingsInputValidations.isEmptyOrWhitespace(newPassword)) {
                                firebaseService.changePassword(newPassword);
                            }

                            Alert.alert("Success", "Your profile has been updated.");
                        } catch (error) {
                            console.error("Error updating profile: ", error);
                            Alert.alert("Error", "There was an issue updating your profile. Please try again.");
                        }
                    }
                }
            ]
        );
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
                setProfileImage(parsedData.profileImage);
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
                            profileImage
                                ? { uri: profileImage }  // Ensure profileImage is treated as a URI
                                : defaultProfileImage     // Fallback to default image
                        }
                        style={UserSettingsStyles.centerImage}
                        onError={() => setProfileImage(null)} // If loading fails, fallback to default
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
                                editable={isEditable}
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
            </ScrollView>


                <NavbarWrapper/>

        </SafeAreaView>
    );
};

export default UserSettingsScreen;
