import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import UserHomeScreen from "./src/screens/UserHomePage";
import Filter from './src/screens/Filter';
import AddAnimal from "./src/screens/AddAnimal";
import UserSettings from "./src/screens/UserSettings";
import ShelterSettings from "./src/screens/ShelterSettings";


const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Filter" component={Filter}/>
                    <Stack.Screen name="AddAnimal" component={AddAnimal}/>
                    <Stack.Screen name="UserHome" component={UserHomeScreen} />
                    <Stack.Screen name="UserSettings" component={UserSettings} />
                    <Stack.Screen name={"ShelterSettings"} component={ShelterSettings}/>
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;