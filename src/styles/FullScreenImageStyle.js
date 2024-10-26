import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    //full screen image styles
    fullScreenContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullScreenImage: {
        width: width,
        height: height * 0.9,
        resizeMode: "contain",
    },
    closeFullScreen: {
        position: "absolute",
        top: 40,
        right: 30,
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
});
