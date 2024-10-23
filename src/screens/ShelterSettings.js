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
    const [tel, setTel] = useState(defaultValues.tel);
    const [password, setPassword] = useState(defaultValues.password);
    const [newPassword, setNewPassword] = useState(defaultValues.newPassword);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);

    const navigation = useNavigation();

    const togglePushNotifications = () => {
        setIsPushNotificationsEnabled(previousState => !previousState);
        setIsEditable(true);
    };

    const handleUpdate = () => {
        updateUserSettings();
    };

    const checkDetailsInputs = () => {
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
        if (SettingsInputValidations.isEmptyOrWhitespace(tel)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.phone_required);
            return false;
        }
        if (!SettingsInputValidations.containsAtSymbol(email)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.valid_email);
            return false;
        }
        if (!SettingsInputValidations.isValidNumberInput(tel)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.valid_number);
            return false;
        }
        return true;
    };

    const updateUserSettings = () => {
        // Check if inputs were edited
        if (!isEditable) {
            Alert.alert('Info', "No changes were made.");
            return;
        }

        // Call the input validation function
        if (!checkDetailsInputs()) {
            return;
        }

        // Save all inputs in an object
        const updatedUserDetails = {
            shelterName,
            location,
            email,
            tel,
            notifications: isPushNotificationsEnabled,
            profileImage: profileImage || defaultProfileImage,
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
                    onPress: () => {
                        firebaseService.updateUserSettings("shelters",updatedUserDetails)
                        if(!SettingsInputValidations.isEmptyOrWhitespace(newPassword)){
                            firebaseService.changePassword(newPassword)
                        }
                    }
                }
            ]
        );
    };


    const handleLogout = () => {
        console.log('Logout button pressed');
        navigation.navigate('Login');
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
                    setIsPushNotificationsEnabled(userData.notifications);
                    setShelterName(userData.shelterName);
                    setLocation(userData.location);
                    setEmail(userData.email);
                    setTel(userData.phoneNumber);
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
                    <Image
                        source={profileImage ? { uri: profileImage } : defaultProfileImage}
                        style={ShelterSettingsStyles.centerImage}
                    />
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
                                value={tel}
                                onChangeText={setTel}
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
                                value={setNewPassword}
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
            </ScrollView>
            <NavbarWrapper />
        </SafeAreaView>
    );
};

export default ShelterSettingsScreen;
