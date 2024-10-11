import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({



    sliderText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },

    button: {
        backgroundColor: 'gold',
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },

    scrollContent: {
        paddingBottom: 20,  // Extra padding to prevent cutting off at the bottom
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    buttonWrapper: {
        alignItems: 'center', // Centers the button horizontally
        marginVertical: 20,   // Adds space around the button
    },
    switchContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    toggleButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'gray', // Background color for unselected buttons
    },
    toggleButton: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    selectedButton: {
        backgroundColor: 'gold', // Background color for selected button
    },
    toggleButtonText: {
        fontSize: 18,
        color: 'white', // Text color
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    pickerContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
        borderColor: '#ccc',
        backgroundColor: "#fff"
    },
    colorPickerContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    pickerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    pickerText: {
        fontSize: 16,
        color: 'black',
    },
    arrowIcon: {
        position: 'absolute',
        right: 10, // Adjust this value as needed
        top: '50%',
        transform: [{ translateY: 2 }], // Adjust based on your text height
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    },
    modalContent: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
    },
    sliderContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    slider: {
        width: '100%', // Ensures the slider width is consistent
        height: 40,
    },
    multiSliderContainer: {
        width: '100%', // Ensures MultiSlider has the same width as other sliders
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    colorOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    colorIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 16,
    },

    inputContainer: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 20, // Added padding to align the inputs with other elements
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
        width: '100%',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        height: 120,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        width: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        backgroundColor: '#f0f0f0', // Background color for the container
        padding: 10,
        borderRadius: 10,  // Rounded edges for the container
        justifyContent: 'space-between',  // Distribute images evenly
    },
    imageWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        margin: 5,  // Spacing between images
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',  // Background color for image wrapper
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    deleteImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 5,
    },
    deleteImageText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    uploadImage: {
        width: 100,
        height: 100,
        margin: 5,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    uploadImageText: {
        fontSize: 24,
        color: '#aaa',
    },
});

export default styles;
