/**
 * Stack navigator for the Vehicles module.
 *
 * Provides navigation between:
 * - AllVehicles (list view with stats, search, filters)
 * - AddVehicle (form to add new vehicle)
 * - EditVehicle (form to edit existing vehicle)
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AllVehiclesScreen from "../../../screens/adminScreens/vehicles/AllVehiclesScreen";
import AddVehicleScreen from "../../../screens/adminScreens/vehicles/AddVehicleScreen";
import EditVehicleScreen from "../../../screens/adminScreens/vehicles/EditVehicleScreen";

export type VehiclesStackParamList = {
  AllVehicles: undefined;
  AddVehicle: undefined;
  EditVehicle: { vehicleId: string };
};

const Stack = createNativeStackNavigator<VehiclesStackParamList>();

export default function VehiclesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllVehicles" component={AllVehiclesScreen} />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EditVehicle"
        component={EditVehicleScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}