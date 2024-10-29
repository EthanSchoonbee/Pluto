/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This React Native component implements a user interface for browsing animals using a card swiper.
Users can swipe left to dislike or right to like an animal.
The component fetches animal data from a Firestore database and stores user interactions.
*/
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
import {
    arrayUnion,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    updateDoc,
    startAfter
} from "firebase/firestore";
import {auth, db} from "../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {buildQuery, processQuerySnapshot} from "../services/databaseService";
import {calculateOpacities} from "../utils/utils";

// Importing images for like and dislike actions
const floatingImageDislike = require('../../assets/dislike.png');
const floatingImageLike = require('../../assets/like.png');

// Mapping activity levels to descriptive strings
const activityLevelMapping = {
    0: 'Couch Cushion',
    1: 'Lap Cat',
    2: 'Playful Pup',
    3: 'Adventure Hound',
};

// Main component for displaying user home screen
const UserHomeScreen = () => {
    const swiperRef = useRef(null); // reference for the swiper object
    const [animals, setAnimals] = useState([]); // Array of animals to display
    const [loading, setLoading] = useState(true); // Loading indicator for fetching animals
    const [loadingLike, setLoadingLike] = useState(false); // Loading indicator for like actions
    const [error, setError] = useState(null); // Error message for fetching failures
    const [cardIndex, setCardIndex] = useState(0); // Index of the current card being viewed
    const [imageIndexes, setImageIndexes] = useState(animals.map(() => 0)); // Image indexes for each animal card
    const [forceRerender, setForceRerender] = useState(1); // Force re-render of the component
    const [showOverlay, setShowOverlay] = useState(false); // Show overlay on swipe
    const [selectedAnimal, setSelectedAnimal] = useState(null); // Currently selected animal for overlay
    const swipeDataRef = useRef({
        swipeDirection: ''
    }); // Direction of the swipe
    const errorStateRef = useRef({
        errorState: false
    }); // Error state reference
    const swipePromisesRef = useRef([]); // Promises for swipe actions
    const [lastVisibleAnimal, setLastVisibleAnimal] = useState(null); // Last visible animal in the list

    // like and dislike coloring:
    const [noButtonColor, setNoButtonColor] = useState(colors.white); // Colors for the dislike button
    const [yesButtonColor, setYesButtonColor] = useState(colors.white); // Colors for the like button
    const [noButtonIconColor, setNoButtonIconColor] = useState(colors.inactiveNoButton); // Icon color for the dislike button
    const [yesButtonIconColor, setYesButtonIconColor] = useState(colors.inactiveYesButton); // Icon color for the like button

    // calculate and keep track of floating image opacity
    const [likeOpacity, setLikeOpacity] = useState([]); // Opacity for the like floating image
    const [dislikeOpacity, setDislikeOpacity] = useState([]); // Opacity for the dislike floating image

    // Fetch animals on focus and reset button colors
    useFocusEffect(
        useCallback(() => {
            fetchAnimals(true);
            resetButtonColors();
        }, [])
    );

    // Initializes opacities when animals are fetched
    useEffect(() => {
        if (animals.length > 0) {
            initializeOpacities();
        }
    }, [animals]);

    // Forces a re-render when animals change
    useEffect(() => {
        setForceRerender((prev) => prev + 1);
    }, [animals]);

    // Resets floating image opacities on card change
    useEffect(() => {
        resetOpacity(cardIndex);
    }, [imageIndexes[cardIndex],cardIndex]);

    // Initializes opacity values for like and dislike images
    const initializeOpacities = () => {
        setLikeOpacity(animals.map(() => new Animated.Value(0))); // Initialize like opacity
        setDislikeOpacity(animals.map(() => new Animated.Value(0))); // Initialize dislike opacity
    };

    // Resets button colors to default
    const resetButtonColors = () => {
        setYesButtonColor(colors.white);
        setYesButtonIconColor(colors.inactiveYesButton);
        setNoButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);
    };

    // Fetches animals based on user preferences and stores them in state
    const fetchAnimals = async (isInitialLoad = false) => {
        try {
            setLoading(true); // Set loading state
            setError(null); // Reset error state
            errorStateRef.current.errorState = false; // Reset error state reference

            const userData = JSON.parse(await AsyncStorage.getItem('userData')); // Fetch user data
            const userPreferences = userData.preferences; // Get user preferences
            const likedAnimals = userData.likedAnimals || []; // Get liked animals

            console.log('Liked animals:', likedAnimals);

            console.log('User preferences: ', userPreferences);

            // Build query based on user preferences
            let q = buildQuery(userPreferences);

            // Modify query to fetch more animals if necessary
            if (lastVisibleAnimal && !isInitialLoad) {
                q = query(q, startAfter(lastVisibleAnimal), limit(10));
            } else {
                q = query(q, limit(10));
            }

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                errorStateRef.current.errorState = true; // Update error state
                setError('No more animals available based on your preferences.'); // Set error message
                return;
            }

            // Process fetched data
            const fetchedAnimals = await processQuerySnapshot(querySnapshot);

            console.log('Fetched animals: ', fetchedAnimals);

            // Filter out animals that have already been liked by the user
            const filteredAnimals = fetchedAnimals.filter(
                (animal) => animal && animal.id && !likedAnimals.includes(animal.uid)
            );

            console.log('Filtered animals: ', filteredAnimals);

            if (!filteredAnimals.length > 0) {
                errorStateRef.current.errorState = true;
                setError('No more animals available based on your preferences.'); // Set error message
                return;
            }

            // Set last visible animal
            setLastVisibleAnimal(querySnapshot.docs[querySnapshot.docs.length - 1]);

            // Update state with fetched animals
            setAnimals(filteredAnimals);

            // Initialize image indexes for each animal
            setImageIndexes(filteredAnimals .map(() => 0)); // Initialize image indexes for each animal

            console.log('Card index: ',cardIndex);
            console.log('Image index: ',imageIndexes);
        } catch (error) {
            console.error('Error fetching animals:', error);

            errorStateRef.current.errorState = true; // Update error state
            setError('Failed to load animals. Please check your network connection.'); // Set error message
        } finally {
            setLoading(false); // End loading state
        }
    };

    // Animates the swipe effect based on direction (left or right)
    const animateSwipe = (direction) => {
        console.log(`Animated Swiped ${direction} on card index:`, cardIndex);
        const animations = direction === 'left'
            ? [createOpacityAnimation(dislikeOpacity[cardIndex], 1), createOpacityAnimation(likeOpacity[cardIndex], 0)]
            : [createOpacityAnimation(likeOpacity[cardIndex], 1), createOpacityAnimation(dislikeOpacity[cardIndex], 0)];
        Animated.parallel(animations).start(); // Start animations in parallel
    };

    // Creates an opacity animation for the floating images
    const createOpacityAnimation = (opacityValue, toValue) => {
        return Animated.timing(opacityValue, {
            toValue,
            duration: 0, // Duration of the animation
            useNativeDriver: true, // Use native driver for better performance
        });
    };

    // Handles the swiping logic based on the current position
    const Swiping = (positionX) => {
        // Calculate opacities based on swipe position
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

    // Updates UI colors based on swipe direction
    const updateSwipeUI = (noBtnColor, yesBtnColor, noIconColor, yesIconColor) => {
        setNoButtonColor(noBtnColor);
        setYesButtonColor(yesBtnColor);
        setNoButtonIconColor(noIconColor);
        setYesButtonIconColor(yesIconColor);
    };

    // Resets opacity and button colors when swipe is aborted
    const SwipedAborted = () => {
        resetOpacity(cardIndex);
        resetButtonColors();
    };

    // Handles the logic for when an animal card is swiped left
    const onSwipedLeft = () => {
        swipeDataRef.current.swipeDirection = 'left';

        console.log(swipeDataRef.current.swipeDirection);

        resetOpacity(cardIndex); // Reset opacity for the current card

        console.log('Swiped left on card index:', cardIndex);

        moveToNextCard(); // Move to the next card
    };

    // Handles the logic for when an animal card is swiped right
    const onSwipedRight = async () => {
        swipeDataRef.current.swipeDirection = 'right';
        console.log(swipeDataRef.current.swipeDirection);

        //setLoadingLike(true);

        resetOpacity(cardIndex);// Reset opacity for the current card

        console.log('Swiped right on card index:', cardIndex);

        // Get the current animal's ID and user's ID
        const animalId = animals[cardIndex]?.id;
        const userId = auth.currentUser.uid;

        // Update the card index first to move to the next card
        const newIndex = (cardIndex + 1) % animals.length; // Update card index
        setCardIndex(newIndex);

        // Reset image index for the new card
        resetImageIndex(newIndex);

        // Reset button colors
        resetButtonColors();

        console.log('New card index:', newIndex);

        // Reference to the animal in the database
        const animalRef = doc(db, 'animals', animalId);

        // Reference to the user in the database
        const userRef = doc(db, 'users', userId);

        console.log('Making new swipe promise for data push...');
        const swipePromise = new Promise(async (resolve) => {
            try {
                // Fetch current animal and user data
                const animalDoc = await getDoc(animalRef);
                const animalData = animalDoc.data();

                // Fetch the current user data
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();

                // Fetch current animal and user data
                const userHasLikedAnimal = animalData.likedByUsers && animalData.likedByUsers.includes(userId);
                const animalHasLikedUser = userData.likedAnimals && userData.likedAnimals.includes(animalId);

                const updatePromises = []; // Array to hold update promises

                // Update likedByUsers and likedAnimals if necessary
                if (!userHasLikedAnimal && !animalHasLikedUser) {
                    console.log(`User ${userId} is liking animal ${animalId} for the first time.`);
                    updatePromises.push(
                        updateDoc(animalRef, {
                            likedByUsers: arrayUnion(userId) // Add user ID to likedByUsers
                        }),
                        updateDoc(userRef, {
                            likedAnimals: arrayUnion(animalId) // Add animal ID to likedAnimals
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
                            notificationCount: newNotificationCount // Update notification count
                        })
                    );
                } else {
                    updatePromises.push(
                        updateDoc(animalRef, {
                            notificationCount: 1 // Initialize notification count
                        })
                    );
                }

                await Promise.all(updatePromises); // Wait for all updates to complete

                // Update AsyncStorage with the new userData
                const updatedUserDoc = await getDoc(userRef); // Fetch updated user data
                const updatedUserData = updatedUserDoc.data();

                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData)); // Update local storage
                console.log(`User ${userId} interacted with animal ${animalId}.`);
                resolve(); // Resolve the promise
            } catch (error) {
                console.error('Error updating Firestore:', error);
            }
        });
        console.log('Adding swipe to promise ref...');
        swipePromisesRef.current.push(swipePromise);
        console.log('SwipePromiseRef: ', swipePromisesRef.current.length);
    };

    // Moves to the next animal card in the carousel
    const moveToNextCard = () => {
        const newIndex = (cardIndex + 1) % animals.length;
        setCardIndex(newIndex);
        resetImageIndex(newIndex); // Reset image index for the new card
        resetButtonColors(); // Reset button colors
        console.log('New card index:', newIndex);
    };

    // Resets the image index for the new card being viewed
    const resetImageIndex = (newIndex) => {
        // Reset the image index for the new card
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[newIndex] = 0; // Reset image index for the new card
            return newIndexes;
        });
    }

    // Handles logic when all cards have been swiped
    const SwipedAll = async () => {
        console.log('All cards swiped');
        setLoadingLike(true); // Set loading state for likes
        try {
            await Promise.all(swipePromisesRef.current); // Wait for all swipe promises to resolve

            console.log('All swipe promises completed.');

            setLoadingLike(false); // Stop loading after processing

            await fetchAnimals(); // Fetch new animals
        } catch (error) {
            console.error('Error in onSwipedAll:', error);

            errorStateRef.current.errorState = true; // Update error state
            setError('Failed to process swipes. Please try again.'); // Set error message
        }
    };

    // Resets the opacity of the floating images for the current card
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
                    toValue: 0, // Reset opacity to 0
                    duration: 20, // Duration of the reset animation
                    useNativeDriver: true, // Use native driver for performance
                }),
                Animated.timing(dislikeOpacity[currentIndex], {
                    toValue: 0, // Reset opacity to 0
                    duration: 20, // Duration of the reset animation
                    useNativeDriver: true, // Use native driver for performance
                })
            ]).start();
        }
    };

    // Renders gender icon based on animal's gender
    const renderGenderIcon = (gender) => {
        // render the icon based on the gender
        if (gender === 'M') {
            return <Ionicons style={styles.gender} name="male" size={18} color={colors.genderMaleBlue} />;
        } else if (gender === 'F') {
            return <Ionicons style={styles.gender} name="female" size={18} color={colors.genderFemalePink} />;
        }
        return null; // Return null if gender is not specified
    };

    // Navigates to the previous image of the current animal
    const onImagePrevious = () => {
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[cardIndex] = (newIndexes[cardIndex] - 1 + animals[cardIndex].images.length) % animals[cardIndex].images.length; // Cycle through images
            return newIndexes;
        });

        setForceRerender(forceRerender + 1); // Force re-render
    };

    // Navigates to the next image of the current animal
    const onImageNext = () => {
        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[cardIndex] = (newIndexes[cardIndex] + 1) % animals[cardIndex].images.length; // Cycle through images
            return newIndexes;
        });

        setForceRerender(forceRerender + 1); // Force re-render
    };

    // Renders the card for each animal
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

    // Overlay component for displaying detailed animal information
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
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________