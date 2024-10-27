import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import UserNavbar from './UserNavbar';
import ShelterNavbar from './ShelterNavbar';
import { auth, db } from '../services/firebaseConfig'; // Adjust the import path as needed
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles/NavbarStyles';

const NavbarWrapper = ({ noShadow }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const cachedUserData = await AsyncStorage.getItem('userData');
                if (cachedUserData) {
                    const parsedData = JSON.parse(cachedUserData);
                    setRole(parsedData.role);
                    setLoading(false);
                    return; // Exit the function early if we find the role in cache
                }

                const userId = auth.currentUser?.uid;
                if (!userId) {
                    console.error('No user logged in');
                    setLoading(false);
                    return;
                }

                // If no cached data, proceed to check Firestore
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userRole = userDoc.data()?.role;
                    setRole(userRole);
                    await AsyncStorage.setItem('userData', JSON.stringify(userDoc.data()));
                } else {
                    const shelterDocRef = doc(db, 'shelters', userId);
                    const shelterDoc = await getDoc(shelterDocRef);

                    if (shelterDoc.exists()) {
                        const shelterRole = shelterDoc.data()?.role;
                        setRole(shelterRole);
                        await AsyncStorage.setItem('userData', JSON.stringify(shelterDoc.data()));
                    } else {
                        console.error('No role found for user in both users and shelters collections.');
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="black" />;
    }

    return (
        <View style={[styles.navbar, noShadow ? styles.noShadow : styles.shadow]}>
            {role === 'shelter' ? <ShelterNavbar /> : <UserNavbar />}
        </View>
    );
};

export default NavbarWrapper;
