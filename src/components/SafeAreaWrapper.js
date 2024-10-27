//Class that is needed for devices that have notches or Rounded corners. (Especially newer IOS devices)
//Mainly cause my device was not having it and the content was getting cut off

import React from "react";
//importing the SafeAreaView, StatusBar and View from react-native
import { SafeAreaView, StatusBar, View } from "react-native";
//Getting the insets for the screen
import { useSafeAreaInsets } from "react-native-safe-area-context";
//importing the colours from the colors file
import colors from "../styles/colors";

const SafeAreaWrapper = ({ children, style }) => {
    const insets = useSafeAreaInsets(); //Getting the insets for the screen

    return (
        // This is the main container that takes the full width and height of the screen
        <View
            style={{
                flex: 1,//Flex is used for full width and height of the screen
                paddingTop: insets.top, //Padding top is used for the top of the screen
                backgroundColor: colors.background, //Background color is used for the background of the screen
            }}
        >
            {/* This is make the status bar transparent */}
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            {/* This makes the children (content of the screen) make use of the full width and height of the screen to fit the screen content */}
            <SafeAreaView style={[{ flex: 1 }, style]}>{children}</SafeAreaView>
        </View>
    );
};

export default SafeAreaWrapper;
