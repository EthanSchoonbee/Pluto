import { StyleSheet } from 'react-native';
import colors from "./colors";

const UserSettingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.genderMaleBlue,   // White background
        paddingHorizontal: 20,
        paddingTop: 15,

    },
    scrollView: {
        backgroundColor: colors.userSettingsWhite, // Match background color
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 20,
    },
    headerSection: {
        marginBottom: 15,
        alignItems: 'center',
        paddingTop: 10,
    },
        headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.userSettingsDarkGrayText, // Dark gray text
            marginBottom: 10,
        },
    detailsContainer: {
        padding: 20,
        backgroundColor: colors.userSettingsLightGray, // Light gray background
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 5,  // Added marginBottom to separate details from next section
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.userSettingsDarkGrayText, // Dark gray text
        paddingLeft: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.userSettingsLightGrayBorder, // Light gray border
        paddingBottom: 7,
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
        padding: 10,
        backgroundColor: colors.userSettingsLightGray, // Light gray background
        borderRadius: 10,
        marginTop: 5,
    },
    privacyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.userSettingsDarkGrayText, // Dark gray text
        paddingLeft: 4,
        paddingTop: 5,
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
        paddingHorizontal: 20,
        paddingTop: 5,
        backgroundColor: colors.userSettingsWhite,
        flexGrow: 1,
        justifyContent: "flex-end",
        paddingBottom: 80,
    },
    customButton: {
        marginBottom: 15,
        backgroundColor: colors.userSettingsWhite,  // White background
        borderRadius: 25,         // Rounded corners
        borderWidth: 2,           // Border width
        borderColor: colors.userSettingsBlueBorder,   // Blue border
        paddingVertical: 10,      // Slightly reduced vertical padding
        paddingHorizontal: 5,     // Further reduced horizontal padding
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',             // Even narrower width (50%)
        alignSelf: 'center',      // Center the button horizontally
    },
    customButtonText: {
        color: colors.userSettingsBlueBorder,         // Blue text
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        borderColor: colors.userSettingsRedBorder,   // Red border for logout
    },
    logoutButtonText: {
        color: colors.userSettingsRedBorder,         // Red text for logout
    },
});

export default UserSettingsStyles;
