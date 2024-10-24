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
    ActivityIndicator, ToastAndroid
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import strings from '../strings/en.js'; // Import the strings file
import styles from "../styles/FilterStyles";
import { db, auth } from '../services/firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";

const Filter = ({navigation}) => {

    const provinces = ['Western Cape', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West'];
    const dogBreeds = strings.dogBreeds;
    const catBreeds = strings.catBreeds;
    const availableFurColors = ['Any', 'Black', 'White', 'Brown', 'Golden', 'Spotted', 'Striped'];


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


    const filters = {
        animalType: isDog ? 'dog' : 'cat',
        breed: selectedBreed,
        province: selectedProvince,
        gender: selectedGender,
        furColors: furColors.includes('Any') ? [] : furColors,
        ageRange,
        activityLevel,
        size,
    };

    useEffect(() => {
        const loadFiltersFromFirestore = async () => {
            try {
                const userFiltersDocRef = doc(db, 'users', userId);
                const docSnap = await getDoc(userFiltersDocRef);

                if (docSnap.exists()) {
                    const filters = docSnap.data().preferences;

                    // Set the state values with the data from Firestore
                    setIsDog(filters.animalType === 'dog');
                    setSelectedBreed(filters.breed || 'Any Breed');  // Default to 'Any Breed'
                    setSelectedProvince(filters.province || 'Any');  // Default to 'Any' for provinces
                    setAgeRange(filters.ageRange || [0, 20]);         // Default age range
                    setActivityLevel(filters.activityLevel ?? 0);     // Default activity level
                    setSize(filters.size ?? 1);                       // Default size value

                    // Set gender (with default of 'Any')
                    setSelectedGender(filters.gender || 'Any');  // Default to 'Any' if gender is not set

                    // Set fur colors (with default of 'Any')
                    if (filters.furColors && filters.furColors.length > 0) {
                        setFurColors(filters.furColors);
                    } else {
                        setFurColors(['Any']);  // Default to 'Any' if no fur colors are set
                    }
                }
            } catch (error) {
                console.error("Error loading filters:", error);
            } finally {
                setLoading(false);  // Stop loading once the data is fetched
            }
        };

        // Call the async function
        loadFiltersFromFirestore();
    }, [userId]);


    if (loading) {
        // Display a loading indicator while data is being fetched
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text>Loading filters...</Text>
            </View>
        );
    }

    const toggleAnimalType = (type) => {
        setIsDog(type === 'dogs');
        setSelectedBreed(strings.anyBreed); // Reset using strings.anyBreed
    };


    const activityLevels = ['Couch Cushion', 'Lap Cat', 'Playful Pup', 'Adventure Hound'];
    const sizes = ['Small', 'Medium', 'Large'];

    const screenWidth = Dimensions.get('window').width;
    const relevantBreeds = isDog ? dogBreeds : catBreeds;

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

    const saveFiltersToFirestore = async () => {
        if (!userId) return;
        try {
            // Directly link the user document to a preferences document
            const userFiltersDocRef = doc(db, 'users', userId);  // Directly reference the user's document

            // Set the filters directly in the user's document
            await setDoc(userFiltersDocRef, { preferences: filters }, { merge: true });  // Merge to avoid overwriting other fields

            console.log('Filters saved successfully!');
        } catch (error) {
            console.error("Error saving filters:", error);
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
                            saveFiltersToFirestore(); // Save filters when user applies
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
