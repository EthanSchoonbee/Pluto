// styles/HeaderStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingVertical: 10,
        backgroundColor: 'transparent',
        marginBottom: 0,
        zIndex: 1
    },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
        },
});

export default styles;
