import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import PetPage from "./src/screens/PetPage";
import ShelterChats from "./src/screens/ShelterChats";
import UserDetailForm from "./src/screens/UserDetailsForm";
import UserHomeScreen from "./src/screens/UserHomePage";
import Filter from './src/screens/Filter';
import AddAnimal from "./src/screens/AddAnimal";
import UserSettings from "./src/screens/UserSettings";
import ShelterSettings from "./src/screens/ShelterSettings";

//an import for the SafeAreaProvider from react-native-safe-area-context
import { SafeAreaProvider } from "react-native-safe-area-context";


const Stack = createNativeStackNavigator();

const App = () => {
    return (
        //Navigation container is wrapped in the SafeAreaProvider to ensure that the content is displayed within the safe area of the device
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="PetPage" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="Filter" component={Filter}/>
                        <Stack.Screen name="AddAnimal" component={AddAnimal}/>
                        <Stack.Screen name="UserHome" component={UserHomeScreen} />
                        <Stack.Screen name="PetPage" component={PetPage} options={{ title: 'Pets' }} />
                        <Stack.Screen name="ShelterChats" component={ShelterChats} options={{ title: 'Chat' }} />
                        <Stack.Screen name="UserDetailForm" component={UserDetailForm} options={{ title: 'Chat Detail' }} />
                        <Stack.Screen name="UserSettings" component={UserSettings} />
                        <Stack.Screen name={"ShelterSettings"} component={ShelterSettings}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
