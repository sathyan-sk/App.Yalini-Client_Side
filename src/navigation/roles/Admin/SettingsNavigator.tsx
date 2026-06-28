import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../../../screens/adminScreens/Settings/SettingsScreen";
import MyBusinessScreen from "../../../screens/adminScreens/MyBusiness/MyBusinessScreen";
import EditBusinessScreen from "../../../screens/adminScreens/MyBusiness/EditBusinessScreen";
import VehiclesNavigator from "./VehiclesNavigator";
import HotelsNavigator from "./HotelsNavigator";
import AllAssignmentsScreen from "../../../screens/adminScreens/AssignAssets/AllAssignmentsScreen";
import AssignAssetScreen from "../../../screens/adminScreens/AssignAssets/AssignAssetScreen";
import type { SettingsStackParamList } from "../../../types/navigation";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

/**
 * Stack mounted under the "Settings" bottom tab.
 *
 * `Settings` is the entry point. Its rows route directly to the shipped
 * modules: the My Business CRUD flow (list → add → edit) and the Vehicles
 * module stack. The Employees row jumps to the Employees bottom tab.
 */
export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />

      <Stack.Screen name="MyBusiness" component={MyBusinessScreen} />
      <Stack.Screen
        name="EditBusiness"
        component={EditBusinessScreen}
        options={{ animation: "slide_from_right" }}
      />

      <Stack.Screen name="Vehicles" component={VehiclesNavigator} />

      <Stack.Screen name="Hotels" component={HotelsNavigator} />


      <Stack.Screen name="AssignAssets" component={AllAssignmentsScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="AssignAsset" component={AssignAssetScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
