import React, {useState, useRef} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Modal,
    FlatList
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ShelterSettingsStyles from "../styles/ShelterSettingsStyles";
import strings from '../strings/en.js';
import SettingsInputValidations from "../services/SettingsInputValidations";
import NavbarWrapper from "../components/NavbarWrapper";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import firebaseService from "../services/firebaseService";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { signOut } from 'firebase/auth';


const defaultprofileImageLocal = require('../../assets/handsome_squidward.jpg');


const ShelterSettingsScreen = () => {
    const defaultValues = {
        shelterName: "Sample Shelter",
        province: "Sample Location",
        email: "shelter@example.com",
        tel: "+1234567890",
        password: "",
        newPassword: ""
    };


    const [shelterName, setShelterName] = useState(defaultValues.shelterName);
    const [selectedProvince, setselectedProvince] = useState(defaultValues.province); // Corrected to use 'province'
    const [email, setEmail] = useState(defaultValues.email);
    const [phoneNumber, setphoneNumber] = useState(defaultValues.phoneNumber);
    const [password, setPassword] = useState(defaultValues.password);
    const [newPassword, setNewPassword] = useState(defaultValues.newPassword);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileImageLocal, setprofileImageLocal] = useState(null);
    const storage = getStorage();
    const auth = getAuth();
    const navigation = useNavigation();
    const [imageChanged, setImageChanged] = useState(false);
    const profileImageRef = useRef({profilesImage: null});
    const [isModalVisible, setModalVisible] = useState(false);

    const provinces= ['Western Cape', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West'];

    // Function to handle selecting a location
    const handlePickedLocation = (province) => {
        if (isEditable) {
            setselectedProvince(province);
            setModalVisible(false);
        }
    };

    // Function to open the modal
    const openModal = () => {
        if (isEditable) {
            setModalVisible(true);
        }
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
        const imageRef = ref(storage, `shelters/${user.uid}/profile.jpg`);

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
                        console.log(downloadURL);
                        console.log(profileImageLocal);

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

        Alert.alert(
            "Attention",
            'Are you sure you want to update your details?',
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        setLoading(true);
                        try {

                            if(imageChanged){
                                if (profileImageLocal) {
                                    await uploadProfileImage(profileImageLocal);
                                }
                            }

                            const profileImage = await checkImageChangeForAsyncStorage();


                            const updatedUserDetails = {
                                shelterName,
                                province: selectedProvince,
                                email,
                                phoneNumber,
                                profileImage,
                            };

                            // Then update the user details, including the image URL if uploaded
                            const finalDetails = {
                                ...updatedUserDetails,
                            };

                            if(newPassword !==  password){
                                await firebaseService.changePassword(newPassword);
                            }

                            await updateUserDataToAsyncStorage(finalDetails);

                            await firebaseService.updateUserSettings("shelters", finalDetails);

                            Alert.alert("Success", "Your profile has been updated.");
                        } catch (error) {
                            Alert.alert("Error", "There was an issue updating your profile. Please try again.");
                        } finally {
                            setImageChanged(false);
                            setLoading(false);
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


    const checkDetailsInputs = () => {

        if(newPassword !== password){
            if(!SettingsInputValidations.isLongerThanFive(newPassword)){
                Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.confirm_required);
                return false;
            }
        }


        if (SettingsInputValidations.isEmptyOrWhitespace(shelterName)) {
            Alert.alert(strings.shelter_settings.validation_error, strings.shelter_settings.name_required);
            return false;
        }
        if (SettingsInputValidations.isEmptyOrWhitespace(selectedProvince)) { // Updated to selectedProvince
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
        setIsEditable(true);
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


    // Function to fetch user data from AsyncStorage
    const fetchUserDataFromAsyncStorage = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data !== null) {
                const userData = JSON.parse(data); // Parse the data into an object
                if (userData) {
                    setShelterName(userData.shelterName);
                    setselectedProvince(userData.province);
                    setEmail(userData.email);
                    setphoneNumber(userData.phoneNumber);
                    setprofileImageLocal(userData.profileImage || null);
                    setPassword('');  // Clear password fields for security
                    setNewPassword('');
                    setIsEditable(false);
                }
                console.log('user data:', data);
            }

            console.log('data:', data);
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
                setShelterName('');
                setEmail('');
                setPassword('');
                setNewPassword('');
                setselectedProvince('');
                setprofileImageLocal(null);
                setIsEditable(false);
            };
        }, [])
    );



    if (loading) {
        // Display a loading spinner or text while data is being fetched
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#d9cb94" />
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
                        source={profileImageLocal ? { uri: profileImageLocal } : defaultprofileImageLocal}
                        style={ShelterSettingsStyles.centerImage}
                        editable ={true}
                    />
                    </TouchableOpacity>
                </View>

                {/* Shelter Details Section */}
                <Text style={ShelterSettingsStyles.detailsTitle}>{strings.shelter_settings.shelter_details_title}</Text>
                <View style={ShelterSettingsStyles.detailsContainer}>
                    <TouchableOpacity onPress={handleDoubleClick}>
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
                        {/* Shelter Location */}
                        <View style={ShelterSettingsStyles.detailsRow}>
                            <Text style={ShelterSettingsStyles.detailsLabel}>Province</Text>
                            <TouchableOpacity onPress={() => { openModal(); handleDoubleClick(); }}>
                                <Text style={ShelterSettingsStyles.detailsValue}>{selectedProvince || "Select Location"}</Text>
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
                                    editable={false}
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
                    </TouchableOpacity>
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


                {/* Location Picker Modal */}
                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={ShelterSettingsStyles.modalOverlay}>
                        <View style={ShelterSettingsStyles.modalContainer}>
                            <Text style={ShelterSettingsStyles.modalTitle}>Select Province</Text>
                            <FlatList
                                data={provinces}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={ShelterSettingsStyles.locationOption}
                                        onPress={() => handlePickedLocation(item)}
                                    >
                                        <Text style={ShelterSettingsStyles.locationText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={ShelterSettingsStyles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={ShelterSettingsStyles.closeButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </ScrollView>
            <NavbarWrapper />
        </SafeAreaView>
    );
};

export default ShelterSettingsScreen;
