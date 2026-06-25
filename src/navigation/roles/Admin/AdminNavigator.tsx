/**
 * AdminNavigator — bottom tab navigator for ADMIN role.
 *
 * Tabs:
 *   Dashboard   → DashboardScreen
 *   DailyRecords → RecordsNavigator
 *   Finance     → FinanceNavigator
 *   Settings    → SettingsNavigator
 */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { AppTabBar, TabBarConfig } from "../../AppTabBar"
import type { RootTabParamList } from "../../../../src/types/navigation"

import DashboardScreen    from "../../../screens/adminScreens/Dashboard/DashboardScreen"
import RecordsNavigator   from "./RecordsNavigator"
import FinanceNavigator   from "./FinanceNavigator"
import EmployeesNavigator from "./EmployeesNavigator"
import SettingsNavigator  from "./SettingsNavigator"

// ─────────────────────────────────────
// TAB CONFIG — Admin owns this
// ─────────────────────────────────────
const ADMIN_TAB_CONFIG: TabBarConfig = {
  Dashboard:    { label: "Dashboard", icon: "home"      },
  DailyRecords: { label: "Records",   icon: "hard-drive" },
  Finance:      { label: "Finance",   icon: "file-text" },
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
      <Tab.Screen name="Finance"      component={FinanceNavigator} />
      <Tab.Screen name="Employees"    component={EmployeesNavigator} />
      <Tab.Screen name="Settings"     component={SettingsNavigator} />
    </Tab.Navigator>
  )
}