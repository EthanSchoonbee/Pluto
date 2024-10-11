import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ShelterSettingsStyles from "../styles/ShelterSettingsStyles";  // New style file
import strings from '../strings/en.js';  // Import strings
import Navbar from "../components/Navbar";

const ShelterSettingsScreen = () => {
    // Initialize state variables
    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [shelterName, setShelterName] = useState("Sample Shelter");
    const [location, setLocation] = useState("Sample Location");
    const [email, setEmail] = useState("shelter@example.com");
    const [tel, setTel] = useState("+1234567890");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Use navigation hook
    const navigation = useNavigation();

    // Toggle push notifications switch
    const togglePushNotifications = () => setIsPushNotificationsEnabled(previousState => !previousState);

    // Handle update action
    const handleUpdate = () => {
        console.log('Update button pressed', { shelterName, location, email, tel, password, confirmPassword });
    };

    // Handle logout and navigate to Login
    const handleLogout = () => {
        console.log('Logout button pressed');
        navigation.navigate('Login');
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={ShelterSettingsStyles.container} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Centered Image */}
                <View style={ShelterSettingsStyles.centerImageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your actual image URI
                        style={ShelterSettingsStyles.centerImage}
                    />
                </View>

                {/* Shelter Profile Image */}
                <View style={ShelterSettingsStyles.imageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual shelter image URI
                        style={ShelterSettingsStyles.profileImage}
                    />
                </View>

                {/* Shelter Details Section */}
                <Text style={ShelterSettingsStyles.detailsTitle}>{strings.shelter_settings.shelter_details_title}</Text>
                <View style={ShelterSettingsStyles.detailsContainer}>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_name}</Text>
                        <TextInput
                            style={ShelterSettingsStyles.detailsValue}
                            value={shelterName}
                            onChangeText={setShelterName}
                            placeholder={strings.shelter_settings.shelter_sample_text}
                        />
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_location}</Text>
                        <TextInput
                            style={ShelterSettingsStyles.detailsValue}
                            value={location}
                            onChangeText={setLocation}
                            placeholder={strings.shelter_settings.shelter_sample_text}
                        />
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_email}</Text>
                        <TextInput
                            style={ShelterSettingsStyles.detailsValue}
                            value={email}
                            onChangeText={setEmail}
                            placeholder={strings.shelter_settings.shelter_email_placeholder}
                        />
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_tel}</Text>
                        <TextInput
                            style={ShelterSettingsStyles.detailsValue}
                            value={tel}
                            onChangeText={setTel}
                            placeholder={strings.shelter_settings.shelter_tel_placeholder}
                        />
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_password}</Text>
                        <TextInput
                            style={ShelterSettingsStyles.detailsValue}
                            value={password}
                            onChangeText={setPassword}
                            placeholder={strings.shelter_settings.shelter_password_placeholder}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_confirm_password}</Text>
                        <TextInput
                            style={ShelterSettingsStyles.detailsValue}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder={strings.shelter_settings.shelter_confirm_password_placeholder}
                            secureTextEntry={true}
                        />
                    </View>
                </View>

                {/* Privacy Section */}
                <Text style={ShelterSettingsStyles.privacyTitle}>{strings.shelter_settings.shelter_privacy_title}</Text>
                <View style={ShelterSettingsStyles.privacyContainer}>
                    <View style={ShelterSettingsStyles.notificationRow}>
                        <Text style={ShelterSettingsStyles.notificationText}>{strings.shelter_settings.shelter_push_notifications}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isPushNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
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

                <View style={{ height: 50 }}><Text></Text></View>
                {/* Navbar at the bottom */}
                <Navbar />
            </ScrollView>
        </View>
    );
};

export default ShelterSettingsScreen;
