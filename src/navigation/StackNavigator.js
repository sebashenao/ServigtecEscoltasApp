import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';

import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import ControlPointScreen from "../screens/ControlPointScreen";
import MapScreen from "../screens/MapScreen";
import NovedadesScreen from "../screens/NovedadesScreen";
import ReportesScreen from "../screens/ReportesScreen";

const Stack = createStackNavigator();

const screenOptionStyle = {
    headerStyle: {
        backgroundColor: "#315993",
    },
    headerTintColor: "white",
    headerBackTitle: "Back",
};

const HomeStackNavigator = ({ navigation }) => (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
            name="Mi Cuenta"
            component={HomeScreen}
            options={{
                headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }}>
                        <FontAwesome
                            onPress={() => navigation.openDrawer()}
                            name="bars"
                            color="#fff"
                            size={20}
                        />
                    </TouchableOpacity>

                ),
            }}
        />
    </Stack.Navigator>
)

const ServicesStackNavigator = ({ navigation }) => (
    <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
            name="Servicios"
            component={ServicesScreen}
            options={{
                headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: 15 }}>
                        <FontAwesome
                            onPress={() => navigation.openDrawer()}
                            name="bars"
                            color="#fff"
                            size={20}
                        />
                    </TouchableOpacity>
                ),
            }}
        />
        <Stack.Screen name="Servicio" component={ControlPointScreen} />
        <Stack.Screen name="Mapa" component={MapScreen} />
        <Stack.Screen name="Novedades" component={NovedadesScreen} />
        <Stack.Screen name="Reportes" component={ReportesScreen} />
    </Stack.Navigator>
)

export {
    HomeStackNavigator,
    ServicesStackNavigator
};