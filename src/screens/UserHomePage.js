import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    Button,
    Image, Modal,
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
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    updateDoc,
    where,
    startAfter
} from "firebase/firestore";
import {auth, db} from "../services/firebaseConfig";
import {
    getDownloadURL,
    getStorage,
    ref
} from "firebase/storage";
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
    const [loadingLike, setLoadingLike] = useState(false);
    const [error, setError] = useState(null);
    const [cardIndex, setCardIndex] = useState(0); //  the card index
    const [imageIndexes, setImageIndexes] = useState(animals.map(() => 0));
    const [forceRerender, setForceRerender] = useState(1);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const swipeDataRef = useRef({
        swipeDirection: ''
    });
    const errorStateRef = useRef({
        errorState: false
    });
    const swipePromisesRef = useRef([]);
    const [lastVisibleAnimal, setLastVisibleAnimal] = useState(null);

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
            fetchAnimals(true);
            resetButtonColors();
        }, [])
    );

    useEffect(() => {
        if (animals.length > 0) {
            initializeOpacities();
        }
    }, [animals]);

    useEffect(() => {
        setForceRerender((prev) => prev + 1);
    }, [animals]);

    // reset current card floating image opacities on load
    useEffect(() => {
        resetOpacity(cardIndex);
    }, [imageIndexes[cardIndex],cardIndex]);

    const initializeOpacities = () => {
        setLikeOpacity(animals.map(() => new Animated.Value(0)));
        setDislikeOpacity(animals.map(() => new Animated.Value(0)));
    };

    const resetButtonColors = () => {
        setYesButtonColor(colors.white);
        setYesButtonIconColor(colors.inactiveYesButton);
        setNoButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);
    };

    const fetchAnimals = async (isInitialLoad = false) => {
        try {
            setLoading(true);
            setError(null);
            errorStateRef.current.errorState = false;

            const userData = JSON.parse(await AsyncStorage.getItem('userData'));
            const userPreferences = userData.preferences;
            const likedAnimals = userData.likedAnimals || [];

            console.log('Liked animals:', likedAnimals);

            console.log('User preferences: ', userPreferences);

            let q = buildQuery(userPreferences);

            if (lastVisibleAnimal && !isInitialLoad) {
                q = query(q, startAfter(lastVisibleAnimal), limit(10));
            } else {
                q = query(q, limit(10));
            }

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                errorStateRef.current.errorState = true;
                setError('No more animals available based on your preferences.');
                return;
            }

            const fetchedAnimals = await processQuerySnapshot(querySnapshot);

            console.log('Fetched animals: ', fetchedAnimals);

            // Perform client-side filtering to exclude liked animals.
            const filteredAnimals = fetchedAnimals.filter(
                (animal) => animal && animal.id && !likedAnimals.includes(animal.uid)
            );

            console.log('Filtered animals: ', filteredAnimals);

            if (!filteredAnimals.length > 0) {
                errorStateRef.current.errorState = true;
                setError('No more animals available based on your preferences.');
                return;
            }

            setLastVisibleAnimal(querySnapshot.docs[querySnapshot.docs.length - 1]);

            setAnimals(filteredAnimals);
            setImageIndexes(filteredAnimals .map(() => 0)); // Initialize image indexes for each animal
            console.log('Card index: ',cardIndex);
            console.log('Image index: ',imageIndexes);
        } catch (error) {
            console.error('Error fetching animals:', error);
            errorStateRef.current.errorState = true;
            setError('Failed to load animals. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    const buildQuery = (preferences) => {
        let q = query(collection(db, 'animals'), limit(10));
        const {
            activityLevel,
            ageRange,
            animalType,
            breed,
            furColors,
            gender,
            province,
            size,
        } = preferences;

        if (activityLevel) q = query(q, where('activityLevel', '==', activityLevel));
        if (ageRange) q = query(q, where('age', '>=', ageRange[0]), where('age', '<=', ageRange[1]));
        if (animalType) q = query(q, where('species', '==', animalType));
        if (breed && breed !== 'Any') q = query(q, where('breed', '==', breed));
        if (furColors?.length > 0) q = query(q, where('furColors', 'array-contains-any', furColors));
        if (gender && gender !== 'Any') q = query(q, where('gender', '==', gender));
        if (province) q = query(q, where('province', '==', province));
        if (size) q = query(q, where('size', '==', size));

        return q;
    };

    const processQuerySnapshot = async (querySnapshot) => {
        const animals = [];
        for (const doc of querySnapshot.docs) {
            const animalData = doc.data();
            animalData.id = doc.id;
            animalData.images = await preloadImages(animalData.imageUrls  || []);

            console.log('Captured animal:', animalData);

            // Only add animals with successfully preloaded images
            if (animalData.images.length > 0) {
                animals.push(animalData);
            } else {
                console.warn('No images found for animal: ${animalData.id}');
            }
        }
        return animals;
    };

    /*const filterLikedAnimals = (fetchedAnimals, likedAnimals) => {
        return fetchedAnimals.filter((animal) => !likedAnimals.includes(animal.id));
    };*/

    const preloadImages = async (imageUrls) => {
        const storage = getStorage();
        const promises = imageUrls.map(async (imageUrl) => {
            try {
                // Get the download URL from Firebase Storage
                const storageRef = ref(storage, imageUrl);
                const downloadUrl = await getDownloadURL(storageRef);
                // Use the image filename as the cache file name
                const fileName = imageUrl.split('/').pop().replace(/%2F/g, '_'); // Replace any %2F with _ to avoid subdirectories
                const localUri = `${FileSystem.cacheDirectory}${fileName}`;
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
        console.log(`Animated Swiped ${direction} on card index:`, cardIndex);
        const animations = direction === 'left'
            ? [createOpacityAnimation(dislikeOpacity[cardIndex], 1), createOpacityAnimation(likeOpacity[cardIndex], 0)]
            : [createOpacityAnimation(likeOpacity[cardIndex], 1), createOpacityAnimation(dislikeOpacity[cardIndex], 0)];
        Animated.parallel(animations).start();
    };

    const createOpacityAnimation = (opacityValue, toValue) => {
        return Animated.timing(opacityValue, {
            toValue,
            duration: 0,
            useNativeDriver: true,
        });
    };

    const Swiping = (positionX) => {
        const [likeOpacityValue, dislikeOpacityValue] = calculateOpacities(positionX);

        if (positionX < 0) {
            // swiping left
            updateSwipeUI(colors.activeNoButton, colors.white, colors.white, colors.inactiveYesButton);

            Animated.parallel([
                createOpacityAnimation(dislikeOpacity[cardIndex], dislikeOpacityValue),
                createOpacityAnimation(likeOpacity[cardIndex], 0),
            ]).start();
        } else if (positionX > 0) {
            // swiping right
            updateSwipeUI(colors.white, colors.activeYesButton, colors.inactiveNoButton, colors.white);

            Animated.parallel([
                createOpacityAnimation(likeOpacity[cardIndex], likeOpacityValue),
                createOpacityAnimation(dislikeOpacity[cardIndex], 0),
            ]).start();
        }
    };

    const calculateOpacities = (positionX) => {
        return [
            Math.min(Math.max(positionX / 100, 0), 1),
            Math.min(Math.max(-positionX / 100, 0), 1),
        ];
    };

    const updateSwipeUI = (noBtnColor, yesBtnColor, noIconColor, yesIconColor) => {
        setNoButtonColor(noBtnColor);
        setYesButtonColor(yesBtnColor);
        setNoButtonIconColor(noIconColor);
        setYesButtonIconColor(yesIconColor);
    };

    const SwipedAborted = () => {
        resetOpacity(cardIndex);
        resetButtonColors();
    };

    const onSwipedLeft = () => {
        swipeDataRef.current.swipeDirection = 'left';
        console.log(swipeDataRef.current.swipeDirection);

        resetOpacity(cardIndex);

        console.log('Swiped left on card index:', cardIndex);

        moveToNextCard();
    };

    const onSwipedRight = async () => {
        swipeDataRef.current.swipeDirection = 'right';
        console.log(swipeDataRef.current.swipeDirection);

        //setLoadingLike(true);

        resetOpacity(cardIndex);
        console.log('Swiped right on card index:', cardIndex);

        const animalId = animals[cardIndex]?.id;
        const userId = auth.currentUser.uid;

        // Update the card index first to move to the next card
        const newIndex = (cardIndex + 1) % animals.length;
        setCardIndex(newIndex);

        resetImageIndex(newIndex);

        // Reset button colors
        resetButtonColors();

        console.log('New card index:', newIndex);

        const animalRef = doc(db, 'animals', animalId);
        const userRef = doc(db, 'users', userId);

        console.log('Making new swipe promise for data push...');
        const swipePromise = new Promise(async (resolve) => {
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

                // Update likedByUsers and likedAnimals if necessary
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
                } else if (userHasLikedAnimal && !animalHasLikedUser) {
                    console.log(`Updating user ${userId} to include animal ${animalId}.`);
                    updatePromises.push(
                        updateDoc(userRef, {
                            likedAnimals: arrayUnion(animalId)
                        })
                    );
                } else if (!userHasLikedAnimal && animalHasLikedUser) {
                    console.log(`Updating animal ${animalId} to include user ${userId}.`);
                    updatePromises.push(
                        updateDoc(animalRef, {
                            likedByUsers: arrayUnion(userId)
                        })
                    );
                }

                // Increment the notificationCount for the animal
                if (animalData.notificationCount !== undefined) {
                    const newNotificationCount = (animalData.notificationCount || 0) + 1;
                    updatePromises.push(
                        updateDoc(animalRef, {
                            notificationCount: newNotificationCount
                        })
                    );
                } else {
                    updatePromises.push(
                        updateDoc(animalRef, {
                            notificationCount: 1
                        })
                    );
                }

                await Promise.all(updatePromises);

                // Update AsyncStorage with the new userData
                const updatedUserDoc = await getDoc(userRef); // Fetch updated user data
                const updatedUserData = updatedUserDoc.data();

                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
                console.log(`User ${userId} interacted with animal ${animalId}.`);
                resolve();
            } catch (error) {
                console.error('Error updating Firestore:', error);
            } finally {
                // Hide the loading dialog after updates are complete
                //setLoadingLike(false);
            }
        });
        console.log('Adding swipe to promise ref...');
        swipePromisesRef.current.push(swipePromise);
        console.log('SwipePromiseRef: ', swipePromisesRef.current.length);
    };

    const moveToNextCard = () => {
        const newIndex = (cardIndex + 1) % animals.length;
        setCardIndex(newIndex);
        resetImageIndex(newIndex);
        resetButtonColors();
        console.log('New card index:', newIndex);
    };

    const resetImageIndex = (newIndex) => {
        // Reset the image index for the new card
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[newIndex] = 0; // Reset image index for the new card
            return newIndexes;
        });
    }

    const SwipedAll = async () => {
        console.log('All cards swiped');
        setLoadingLike(true);
        try {
            await Promise.all(swipePromisesRef.current);

            console.log('All swipe promises completed.');

            setLoadingLike(false); // Stop loading after processing

            await fetchAnimals();
        } catch (error) {
            console.error('Error in onSwipedAll:', error);
            errorStateRef.current.errorState = true;
            setError('Failed to process swipes. Please try again.');
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
                        <Text style={styles.overlayDetails}>{animal.furColors.join(', ')}</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldTitle}>Location</Text>
                        <Text style={styles.overlayDetails}>{animal.province}</Text>
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
            {loadingLike ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={'#d9cb94'} />
                        <Text>Calibrating cuteness settings...</Text>
                    </View>
                ) : loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={'#d9cb94'} />
                    <Text>Loading some pets...</Text>
                </View>
            ) : error ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.errorText, paddingHorizontal: 15, fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                        {error}
                    </Text>
                    <Button title="Retry" onPress={fetchAnimals} color={'#d9cb94'}  />
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
            {!loadingLike && !loading && !errorStateRef.current.errorState && animals.length > 0 && (
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