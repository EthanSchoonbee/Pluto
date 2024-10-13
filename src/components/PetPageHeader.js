import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HeaderStyles';
import { useNavigation } from '@react-navigation/native';

const PetPageHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>PLUTO</Text>
        </View>
    );
};

export default PetPageHeader;