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
import { PlaceholderScreen } from "../screens/PlaceholderScreen";
import MoreNavigator from "./MoreNavigator";
import EmployeesNavigator from "./EmployeesNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * App navigation root, built with React Navigation (bottom tabs).
 * Wrapped in NavigationIndependentTree so it owns navigation entirely,
 * independent of the expo-router shell that boots the project.
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
          <Tab.Screen name="DailyRecords">
            {() => (
              <PlaceholderScreen
                title="Daily Records"
                icon="calendar"
                description="Daily logs and operational records will appear here."
                testID="daily-records-screen"
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Finance">
            {() => (
              <PlaceholderScreen
                title="Finance"
                icon="credit-card"
                description="Financial reports and the ledger will appear here."
                testID="finance-screen"
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Employees" component={EmployeesNavigator} />
          <Tab.Screen name="More">
            {() => (
              <MoreNavigator />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}