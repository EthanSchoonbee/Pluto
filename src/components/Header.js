import React from 'react';
import {View, Text, Image, SafeAreaView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/HeaderStyles';
import { useNavigation } from '@react-navigation/native';

const Header = ({ rightComponent }) => {
    const navigation = useNavigation();

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