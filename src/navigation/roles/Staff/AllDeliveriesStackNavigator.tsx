/**
 * AllDeliveriesStackNavigator - Stack navigator for AllDeliveries flow in Staff module.
 * 
 * Flow:
 *   AllDeliveriesList → View all saved deliveries
 *   EditPreview → View/Edit delivery details
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AllDeliveriesStackParamList } from "../../../types/navigation";

import AllDeliveriesScreen from "../../../screens/staffScreens/AllDeliveries/AllDeliveriesScreen";
import EditPreviewScreen from "../../../screens/staffScreens/EditPreview/EditPreviewScreen";

const Stack = createNativeStackNavigator<AllDeliveriesStackParamList>();

export default function AllDeliveriesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="AllDeliveriesList" 
        component={AllDeliveriesScreen} 
      />
      <Stack.Screen 
        name="EditPreview" 
        component={EditPreviewScreen} 
      />
    </Stack.Navigator>
  );
}
