import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AppTabBar } from "./AppTabBar";
import type { RootTabParamList } from "../types/navigation";
import DashboardScreen from "../screens/adminScreens/Dashboard/DashboardScreen";
import EmployeesNavigator from "./EmployeesNavigator";
import SettingsNavigator from "./SettingsNavigator";
import RecordsNavigator from "./RecordsNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * App navigation root, built entirely with React Navigation (bottom tabs +
 * nested native stacks).
 *
 * Tabs: Dashboard | Daily Records | Employees | Settings
 * 
 * Each tab that needs nested screens has its own Stack Navigator:
 * - Dashboard: Single screen
 * - DailyRecords: RecordsNavigator (RecordsHome, TaxiRecordDetails, WaterRecordDetails)
 * - Employees: EmployeesNavigator
 * - Settings: SettingsNavigator
 */
export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="DailyRecords" component={RecordsNavigator} />
      <Tab.Screen name="Employees" component={EmployeesNavigator} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}