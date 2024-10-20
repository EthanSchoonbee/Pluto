import { StyleSheet } from 'react-native';
import colors from "./colors";

const styles = StyleSheet.create({
    navbar: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingBottom: 10,
    },
});

export default styles;