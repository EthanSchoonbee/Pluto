import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Button,
    ScrollView,
    Modal,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import strings from '../strings/en.js'; // Import the strings file
import styles from "../styles/FilterStyles";
import { db, auth } from '../services/firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Filter = ({navigation}) => {

    const provinces = strings.provinceArray
    const dogBreeds = strings.dogBreeds;
    const catBreeds = strings.catBreeds;
    const availableFurColors = strings.availableFurColors


    const userId = auth.currentUser.uid;
    const [loading, setLoading] = useState(true);  // Add loading state
    const [isDog, setIsDog] = useState(true);
    const [selectedBreed, setSelectedBreed] = useState(strings.anyBreed); // Use strings.anyBreed
    const [selectedGender, setSelectedGender] = useState("Any");
    const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState(provinces[0]);
    const [isProvincePickerVisible, setIsProvincePickerVisible] = useState(false);
    const [ageRange, setAgeRange] = useState([0, 0]);
    const [activityLevel, setActivityLevel] = useState(0);
    const [size, setSize] = useState(1);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [furColors, setFurColors] = useState([]);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const activityLevels = strings.activityLevels
    const sizes = strings.sizes

    const screenWidth = Dimensions.get('window').width;
    const relevantBreeds = isDog ? dogBreeds : catBreeds;


    const filters = {
        animalType: isDog ? 'Dog' : 'Cat',
        breed: selectedBreed,
        province: selectedProvince,
        gender: selectedGender,
        furColors: furColors.includes('Any') ? [] : furColors,
        ageRange,
        activityLevel,
        size,
    };

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const storedFilters = await AsyncStorage.getItem('userPreferences');

                if (storedFilters) {
                    const parsedFilters = JSON.parse(storedFilters);

                    // Set state with AsyncStorage values
                    setIsDog(parsedFilters.animalType === 'dog');
                    setSelectedBreed(parsedFilters.breed || 'Any Breed');
                    setSelectedProvince(parsedFilters.province || 'Any');
                    setAgeRange(parsedFilters.ageRange || [0, 20]);
                    setActivityLevel(parsedFilters.activityLevel ?? 0);
                    setSize(parsedFilters.size ?? 1);
                    setSelectedGender(parsedFilters.gender || 'Any');
                    setFurColors(parsedFilters.furColors && parsedFilters.furColors.length > 0 ? parsedFilters.furColors : ['Any']);
                }
                console.log(storedFilters);
            } catch (error) {
                console.error("Error loading filters:", error);
            } finally {
                setLoading(false);
            }
        };
        loadFilters();
    }, [userId]);

    const saveFilters = async () => {
        try {
            // Save to AsyncStorage
            await AsyncStorage.setItem('userPreferences', JSON.stringify(filters));
            console.log('Filters saved to AsyncStorage.');

            // Asynchronously save to Firestore
            const userFiltersDocRef = doc(db, 'users', userId);
            await setDoc(userFiltersDocRef, { preferences: filters }, { merge: true });
            console.log('Filters saved to Firestore.');
        } catch (error) {
            console.error("Error saving filters:", error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text>Loading filters...</Text>
            </View>
        );
    }

    const toggleAnimalType = (type) => {
        setIsDog(type === 'Dogs');
        setSelectedBreed(strings.anyBreed); // Reset using strings.anyBreed
    };


    const toggleFurColor = (color) => {
        if (color === 'Any') {
            // If "Any" is selected, clear all other colors
            setFurColors(['Any']);
        } else {
            if (furColors.includes('Any')) {
                // If "Any" was selected, remove it and add the selected color
                setFurColors([color]);
            } else if (furColors.includes(color)) {
                // Deselect the color if it's already selected
                setFurColors(furColors.filter(furColor => furColor !== color));
            } else {
                // Add the selected color
                setFurColors([...furColors, color]);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{strings.title}</Text>

                {/* Dog/Cat Toggle */}
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>{strings.lookingForLabel}</Text>
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

                {/* Breed Picker */}
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>{strings.breedLabel}</Text>
                    <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>{selectedBreed}</Text>
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
                                    <Picker.Item label={strings.anyBreed} value={strings.anyBreed} />
                                    {relevantBreeds.map((breed, index) => (
                                        <Picker.Item key={index} label={breed} value={breed} />
                                    ))}
                                </Picker>
                                <Button title={strings.closeButton} onPress={() => setIsPickerVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* Gender Picker */}
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>{strings.genderLabel}</Text>
                    <TouchableOpacity onPress={() => setIsGenderPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>{selectedGender}</Text>
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
                                        setSelectedGender(itemValue);
                                        setIsGenderPickerVisible(false);
                                    }}
                                >
                                    <Picker.Item label="Any" value="Any" />
                                    <Picker.Item label="Male (M)" value="M" />
                                    <Picker.Item label="Female (F)" value="F" />
                                </Picker>
                                <Button title={strings.closeButton} onPress={() => setIsGenderPickerVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* Province Selector */}
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>{strings.provincesLabel}</Text>
                    <TouchableOpacity onPress={() => setIsProvincePickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>{selectedProvince}</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={isProvincePickerVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsProvincePickerVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Picker
                                    selectedValue={selectedProvince}
                                    onValueChange={(itemValue) => {
                                        setSelectedProvince(itemValue);
                                        setIsProvincePickerVisible(false);
                                    }}
                                >
                                    {provinces.map((province, index) => (
                                        <Picker.Item key={index} label={province} value={province} />
                                    ))}
                                </Picker>
                                <Button title={strings.closeButton} onPress={() => setIsProvincePickerVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>

                {/* Fur Color Selection */}
                <View style={styles.colorPickerContainer}>
                    <Text style={styles.label}>{strings.furColorLabel}</Text>
                    <TouchableOpacity onPress={() => setIsColorPickerVisible(true)} style={styles.pickerButton}>
                        <Text style={styles.pickerText}>
                            {furColors.length > 0 ? furColors.join(', ') : strings.selectFurColor}
                        </Text>
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


                {/* Age Range Multi-Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={styles.label}>{strings.ageRangeLabel(ageRange[0], ageRange[1])}</Text>
                    <View style={styles.multiSliderContainer}>
                        <MultiSlider
                            values={ageRange}
                            onValuesChange={setAgeRange}
                            onValuesChangeStart={() => setScrollEnabled(false)}
                            onValuesChangeFinish={() => setScrollEnabled(true)}
                            min={0}
                            max={20}
                            step={1}
                            selectedStyle={{ backgroundColor: 'gold' }}
                            unselectedStyle={{ backgroundColor: 'gray' }}
                            markerStyle={{ backgroundColor: 'gold' }}
                            containerStyle={styles.slider}
                            sliderLength={screenWidth - 45}
                            trackStyle={{ height: 4 }}
                        />
                    </View>
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

                {/* Apply Filters Button */}
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            saveFilters(); // Save filters when user applies
                            navigation.navigate('UserHome'); // Navigate back to home
                        }}
                    >
                        <Text style={styles.buttonText}>{strings.applyFilterButton}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Filter;
