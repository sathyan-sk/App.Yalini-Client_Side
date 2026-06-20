/**
* DriverTabNavigator — bottom tab navigator for DRIVER role.
 * Mounted after driver starts their daily session.
 *
 * Tabs:
 * Home → DriverHomeScreen (session overview)
 * AddTrip → AddTripScreen (add new trip)
 * AllTrips → AllTripsScreen (view all trips) - Placeholder
 * Checkout → CheckoutScreen (submit session) - Placeholder
 */

import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppTabBar, TabBarConfig } from "../../AppTabBar"
import type { DriverTabParamList } from "../../../types/navigation"

import DriverHomeScreen from "../../../screens/driverScreens/Home/DriverHomeScreen"
import AddTripScreen from "../../../screens/driverScreens/AddTrip/AddTripScreen"
import AllTripsScreen from "@/screens/driverScreens/AllTrips/AllTripsScreen"
import AddExpenseScreen from "../../../screens/driverScreens/AddExpense/AddExpenseScreen"

// ─────────────────────────────────────
// DRIVER TAB CONFIG
// ─────────────────────────────────────
const DRIVER_TAB_CONFIG: TabBarConfig = {
  DriverHome: { label: "Home",      icon: "home"         },
  AddTrip:    { label: "Add Trip",  icon: "plus-circle"  },
  AddExpense: { label: "Add Expense", icon: "dollar-sign"  },
  AllTrips:   { label: "All Trips", icon: "list"         },
  Checkout:   { label: "Checkout",  icon: "check-square" },
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
      <Tab.Screen name="DriverHome" component={DriverHomeScreen} />
      <Tab.Screen name="AddTrip"    component={AddTripScreen}    />
      <Tab.Screen name={"AddExpense" as keyof DriverTabParamList} component={AddExpenseScreen} />
      <Tab.Screen name="AllTrips"   component={AllTripsScreen} />
    </Tab.Navigator>
  )
}