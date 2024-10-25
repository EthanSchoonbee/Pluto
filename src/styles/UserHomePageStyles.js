import { StyleSheet, Dimensions } from 'react-native';
import colors from '../styles/colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)'
    },
    loadingLikeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // Semi-transparent background
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
        swiperContainer: {
            flex: 1,
            borderRadius: 10
        },
            card: {
                flex: 1,
                height: '80%',
                alignSelf: 'center',
                width:  width * 0.98,
                maxHeight:  height * 0.9,
                backgroundColor: '#ffffff',
                marginTop: 10,
                position: 'absolute',
                overflow: 'hidden'
            },
                leftTouchableArea: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: '25%',
                    width: '50%',
                    zIndex: 99,
                    //backgroundColor: 'rgba(255, 0, 0, 0.2)',
                },
                rightTouchableArea: {
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: '25%',
                    width: '50%',
                    zIndex: 100,
                    //backgroundColor: 'rgba(0, 0, 255, 0.2)'
                },
                floatingImageLeft: {
                    position: 'absolute',
                    top: '-15%',
                    left: '30%',
                    width: '100%',
                    height: '50%',
                    zIndex: 1
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
                imageIndexIndicator: {
                    position: 'absolute',
                    top: '2%', // Relative position for better scaling
                    right: '2%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignSelf: 'flex-end', // Ensures alignment to the right side
                },
                imageIndexText: {
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold',
                },
                gradient: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '35%',
                    zIndex: 1,
                },
                cardInfo: {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    position: 'absolute',
                    bottom: '16%',
                    width: '100%',
                    padding: 15,
                    zIndex: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                    leftContainer: {
                        flex: 2,
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
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                    },
                        arrowButton: {
                            position: 'absolute',
                            bottom: '17%', // Adjust based on your layout
                            right: 20, // Adjust based on your layout
                            backgroundColor: 'transparent', // Optional: Background color for visibility
                            borderRadius: 15, // Optional: Rounded corners
                            padding: 10, // Optional: Padding around the icon
                            opacity: 0.2,
                            zIndex: 150
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
                        },
        overlayContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
            justifyContent: 'center',
            alignItems: 'stretch',
            zIndex: 1000, // Ensures it is above other content
        },
    scrollView: {
        width: '100%', // Adjust this width to your desired size
        maxHeight: '90%', // Limit the height to prevent overflow
    },
    overlayContent: {
        width: '100%',
        height: '60%', // Increase height to accommodate the scrollable content
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    overlayName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center', // Center the animal's name
    },

    fieldContainer: {
        alignItems: 'center', // Center titles and values
        marginVertical: 10, // Add vertical spacing between fields
        width: '100%', // Make sure the field container takes full width
    },

    fieldTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5, // Space between title and value
        textAlign: 'center', // Center the title
    },

    overlayDetails: {
        fontSize: 18,
        textAlign: 'center', // Center the details
    },

    genderOverlayContainer: {
        flexDirection: 'row', // Aligns text and icon in a row
        alignItems: 'center', // Centers items vertically
        marginLeft: 9,
    },
    genderOverlay: {
        marginLeft: 8, // Add space between text and icon
    },

    overlayDetailsDescription: {
        fontSize: 18,
        textAlign: 'center', // Center the description
        marginTop: 5,
        textAlignVertical: 'top', // Align text at the top if it's long
        overflow: 'scroll', // Enable scrolling if the text is long
        width: '100%', // Make sure the details take full width
    },

    closeButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: colors.darkGrey,
        color: colors.darkGrey,
        alignSelf: 'center',
        borderRadius: 5,
    },

    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },

});

export default styles;