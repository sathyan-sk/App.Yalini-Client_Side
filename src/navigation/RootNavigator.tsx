import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import { AppTabBar } from "./AppTabBar";
import type { RootTabParamList } from "./types";
import DashboardScreen from "../screens/adminScreens/Dashboard/DashboardScreen";
import EmployeesNavigator from "./EmployeesNavigator";
import SettingsNavigator from "./SettingsNavigator";
import DailyRecordsNavigator from "./DailyRecordsNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();
/**
 * App navigation root, built entirely with React Navigation (bottom tabs +
 * nested native stacks).

 * Tabs: Dashboard · Daily Records · Finance · Employees · Settings.
 * (Vehicles and My Business are reachable from inside the Settings tab.)
 */
export default function RootNavigator() {
  return (
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
        tabBar={(props) => <AppTabBar {...props} />}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="DailyRecords" component={DailyRecordsNavigator} />
          <Tab.Screen name="Employees" component={EmployeesNavigator} />
          <Tab.Screen name="Settings" component={SettingsNavigator} />
          
        </Tab.Navigator>
      </NavigationContainer>
  );
}
