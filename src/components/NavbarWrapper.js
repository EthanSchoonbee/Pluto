/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains the implementation of the `NavbarWrapper` component, which dynamically renders either
the `UserNavbar` or `ShelterNavbar` based on the authenticated user's role. It retrieves the user's role
from local storage or Firestore and displays a loading indicator while fetching the data.

SUMMARY:
- `NavbarWrapper`: The main component that determines the user's role and renders the corresponding navbar.
 */
import React, {
    useEffect,
    useState
} from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import UserNavbar from './UserNavbar';
import ShelterNavbar from './ShelterNavbar';
import {
    auth,
    db
} from '../services/firebaseConfig';
import {
    doc,
    getDoc
} from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles/NavbarStyles';

/**
 * NavbarWrapper component
 * Fetches the user's role and renders either the UserNavbar or ShelterNavbar based on the role.
 * Displays a loading indicator while fetching the role.
 * @param {boolean} noShadow - Optional prop to determine if the navbar should have a shadow effect.
 * @returns {JSX.Element} - The rendered navbar component for the user or shelter.
 */
const NavbarWrapper = ({ noShadow }) => {
    const [role, setRole] = useState(null); // State to store the user's role
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                // Attempt to get cached user data from AsyncStorage
                const cachedUserData = await AsyncStorage.getItem('userData');
                if (cachedUserData) {
                    const parsedData = JSON.parse(cachedUserData);
                    setRole(parsedData.role); // Set role from cached data
                    setLoading(false); // End loading state
                    return; // Exit the function early if we find the role in cache
                }

                const userId = auth.currentUser?.uid; // Get current user's ID
                if (!userId) {
                    console.error('No user logged in');
                    setLoading(false); // End loading state
                    return; // Exit if no user is logged in
                }

                // If no cached data, proceed to check Firestore for user role
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef); // Fetch user document

                if (userDoc.exists()) {
                    const userRole = userDoc.data()?.role; // Get role from user document
                    setRole(userRole);
                    // Cache user data
                    await AsyncStorage.setItem('userData', JSON.stringify(userDoc.data()));
                } else {
                    // If no user document, check if the user is a shelter
                    const shelterDocRef = doc(db, 'shelters', userId);
                    const shelterDoc = await getDoc(shelterDocRef); // Fetch shelter document

                    if (shelterDoc.exists()) {
                        const shelterRole = shelterDoc.data()?.role; // Get role from shelter document
                        setRole(shelterRole);
                        await AsyncStorage.setItem('userData', JSON.stringify(shelterDoc.data()));
                    } else {
                        console.error('No role found for user in both users and shelters collections.');
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error); // Log any errors during fetching
            } finally {
                setLoading(false); // End loading state regardless of success or failure
            }
        };
        // Call the function to fetch user role
        fetchUserRole();
    }, []);

    // Show loading indicator while fetching user role
    if (loading) {
        return <ActivityIndicator size="large" color="black" />;
    }

    // Render the appropriate navbar based on the user's role
    return (
        <View style={[styles.navbar, noShadow ? styles.noShadow : styles.shadow]}>
            {role === 'shelter' ? <ShelterNavbar /> : <UserNavbar />}
        </View>
    );
};

export default NavbarWrapper;
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________