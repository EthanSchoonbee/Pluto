import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    Button,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Ionicons} from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import {LinearGradient} from 'expo-linear-gradient';
import colors from "../styles/colors";
import styles from '../styles/UserHomePageStyles';
import Header from '../components/Header';
import NavbarWrapper from "../components/NavbarWrapper";
import {arrayUnion, collection, doc, getDoc, getDocs, limit, query, updateDoc, where} from "firebase/firestore";
import {auth, db} from "../services/firebaseConfig";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

const floatingImageDislike = require('../../assets/dislike.png');
const floatingImageLike = require('../../assets/like.png');

const activityLevelMapping = {
    0: 'Couch Cushion',
    1: 'Lap Cat',
    2: 'Playful Pup',
    3: 'Adventure Hound',
};

const UserHomeScreen = () => {
    const swiperRef = useRef(null); // reference for the swiper object
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardIndex, setCardIndex] = useState(0); //  the card index
    const [imageIndexes, setImageIndexes] = useState(animals.map(() => 0));
    const [forceRerender, setForceRerender] = useState(1);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [lastSwipeDirection, setLastSwipeDirection] = useState(null);
    // like and dislike coloring:
    const [noButtonColor, setNoButtonColor] = useState(colors.white);
    const [yesButtonColor, setYesButtonColor] = useState(colors.white);
    const [noButtonIconColor, setNoButtonIconColor] = useState(colors.inactiveNoButton);
    const [yesButtonIconColor, setYesButtonIconColor] = useState(colors.inactiveYesButton);

    // calculate and keep track of floating image opacity
    const [likeOpacity, setLikeOpacity] = useState([]);
    const [dislikeOpacity, setDislikeOpacity] = useState([]);

    useFocusEffect(
        useCallback(() => {
            fetchAnimals();
            setYesButtonColor(colors.white);
            setYesButtonIconColor(colors.inactiveYesButton);
            setNoButtonColor(colors.white);
            setNoButtonIconColor(colors.inactiveNoButton);
        }, [])
    );

    useEffect(() => {
        if (animals.length > 0) {
            setLikeOpacity(animals.map(() => new Animated.Value(0))); // Initialize like opacity values
            setDislikeOpacity(animals.map(() => new Animated.Value(0))); // Initialize dislike opacity values
        }
    }, [animals]);

    useEffect(() => {
        setForceRerender((prev) => prev + 1);
    }, [animals]);

    // reset current card floating image opacities on load
    useEffect(() => {
        resetOpacity(cardIndex);
    }, [imageIndexes[cardIndex],cardIndex]);

    const fetchAnimals = async () => {
        try {
            setLoading(true);
            setError(null);

            const userData = JSON.parse(await AsyncStorage.getItem('userData'));
            const userPreferences = userData.preferences;
            const likedAnimals = userData.likedAnimals || [];

            console.log('User preferences: ', userPreferences);

            const {
                activityLevel,
                ageRange,
                animalType,
                breed,
                furColors,
                gender,
                province,
                size,
            } = userPreferences;

            let q = query(collection(db, 'animals'), limit(10));

            console.log("Liked animals: ", likedAnimals);

            /*
            // If the user has liked animals, filter by those IDs
            if (likedAnimals.length > 0) {
                q = query(q, where('uid', 'in', likedAnimals));
            }
             */

            console.log("Activity level: ", activityLevel);


            if (activityLevel !== undefined) {
                q = query(q, where('activityLevel', '==', activityLevel));
            }

            console.log('MIN: ', ageRange[0]);
            console.log('MAX: ', ageRange[1]);

            const minAge = ageRange[0];
            const maxAge = ageRange[1];

            if (ageRange && minAge !== undefined && maxAge !== undefined) {
                q = query(q, where('age', '>=', minAge), where('age', '<=', maxAge));
            }

            console.log('Animal type: ', animalType);

            if (animalType) {
                q = query(q, where('species', '==', animalType));
            }

            if (breed && breed !== 'Any') {
                q = query(q, where('breed', '==', breed));
            }

            console.log('Fur Colors: ', furColors);
            console.log('Fur Color Length: ', furColors.length);

            if (furColors && furColors.length > 0) {
                q = query(q, where('furColors', 'array-contains-any', furColors));
            }

            console.log('Gender: ', gender);

            if (gender && gender !== 'Any') {
                q = query(q, where('gender', '==', gender));
            }

            console.log('Province: ', province);

            if (province) {
                q = query(q, where('province', '==', province));
            }

            console.log('Size: ', size);

            if (size !== undefined) {
                q = query(q, where('size', '==', size));
            }

            console.log(q);

            const querySnapshot = await getDocs(q);

            const fetchedAnimals = [];

            for (const doc of querySnapshot.docs) {
                const animalData = doc.data();
                animalData.id = doc.id;
                animalData.imageUrls = animalData.imageUrls || [];
                animalData.images = await preloadImages(animalData.imageUrls);

                console.log('Captured animal: ${animalData.name} (ID: ${animalData.id})');

                // Only add animals with successfully preloaded images
                if (animalData.images.length > 0) {
                    fetchedAnimals.push(animalData);
                } else {
                    console.warn('No images found for animal: ${animalData.id}');
                }
            }
            console.log('Fetched animals: ', fetchedAnimals);

            // Filter out liked animals after fetching
            const filteredAnimals = fetchedAnimals.filter(
                (animal) => !likedAnimals.includes(animal.id)
            );

            console.log('Filtered animals: ', filteredAnimals);

            if (filteredAnimals .length === 0) {
                setError('No animals found. Please try again later.');
            }

            setAnimals(filteredAnimals );
            setImageIndexes(filteredAnimals .map(() => 0)); // Initialize image indexes for each animal
            console.log('Card index: ',cardIndex);
            console.log('Image index: ',imageIndexes);
        } catch (error) {
            console.error('Error fetching animals:', error);
            setError('Failed to load animals. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };


    const preloadImages = async (imageUrls) => {
        const storage = getStorage();
        const promises = imageUrls.map(async (imageUrl) => {
            try {
                // Get the download URL from Firebase Storage
                const storageRef = ref(storage, imageUrl);
                const downloadUrl = await getDownloadURL(storageRef);

                console.log(downloadUrl);

                // Use the image filename as the cache file name
                const fileName = imageUrl.split('/').pop().replace(/%2F/g, '_'); // Replace any %2F with _ to avoid subdirectories

                console.log('File Name: ',fileName);
                const localUri = `${FileSystem.cacheDirectory}${fileName}`;

                console.log('Local Uri: ',localUri);

                // Check if the image is already cached
                const fileInfo = await FileSystem.getInfoAsync(localUri);
                if (!fileInfo.exists) {
                    // Download the image if it doesn't exist locally
                    await FileSystem.downloadAsync(downloadUrl, localUri);
                }

                // Return the local URI for the image
                return { uri: localUri };
            } catch (error) {
                console.error('Error downloading or caching image:', error);
                return null; // Return null if there was an error
            }
        });

        // Filter out any null results and return only successful image URIs
        return (await Promise.all(promises)).filter(Boolean);
    };

    const animateSwipe = (direction) => {
        if (direction === 'left') {
            console.log('Animated Swiped left on card index:', cardIndex);
            Animated.parallel([
                Animated.timing(dislikeOpacity[cardIndex], {
                    toValue: 1,
                    duration: 20,
                    useNativeDriver: true,
                }),
                Animated.timing(likeOpacity[cardIndex], {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: true,
                })
            ]).start();
        } else if (direction === 'right') {
            console.log('Animated Swiped right on card index:', cardIndex);
            Animated.parallel([
                Animated.timing(likeOpacity[cardIndex], {
                    toValue: 1,
                    duration: 20,
                    useNativeDriver: true,
                }),
                Animated.timing(dislikeOpacity[cardIndex], {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const Swiping = (positionX) => {
        const likeOpacityValue = Math.min(Math.max(positionX / 100, 0), 1);
        const dislikeOpacityValue = Math.min(Math.max(-positionX / 100, 0), 1);

        if (positionX < 0) {
            // swiping left
            Animated.parallel([
                Animated.timing(dislikeOpacity[cardIndex], {
                    toValue: dislikeOpacityValue,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(likeOpacity[cardIndex], {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                })
            ]).start();

            setNoButtonColor(colors.activeNoButton);
            setYesButtonColor(colors.white);
            setNoButtonIconColor(colors.white);
            setYesButtonIconColor(colors.inactiveYesButton);
        } else if (positionX > 0) {
            // swiping right
            Animated.parallel([
                Animated.timing(likeOpacity[cardIndex], {
                    toValue: likeOpacityValue,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(dislikeOpacity[cardIndex], {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                })
            ]).start();


            setYesButtonColor(colors.activeYesButton);
            setNoButtonColor(colors.white);
            setNoButtonIconColor(colors.inactiveNoButton);
            setYesButtonIconColor(colors.white);
        }
    };

    const SwipedAborted = () => {
        resetOpacity(cardIndex);
        setNoButtonColor(colors.white);
        setYesButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);
        setYesButtonIconColor(colors.inactiveYesButton);
        console.log('Swipe aborted');
    };

    const onSwipedLeft = () => {
        setLastSwipeDirection('left');

        console.log(lastSwipeDirection);
        resetOpacity(cardIndex);

        console.log('Swiped left on card index:', cardIndex);

        // Move to the next card
        const newIndex = (cardIndex + 1) % animals.length;
        setCardIndex(newIndex); // Update card index

        // Reset the image index for the new card
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[newIndex] = 0; // Reset image index for the new card
            return newIndexes;
        });

        // Reset button colors
        setYesButtonColor(colors.white);
        setYesButtonIconColor(colors.inactiveYesButton);
        setNoButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);


        console.log('New card index:', newIndex);
    };

    const onSwipedRight = async () => {
        setLastSwipeDirection('right');

        console.log(lastSwipeDirection);

        resetOpacity(cardIndex);

        console.log('Swiped right on card index:', cardIndex);


        const animalId = animals[cardIndex]?.id;
        const userId = auth.currentUser.uid;

        // Update the card index first to move to the next card
        const newIndex = (cardIndex + 1) % animals.length;
        setCardIndex(newIndex);

        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[newIndex] = 0; // Reset image index for the new card
            return newIndexes;
        });

        // Reset button colors
        setYesButtonColor(colors.white);
        setYesButtonIconColor(colors.inactiveYesButton);
        setNoButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);

        console.log('New card index:', newIndex);

        const animalRef = doc(db, 'animals', animalId);
        const userRef = doc(db, 'users', userId);

        try {
            // Fetch the current animal data
            const animalDoc = await getDoc(animalRef);
            const animalData = animalDoc.data();

            // Fetch the current user data
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();

            const userHasLikedAnimal = animalData.likedByUsers && animalData.likedByUsers.includes(userId);
            const animalHasLikedUser = userData.likedAnimals && userData.likedAnimals.includes(animalId);

            const updatePromises = [];

            if (!userHasLikedAnimal && !animalHasLikedUser) {
                console.log(`User ${userId} is liking animal ${animalId} for the first time.`);
                updatePromises.push(
                    updateDoc(animalRef, {
                        likedByUsers: arrayUnion(userId)
                    }),
                    updateDoc(userRef, {
                        likedAnimals: arrayUnion(animalId)
                    })
                );
            } else if (!userHasLikedAnimal && animalHasLikedUser) {
                console.log(`Updating user ${userId} to include animal ${animalId}.`);
                updatePromises.push(
                    updateDoc(userRef, {
                        likedAnimals: arrayUnion(animalId)
                    })
                );
            } else if (userHasLikedAnimal && !animalHasLikedUser) {
                console.log(`Updating animal ${animalId} to include user ${userId}.`);
                updatePromises.push(
                    updateDoc(animalRef, {
                        likedByUsers: arrayUnion(userId)
                    })
                );
            }

            await Promise.all(updatePromises);

            // Update AsyncStorage with the new userData
            const updatedUserDoc = await getDoc(userRef); // Fetch updated user data
            const updatedUserData = updatedUserDoc.data();

            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
            console.log(`User ${userId} interacted with animal ${animalId}.`);
        } catch (error) {
            console.error('Error updating Firestore:', error);
        }
    };

    const SwipedAll = async () => {
        try {
            if (lastSwipeDirection === 'right') {
                await onSwipedRight();
            }
            await fetchAnimals(); // Fetch new animals only after the updates
        } catch (error) {
            console.error('Error in onSwipedAll:', error);
        }
    };

    const resetOpacity = (currentIndex) => {
        if (
            animals.length > 0 &&
            currentIndex >= 0 &&
            currentIndex < animals.length &&
            likeOpacity[currentIndex] &&
            dislikeOpacity[currentIndex]
        ) {
            Animated.parallel([
                Animated.timing(likeOpacity[currentIndex], {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: true,
                }),
                Animated.timing(dislikeOpacity[currentIndex], {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const renderGenderIcon = (gender) => {
        // render the icon based on the gender
        if (gender === 'M') {
            return <Ionicons style={styles.gender} name="male" size={18} color={colors.genderMaleBlue} />;
        } else if (gender === 'F') {
            return <Ionicons style={styles.gender} name="female" size={18} color={colors.genderFemalePink} />;
        }
        return null;
    };

    const onImagePrevious = () => {
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[cardIndex] = (newIndexes[cardIndex] - 1 + animals[cardIndex].images.length) % animals[cardIndex].images.length;
            return newIndexes;
        });

        setForceRerender(forceRerender + 1);
    };

    const onImageNext = () => {
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[cardIndex] = (newIndexes[cardIndex] + 1) % animals[cardIndex].images.length;
            return newIndexes;
        });

        setForceRerender(forceRerender + 1);
    };

    const renderCard = (animal, index) => {
        console.log('Rendering card with ID:', animal.id);
        return (
            <View key={animal.id || index} style={styles.card}>
                <Animated.Image
                    source={floatingImageLike}
                    style={[styles.floatingImageRight, { opacity: likeOpacity[index] }]}
                />
                <Animated.Image
                    source={floatingImageDislike}
                    style={[styles.floatingImageLeft, { opacity: dislikeOpacity[index] }]}
                />

                <TouchableOpacity
                    style={ styles.leftTouchableArea }
                    onPress={onImagePrevious}
                />
                <Image
                    key={`${animal.id}-${imageIndexes[index]}`} // Unique key for the image
                    source={
                        animals[index]?.images?.[imageIndexes[index]]?.uri
                            ? { uri: animals[index].images[imageIndexes[index]].uri }
                            : require('../../assets/dog-test-1.jpg')
                    }
                    style={styles.image}
                />
                <TouchableOpacity
                    style={ styles.rightTouchableArea }
                    onPress={onImageNext}
                />

                <View style={styles.imageIndexIndicator}>
                    <Text style={styles.imageIndexText}>
                        {imageIndexes[index] + 1}/{animal.images.length}
                    </Text>
                </View>

                <LinearGradient
                    colors={['rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.8)',
                        'rgba(255, 255, 255, 0.9)',
                        'rgba(255, 255, 255, 0.99)',
                        'rgba(255, 255, 255, 1)']}
                    style={styles.gradient}
                />

                <View style={styles.cardInfo}>
                    <View style={styles.leftContainer}>
                        <View style={styles.nameAgeContainer}>
                            <Text style={styles.name}>{animal.name}</Text>
                            <Text style={styles.age}>, {animal.age} years old</Text>
                        </View>

                        <View style={styles.genderBreedContainer}>
                            {renderGenderIcon(animal.gender)}
                            <Text style={styles.breed}>{animal.breed}</Text>
                        </View>
                    </View>

                    <View style={styles.rightContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedAnimal(animals[cardIndex]);
                                setShowOverlay(true);
                            }}>
                            <Entypo name="info-with-circle" size={30} color={colors.genderMaleBlue} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const AnimalInfoOverlay = ({ animal, onClose }) => (
        <View style={styles.overlayContainer}>
            <View style={styles.overlayContent}>
                <Text style={styles.overlayName}>{animal.name}</Text>
                <ScrollView
                    contentContainerStyle={{ alignItems: 'center' }}
                    style={styles.scrollView}
                >
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Species</Text>
                        <Text style={styles.overlayDetails}>{animal.species}</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Breed</Text>
                        <Text style={styles.overlayDetails}>{animal.breed}</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Age</Text>
                        <Text style={styles.overlayDetails}>{animal.age} years</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Gender</Text>
                        <View style={styles.genderOverlayContainer}>
                            {renderGenderIcon(animal.gender)}
                        </View>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Activity Level</Text>
                        <Text style={styles.overlayDetails}>
                            {activityLevelMapping[animal.activityLevel] || 'Unknown'}
                        </Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Fur Color</Text>
                        <Text style={styles.overlayDetails}>{animal.furColor}</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Location</Text>
                        <Text style={styles.overlayDetails}>{animal.location}</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Description</Text>
                        <Text style={styles.overlayDetailsDescription}>{animal.description}</Text>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight: 0}]} edges={['left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <Header />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={'#d9cb94'} />
                    <Text>Loading some pets...</Text>
                </View>
            ) :error ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.errorText, fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                        {error}
                    </Text>
                    <Button title="Retry" onPress={fetchAnimals} color={colors.primary} />
                </View>
            ) : (
                <View style={styles.swiperContainer}>
                    <Swiper
                        key={forceRerender}
                        keyExtractor={(animal) => animal.id} // Ensure that keyExtractor is set up correctly
                        ref={swiperRef}
                        cards={ animals }
                        cardIndex={ cardIndex }
                        renderCard={ renderCard }
                        onSwiping={ Swiping }
                        onSwipedLeft={ onSwipedLeft }
                        onSwipedRight={ onSwipedRight }
                        onSwipedAborted={ SwipedAborted }
                        onSwipedAll={ SwipedAll }
                        stackSize={ 2 }
                        disableBottomSwipe
                        disableTopSwipe
                        backgroundColor={ colors.white }
                        infinite={ false }
                        cardVerticalMargin={ 0 }>
                    </Swiper>
                </View>
            )}
            <NavbarWrapper noShadow={true} />
            {!loading && animals.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={ [styles.button,
                            { backgroundColor:  noButtonColor }
                        ]}
                        onPressIn={ () => setNoButtonColor(colors.activeNoButton) }
                        onPressOut={ () => setNoButtonColor(colors.white) }
                        onPress={ () => {
                            resetOpacity(cardIndex);
                            animateSwipe('left');
                            swiperRef.current.swipeLeft();
                        }}
                    >
                        <Ionicons name="close" size={50} color={noButtonIconColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={ [styles.button,
                            { backgroundColor: yesButtonColor }
                        ]}
                        onPressIn={ () => setYesButtonColor(colors.activeYesButton) }
                        onPressOut={ () => setYesButtonColor(colors.white) }
                        onPress={ () => {
                            resetOpacity(cardIndex);
                            animateSwipe('right');
                            swiperRef.current.swipeRight();
                        }}
                    >
                        <Ionicons name="heart" size={45} color={yesButtonIconColor} />
                    </TouchableOpacity>
                </View>
            )}

            {showOverlay && (
                <AnimalInfoOverlay
                    animal={selectedAnimal}
                    onClose={() => setShowOverlay(false)}
                />
            )}
        </SafeAreaView>
    );
};

export default UserHomeScreen;