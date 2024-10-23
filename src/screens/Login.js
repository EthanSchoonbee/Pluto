import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, ImageBackground, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import strings from "../strings/en";
import firebaseService from "../services/firebaseService";
import userSession from "../services/UserSession";
import styles from '../styles/LoginScreenStyles'; // Import the new styles file

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleLogin = () => {
        if (!email || !password) {
            console.log('Please enter login details');
            alert('Please enter login details');
            return;
        }

        firebaseService.loginUser(email, password, async (success, errorMessage) => {
            if (success) {
                const user = firebaseService.getCurrentUser();

                try {
                    const userData = await firebaseService.getUserData('users', user.uid);

                    if (userData) {
                        console.log('Fetched user data:', userData);
                        const token = await user.getIdToken();
                        userSession.setUser(userData, token);
                        navigation.navigate('UserHome');
                    } else {
                        const shelterData = await firebaseService.getUserData('shelters', user.uid);
                        if (shelterData) {
                            console.log('Fetched shelter data:', shelterData);
                            const token = await user.getIdToken();
                            userSession.setUser(shelterData, token);
                            navigation.navigate('ShelterHome');
                        } else {
                            console.log('No user or shelter data found in Firestore');
                            alert('Invalid login details');
                        }
                    }
                } catch (error) {
                    console.log('Error fetching user/shelter data:', error);
                    alert('An error occurred while fetching user data.');
                }
            } else {
                console.log('Error during login:', errorMessage);
                alert('Invalid login details');
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" />
            <ImageBackground
                source={require('../../assets/wave_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/pluto_logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>{strings.pluto_title}</Text>
                </View>

                <View style={styles.inputContainer}>
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

export default LoginScreen;
