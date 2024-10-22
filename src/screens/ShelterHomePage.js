import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import styles from '../styles/ShelterHomePageStyle';
import {Ionicons} from "@expo/vector-icons";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import colors from "../styles/colors";
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { Platform } from 'react-native';
import { db, auth } from '../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AnimalCard = ({ name, age, breed, gender, imageUrls, notificationCount }) => (
    <View style={styles.card}>
        <Image
            source={{ uri: imageUrls.length > 0 ? imageUrls[0] : '' }}
            style={styles.animalImage}
            resizeMode="cover"
            onError={(e) => {
                console.log("Error loading image: ", e.nativeEvent.error);
            }}
        />
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
            <ActionButton title="Adopted" />
            <ActionButton title="View Messages" />
            <ActionButton title="Delete" style={styles.deleteButton} deleteButtonText />
        </View>
    </View>
);

const renderGenderIcon = (gender) => {
    const iconName = gender === 'M' ? "male" : gender === 'F' ? "female" : null;
    const iconColor = gender === 'M' ? colors.genderMaleBlue : colors.genderFemalePink;

    return iconName ? (
        <Ionicons style={styles.gender} name={iconName} size={18} color={iconColor} />
    ) : null;
};

const ActionButton = ({ title, style, deleteButtonText }) => (
    <TouchableOpacity style={[styles.button, style]}>
        <Text style={[styles.buttonText, deleteButtonText && styles.deleteButtonText]}>{title}</Text>
    </TouchableOpacity>
);

const ShelterHomeScreen = () => {
    const navigation = useNavigation();
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const fetchAnimals = async () => {
        setLoading(true);
        try {
            const currentShelterId = auth.currentUser?.uid;
            if (!currentShelterId) {
                console.error('No user logged in');
                return;
            }

            console.log('Current Shelter ID:', currentShelterId);

            const animalsQuery = query(
                collection(db, 'animals'),
                where('shelterId', '==', currentShelterId)
            );

            const querySnapshot = await getDocs(animalsQuery);
            const animalsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log(doc.data().valueOf().imageUrls);
                return {
                    id: doc.id,
                    name: data.name,
                    age: data.age,
                    gender: data.gender,
                    breed: data.breed,
                    imageUrls: data.imageUrls || [],
                    notificationCount: data.notificationCount || 0,
                };
            });

            setAnimals(animalsList);
            await preloadImages(animalsList);
        } catch (error) {
            console.error('Error fetching animals:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const preloadImages = async (animalsList) => {
        const imageUrls = animalsList.flatMap(animal => animal.imageUrls);
        await Promise.all(imageUrls.map(url => Image.prefetch(url)));
        setImagesLoaded(true);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAnimals();
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight: 0}]} edges={['left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <Header rightComponent={() => (
                <Text style={styles.addButton} onPress={() => navigation.navigate('AddAnimal')}>Add</Text>
            )} />
            {loading || !imagesLoaded ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.genderMaleBlue} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {animals.map((animal) => (
                        <AnimalCard key={animal.id} {...animal} />
                    ))}
                </ScrollView>
            )}
            <Navbar />
        </SafeAreaView>
    );
};

export default ShelterHomeScreen;