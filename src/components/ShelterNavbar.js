/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains the implementation of the `ShelterNavbar` component, which serves as the navigation bar
specifically for shelter users. It provides quick access to the shelter home and settings screens using
icon-based navigation.

SUMMARY:
- `ShelterNavbar`: The main component that renders the navigation options for shelter users.
*/
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyles';
import { useNavigation } from '@react-navigation/native';

/**
 * ShelterNavbar component
 * Renders the navigation options for shelter users with icons for home and settings.
 * @returns {JSX.Element} - The rendered navigation bar for shelter users.
 */
const ShelterNavbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            <Ionicons
                name="home"
                size={30}
                color="black"
                onPress={() => navigation.navigate('ShelterHome')} //navigate to the shelter home page
            />
            <Ionicons
                name="settings"
                size={30}
                color="black"
                onPress={() => navigation.navigate('ShelterSettings')} //navigate to the shelter settings page
            />
        </View>
    );
};

export default ShelterNavbar;
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________