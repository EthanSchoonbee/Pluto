import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleRegister = async () => {
        navigation.navigate('Login');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
        >
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

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerText}>REGISTER</Text>
            </TouchableOpacity>

            <Text style={styles.loginText}>
                Already have an account?{'\n'}
                <Text style={styles.loginLink}>Sign in now.</Text>
            </Text>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginBottom: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 110,
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
    },
    loginLink: {
        color: '#EDE3BB',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
