import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import strings from "../strings/en"
import { StatusBar } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import firebaseService from "../services/firebaseService";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleLogin = async () => {
        try {
            const user = await firebaseService.loginUser(email, password);
            console.log('User logged in:', user);
            navigation.navigate('UserHome'); // Navigate to UserHome upon success
        } catch (error) {
            console.log('Error during login:', error);
            // Optionally: show error message to user
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Set the status bar style to dark-content */}
            <StatusBar barStyle="dark-content" />
            {/* Background Image with absolute positioning */}
            <ImageBackground
                source={require('../../assets/wave_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            {/* ScrollView for the login content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/pluto_logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>{strings.pluto_title}</Text>
                </View>

                <View style={styles.inputContainer}>
                    {/* Email Input with Icon */}
                    <View style={styles.inputWrapper}>
                        <Icon name="email" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.email_placeholder}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input with Icon */}
                    <View style={styles.inputWrapper}>
                        <Icon name="lock" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.password_placeholder}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secureTextEntry}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <Icon name={secureTextEntry ? 'visibility' : 'visibility-off'} size={20} color="#aaa" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>{strings.login_button}</Text>
                </TouchableOpacity>

                <Text style={styles.signupText}>
                    {strings.dont_have_account}{'\n'}
                    <Text onPress={() => navigation.navigate('Register')} style={styles.signupLink}>{strings.register_link}</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
        position: 'absolute',
        top: -100,  // Push the wave up while keeping the full image
        left: 0,
        right: 0,
        height: 550,  // Keep height at 380 or less, as required by your design
        zIndex: -1,
        resizeMode: 'cover',  // Ensure the background fills the space without cutting off
    },
    scrollContainer: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 60,
        zIndex: 1,  // Ensure content stays above the background
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 120,
        marginTop: 70,
        zIndex: 1,
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
        zIndex: 1,
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
    loginButton: {
        height: 50,
        backgroundColor: '#EDE3BB',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '80%',
        zIndex: 1,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
    },
    signupText: {
        textAlign: 'center',
        color: '#333',
        fontSize: 15,
        zIndex: 1,
    },
    signupLink: {
        color: '#EDE3BB',
        fontWeight: 'bold',
    },
});


export default LoginScreen;
