import React, { useState } from 'react';
import {View, Text, ScrollView, Switch, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import UserSettingsStyles from "../styles/UserSettingsStyles";
import strings from '../strings/en.js';
import Navbar from "../components/ShelterNavbar";
import SettingsInputValidations from "../services/SettingsInputValidations";
import { Alert } from 'react-native';
import NavbarWrapper from "../components/NavbarWrapper";
import { db, auth } from '../services/firebaseConfig';
import firebaseService from "../services/firebaseService";

const UserSettingsScreen = () => {
    const defaultValues = {
        name: "Sample Name",
        surname: "Sample Surname",
        email: "sample@example.com",
        password: "default",
        confirmPassword: "default",
        location: "Sample Location",
    };

    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [name, setName] = useState(defaultValues.name);
    const [email, setEmail] = useState(defaultValues.email);
    const [password, setPassword] = useState(defaultValues.password);
    const [confirmPassword, setConfirmPassword] = useState(defaultValues.confirmPassword);
    const [location, setLocation] = useState(defaultValues.location);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);  // Add loading state

    const navigation = useNavigation();

    const togglePushNotifications = () => setIsPushNotificationsEnabled(previousState => !previousState);

    const handleUpdate = () => {
        checkDetailsInputs()
    };

    // Check if details inputs are valid
    const checkDetailsInputs = () => {

        // Start of checking for null inputs
        if (SettingsInputValidations.isEmptyOrWhitespace(name)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.name_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(email)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.email_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(password)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.password_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(confirmPassword)) {
            Alert.alert(strings.user_settings.validation_error, strings.user_settings.confirm_required);
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

        if(SettingsInputValidations.containsNumber(surname)){
            Alert.alert(strings.user_settings.validation_error,strings.user_settings.surname_number)
            return false;
        }

        if(SettingsInputValidations.containsNumber(location)){
            Alert.alert(strings.user_settings.validation_error,strings.user_settings.location_number)
            return false;
        }

        if(!SettingsInputValidations.areStringsEqual(password, confirmPassword)){
            Alert.alert(strings.user_settings.validation_error,strings.user_settings.password_match)
            return false;
        }

        // If all inputs are valid
        return true;
    };

    const handleLogout = () => {
        // Handle logout action and navigate to the Login screen
        console.log('Logout button pressed');
        navigation.navigate('Login');
    };

    const handleDoubleClick = () => {
        setIsEditable(prev => !prev);
    };


    useFocusEffect(
        React.useCallback(() => {
            const fetchUserData = async () => {
                try {
                    const currentUser = firebaseService.getCurrentUser();
                    if (currentUser) {
                        const userData = await firebaseService.getUserData('users', currentUser.uid);
                        if (userData) {
                            setIsPushNotificationsEnabled(userData.notifications)
                            setName(userData.fullName || '');
                            setEmail(userData.email || '');
                            setLocation(userData.location || '');
                            setPassword('');  // Clear password fields for security
                            setConfirmPassword('');
                        }
                    }
                } catch (error) {
                    console.log('Error fetching user data:', error);
                } finally {
                    setLoading(false);  // Stop loading once data is fetched
                }
            };

            fetchUserData();

            return () => {
                setIsPushNotificationsEnabled(false);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
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
                {/* Username and Location */}
                <View style={UserSettingsStyles.headerSection}>
                    <Text style={UserSettingsStyles.headerText}>{name}</Text>
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
                                value={name}
                                onChangeText={setName}
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
                        <TouchableOpacity onPress={handleDoubleClick}>
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
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.confirm_password_label}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={UserSettingsStyles.detailsValue}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
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

                {/* Privacy Section */}
                <Text style={UserSettingsStyles.privacyTitle}>{strings.user_settings.privacy_title}</Text>
                <View style={UserSettingsStyles.privacyContainer}>
                    <View style={UserSettingsStyles.notificationRow}>
                        <Text style={UserSettingsStyles.notificationText}>{strings.user_settings.push_notifications}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isPushNotificationsEnabled ? '#00C853' : "#f4f3f4"}
                            onValueChange={togglePushNotifications}
                            value={isPushNotificationsEnabled}
                        />
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

            <View style={{height: 80}}>
                <NavbarWrapper/>
            </View>
        </SafeAreaView>
    );
};

export default UserSettingsScreen;
