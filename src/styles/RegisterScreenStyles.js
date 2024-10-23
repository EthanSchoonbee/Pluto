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
    icon: {
        marginRight: 10,
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
