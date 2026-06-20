/**
 * AllTripsStackNavigator - Stack navigator for AllTrips flow
 * 
 * Flow:
 *   AllTripsList → View all trips
 *   EditPreview → View/Edit trip details
 *   AddExpenseForTrip → Add/Edit expense for a specific trip
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AllTripsStackParamList } from "../../../types/navigation";

import AllTripsScreen from "../../../screens/driverScreens/AllTrips/AllTripsScreen";
import EditPreviewScreen from "../../../screens/driverScreens/EditPreview/EditPreviewScreen";
import AddExpenseScreen from "../../../screens/driverScreens/AddExpense/AddExpenseScreen";

const Stack = createNativeStackNavigator<AllTripsStackParamList>();

export default function AllTripsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="AllTripsList" 
        component={AllTripsScreen} 
      />
      <Stack.Screen 
        name="EditPreview" 
        component={EditPreviewScreen} 
      />
      <Stack.Screen 
        name="AddExpenseForTrip" 
        component={AddExpenseScreen} 
      />
    </Stack.Navigator>
  );
}
