import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/NavbarStyles';
import { useNavigation } from '@react-navigation/native';

const UserNavbar = () => {
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
                name="heart"
                size={30}
                color="black"
                onPress={() => navigation.navigate('PetPage')}
            />
            <Ionicons
                name="chatbubbles"
                size={30}
                color="black"
                onPress={() => navigation.navigate('ShelterChats')}
            />
            <Ionicons
                name="person"
                size={30}
                color="black"
                onPress={() => navigation.navigate('UserSettings')}
            />
        </View>
    );
};

export default UserNavbar;
