/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains the implementation of the `UserNavbar` component, which serves as the navigation bar
specifically for customer users. It provides quick access to the user home, liked animals, and settings screens using
icon-based navigation.

SUMMARY:
- `UserNavbar`: The main component that renders the navigation options for customer users.
*/
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyles';
import { useNavigation } from '@react-navigation/native';


/**
 * UserNavbar component
 * Renders the navigation options for customer users with icons for home, liked animals, and settings.
 * @returns {JSX.Element} - The rendered navigation bar for customer users.
 */
const UserNavbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            <Ionicons
                name="home"
                size={30}
                color="black"
                onPress={() => navigation.navigate('UserHome')} //navigate to the user home page
            />
            <Ionicons
                name="heart"
                size={30}
                color="black"
                onPress={() => navigation.navigate('LikedAnimalsPage')} //navigate to the user liked animals page
            />
            <Ionicons
                name="person"
                size={30}
                color="black"
                onPress={() => navigation.navigate('UserSettings')} //navigate to the user settings page
            />
        </View>
    );
};

export default UserNavbar;
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________