import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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
    },
    colorPickerContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    pickerButton: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    pickerText: {
        fontSize: 16,
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
});

export default styles