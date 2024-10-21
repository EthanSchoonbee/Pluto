import { StyleSheet } from 'react-native';
import colors from "./colors";

const styles = StyleSheet.create({
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

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,

        // Shadow for Android
        elevation: 5,
    },
});

export default styles;