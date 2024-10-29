/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This component represents the home screen for a shelter management application.
It displays a list of animals available in the shelter, fetched from a Firebase Firestore database.
Users can view details about each animal and navigate to add new animals or check interested adopters.
*/
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import styles from '../styles/ShelterHomePageStyle';
import Header from "../components/Header";
import {
    useNavigation,
    useFocusEffect
} from '@react-navigation/native';
import { Platform } from 'react-native';
import {
    db,
    auth
} from '../services/firebaseConfig';
import {
    collection,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import AnimalCard from '../components/AnimalCard';
import {
    handleAnimalAdopt,
    handleAnimalDelete
} from '../services/databaseService';
import NavbarWrapper from "../components/NavbarWrapper";
import colors from "../styles/colors";

/**
 * ShelterHomeScreen component
 * Displays a list of animals in the current shelter and allows navigation to other pages.
 */
const ShelterHomeScreen = () => {
    const navigation = useNavigation();
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * fetchAnimals function
     * Fetches the list of animals from Firestore for the current shelter.
     * Updates the state with the fetched animals and handles loading state.
     */
    const fetchAnimals = useCallback(async () => {
        setLoading(true);
        try {
            const currentShelterId = auth.currentUser?.uid;
            if (!currentShelterId) {
                console.error('No user logged in');
                setLoading(false);
                return;
            }
            // Query Firestore for animals belonging to the current shelter
            const animalsQuery = query(
                collection(db, 'animals'),
                where('shelterId', '==', currentShelterId)
            );

            // Subscribe to real-time updates from Firestore
            const unsubscribe = onSnapshot(animalsQuery, async (querySnapshot) => {
                try {
                    const animalsList = querySnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.name,
                            age: data.age,
                            gender: data.gender,
                            breed: data.breed,
                            adoptionStatus: data.adoptionStatus,
                            imageUrl: data.imageUrls[0] || '', // Store only the first image URL
                            notificationCount: data.notificationCount || 0,
                        };
                    });
                    setAnimals(animalsList);
                } catch (error) {
                    console.error('Error processing animals data:', error);
                } finally {
                    setLoading(false); // Ensure loading state is reset
                }
            }, (error) => {
                console.error('Error fetching animals:', error);
                setLoading(false); // Ensure loading is false even if there is an error
            });

            return () => unsubscribe(); // Cleanup subscription on unmount
        } catch (error) {
            console.error('Error fetching animals:', error);
            setLoading(false); // Ensure loading is false even if there is an error
        }
    }, []);

    /**
     * handleViewLikes function
     * Navigates to the InterestedAdoptersPage for the given animal.
     * @param {string} animalId - The ID of the animal to view likes for.
     */
    const handleViewLikes = (animalId) => {
        navigation.navigate('InterestedAdoptersPage', { animalId });
    };

    //load in animals whenever the page is viewed
    useFocusEffect(
        useCallback(() => {
            fetchAnimals();
        }, [fetchAnimals])
    );

    return (
        <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]} edges={['left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <Header rightComponent={() => (
                <Text style={styles.addButton} onPress={() => navigation.navigate('AddAnimal')}>Add</Text>
            )} />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.plutoCream} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {animals.map((animal) => (
                        <AnimalCard
                            key={animal.id} {...animal}
                            onAdopt={handleAnimalAdopt}
                            onDelete={handleAnimalDelete}
                            onViewLikes={handleViewLikes}
                        />
                    ))}
                </ScrollView>
            )}
            <NavbarWrapper />
        </SafeAreaView>
    );
};

export default ShelterHomeScreen;
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________