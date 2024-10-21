import 'react-native-gesture-handler';
import { auth } from './src/services/firebaseConfig'; // Import auth from your firebaseConfig
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import React, {useEffect, useState} from "react";
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
import ShelterHomeScreen from "./src/screens/ShelterHomePage";


const Stack = createNativeStackNavigator();

const App = () => {
    const [isLoading, setIsLoading] = useState(true); // Manage loading state
    const [initialRoute, setInitialRoute] = useState('Login'); // Default route

    useEffect(() => {
        const checkUserSession = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, navigate to UserHome
                    setInitialRoute('Login');
                } else {
                    // No user is signed in, navigate to Login
                    setInitialRoute('Login');
                }
                setIsLoading(false); // Set loading to false after checking session
            });
        };

        checkUserSession();
    }, []);

    if (isLoading) {
        return null; // Or a loading spinner while checking auth state
    }

    return (
        //Navigation container is wrapped in the SafeAreaProvider to ensure that the content is displayed within the safe area of the device
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animation: 'none' }}>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="ShelterHome" component={ShelterHomeScreen}/>
                        <Stack.Screen name="UserHome" component={UserHomeScreen} />
                        <Stack.Screen name="Filter" component={Filter}/>
                        <Stack.Screen name="AddAnimal" component={AddAnimal}/>
                        <Stack.Screen name="PetPage" component={PetPage} options={{ title: 'Pets' }} />
                        <Stack.Screen name="ShelterChats" component={ShelterChats} options={{ title: 'Chat' }} />
                        <Stack.Screen name="UserDetailForm" component={UserDetailForm} options={{ title: 'Chat Detail' }} />
                        <Stack.Screen name="UserSettings" component={UserSettings} />
                        <Stack.Screen name="ShelterSettings" component={ShelterSettings}/>
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
