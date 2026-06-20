import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EmployeesScreen from "../../../screens/adminScreens/Employees/EmployeesScreen";
import AddEmployeeScreen from "../../../screens/adminScreens/Employees/AddEmployeeScreen";
import EditEmployeeScreen from "../../../screens/adminScreens/Employees/EditEmployeeScreen";
import type { EmployeesStackParamList } from "../../../types/navigation";

const Stack = createNativeStackNavigator<EmployeesStackParamList>();

/**
 * Stack mounted under the \"Employees\" bottom tab.
 *
 * Owns the EmployeesList entry point and Add/Edit screens for full CRUD.
 */
export default function EmployeesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeesList" component={EmployeesScreen} />
      <Stack.Screen
        name="AddEmployee"
        component={AddEmployeeScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EditEmployee"
        component={EditEmployeeScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
