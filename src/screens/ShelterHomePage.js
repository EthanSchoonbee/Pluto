import React, {
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import styles from '../styles/ShelterHomePageStyle';
import Header from "../components/Header";
import Navbar from "../components/ShelterNavbar";
import {
    useNavigation,
    useFocusEffect
} from '@react-navigation/native';
import { Platform } from 'react-native';
import { db, auth } from '../services/firebaseConfig';
import {
    collection,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import AnimalCard from '../components/AnimalCard';
import { getLocalImageUrl, deleteLocalImage } from '../utils/imageUtils';
import {  handleAdopt, handleDelete } from '../services/databaseService';
import NavbarWrapper from "../components/NavbarWrapper";

const ShelterHomeScreen = () => {
    const navigation = useNavigation();
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const fetchAnimals = useCallback(async () => {
        setLoading(true);
        try {
            const currentShelterId = auth.currentUser?.uid;
            if (!currentShelterId) {
                console.error('No user logged in');
                setLoading(false);
                return;
            }

            const animalsQuery = query(
                collection(db, 'animals'),
                where('shelterId', '==', currentShelterId)
            );

            const unsubscribe = onSnapshot(animalsQuery, async (querySnapshot) => {
                try {
                    const animalsList = await Promise.all(querySnapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const localImageUrl = await getLocalImageUrl(data.imageUrls || []);
                        return {
                            id: doc.id,
                            name: data.name,
                            age: data.age,
                            gender: data.gender,
                            breed: data.breed,
                            adoptionStatus: data.adoptionStatus,
                            imageUrl: localImageUrl, // Store only the first image URL
                            notificationCount: data.notificationCount || 0,
                        };
                    }));
                    setAnimals(animalsList);
                    await preloadImages(animalsList);
                } catch (error) {
                    console.error('Error processing animals data:', error);
                } finally {
                    setLoading(false); // Ensure loading state is reset
                }
            }, (error) => {
                console.error('Error fetching animals:', error);
                setLoading(false); // End loading on error
            });

            return () => unsubscribe(); // Cleanup subscription on unmount
        } catch (error) {
            console.error('Error fetching animals:', error);
            setLoading(false); // Ensure loading is false even if there is an error
        }
    }, []);


    const preloadImages = async (animalsList) => {
        const imageUrls = animalsList.flatMap(animal => animal.imageUrls).filter(url => url);
        try {
            await Promise.all(imageUrls.map(url => Image.prefetch(url)));
            setImagesLoaded(true);
        } catch (error) {
            console.error('Error prefetching images:', error);
        }
    };

    const handleViewLikes = (animalId) => {
        navigation.navigate('ShelterChats', { animalId });
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnimals();
        }, [fetchAnimals])
    );

    useEffect(() => {
        console.log('Loading state: ', loading);
    }, [loading]); // Log loading state whenever it changes

    return (
        <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight: 0}]} edges={['left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <Header rightComponent={() => (
                <Text style={styles.addButton} onPress={() => navigation.navigate('AddAnimal')}>Add</Text>
            )} />
            {loading || !imagesLoaded ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={'#d9cb94'} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {animals.map((animal) => (
                        <AnimalCard
                            key={animal.id} {...animal}
                            onAdopt={handleAdopt}
                            onDelete={handleDelete}
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