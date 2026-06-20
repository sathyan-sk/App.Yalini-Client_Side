/**
 * DriverTabNavigator — bottom tab navigator for DRIVER role.
 * Mounted after driver starts their daily session.
 *
 * Tabs:
 *   Home     → DriverHomeScreen   (session overview)
 *   Income   → IncomeNavigator    (list + add income)
 *   Expense  → ExpenseNavigator   (list + add expense)
 *   Checkout → CheckoutScreen     (submit session)
 */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { AppTabBar, TabBarConfig } from "../../AppTabBar"
import type { DriverTabParamList } from "../../../types/navigation"

import DriverHomeScreen from "../../../screens/driverScreens/Home/DriverHomeScreen"

// ─────────────────────────────────────
// DRIVER TAB CONFIG
// ─────────────────────────────────────
const DRIVER_TAB_CONFIG: TabBarConfig = {
  DriverHome:     { label: "Home",     icon: "home"          },
  AddTrip:   { label: "Add Trip",   icon: "plus-circle"   },
  AllTrips:  { label: "All Trips",  icon: "list" },
  Checkout: { label: "Checkout", icon: "check-circle"  },
}

const Tab = createBottomTabNavigator<DriverTabParamList>()

export default function DriverTabBar() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppTabBar
          {...props}
          tabConfig={DRIVER_TAB_CONFIG}
        />
      )}
    >
      <Tab.Screen name="DriverHome"     component={DriverHomeScreen} />
    </Tab.Navigator>
  )
}