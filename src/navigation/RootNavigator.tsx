import React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import { AppTabBar } from "./AppTabBar";
import type { RootTabParamList } from "./types";
import DashboardScreen from "../screens/adminScreens/Dashboard/DashboardScreen";
import EmployeesNavigator from "./EmployeesNavigator";
import SettingsNavigator from "./SettingsNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();



/**
 * App navigation root, built entirely with React Navigation (bottom tabs +
 * nested native stacks).
 *
 * Wrapped in NavigationIndependentTree + NavigationContainer so it owns the
 * navigation state completely and stays decoupled from the thin expo-router
 * entry shell that boots the project.
 *
 * Tabs: Dashboard · Daily Records · Finance · Employees · Settings.
 * (Vehicles and My Business are reachable from inside the Settings tab.)
 */
export default function RootNavigator() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <AppTabBar {...props} />}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          {/* <Tab.Screen name="DailyRecords" component={DailyRecordsScreen} />
          <Tab.Screen name="Finance" component={FinanceScreen} /> */}
          <Tab.Screen name="Employees" component={EmployeesNavigator} />
          <Tab.Screen name="Settings" component={SettingsNavigator} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
