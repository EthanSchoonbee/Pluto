import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyles';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            <Ionicons
                name="home"
                size={30}
                color="black"
                onPress={() => navigation.navigate('UserHome')}
            />
            <Ionicons
                name="paw"
                size={30}
                color="black"
                onPress={() => navigation.navigate('AddAnimal')}
            />
            <Ionicons
                name="chatbubble"
                size={30}
                color="black"
                onPress={() => navigation.navigate('Register')}
            />
            <Ionicons
                name="person"
                size={30}
                color="black"
                onPress={() => navigation.navigate('ShelterSettings')}
            />
        </View>
    );
};

export default Navbar;
