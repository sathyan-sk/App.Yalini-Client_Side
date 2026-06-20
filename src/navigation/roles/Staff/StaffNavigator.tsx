/**
 * StaffNavigator — bottom tab navigator for STAFF role.
 *
 * Tabs:
 *   Home     → StaffHomeScreen     (session status + cans summary)
 *   Delivery → DeliveryNavigator   (list + add + edit deliveries)
 *   Expense  → ExpenseNavigator    (list + add expense entries)
 *   Checkout → CheckoutScreen      (balance summary + submit session)
 */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { AppTabBar, TabBarConfig } from "@/src/navigation/AppTabBar"
import type { StaffTabParamList } from "@/src/types/navigation"

import StaffHomeScreen   from "@/src/screens/staffScreens/Home/StaffHomeScreen"
import CheckoutScreen    from "@/src/screens/staffScreens/Checkout/CheckoutScreen"
import DeliveryNavigator from "./DeliveryNavigator"
import ExpenseNavigator  from "./ExpenseNavigator"

// ─────────────────────────────────────
// STAFF TAB CONFIG
// ─────────────────────────────────────
const STAFF_TAB_CONFIG: TabBarConfig = {
  StaffHome:      { label: "Home",     icon: "home"         },
  StaffDelivery:  { label: "Delivery", icon: "package"      },
  StaffExpense:   { label: "Expense",  icon: "credit-card"  },
  StaffCheckout:  { label: "Checkout", icon: "check-circle" },
}

const Tab = createBottomTabNavigator<StaffTabParamList>()

export default function StaffNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppTabBar
          {...props}
          tabConfig={STAFF_TAB_CONFIG}
        />
      )}
    >
      <Tab.Screen name="StaffHome"      component={StaffHomeScreen}   />
      <Tab.Screen name="StaffDelivery"  component={DeliveryNavigator} />
      <Tab.Screen name="StaffExpense"   component={ExpenseNavigator}  />
      <Tab.Screen name="StaffCheckout"  component={CheckoutScreen}    />
    </Tab.Navigator>
  )
}
