import { StyleSheet } from "react-native";
import colors from "./colors";

//Exporting the styles for the PetPage screen
export default StyleSheet.create({
    //Container for the entire screen
    container: {
        flex: 1, //Making the container take up the full screen
        backgroundColor: colors.background, //Setting the background color to the background color defined in colors.js
    },
    //Container for the scroll view
    scrollContainer: {
        padding: 20, //Adding padding to the scroll view to make the content more spaced out
        paddingBottom: 80, //Padding to the bottom to make space for the navbar
    },
    //Styling for the title
    title: {
        fontSize: 24, //Setting the font size to 24
        fontWeight: "600", //Setting the font weight to 600
        color: colors.textPrimary, //Setting the colour to the primary text colour defined in colors.js
        marginBottom: 20, //Adding margin to the bottom of the title to separate it from the content
    },
    //Container for the tab container
    tabContainer: {
        flexDirection: "row", //Setting the direction of the tab container to row
        marginBottom: 20, //Adding margin to the bottom of the tab container to separate it from the content
    },
    //Styling for the tab
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },
    //Styling for the active tab
    activeTab: {
        borderBottomWidth: 4, //This will allow the bottom of the active tab to be highlighted
        borderBottomColor: colors.primary, //Setting the colour of the bottom of the active tab to the primary colour defined in colors.js
    },
    //Styling for the tab text
    tabText: {
        fontSize: 16, //Setting the font size to 16
        fontWeight: "600", //Setting the font weight to 600
        color: colors.textPrimary,
    },
    activeTabText: {
        color: colors.black,
    },
    //Container for the filter container
    filterContainer: {
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "center",
    },
    //Styling for the filter button
    filterButton: {
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.disabled,
    },
    //Styling for the active filter
    activeFilter: {
        backgroundColor: colors.primary,
    },
    //Styling for the filter text
    filterText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    //Styling for the active filter text
    activeFilterText: {
        color: colors.white,
    },
    //Styling for the pet item
    petItem: {
        alignItems: "center",
        margin: 10,
        width: "45%",
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    petImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    petName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
});
