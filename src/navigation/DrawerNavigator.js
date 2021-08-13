import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { HomeStackNavigator, ServicesStackNavigator } from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
    <NavigationContainer>
        <Drawer.Navigator>
            <Drawer.Screen name="Inicio" component={HomeStackNavigator}/>
            <Drawer.Screen name="Servicios" component={ServicesStackNavigator} />
        </Drawer.Navigator>
    </NavigationContainer>
);


export default DrawerNavigator;