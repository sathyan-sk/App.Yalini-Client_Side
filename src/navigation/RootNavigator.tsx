/**
 * RootNavigator — the top-level navigator that handles authentication routing.
 *
 * Lifecycle:
 *   1. On mount, calls `bootstrap()` to restore any persisted session.
 *   2. While booting, shows a loading state.
 *   3. Once bootstrapped:
 *      - If unauthenticated → shows LoginScreen
 *      - If authenticated → routes to the correct module based on user.role:
 *        - ADMIN  → AdminNavigator
 *        - DRIVER → DriverNavigator  
 *        - STAFF  → StaffNavigator
 *
 * This navigator wraps React Navigation inside expo-router using
 * NavigationIndependentTree to avoid conflicts with expo-router's
 * internal navigator.
 */
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "../store/authStore";
import LoginScreen from "../screens/auth/loginScreen/LoginScreen";
import AdminNavigator from "./roles/Admin/AdminNavigator";
import DriverNavigator from "./roles/Driver/DriverNavigator";
import StaffNavigator from "./roles/Staff/StaffNavigator";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();

/** Loading screen shown while restoring session */
function BootingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  );
}

/** Select the correct navigator based on the user's role */
function RoleBasedNavigator() {
  const role = useAuthStore((s) => s.user?.role);

  switch (role) {
    case "ADMIN":
      return <AdminNavigator />;
    case "DRIVER":
      return <DriverNavigator />;
    case "STAFF":
      return <StaffNavigator />;
  }
}

export default function RootNavigator() {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  // Bootstrap auth on mount
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Show loading while bootstrapping
  if (status === "booting") {
    return <BootingScreen />;
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {status === "unauthenticated" ? (
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ animationTypeForReplace: "pop" }}
            />
          ) : (
            <Stack.Screen 
              name="Main" 
              component={RoleBasedNavigator}
              options={{ animationTypeForReplace: "push" }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});
