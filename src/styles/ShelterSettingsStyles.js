import { StyleSheet } from 'react-native';
import colors from './colors'; // Assuming you have a colors file

const ShelterSettingsStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.userSettingsWhite, // Match background color
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 20,
    },
    // Header Section for the main title
    headerSection: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.userSettingsDarkGrayText, // Dark gray text
        marginBottom: 10,
    },
    // Details container section with 6 fields
    detailsContainer: {
        padding: 10,
        backgroundColor: colors.userSettingsLightGray, // Light gray background
        borderRadius: 10,
        marginTop: 5,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.userSettingsDarkGrayText, // Dark gray text
        paddingVertical: 5,
        paddingLeft: 5,

    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.userSettingsLightGrayBorder, // Light gray border
        paddingBottom: 5,
    },
    detailsLabel: {
        fontSize: 14,
        color: colors.userSettingsMediumGrayText, // Medium gray text
        fontWeight: '500',
    },
    detailsValue: {
        fontSize: 14,
        color: colors.userSettingsDarkGrayText, // Dark gray text
    },
    // Privacy Section Styles
    privacyContainer: {
        padding: 2,
        backgroundColor: colors.userSettingsLightGray, // Light gray background
        borderRadius: 10,
        marginTop: 10, // Adds spacing above the privacy section
    },
    privacyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.userSettingsDarkGrayText, // Dark gray text
        paddingLeft: 5,
        marginTop: 10,
    },
    notificationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationText: {
        fontSize: 14,
        color: colors.userSettingsMediumGrayText, // Medium gray text
    },
    // Custom Button Styles
    buttonContainer: {
        flex:1,
        paddingHorizontal: 20,
        paddingTop: 5,
        backgroundColor: colors.userSettingsWhite,
        justifyContent: "flex-end",
    },
    customButton: {
        marginBottom: 15,
        backgroundColor: colors.userSettingsWhite, // White background
        borderRadius: 25, // Rounded corners
        borderWidth: 2, // Border width
        borderColor: colors.userSettingsBlueBorder, // Blue border
        paddingVertical: 10, // Vertical padding
        paddingHorizontal: 5, // Horizontal padding
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%', // Width (50%)
        alignSelf: 'center', // Center the button horizontally
    },
    customButtonText: {
        color: colors.userSettingsBlueBorder, // Blue text
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        borderColor: colors.userSettingsRedBorder, // Red border for logout
    },
    logoutButtonText: {
        color: colors.userSettingsRedBorder, // Red text for logout
    },
    // New Style for Center Image
    centerImageContainer: {
        justifyContent: 'center', // Vertically center the content
        alignItems: 'center', // Horizontally center the content
        paddingTop:10,

    },
    centerImage: {
        width: 100,    // Set width to 150
        height: 100,   // Set height to 150
        borderRadius: 75, // Keep it circular (optional, remove if not needed)
        resizeMode: "cover", // Ensure the image fills the container
    }

});

export default ShelterSettingsStyles;
