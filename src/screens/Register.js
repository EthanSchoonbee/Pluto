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
import firebaseService from '../services/firebaseService';
import ValidationClass from '../services/SettingsInputValidations';
import styles from '../styles/RegisterScreenStyles'; // Import styles here

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);  // Add loading state

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleRegister = async () => {

        if (ValidationClass.isEmptyOrWhitespace(fullName) ||
            ValidationClass.isEmptyOrWhitespace(email) ||
            ValidationClass.isEmptyOrWhitespace(password) ||
            ValidationClass.isEmptyOrWhitespace(phoneNo) ||
            ValidationClass.isEmptyOrWhitespace(location)) {
            alert('Please fill in all required fields');
            return;
        }

        if (!ValidationClass.containsAtSymbol(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!ValidationClass.isValidNumberInput(phoneNo)) {
            alert('Please enter a valid phone number');
            return;
        }

        // Password validation regex
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(password)) {
            alert('Insufficient password: Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
            return;
        }

        setLoading(true);
        try {
            const user = await firebaseService.registerUser(fullName, email, password, phoneNo, location);
            setLoading(false);
            console.log('User registered:', user);
            navigation.navigate('UserHome');
        } catch (error) {
            console.log('Error during registration:', error);
            setLoading(false);
            alert('Registration failed, please try again');
        }
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
                        <Icon name="person" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.full_name_placeholder}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

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
                        <Icon name="phone" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.phone_placeholder}
                            value={phoneNo}
                            onChangeText={setPhoneNo}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Icon name="home" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.location_placeholder}
                            value={location}
                            onChangeText={setLocation}
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

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerText}>{strings.register_button}</Text>
                </TouchableOpacity>

                {loading && (  // Display loading indicator when loading state is true
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFD700" />
                        <Text>Logging in...</Text>
                    </View>
                )}

                <Text style={styles.loginText}>
                    {strings.already_have_account}{'\n'}
                    <Text onPress={() => navigation.navigate('Login')} style={styles.loginLink}>{strings.login_link}</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
