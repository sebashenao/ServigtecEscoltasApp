import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import RestorePasswordScreen from './RestorePasswordScreen';
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

const screenOptionStyle = {
    headerStyle: {
        backgroundColor: "#315993",
    },
    headerTintColor: "white",
    headerBackTitle: "Back",
};

const RootStackScreen = () => {
    return (
        <NavigationContainer>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Navigator initialRouteName="Login" screenOptions={screenOptionStyle}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Recuperar Contraseña" component={RestorePasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default RootStackScreen;