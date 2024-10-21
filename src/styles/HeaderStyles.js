// styles/HeaderStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        marginBottom: 0,
        zIndex: 1,

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Shadow moves downward
        shadowOpacity: 0.15, // Adjust the opacity for a softer shadow
        shadowRadius: 2, // Adjust the spread of the shadow

        // Shadow for Android
        elevation: 3, // Keep this lower for a more subtle shadow
    },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
            logo: {
                width: 30,
                height: 30,
                marginRight: 10
            },
            headerText: {
                fontSize: 20,
                fontWeight: 'bold'
            }
});

export default styles;
