import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
        position: 'absolute',
        top: -100,
        left: 0,
        right: 0,
        height: 550,
        zIndex: -1,
        resizeMode: 'cover',
    },
    scrollContainer: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 90,
        marginTop: 70,
    },
    logo: {
        width: 217.7,
        height: 145.16,
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: '600',
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
        width: '80%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingHorizontal: 10,
    },
    pickerContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',  // Matches underline color of other inputs
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,  // Add horizontal padding for consistent layout
    },
    pickerButton: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 10,
    },
    pickerText: {
        fontSize: 16,
        color: '#333',  // Matches input text color
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        color: '#aaa',
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Background overlay for the modal
    },
    modalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,  // Adds shadow for Android
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'center',
        color: '#007BFF',  // Change color to match your theme
    },
    icon: {
        marginRight: 10,
    },
    locationIcon: {
        marginRight: 10,
        color: '#aaa',  // Same color as other input icons
    },
    pickerUnderline: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',  // Same underline color as the other inputs
    },
    inputUnderline: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
    },
    registerButton: {
        height: 50,
        backgroundColor: '#EDE3BB',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '80%',
    },
    registerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
    },
    loginText: {
        textAlign: 'center',
        color: '#333',
        fontSize: 15,
    },
    loginLink: {
        color: '#EDE3BB',
        fontWeight: 'bold',
    },
});

export default styles;
