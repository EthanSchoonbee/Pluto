import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Slider from '@react-native-community/slider';
import React from "react";
import { View, Text, TextInput, SafeAreaView, Button, ScrollView, Modal, TouchableOpacity, Dimensions, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import strings from "../strings/en";
import styles from '../styles/AddAnimalPageStyles';
import { Picker } from "@react-native-picker/picker"; // Import the stylesheet
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'; // or any other icon set you prefer
import {useAuth} from "../hooks/useAuth"
import userSession from '../services/UserSession';
import { useEffect } from "react";
import {Animal} from "../models/AnimalModel";
import firebaseService from "../services/firebaseService";
import { db, auth } from "../services/firebaseConfig";

const AddAnimal = ({ navigation }) => {
    const [isDog, setIsDog] = useState(true);
    const [selectedBreed, setSelectedBreed] = useState(strings.anyBreed); // Use strings.anyBreed
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [biography, setBiography] = useState("");
    const [activityLevel, setActivityLevel] = useState(0);
    const [size, setSize] = useState(0);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [furColors, setFurColors] = useState([]);
    const activityLevels = ['Couch Cushion', 'Lap Cat', 'Playful Pup', 'Adventure Hound'];
    const sizes = ['Small', 'Medium', 'Large'];
    const dogBreeds = ['Labrador', 'Poodle', 'Bulldog', 'German Shepherd'];
    const catBreeds = ['Siamese', 'Persian', 'Maine Coon', 'Bengal'];
    const availableFurColors = ['Black', 'White', 'Brown', 'Golden', 'Spotted', 'Striped'];
    const relevantBreeds = isDog ? dogBreeds : catBreeds;

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
            if (result.assets && result.assets.length + images.length <= 7) {
                const selectedUris = result.assets.map((asset) => asset.uri);
                setImages([...images, ...selectedUris]);
            } else {
                Alert.alert('Upload Limit', 'You can only upload a maximum of 7 images.');
            }
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (images.length < 3) {
            alert("Please add at least 3 images.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            console.log("You must be signed in.");
            return;
        }

        try {
            // Populate the Animal object
            const newAnimal = { ...Animal }; // Create a new instance based on the class structure
            newAnimal.name = name;
            newAnimal.species = isDog ? "dog" : "cat";
            newAnimal.breed = selectedBreed;
            newAnimal.age = age;
            newAnimal.activityLevel = activityLevel;
            newAnimal.size = sizes[size];
            newAnimal.furColor = furColors.join(", ");
            newAnimal.description = biography;
            newAnimal.shelterId = user.uid // Assume user represents a shelter
            newAnimal.location = ""; // Add location logic here if needed
            newAnimal.imageUrl = images[0]; // Assuming first image as a sample, you can adjust this as needed
            newAnimal.likedByUsers = [];
            newAnimal.createdAt = new Date();
            newAnimal.updatedAt = new Date();

            // Add the animal data to Firestore under the "animals" collection
            await addDoc(collection(db, "animals"), newAnimal);

            // Success feedback or redirection after submission
            alert("Animal data has been saved successfully!");
            navigation.navigate("UserHome");
        } catch (error) {
            console.error("Error adding animal data: ", error);
            alert("Failed to save the animal data. Please try again.");
        }
    };


    const toggleAnimalType = (type) => {
        setIsDog(type === 'dogs');
        setSelectedBreed(strings.anyBreed); // Reset using strings.anyBreed
    };

    const toggleFurColor = (color) => {
        if (furColors.includes(color)) {
            setFurColors(furColors.filter(furColor => furColor !== color));
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
                            onPress={() => toggleAnimalType('dogs')}
                        >
                            <Text style={styles.toggleButtonText}>{strings.dogsButton}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.toggleButton, !isDog && styles.selectedButton]}
                            onPress={() => toggleAnimalType('cats')}
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
                    <TextInput
                        style={styles.input}
                        placeholder={strings.namePlaceholder}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={strings.agePlaceholder}
                        value={age}
                        onChangeText={setAge}
                    />
                    <TextInput
                        style={styles.textArea}
                        placeholder={strings.biographyPlaceholder}
                        value={biography}
                        onChangeText={setBiography}
                        multiline
                    />
                </View>

                {/* Breed Picker */}
                <View style={styles.pickerContainer}>
                    <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>
                            {selectedBreed === strings.anyBreed ? strings.selectBreed : selectedBreed}
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
