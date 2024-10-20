import React from 'react';
import {View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../styles/ShelterHomePageStyle';
import {Ionicons} from "@expo/vector-icons";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import colors from "../styles/colors";
import { useNavigation } from '@react-navigation/native';

// test animals
const animals = [
    { id: 1, name: 'Ollie', age: 12, gender: 'M', breed: 'Jack Russell',notificationCount: 2,  images: [
            require('../../assets/dog-test-2.jpg')
        ]
    },
    { id: 2, name: 'Max', age: 5, gender: 'F', breed: 'Labrador',notificationCount: 0, images: [
            require('../../assets/dog-test-1.jpg'),
            require('../../assets/dog-test-3.jpg')
        ]
    },
    { id: 3, name: 'Bella', age: 3, gender: 'M', breed: 'Poodle',notificationCount: 1, images: [
            require('../../assets/dog-test-1.jpg'),
            require('../../assets/dog-test-2.jpg'),
            require('../../assets/dog-test-3.jpg')
        ]
    },
];

const AnimalCard = ({ name, age, breed, gender, images, notificationCount }) => (
    <View style={styles.card}>
        <Image source={images[0]} style={styles.animalImage} resizeMode="cover" />

        <View style={styles.notificationContainer}>
            {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notificationCount}</Text>
                </View>
            )}
        </View>

        <View style={styles.animalDetails}>
            <View style={styles.nameAgeContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>, {age} years old</Text>
            </View>

            <View style={styles.genderBreedContainer}>
                {renderGenderIcon(gender)}
                <Text style={styles.breed}>{breed}</Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Adopted</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const renderGenderIcon = (gender) => {
    if (gender === 'M') {
        return <Ionicons style={styles.gender} name="male" size={18} color={colors.genderMaleBlue} />;
    } else if (gender === 'F') {
        return <Ionicons style={styles.gender} name="female" size={18} color={colors.genderFemalePink} />;
    }
    return null;
};

const customRightComponent = (navigation) => (
    <Text style={styles.addButton} onPress={() => navigation.navigate('Login')}>Add</Text>
);

const ShelterHomeScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <Header rightComponent={() => customRightComponent(navigation)} />
                <ScrollView style={styles.scrollView}>
                    {animals.map((animal) => (
                        <AnimalCard key={animal.id} {...animal} />
                    ))}
                </ScrollView>
            <Navbar />
        </SafeAreaView>
    );
};

export default ShelterHomeScreen;