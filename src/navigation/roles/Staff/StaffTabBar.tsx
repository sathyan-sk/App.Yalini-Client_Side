/**
 * StaffTabBar — bottom tab navigator for STAFF role.
 * Mounted after staff starts their daily session.
 *
 * Tabs:
 * Home → StaffHomeScreen (session overview)
 * Deliveries → DeliveriesScreen (manage water deliveries)
 * AllDeliveries → AllDeliveriesStackNavigator (view/edit deliveries)
 * Checkout → CheckoutScreen (submit session) - Placeholder
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppTabBar, TabBarConfig } from "../../AppTabBar";
import type { StaffTabParamList } from "../../../types/navigation";
import { colors } from "../../../theme";

import StaffHomeScreen from "../../../screens/staffScreens/Home/StaffHomeScreen";
import AddDeliveryScreen from "../../../screens/staffScreens/AddDelivery/AddDeliveryScreen";

// ─────────────────────────────────────
// PLACEHOLDER SCREENS
// These will be replaced with actual screens as they are developed
// ─────────────────────────────────────

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{title}</Text>
      <Text style={styles.placeholderSubtext}>Coming Soon</Text>
    </View>
  );
}


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
