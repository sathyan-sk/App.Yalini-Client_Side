import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface BusinessListHeaderProps {
  onMenuPress: () => void;
  onAddPress: () => void;
  testID?: string;
}

/**
 * Top-of-screen header for the Businesses list.
 *
 * - Left: hamburger menu (forwards to drawer/back).
 * - Middle: large \"Businesses\" title + supporting subtitle.
 * - Right: pill-shaped \"+ Add Business\" primary CTA.
 *
 * Lives inside the sticky header zone, NOT the scrollable content, so the
 * primary CTA stays reachable while the list scrolls.
 */
export function BusinessListHeader({
  onMenuPress,
  onAddPress,
  testID,
}: BusinessListHeaderProps) {
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.leftBlock}>
        <Pressable
          testID="businesses-menu-button"
          onPress={onMenuPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to settings"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Feather name="menu" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title} testID="businesses-title">
            Businesses
          </Text>
          <Text style={styles.subtitle}>Manage your businesses</Text>
        </View>
      </View>

      <Pressable
        testID="businesses-add-button"
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="Add a new business"
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Ionicons name="add" size={18} color="#FFFFFF" />
        <Text style={styles.addLabel}>Add Business</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  leftBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  titleBlock: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800",
    color: "#0B1F3F",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#4F46E5",
  },
  addLabel: {
    color: "#FFFFFF",
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
