import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ImageBackground,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import strings from "../strings/en";
import firebaseService from "../services/firebaseService";
import styles from '../styles/LoginScreenStyles'; // Import the new styles file

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);  // Add loading state

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleLogin = () => {
        if (!email || !password) {
            console.log('Please enter login details');
            alert('Please enter login details');
            return;
        }

        setLoading(true);

        firebaseService.loginUser(email, password, async (success, errorMessage) => {
            if (success) {
                const user = firebaseService.getCurrentUser();

                try {
                    const userData = await firebaseService.getUserData('users', user.uid);

                    if (userData) {
                        console.log('Fetched user data:', userData);
                        setLoading(false);
                        navigation.navigate('UserHome');
                    } else {
                        const shelterData = await firebaseService.getUserData('shelters', user.uid);
                        if (shelterData) {
                            console.log('Fetched shelter data:', shelterData);
                            setLoading(false);
                            navigation.navigate('ShelterHome');
                        } else {
                            console.log('No user or shelter data found in Firestore');
                            setLoading(false);
                            alert('Invalid login details');
                        }
                    }
                } catch (error) {
                    console.log('Error fetching user/shelter data:', error);
                    setLoading(false);
                    alert(errorMessage);
                }
            } else {
                console.log('Error during login:', errorMessage);
                setLoading(false);
                alert(errorMessage);
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

                {loading && (  // Display loading indicator when loading state is true
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFD700" />
                        <Text>Logging in...</Text>
                    </View>
                )}

                <Text style={styles.signupText}>
                    {strings.dont_have_account}{'\n'}
                    <Text onPress={() => navigation.navigate('Register')} style={styles.signupLink}>{strings.register_link}</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
