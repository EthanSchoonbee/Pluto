import { StyleSheet } from 'react-native';
import colors from "./colors";

const UserSettingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.userSettingsWhite,   // White background
        paddingHorizontal: 20,
        paddingTop: 30,
        color: colors.white,
    },
    scrollView: {
        backgroundColor: colors.userSettingsWhite, // Match background color
        paddingRight: 12,
        paddingLeft: 12,
        paddingBottom: 50,
        paddingTop: 40,
    },
    headerSection: {
        marginBottom: 15,
        alignItems: 'center',
        paddingTop: 10,
    },
        headerText: {
            fontSize: 18,
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
        fontSize: 18,
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
        paddingBottom: 5,
    },
    detailsLabel: {
        fontSize: 16,
        color: colors.userSettingsMediumGrayText, // Medium gray text
        fontWeight: '500',
    },
    detailsValue: {
        fontSize: 16,
        color: colors.userSettingsDarkGrayText, // Dark gray text
    },
    // Privacy Section Styles
    privacyContainer: {
        padding: 20,
        backgroundColor: colors.userSettingsLightGray, // Light gray background
        borderRadius: 10,
        marginTop: 5,
    },
    privacyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.userSettingsDarkGrayText, // Dark gray text
        paddingLeft: 4,
    },
    notificationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationText: {
        fontSize: 16,
        color: colors.userSettingsMediumGrayText, // Medium gray text
    },
    // Custom Button Styles
    buttonContainer: {
        paddingHorizontal: 20,
        marginTop: 30,
        backgroundColor: colors.userSettingsWhite,
        flexGrow: 1,
        justifyContent: "flex-end",
        paddingBottom: 66,

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
