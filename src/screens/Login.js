import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleLogin = async () => {
        // Handle login logic
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                    <Text style={styles.title}>PLUTO</Text>
                </View>

                <View style={styles.inputContainer}>
                    {/* Email Input with Icon */}
                    <View style={styles.inputWrapper}>
                        <Icon name="email" size={20} color="#aaa" style={styles.icon} />
                        <TextInput
                            style={styles.inputUnderline}
                            placeholder="EMAIL"
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
                            placeholder="PASSWORD"
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
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>

                <Text style={styles.signupText}>
                    Don't have an account yet?{'\n'}
                    <Text onPress={() => navigation.navigate('Register')} style={styles.signupLink}>Create one now.</Text>
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
        height: 480,  // Keep height at 380 or less, as required by your design
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
        marginBottom: 80,
        marginTop: 20,
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
        zIndex: 1,
    },
    signupLink: {
        color: '#EDE3BB',
        fontWeight: 'bold',
    },
});


export default LoginScreen;
