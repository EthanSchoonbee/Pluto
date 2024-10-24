import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    Platform,
    SafeAreaView,
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
import {collection, getDocs, limit, query} from "firebase/firestore";
import {db} from "../services/firebaseConfig";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import {defaultProps as animal} from "react-native-web/src/modules/forwardedProps";


// test animals
/*
const animals = [
    { id: 1, name: 'Ollie', age: 12, gender: 'M', breed: 'Jack Russell', images: [
                                                                                require('../../assets/dog-test-2.jpg')
                                                                                ]
    },
    { id: 2, name: 'Max', age: 5, gender: 'F', breed: 'Labrador', images: [
                                                                            require('../../assets/dog-test-1.jpg'),
                                                                            require('../../assets/dog-test-3.jpg')
                                                                        ]
    },
    { id: 3, name: 'Bella', age: 3, gender: 'M', breed: 'Poodle', images: [
                                                                            require('../../assets/dog-test-1.jpg'),
                                                                            require('../../assets/dog-test-2.jpg'),
                                                                            require('../../assets/dog-test-3.jpg')
                                                                        ]
    },
];
 */

const floatingImageDislike = require('../../assets/dislike.png');
const floatingImageLike = require('../../assets/like.png');

const UserHomeScreen = () => {
    const swiperRef = useRef(null); // reference for the swiper object
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cardIndex, setCardIndex] = useState(0); //  the card index
    const [imageIndexes, setImageIndexes] = useState(animals.map(() => 0));
    const [forceRerender, setForceRerender] = useState(1);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    // like and dislike coloring:
    const [noButtonColor, setNoButtonColor] = useState(colors.white);
    const [yesButtonColor, setYesButtonColor] = useState(colors.white);
    const [noButtonIconColor, setNoButtonIconColor] = useState(colors.inactiveNoButton);
    const [yesButtonIconColor, setYesButtonIconColor] = useState(colors.inactiveYesButton);

    // calculate and keep track of floating image opacity
    const [likeOpacity, setLikeOpacity] = useState([]);
    const [dislikeOpacity, setDislikeOpacity] = useState([]);

    useEffect(() => {
        fetchAnimals();
    }, []);

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
            const q = query(collection(db, 'animals'), limit(10));
            const querySnapshot = await getDocs(q);

            const fetchedAnimals = [];
            for (const doc of querySnapshot.docs) {
                const animalData = doc.data();
                animalData.id = doc.id;
                animalData.imageUrls = animalData.imageUrls || [];
                animalData.images = await preloadImages(animalData.imageUrls);

                console.log(`Captured animal: ${animalData.name} (ID: ${animalData.id})`);

                // Only add animals with successfully preloaded images
                if (animalData.images.length > 0) {
                    fetchedAnimals.push(animalData);
                } else {
                    console.warn(`No images found for animal: ${animalData.id}`);
                }
            }

            console.log('Captured animals: ', fetchedAnimals);
            setAnimals(fetchedAnimals);
            setImageIndexes(fetchedAnimals.map(() => 0)); // Initialize image indexes for each animal
            console.log('Card index: ',cardIndex);
            console.log('Image index: ',imageIndexes);
        } catch (error) {
            console.error('Error fetching animals:', error);
        } finally {
            setLoading(false);
        }
    };

    const preloadImages = async (imageUrls) => {
        const storage = getStorage();
        const promises = imageUrls.map(async (imageUrl) => {
            try {
                const storageRef = ref(storage, imageUrl);
                const downloadUrl = await getDownloadURL(storageRef);
                const fileName = imageUrl.split('/').pop();
                const localUri = `${FileSystem.cacheDirectory}${fileName}`;

                const fileInfo = await FileSystem.getInfoAsync(localUri);
                if (!fileInfo.exists) {
                    await FileSystem.downloadAsync(downloadUrl, localUri);
                }
                return { uri: localUri };
            } catch (error) {
                console.error('Error downloading or caching image:', error);
                return null;
            }
        });
        return (await Promise.all(promises)).filter(Boolean);
    };

    const animateSwipe = (direction) => {
        if (direction === 'left') {
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
        resetOpacity(cardIndex);

        setCardIndex((prevIndex) => (prevIndex + 1) % animals.length);

        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[cardIndex] = 0;
            return newIndexes;
        });

        setNoButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);

        console.log('Swiped left on card index:', cardIndex);
        console.log('Starting image index:', imageIndexes[cardIndex]);
    };

    const onSwipedRight = () => {
        resetOpacity(cardIndex);

        setCardIndex((prevIndex) => (prevIndex + 1) % animals.length);

        setImageIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[cardIndex] = 0;
            return newIndexes;
        });

        setYesButtonColor(colors.white);
        setYesButtonIconColor(colors.inactiveYesButton);

        console.log('Swiped right on card index:', cardIndex);
        console.log('Starting image index:', imageIndexes[cardIndex]);
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
                <Text style={styles.overlayDetails}>Age: {animal.age} years</Text>
                <Text style={styles.overlayDetails}>Breed: {animal.breed}</Text>
                <Text style={styles.overlayDetails}>Age: {animal.age} years</Text>
                <Text style={styles.overlayDetails}>Breed: {animal.breed}</Text>
                <Text style={styles.overlayDetails}>Age: {animal.age} years</Text>
                <Text style={styles.overlayDetails}>Breed: {animal.breed}</Text>
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
                <ActivityIndicator size="large" color="#0000ff" />
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
                        onSwipedAll={ fetchAnimals }
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

            {/* Render the overlay if it should be shown */}
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