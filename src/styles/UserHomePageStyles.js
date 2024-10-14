import { StyleSheet, Dimensions } from 'react-native';
import colors from '../styles/colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        height: height,
        backgroundColor: '#ffffff',
    },
        swiperContainer: {
            height: '100%',
            width: '100%',
            justifyContent: 'flex-start',
        },

            card: {
                height: '80%',
                borderRadius: 10,
                alignSelf: 'center',
                width:  width * 0.98,
                backgroundColor: '#ffffff',
                marginTop: 10,
                position: 'absolute',
            },
                leftTouchableArea: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: '20%',
                    width: '50%',
                    zIndex: 100,
                    //backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderWidth: 0,
                    borderColor: 'red',
                },
                rightTouchableArea: {
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: '20%',
                    width: '50%',
                    zIndex: 100,
                    //backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderWidth: 0,
                    borderColor: 'red',
                },
                floatingImageLeft: {
                    position: 'absolute',
                    top: '-15%',
                    left: '30%',
                    width: '100%',
                    height: '50%',
                    zIndex: 1,
                },
                floatingImageRight: {
                    position: 'absolute',
                    top: '-15%',
                    right: '32%',
                    width: '100%',
                    height: '50%',
                    zIndex: 1,
                },
                image: {
                    height: '100%',
                    width: '100%',
                    borderRadius: 10,
                    resizeMode: 'cover',
                    backgroundColor: colors.darkGrey,
                },
                gradient: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '25%',
                    zIndex: 1,
                },
                cardInfo: {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    position: 'absolute',
                    bottom: '12%',
                    width: '100%',
                    padding: 15,
                    zIndex: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                    leftContainer: {
                        flex: 1,
                        justifyContent: 'center',
                    },
                        nameAgeContainer: {
                            flexDirection: 'row',
                            alignItems: 'baseline',
                        },
                            name: {
                                fontSize: 30,
                                color: '#1a1a18',
                                fontWeight: 'bold',
                            },
                            age: {
                                fontSize: 20,
                                color: '#2f2f2e',
                            },
                        genderBreedContainer: {
                            flexDirection: 'row',
                            alignItems: 'center',
                        },
                            gender: {
                                fontSize: 18,
                                marginRight: 7
                            },
                            breed: {
                                fontSize: 18,
                                color: '#2f2f2e',
                            },
                    rightContainer: {
                        flex: 1,
                        justifyContent: 'center',
                    },
                        infoIconContainer: {
                            marginLeft: 'auto',
                        },
        infoContainer: {
            padding: 10,
            backgroundColor: colors.black, // Adjust as needed
            borderRadius: 5,
            marginTop: 10,
        },
        infoText: {
            fontSize: 16,
            color: colors.black,
        },
        buttonsContainer: {
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: 20,
        },
            button: {
                width: 70,
                height: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                // shadow for IOS:
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                // shadow for Android
                elevation: 5,
                zIndex: 2
            },
                noButton: {
                    backgroundColor: colors.white,

                },
                yesButton: {
                    backgroundColor: colors.white,
                },
                pressed: {
                    opacity: 0.5,

                }
});

export default styles;