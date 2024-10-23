import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    SafeAreaView, ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ShelterSettingsStyles from "../styles/ShelterSettingsStyles";
import strings from '../strings/en.js';
import Navbar from "../components/ShelterNavbar";
import SettingsInputValidations from "../services/SettingsInputValidations";
import colors from "../styles/colors";
import NavbarWrapper from "../components/NavbarWrapper";

const defaultProfileImage = require('../../assets/handsome_squidward.jpg');

const ShelterSettingsScreen = () => {
    const defaultValues = {
        shelterName: "Sample Shelter",
        location: "Sample Location",
        email: "shelter@example.com",
        tel: "+1234567890",
        password: "aaaaaaa",
        confirmPassword: "aaaaaaa"
    };

    const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(false);
    const [shelterName, setShelterName] = useState(defaultValues.shelterName);
    const [location, setLocation] = useState(defaultValues.location);
    const [email, setEmail] = useState(defaultValues.email);
    const [tel, setTel] = useState(defaultValues.tel);
    const [password, setPassword] = useState(defaultValues.password);
    const [confirmPassword, setConfirmPassword] = useState(defaultValues.confirmPassword);
    const [isEditable, setIsEditable] = useState(false);

    const navigation = useNavigation();

    const togglePushNotifications = () => setIsPushNotificationsEnabled(previousState => !previousState);

    const handleUpdate = () => {
        checkDetailsInputs();
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
        if (SettingsInputValidations.isEmptyOrWhitespace(password)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.password_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(confirmPassword)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.confirm_required);
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
        if (!SettingsInputValidations.areStringsEqual(password, confirmPassword)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.password_match);
            return false;
        }
        return true;
    };

    const handleLogout = () => {
        console.log('Logout button pressed');
        navigation.navigate('Login');
    };

    const handleDoubleClick = () => {
        setIsEditable(prev => !prev);
    };

    useFocusEffect(
        React.useCallback(() => {
            setIsPushNotificationsEnabled(false);
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={ShelterSettingsStyles.container}>
                {/* Centered Image */}
                <View style={ShelterSettingsStyles.centerImageContainer}>
                    <Image
                        source={defaultProfileImage}
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
                        <TouchableOpacity onPress={handleDoubleClick}>
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
                        <Text style={ShelterSettingsStyles.detailsLabel}>{strings.shelter_settings.shelter_confirm_password}</Text>
                        <TouchableOpacity onPress={handleDoubleClick}>
                            <TextInput
                                style={ShelterSettingsStyles.detailsValue}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
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
            {/* Navbar */}
            <View style={{height: 80}}>
                <Navbar/>
            </View>
            <NavbarWrapper />
        </SafeAreaView>
    );
};

export default ShelterSettingsScreen;
