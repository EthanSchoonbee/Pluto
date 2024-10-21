import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import ShelterSettingsStyles from "../styles/ShelterSettingsStyles"; // New style file
import strings from '../strings/en.js'; // Import strings
import Navbar from "../components/Navbar";

const defaultProfileImage = require('../../assets/handsome_squidward.jpg')

const ShelterSettingsScreen = () => {
    const defaultValues = {
        shelterName: "Sample Shelter",
        location: "Sample Location",
        email: "shelter@example.com",
        tel: "+1234567890",
        password: "",
        confirmPassword: ""
    };

    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [shelterName, setShelterName] = useState(defaultValues.shelterName);
    const [location, setLocation] = useState(defaultValues.location);
    const [email, setEmail] = useState(defaultValues.email);
    const [tel, setTel] = useState(defaultValues.tel);
    const [password, setPassword] = useState(defaultValues.password);
    const [confirmPassword, setConfirmPassword] = useState(defaultValues.confirmPassword);
    const [isEditable, setIsEditable] = useState(false); // Control editable state

    const navigation = useNavigation();

    const togglePushNotifications = () => setIsPushNotificationsEnabled(previousState => !previousState);

    const handleUpdate = () => {
        console.log('Update button pressed', { shelterName, location, email, tel, password, confirmPassword });
    };

    const handleLogout = () => {
        console.log('Logout button pressed');
        navigation.navigate('Login');
    };

    const handleDoubleClick = () => {
        setIsEditable(prev => !prev);
    };

    // Reset fields to default values when the component is focused
    useFocusEffect(
        React.useCallback(() => {
            setIsPushNotificationsEnabled(false); // Reset push notifications
            setShelterName(defaultValues.shelterName);
            setLocation(defaultValues.location);
            setEmail(defaultValues.email);
            setTel(defaultValues.tel);
            setPassword(defaultValues.password);
            setConfirmPassword(defaultValues.confirmPassword);
            setIsEditable(false);
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={ShelterSettingsStyles.container} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Centered Image */}
                <View style={ShelterSettingsStyles.centerImageContainer}>
                    <Image
                        source={defaultProfileImage} // Replace with your actual image URI
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
                                editable={isEditable} // Editable only when double clicked
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
                                editable={isEditable} // Editable only when double clicked
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
                                editable={isEditable} // Editable only when double clicked
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
                                editable={isEditable} // Editable only when double clicked
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_password}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={strings.shelter_settings.shelter_password_placeholder}
                                secureTextEntry={true}
                                editable={isEditable} // Editable only when double clicked
                                selectTextOnFocus={isEditable}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ShelterSettingsStyles.detailsRow}>
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_confirm_password}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder={strings.shelter_settings.shelter_confirm_password_placeholder}
                                secureTextEntry={true}
                                editable={isEditable} // Editable only when double clicked
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
            </ScrollView>

            <Navbar style={{ flex: 1 }} />
        </View>
    );
};

export default ShelterSettingsScreen;
