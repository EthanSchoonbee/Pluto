import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between", //space between component elements
        alignItems: "center",
        padding: 16,
        backgroundColor: colors.surface,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    //The header pet image styling
    headerPetImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerPetName: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    //Container for the user info
    userInfoContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    //Styling for the user image
    userImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10, //space between user image and name
    },
    //Styling for the user name
    userName: {
        fontSize: 24,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    //Container for the form
    formContainer: {
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, //shadow for the form
    },
    //Container for the detail items
    detailItem: {
        marginBottom: 15,
    },
    //Styling for the detail label
    detailLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    notificationButton: {
        backgroundColor: "gold",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    notificationButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", //will darken the background when modal is open
    },
    blurView: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 35, //space between modal and edge of the screen
        alignItems: "center",
        shadowColor: colors.black,
        shadowOffset: {
            //how far the shadow is from the element itself. slight height shadow. no width shadow
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        color: colors.textPrimary,
    },
    //styling for the adoption statuses
    statusItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    //styling for the adoption status text
    statusText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    //styling for the modal title
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: colors.textPrimary,
    },
    //styling for the close button
    closeButton: {
        marginTop: 20,
        padding: 10,
    },
    //styling for the close button text
    closeButtonText: {
        fontSize: 16,
        color: colors.primary,
        textAlign: "center",
    },
});
