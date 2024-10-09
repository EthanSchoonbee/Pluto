import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import strings from "../strings/en"
import { StatusBar } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleRegister = async () => {
        // Registration logic here
        navigation.navigate('Login');
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

            {/* ScrollView for the registration content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/pluto_logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>{strings.pluto_title}</Text>
                </View>

                <View style={styles.inputContainer}>
                    {/* Full Name Input */}
                    <View style={styles.inputWrapper}>
                        <Icon name="person" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.full_name_placeholder}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    {/* Email Input */}
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

                    {/* Password Input */}
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

                    {/* Confirm Password Input */}
                    <View style={styles.inputWrapper}>
                        <Icon name="lock" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder={strings.confirm_password_placeholder}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
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

                <Text style={styles.loginText}>
                    {strings.already_have_account}{'\n'}
                    <Text onPress={() => navigation.navigate('Login')} style={styles.loginLink}>{strings.login_link}</Text>
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
        top: -100,  // Adjust based on design
        left: 0,
        right: 0,
        height: 550,  // Same height as in LoginScreen
        zIndex: -1,
        resizeMode: 'cover',  // Ensure it covers the screen without cutting off
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

export default RegisterScreen;
