import { StyleSheet } from 'react-native';
import colors from "./colors";

const styles = StyleSheet.create({
    //navbar
    navbar: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // For Android
        },
        noShadow: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0, // For Android
        },
});

export default styles;