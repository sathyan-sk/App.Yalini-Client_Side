/**
 * Driver module navigator — placeholder until the Driver experience ships.
 *
 * The Login flow currently blocks driver logins with a toast and never
 * routes here, but the component exists so the role-based switch in
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PlaceholderScreen } from "../../../screens/PlaceholderScreen";

const Stack = createNativeStackNavigator();

function DriverHome() {
  return (
    <PlaceholderScreen
      title="Driver"
      icon="truck"
      description="The Driver module is coming soon."
      testID="driver-placeholder"
    />
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={DriverHome} />
    </Stack.Navigator>
  );
}
