import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HeaderStyles';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>PLUTO</Text>
            <Ionicons
                name="filter"
                size={30}
                color="black"
                onPress={() => navigation.navigate('Filter')}
            />
        </View>
    );
};

export default Header;