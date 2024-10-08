import { useState } from 'react';
import { auth } from '../services/firebaseService'; // Firebase authentication service

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle login
    const login = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            setUser(userCredential.user);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return { user, login, logout, loading, error };
};