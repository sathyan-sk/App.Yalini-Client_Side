import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, spacing } from "../../../../theme";

interface SettingsHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  testID?: string;
}

/**
 * Top-of-screen header for Settings.
 * - Oversized page title (\"Settings\")
 * - Secondary heading (\"Admin Panel\")
 * - Multi-line description copy
 *
 * Lives inside the scrollable area (not sticky) to mirror the reference design.
 */
export function SettingsHeader({
  title,
  subtitle,
  description,
  testID,
}: SettingsHeaderProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title} testID="settings-title">
        {title}
      </Text>
      <Text style={styles.subtitle} testID="settings-subtitle">
        {subtitle}
      </Text>
      <Text style={styles.description} testID="settings-description">
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#0B1F3F",
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  description: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});