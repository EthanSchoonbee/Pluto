import { StyleSheet } from 'react-native';
import colors from "./colors";

const styles = StyleSheet.create({
    navbar: {
        height: '7%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 10,
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        zIndex: 1,
    },
});

export default styles;