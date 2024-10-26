import {useEffect, useState} from "react";
import {collection, addDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import Slider from '@react-native-community/slider';
import React from "react";
import { View, Text, TextInput, SafeAreaView, Button, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import strings from "../strings/en";
import styles from '../styles/AddAnimalPageStyles';
import { Picker } from "@react-native-picker/picker"; // Import the stylesheet
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'; // or any other icon set you prefer
import { db, auth } from '../services/firebaseConfig';
import {Animal as animalData, Animal} from "../models/AnimalModel";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddAnimal = ({ navigation }) => {

    //Firebase
    const user = auth.currentUser;
    const storage = getStorage();

    //Interface
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

    //Animal Data
    const [isDog, setIsDog] = useState(true);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [selectedGender, setSelectedGender] = useState([]);
    const [shelterProvince, setShelterProvince] = useState("");
    const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
    const [age, setAge] = useState(0);
    const [biography, setBiography] = useState("");
    const [activityLevel, setActivityLevel] = useState(0);
    const [size, setSize] = useState(0);
    const sizes = strings.sizes;
    const availableFurColors = strings.shelterAvailableFurColors;
    const dogBreeds = strings.dogBreeds
    const catBreeds = strings.catBreeds
    const relevantBreeds = isDog ? dogBreeds : catBreeds;
    const activityLevels = strings.activityLevels;
    const [furColors, setFurColors] = useState([]);
    const newAnimal = { ...Animal };
    const [errors, setErrors] = useState({});


    // Fetch the shelter's location when the component mounts
    useEffect(() => {
        const fetchShelterProvince = async () => {
            if (user) {
                const shelterDocRef = doc(db, "shelters", user.uid);
                const shelterDoc = await getDoc(shelterDocRef);

                if (shelterDoc.exists()) {
                    const shelterData = shelterDoc.data();
                    setShelterProvince(shelterData.location);
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchShelterProvince();
    }, [user]);

    const validateForm = () => {
        let formErrors = {};

        // Name validation: No numbers allowed
        if (!newAnimal.name || /\d/.test(newAnimal.name)) {
            formErrors.name = 'Name should not contain numbers and cannot be empty';
        }

        // Age validation: Must be a number
        if (!newAnimal.age || isNaN(newAnimal.age) || newAnimal.age > 20|| newAnimal.age < 0) {
            formErrors.age = 'Age must be a valid number';
        }

        // Fur color validation: Required field
        if (!newAnimal.furColors) {
            console.log("Fur error")
            formErrors.furColors = 'Fur color is required';
        }

        // Breed validation: Required field
        if (selectedBreed === strings.anyBreed) {
            console.log("Breed error")
            formErrors.breed = 'Breed is required';
        }

        // Gender validation: Required field
        if (!selectedGender) {
            console.log("Gender error")
            formErrors.gender = 'Gender is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleImageUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need media library permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            selectionLimit: 7,
        });

        if (!result.canceled) {
            const uploadedImageUrls = [];

            for (const image of result.assets) {
                const blob = await fetch(image.uri).then(r => r.blob()); // Convert the image to a blob
                const imageRef = ref(storage, `animals/${user.uid}/${Date.now()}_${image.fileName}`); // Create a storage reference

                // Upload the image to Firebase Storage
                const uploadTask = uploadBytesResumable(imageRef, blob);

                // Handle upload progress and complete the task
                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        (error) => reject(error),
                        async () => {
                            // Once uploaded, get the download URL
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadedImageUrls.push(downloadURL); // Add the download URL to the array
                            resolve();
                        }
                    );
                });
            }

            setImages([...images, ...uploadedImageUrls]); // Add the uploaded image URLs to the state
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (images.length < 3) {
            alert(strings.shortImageLength);
            return;
        }

        if (!user) {
            alert(strings.noCurrentUser);
            return;
        }

        try {
            // Create a new Animal object
            newAnimal.name = name;
            newAnimal.species = isDog ? "Dog" : "Cat";
            newAnimal.breed = selectedBreed;
            newAnimal.age = Number(age);
            newAnimal.gender = selectedGender;
            newAnimal.province = shelterProvince;
            newAnimal.activityLevel = activityLevel;
            newAnimal.size = size;
            newAnimal.adoptionStatus = false;
            newAnimal.furColors = furColors.length > 0 ? furColors : []; // Stores the array directly
            newAnimal.description = biography;
            newAnimal.shelterId = user.uid;
            newAnimal.imageUrls = images; // Store the array of image URLs
            newAnimal.likedByUsers = [];
            newAnimal.createdAt = new Date();
            newAnimal.updatedAt = new Date();

            if (!validateForm()){
                alert("Error Creating animal. Check all data fields have valid entries" )
                return;
            }

            // Add the animal data to Firestore under the "animals" collection
            const animalRef = await addDoc(collection(db, "animals"), newAnimal);

            await updateDoc(animalRef,{
                uid: animalRef.id,
            })

            alert(strings.animalUploadSuccessful);
            navigation.navigate("ShelterHome");
        } catch (error) {
            console.error("Error adding animal data: ", error);
            alert(strings.animalUploadFailed);
        }
    };


    const toggleAnimalType = (type) => {
        setIsDog(type === 'Dog');
        setSelectedBreed(strings.anyBreed); // Reset using strings.anyBreed
    };


    const toggleFurColor = (color) => {
        if (furColors.includes(color)) {
            setFurColors(furColors.filter(furColors => furColors !== color));
        } else {
            setFurColors([...furColors, color]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{strings.addAnimalTitle}</Text>

                {/* Dog/Cat Toggle */}
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>{strings.selectSpecies}</Text>
                    <View style={styles.toggleButtonGroup}>
                        <TouchableOpacity
                            style={[styles.toggleButton, isDog && styles.selectedButton]}
                            onPress={() => toggleAnimalType('Dog')}
                        >
                            <Text style={styles.toggleButtonText}>{strings.dogsButton}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.toggleButton, !isDog && styles.selectedButton]}
                            onPress={() => toggleAnimalType('Cat')}
                        >
                            <Text style={styles.toggleButtonText}>{strings.catsButton}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Image Upload */}
                <View style={styles.imageContainer}>
                    {images.map((img, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: img }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.deleteImageButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.deleteImageText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 7 && (
                        <TouchableOpacity style={styles.uploadImage} onPress={handleImageUpload}>
                            <Text style={styles.uploadImageText}>+</Text>
                        </TouchableOpacity>
                    )}
                </View>


                {/* Name, Breed, Age, Biography */}
                <View style={styles.inputContainer}>
                    {/* Name Input */}
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Name"
                            value={name}
                            onChangeText={setName}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    {/* Age Input */}
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Age (1 - 20)"
                            value={age}
                            onChangeText={setAge}
                        />
                        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
                    </View>

                    {/* Biography Input */}
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter Biography"
                            value={biography}
                            onChangeText={setBiography}
                            multiline
                        />
                        {errors.biography && <Text style={styles.errorText}>{errors.biography}</Text>}
                    </View>
                </View>

                {/* Breed Picker */}
                <View style={styles.pickerContainer}>
                    <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>
                            {selectedBreed === "" ? strings.selectBreed : selectedBreed}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.arrowIcon} />
                    </TouchableOpacity>
                    <Modal
                        visible={isPickerVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsPickerVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Picker
                                    selectedValue={selectedBreed}
                                    onValueChange={(itemValue) => {
                                        setSelectedBreed(itemValue);
                                        setIsPickerVisible(false);
                                    }}
                                >
                                    {/* Blank option at the top */}
                                    <Picker.Item label="" value="" />
                                    {relevantBreeds.map((breed, index) => (
                                        <Picker.Item key={index} label={breed} value={breed} />
                                    ))}
                                </Picker>
                                <Button title={strings.closeButton} onPress={() => setIsPickerVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* Fur Color Selection */}
                <View style={styles.colorPickerContainer}>
                    <TouchableOpacity onPress={() => setIsColorPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>
                            {furColors.length > 0 ? furColors.join(', ') : strings.selectFur}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.arrowIcon} />
                    </TouchableOpacity>
                    <Modal
                        visible={isColorPickerVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsColorPickerVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.label}>{strings.selectFurColors}</Text>
                                {availableFurColors.map((color, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.colorOption}
                                        onPress={() => toggleFurColor(color)}
                                    >
                                        <View style={[styles.colorIndicator, { backgroundColor: furColors.includes(color) ? 'gold' : 'gray' }]} />
                                        <Text style={styles.checkboxLabel}>{color}</Text>
                                    </TouchableOpacity>
                                ))}
                                <Button title={strings.closeButton} onPress={() => setIsColorPickerVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>


                {/* Gender Picker */}
                <View style={styles.pickerContainer}>
                    <TouchableOpacity onPress={() => setIsGenderPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>
                            {selectedGender === "M" ? "Male" : selectedGender === "F" ? "Female" : strings.selectGender}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.arrowIcon} />
                    </TouchableOpacity>
                    <Modal
                        visible={isGenderPickerVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsGenderPickerVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Picker
                                    selectedValue={selectedGender}
                                    onValueChange={(itemValue) => {
                                        setSelectedGender(itemValue); // Set value to M or F
                                        setIsGenderPickerVisible(false);
                                    }}
                                >
                                    <Picker.Item label="" value="" />
                                    <Picker.Item label="Male" value="M" />
                                    <Picker.Item label="Female" value="F" />
                                </Picker>
                                <Button title={strings.closeButton} onPress={() => setIsGenderPickerVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* Activity Level Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={styles.label}>{strings.activityLevelLabel(activityLevels[activityLevel])}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={3}
                        step={1}
                        minimumTrackTintColor="gold"
                        maximumTrackTintColor="gray"
                        onValueChange={setActivityLevel}
                        value={activityLevel}
                    />
                </View>

                {/* Size Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={styles.label}>{strings.sizeLabel(sizes[size])}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={2}
                        step={1}
                        minimumTrackTintColor="gold"
                        maximumTrackTintColor="gray"
                        onValueChange={setSize}
                        value={size}
                    />
                </View>

                {/* Done Button */}
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>{strings.doneButton}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddAnimal;
