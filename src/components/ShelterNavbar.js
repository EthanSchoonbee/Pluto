import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyles';
import { useNavigation } from '@react-navigation/native';

const ShelterNavbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            <Ionicons
                name="home"
                size={30}
                color="black"
                onPress={() => navigation.navigate('ShelterHome')}
            />
            <Ionicons
                name="settings"
                size={30}
                color="black"
                onPress={() => navigation.navigate('ShelterSettings')}
            />
        </View>
    );
};

export default ShelterNavbar;
