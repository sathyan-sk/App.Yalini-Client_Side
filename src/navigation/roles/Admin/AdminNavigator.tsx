/**
 * AdminNavigator — bottom tab navigator for ADMIN role.
 *
 * Tabs:
 *   Dashboard   → DashboardScreen
 *   DailyRecords → RecordsNavigator
 *   Employees   → EmployeesNavigator
 *   Settings    → SettingsNavigator
 */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { AppTabBar, TabBarConfig } from "../../AppTabBar"
import type { RootTabParamList } from "../../../../src/types/navigation"

import DashboardScreen    from "../../../screens/adminScreens/Dashboard/DashboardScreen"
import RecordsNavigator   from "./RecordsNavigator"
import EmployeesNavigator from "./EmployeesNavigator"
import SettingsNavigator  from "./SettingsNavigator"

// ─────────────────────────────────────
// TAB CONFIG — Admin owns this
// ─────────────────────────────────────
const ADMIN_TAB_CONFIG: TabBarConfig = {
  Dashboard:    { label: "Dashboard", icon: "home"      },
  DailyRecords: { label: "Records",   icon: "file-text" },
  Employees:    { label: "Employees", icon: "users"     },
  Settings:     { label: "Settings",  icon: "settings"  },
}

const Tab = createBottomTabNavigator<RootTabParamList>()

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppTabBar
          {...props}
          tabConfig={ADMIN_TAB_CONFIG}
        />
      )}
    >
      <Tab.Screen name="Dashboard"    component={DashboardScreen} />
      <Tab.Screen name="DailyRecords" component={RecordsNavigator} />
      <Tab.Screen name="Employees"    component={EmployeesNavigator} />
      <Tab.Screen name="Settings"     component={SettingsNavigator} />
    </Tab.Navigator>
  )
}