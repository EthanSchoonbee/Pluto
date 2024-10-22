import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert
} from 'react-native';
import styles from '../styles/ShelterHomePageStyle';
import {Ionicons} from "@expo/vector-icons";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import colors from "../styles/colors";
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
    doc,
    updateDoc
} from 'firebase/firestore';

const AnimalCard = ({ name, age, breed, gender, adoptionStatus, imageUrls, notificationCount, id, onAdopt }) => (
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

            <View style={styles.adoptionStatusContainer}>
                <Text style={styles.adoptionStatus}>
                    {adoptionStatus ? "Adopted" : "Up for Adoption"}
                </Text>
            </View>

        </View>
        <View style={styles.buttonContainer}>
            <ActionButton title="Adopted" onPress={() => onAdopt(id)} />
            <ActionButton title="View Likes" />
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

const ActionButton = ({ title, style, deleteButtonText, onPress }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
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

        console.log('Loading state before pull:',loading);
        try {
            const currentShelterId = auth.currentUser?.uid;
            if (!currentShelterId) {
                console.error('No user logged in');
                setLoading(false);
                return;
            }

            console.log('Current Shelter ID:', currentShelterId);

            const animalsQuery = query(
                collection(db, 'animals'),
                where('shelterId', '==', currentShelterId)
            );

            const unsubscribe = onSnapshot(animalsQuery, (querySnapshot) => {
                const animalsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name,
                        age: data.age,
                        gender: data.gender,
                        breed: data.breed,
                        adoptionStatus: data.adoptionStatus,
                        imageUrls: data.imageUrls || [],
                        notificationCount: data.notificationCount || 0,
                    };
                });
                setAnimals(animalsList);
                console.log('Animals fetched:', animalsList);
                preloadImages(animalsList);
                setLoading(false); // End loading after data is fetched
            }, (error) => {
                console.error('Error fetching animals:', error);
                setLoading(false); // End loading on error
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } catch (error) {
            console.error('Error fetching animals:', error);
            setLoading(false); // Ensure loading is false even if there is an error
        }
    };

    const preloadImages = async (animalsList) => {
        const imageUrls = animalsList.flatMap(animal => animal.imageUrls);
        const validImageUrls = imageUrls.filter(url => url); // Filter out any empty URLs

        try {
            await Promise.all(validImageUrls.map(url => Image.prefetch(url)));
            setImagesLoaded(true);
        } catch (error) {
            console.error('Error prefetching images:', error);
        }
    };

    const handleAdopt = (animalId) => {
        Alert.alert(
            "Confirm Adoption",
            "Are you sure this animal has been adopted?",
            [
                { text: "No", onPress: () => console.log("Adoption canceled"), style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const animalRef = doc(db, 'animals', animalId);
                            await updateDoc(animalRef, { adoptionStatus: true });
                            console.log(`Animal with ID ${animalId} updated to adopted.`);

                            // Refresh the list of animals after updating
                            await fetchAnimals(); // Call fetchAnimals directly

                            Alert.alert('Success', 'The animal has been marked as adopted.');
                        } catch (error) {
                            console.error('Error updating animal adoption status:', error);
                        } finally {
                            setLoading(false); // Ensure loading state is reset
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAnimals();
        }, [])
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
                    <ActivityIndicator size="large" color={colors.genderMaleBlue} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {animals.map((animal) => (
                        <AnimalCard key={animal.id} {...animal} onAdopt={handleAdopt} />
                    ))}
                </ScrollView>
            )}
            <Navbar />
        </SafeAreaView>
    );
};

export default ShelterHomeScreen;