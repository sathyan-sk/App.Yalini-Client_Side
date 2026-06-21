/**
 * StaffTabBar — bottom tab navigator for STAFF role.
 * Mounted after staff starts their daily session.
 *
 * Tabs:
 * Home → StaffHomeScreen (session overview)
 * AddDelivery → AddDeliveryScreen (record water deliveries)
 * AllDeliveries → AllDeliveriesStackNavigator (view/edit deliveries)
 * Checkout → StaffCheckoutScreen (submit session)
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppTabBar, TabBarConfig } from "../../AppTabBar";
import type { StaffTabParamList } from "../../../types/navigation";
import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

import StaffHomeScreen from "../../../screens/staffScreens/Home/StaffHomeScreen";
import AddDeliveryScreen from "../../../screens/staffScreens/AddDelivery/AddDeliveryScreen";
import AllDeliveriesStackNavigator from "./AllDeliveriesStackNavigator";
import StaffCheckoutScreen from "../../../screens/staffScreens/Checkout/StaffCheckoutScreen";


// ─────────────────────────────────────
// STAFF TAB CONFIG
// ─────────────────────────────────────
const STAFF_TAB_CONFIG: TabBarConfig = {
  StaffHome: { label: "Home", icon: "home" },
  AddDelivery: { label: "Add Delivery", icon: "plus-circle" },
  AllDeliveries: { label: "All Deliveries", icon: "list" },
  StaffCheckout: { label: "Checkout", icon: "check-square" },
};

const Tab = createBottomTabNavigator<StaffTabParamList>();

export default function StaffTabBar() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppTabBar {...props} tabConfig={STAFF_TAB_CONFIG} />
      )}
    >
    <Tab.Screen name="StaffHome" component={StaffHomeScreen} />
    <Tab.Screen name="AddDelivery" component={AddDeliveryScreen} />
    <Tab.Screen name="AllDeliveries" component={AllDeliveriesStackNavigator} />
    <Tab.Screen name="StaffCheckout" component={StaffCheckoutScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
