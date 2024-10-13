import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    container: {
        flex: 1, // This makes the container take up the full space available, ensuring all content is visible.
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    petInfoContainer: {
        alignItems: "center",
        padding: 16,
        backgroundColor: colors.surface,
        marginBottom: 1,
    },
    petImage: {
        width: 120,
        height: 120,
        borderRadius: 60, // Makes the image a circle.
        marginBottom: 12, // Adds space below the pet image.
    },
    petName: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    listContainer: {
        padding: 16, // Adds space around the list content.
    },
    adopterItem: {
        flexDirection: "row", // Aligns elements in a row.
        alignItems: "center", // Vertically aligns elements in the middle.
        backgroundColor: colors.surface, // Sets the background colour of the adopter item.
        borderRadius: 10, // Adds a slight curve to the corners.
        padding: 16, // Adds space around the adopter item content.
        marginBottom: 12, // Adds space below the adopter item.
        shadowColor: colors.black, // Sets the shadow colour.
        shadowOffset: { width: 0, height: 2 }, // Sets the shadow offset.
        shadowOpacity: 0.1, // Sets the shadow opacity.
        shadowRadius: 4, // Sets the shadow radius.
        elevation: 3, // Sets the elevation of the adopter item.
    },
    adopterImage: {
        width: 60,
        height: 60,
        borderRadius: 30, // Makes the image a circle.
        marginRight: 16, // Adds space to the right of the adopter image.
    },
    adopterInfo: {
        flex: 1, // This makes the adopter info take up the remaining space.
        flexDirection: "row", // Aligns elements in a row.
        justifyContent: "space-between", // Spreads elements evenly across the row.
        alignItems: "flex-start", // Aligns elements to the start of the row.
    },
    adopterDetails: {
        flex: 1, // This makes the adopter details take up the remaining space.
    },
    adopterName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    adopterMessage: {
        fontSize: 14,
        colour: colors.textSecondary,
    },
    timestamp: {
        fontSize: 14,
        colour: colors.textSecondary,
        marginLeft: 8,
    },
});
