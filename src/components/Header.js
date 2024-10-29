/*
AUTHOR: Ethan Schoonbee
CREATED ON: 02/09/2024
LAST UPDATED: 29/10/2024

DESCRIPTION:
This file contains the implementation of the `Header` component, which serves as the header for the application.
It displays the application logo and name, along with an optional right component or a default filter icon.

SUMMARY:
- `Header`: The main component that renders the header UI with the application logo, name, and an optional right component.
*/
import React from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HeaderStyles';
import { useNavigation } from '@react-navigation/native';

/**
 * Header component
 * Displays the application logo and name, along with an optional right component or a default filter icon.
 * @param {function} rightComponent - An optional function that returns a JSX element to render on the right side of the header.
 * @returns {JSX.Element} - The rendered header component.
 */
const Header = ({ rightComponent }) => {
    const navigation = useNavigation(); // Hook to access the navigation object

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <View style={styles.leftContainer}>
                    <Image
                        source={require('../../assets/pluto_logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.headerText}>PLUTO</Text>
                </View>
                {rightComponent ? (
                    rightComponent()
                ) : (
                    <Ionicons
                        name="filter"
                        size={30}
                        color="black"
                        onPress={() => navigation.navigate('Filter')}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Header;
//________________________________....oooOO0_END_OF_FILE_0OOooo....________________________________