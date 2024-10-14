import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, ScrollView, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import strings from '../strings/en.js'; // Import the strings file
import styles from "../styles/FilterStyles";




const Filter = ({navigation})  =>  {
    const [isDog, setIsDog] = useState(true);
    const [selectedBreed, setSelectedBreed] = useState(strings.anyBreed); // Use strings.anyBreed
    const [maxDistance, setMaxDistance] = useState(32);
    const [ageRange, setAgeRange] = useState([3, 13]);
    const [activityLevel, setActivityLevel] = useState(0);
    const [size, setSize] = useState(1);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [furColors, setFurColors] = useState([]);
    const [scrollEnabled, setScrollEnabled] = useState(true);


    const dogBreeds = ['Labrador', 'Poodle', 'Bulldog', 'German Shepherd'];
    const catBreeds = ['Siamese', 'Persian', 'Maine Coon', 'Bengal'];
    const availableFurColors = ['Black', 'White', 'Brown', 'Golden', 'Spotted', 'Striped'];

    const toggleAnimalType = (type) => {
        setIsDog(type === 'dogs');
        setSelectedBreed(strings.anyBreed); // Reset using strings.anyBreed
    };


    const activityLevels = ['Couch Cushion', 'Lap Cat', 'Playful Pup', 'Adventure Hound'];
    const sizes = ['Small', 'Medium', 'Large'];

    const screenWidth = Dimensions.get('window').width;
    const relevantBreeds = isDog ? dogBreeds : catBreeds;

    const toggleFurColor = (color) => {
        if (furColors.includes(color)) {
            setFurColors(furColors.filter(furColor => furColor !== color));
        } else {
            setFurColors([...furColors, color]);
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

                {/* Maximum Distance Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={styles.label}>{strings.maximumDistanceLabel(maxDistance)}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={500}
                        step={1}
                        minimumTrackTintColor="gold"
                        maximumTrackTintColor="gray"
                        onValueChange={setMaxDistance}
                        value={maxDistance}
                    />
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

                {/* Done Button */}
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserHome')} >
                        <Text style={styles.buttonText}>{strings.applyFilterButton}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
export default Filter;
