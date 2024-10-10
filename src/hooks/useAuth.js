// src/hooks/useAuth.js

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import UserModel from '../models/UserModel'; // Import UserModel
import UserSession from '../services/UserSession'; // Import the UserSession singleton
import Login from "../screens/Login"; // Navigation target for login
import UserHomePage from "../screens/UserHomePage"; // Navigation target for user home page

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    // Login method
    const login = async (email, password) => {
        setLoading(true);
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Create a UserModel instance from the Firebase user
            const userModel = UserModel.fromFirebaseUser(firebaseUser);

            // Store the user in the singleton class
            UserSession.setUser(userModel);
            setUser(userModel);
            setError(null);

            // Navigate to the home screen
            navigation.navigate(UserHomePage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Logout method
    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);

            // Clear the user in the singleton class
            UserSession.clearUser();
            setUser(null);

            // Navigate to the login screen
            navigation.navigate(Login);
        } catch (err) {
            setError(err.message);
        }
    };

    return { user, login, logout, loading, error };
};
