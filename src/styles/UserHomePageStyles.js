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
            floatingImageLeft: {
                position: 'absolute',
                top: '-15%',
                left: '-28%',
                width: 400,
                height: 400,
                zIndex: 10,
            },
            floatingImageRight: {
                position: 'absolute',
                top: '-15%',
                right: '-25%',
                width: 400,
                height: 400,
                zIndex: 10,
            },
            card: {
                height: '80%',
                borderRadius: 10,
                alignSelf: 'center',
                width:  width * 0.98,
                backgroundColor: '#ffffff',
                marginTop: 10,
                position: 'absolute',
                top: 0,
            },
                image: {
                    height: '100%',
                    width: '100%',
                    borderRadius: 10,
                    resizeMode: 'cover',
                    backgroundColor: '#ffffff',
                },
                cardInfo: {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    position: 'absolute',
                    bottom: 90,
                    width: '100%',
                    padding: 15,
                    zIndex: 2
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
                    gradient: {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '25%',
                        zIndex: 1,
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
});

export default styles;