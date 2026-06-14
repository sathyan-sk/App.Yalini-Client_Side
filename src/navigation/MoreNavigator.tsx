import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../screens/adminScreens/Settings/SettingsScreen";
import { PlaceholderScreen } from "../screens/PlaceholderScreen";
import type { MoreStackParamList } from "./types";

const Stack = createNativeStackNavigator<MoreStackParamList>();

/**
 * Stack mounted under the \"More\" bottom tab.
 *
 * Owns the `Settings` entry point and the placeholder destinations that
 * the settings rows route to (My Business, Employees Admin, Vehicles,
 * Hotels, Assign Assets). Each placeholder is replaced by its real
 * screen as soon as that feature ships.
 */
export default function MoreNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />

      <Stack.Screen name="MyBusiness">
        {() => (
          <PlaceholderScreen
            title="My Business"
            icon="briefcase"
            description="Business profile, branches and KYC details will appear here."
            testID="my-business-screen"
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EmployeesAdmin">
        {() => (
          <PlaceholderScreen
            title="Employees"
            icon="users"
            description="Add, view and manage employees from this screen."
            testID="employees-admin-screen"
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Vehicles">
        {() => (
          <PlaceholderScreen
            title="Vehicles"
            icon="truck"
            description="Vehicle inventory, RC details and assignments will appear here."
            testID="vehicles-screen"
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Hotels">
        {() => (
          <PlaceholderScreen
            title="Hotels"
            icon="home"
            description="Manage hotel listings, addresses and staffing from here."
            testID="hotels-screen"
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="AssignAssets">
        {() => (
          <PlaceholderScreen
            title="Assign Assets"
            icon="repeat"
            description="Assign vehicles to drivers and hotels to staff from here."
            testID="assign-assets-screen"
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}