import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserSettingsStyles from "../styles/UserSettingsStyles";
import strings from '../strings/en.js';
import Navbar from "../components/Navbar";

const UserSettingsScreen = () => {
    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const navigation = useNavigation();

    const togglePushNotifications = () => setIsPushNotificationsEnabled(previousState => !previousState);

    const handleUpdate = () => {
        // Handle update action
        console.log('Update button pressed');
    };

    const handleLogout = () => {
        // Handle logout action and navigate to the Login screen
        console.log('Logout button pressed');
        navigation.navigate('Login');
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={UserSettingsStyles.container} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* User Name and Location */}
                <View style={UserSettingsStyles.headerSection}>
                    <Text style={UserSettingsStyles.headerText}>{strings.user_settings.user_name}</Text>
                    <Text style={UserSettingsStyles.headerText}>{strings.user_settings.location}</Text>
                </View>

                {/* Your Details Section */}
                <Text style={UserSettingsStyles.detailsTitle}>{strings.user_settings.your_details_title}</Text>
                <View style={UserSettingsStyles.detailsContainer}>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.name_label}</Text>
                        <Text style={UserSettingsStyles.detailsValue}>{strings.user_settings.sample_text}</Text>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.surname_label}</Text>
                        <Text style={UserSettingsStyles.detailsValue}>{strings.user_settings.sample_text}</Text>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.email_label}</Text>
                        <Text style={UserSettingsStyles.detailsValue}>sample@example.com</Text>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.password_label}</Text>
                        <Text style={UserSettingsStyles.detailsValue}>{strings.user_settings.password_placeholder}</Text>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.confirm_password_label}</Text>
                        <Text style={UserSettingsStyles.detailsValue}>{strings.user_settings.confirm_password_placeholder}</Text>
                    </View>
                    <View style={UserSettingsStyles.detailsRow}>
                        <Text style={UserSettingsStyles.detailsLabel}>{strings.user_settings.location}</Text>
                        <Text style={UserSettingsStyles.detailsValue}>{strings.user_settings.sample_text}</Text>
                    </View>
                </View>

                {/* Privacy Section */}
                <Text style={UserSettingsStyles.privacyTitle}>{strings.user_settings.privacy_title}</Text>
                <View style={UserSettingsStyles.privacyContainer}>
                    <View style={UserSettingsStyles.notificationRow}>
                        <Text style={UserSettingsStyles.notificationText}>{strings.user_settings.push_notifications}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isPushNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
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

                {/* Add extra space before the Navbar to avoid clipping */}
                <View style={{ height: 50 }} />  {/* Optional: Add some space before the navbar */}
                {/* Navbar at the bottom */}
                <Navbar />
            </ScrollView>
        </View>
    );
};

export default UserSettingsScreen;
