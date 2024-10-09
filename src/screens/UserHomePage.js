import React, {useEffect, useRef, useState} from 'react';
import { View, Text, Image, SafeAreaView, Animated  } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import colors  from "../styles/colors";
import styles from '../styles/UserHomePageStyles';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

// test animals
const animals = [
    { id: 1, name: 'Ollie', age: 12, gender: 'M', breed: 'Jack Russell', image: require('../../assets/dog-test-1.jpg') },
    { id: 2, name: 'Max', age: 5, gender: 'F', breed: 'Labrador', image: require('../../assets/dog-test-1.jpg') },
    { id: 3, name: 'Bella', age: 3, gender: 'M', breed: 'Poodle', image: require('../../assets/dog-test-1.jpg') },
];

const floatingImageDislike = require('../../assets/dislike.png');
const floatingImageLike = require('../../assets/like.png');

const UserHomeScreen = () => {
    const swiperRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [noButtonColor, setNoButtonColor] = useState(colors.white);
    const [yesButtonColor, setYesButtonColor] = useState(colors.white);
    const [noButtonIconColor, setNoButtonIconColor] = useState(colors.inactiveNoButton);
    const [yesButtonIconColor, setYesButtonIconColor] = useState(colors.inactiveYesButton);
    const [isNoButtonPressed, setIsNoButtonPressed] = useState(false);
    const [isYesButtonPressed, setIsYesButtonPressed] = useState(false);

    const likeOpacity = useRef(animals.map(() => new Animated.Value(0))).current;
    const dislikeOpacity = useRef(animals.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        resetOpacity(0);
    }, []);

    const animateSwipe = (direction) => {
        if (direction === 'left') {
            Animated.parallel([
                Animated.timing(dislikeOpacity[index], {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(likeOpacity[index], {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                })
            ]).start();
        } else if (direction === 'right') {
            Animated.parallel([
                Animated.timing(likeOpacity[index], {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(dislikeOpacity[index], {
                    toValue: 0,
                    duration: 0,
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
                Animated.timing(dislikeOpacity[index], {
                    toValue: dislikeOpacityValue,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(likeOpacity[index], {
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
                Animated.timing(likeOpacity[index], {
                    toValue: likeOpacityValue,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(dislikeOpacity[index], {
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
        resetOpacity(index);
        setNoButtonColor(colors.white);
        setYesButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);
        setYesButtonIconColor(colors.inactiveYesButton);
        console.log('Swipe aborted');
    };

    const SwipedLeft = () => {
        setIndex((prevIndex) => (prevIndex + 1) % animals.length);

        resetOpacity(index);

        setNoButtonColor(colors.white);
        setNoButtonIconColor(colors.inactiveNoButton);

        console.log('Swiped left on card index:', index);
    };

    const SwipedRight = () => {
        setIndex((prevIndex) => (prevIndex + 1) % animals.length);

        resetOpacity(index);

        setYesButtonColor(colors.white);
        setYesButtonIconColor(colors.inactiveYesButton);

        console.log('Swiped right on card index:', index);
    };

    const resetOpacity = (currentIndex) => {
        if (currentIndex >= 0 && currentIndex < animals.length) {
            Animated.parallel([
                Animated.timing(likeOpacity[currentIndex], {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(dislikeOpacity[currentIndex], {
                    toValue: 0,
                    duration: 0,
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

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <Header />
            <View style={styles.swiperContainer}>
                <Swiper
                    ref={swiperRef}
                    cards={ animals }
                    renderCard={(card, cardIndex) => (
                        <View style={styles.card}>
                            <Animated.Image
                                source={floatingImageLike}
                                style={[styles.floatingImageRight, { opacity: likeOpacity[cardIndex] }]}
                            />
                            <Animated.Image
                                source={floatingImageDislike}
                                style={[styles.floatingImageLeft, { opacity: dislikeOpacity[cardIndex] }]}
                            />


                            <Image source={ card.image } style={styles.image} />
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
                                <View style={styles.nameAgeContainer}>
                                    <Text style={styles.name}>{card.name}</Text>
                                    <Text style={styles.age}>, {card.age} years old</Text>
                                </View>
                                <View style={styles.genderBreedContainer}>
                                    {renderGenderIcon(card.gender)}
                                    <Text style={styles.breed}>{card.breed}</Text>
                                </View>

                            </View>
                        </View>
                    )}
                    onSwiping={Swiping}
                    onSwipedLeft={SwipedLeft}
                    onSwipedRight={SwipedRight}
                    onSwipedAborted={SwipedAborted}
                    onSwipedAll={() => console.log('All cards swiped')}
                    cardIndex={index}
                    stackSize={3}
                    stackAnimationFriction={7}
                    stackAnimationTension={40}
                    disableBottomSwipe
                    disableTopSwipe
                    backgroundColor={colors.white}
                    infinite={true}
                    cardVerticalMargin={0}
                />
            </View>
            <Navbar />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button,
                        { backgroundColor:  noButtonColor }
                    ]}
                    onPressIn={() => setNoButtonColor(colors.activeNoButton)}
                    onPressOut={() => setNoButtonColor(colors.white)}
                    onPress={() => {
                        resetOpacity(index);
                        animateSwipe('left');
                        swiperRef.current.swipeLeft();
                    }}
                >
                    <Ionicons name="close" size={50} color={noButtonIconColor} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button,
                        { backgroundColor: yesButtonColor }
                    ]}
                    onPressIn={() => setYesButtonColor(colors.activeYesButton)}
                    onPressOut={() => setYesButtonColor(colors.white)}
                    onPress={() => {
                        resetOpacity(index);
                        animateSwipe('right');
                        swiperRef.current.swipeRight();
                    }}
                >
                    <Ionicons name="heart" size={45} color={yesButtonIconColor} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default UserHomeScreen;