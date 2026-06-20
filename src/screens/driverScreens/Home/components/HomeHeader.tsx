/**
 * HomeHeader - Dark navy header with avatar, greeting, and notification bell
 * Pixel-perfect match to design specifications
 */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, spacing } from "../../../../theme";

interface HomeHeaderProps {
  driverName: string;
  greeting: string;
  notificationCount: number;
  onNotificationPress?: () => void;
}

const HEADER_BG = colors.headerDark;

export function HomeHeader({
  driverName,
  greeting,
  notificationCount,
  onNotificationPress,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  // Extract first name from full name
  const firstName = driverName.split(" ")[0];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            insets.top > 0
              ? insets.top + spacing.sm
              : Platform.OS === "android"
              ? (StatusBar.currentHeight || 24) + spacing.sm
              : spacing.lg,
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Feather name="user" size={28} color="#FFFFFF" />
        </View>

        {/* Greeting Text */}
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            {greeting}, {firstName}!
          </Text>
          <Text style={styles.subtitle}>Have a safe and productive day</Text>
        </View>

        {/* Notification Bell */}
        <Pressable
          onPress={onNotificationPress}
          style={({ pressed }) => [
            styles.notificationButton,
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Feather name="bell" size={24} color="#FFFFFF" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? "9+" : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_BG,
    paddingBottom: spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
  },
  notificationButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF5252",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
