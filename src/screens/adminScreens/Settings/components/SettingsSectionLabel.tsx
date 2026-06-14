import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface SettingsSectionLabelProps {
  label: string;
  /** Hex colour for the small vertical accent bar drawn left of the label. */
  accentColor: string;
  testID?: string;
}

/**
 * Section divider used between groups of settings cards
 * (e.g. "BUSINESS SETUP", "ACCOUNT").
 *
 * Renders a short coloured pill on the left + uppercase tracked label.
 */
export function SettingsSectionLabel({
  label,
  accentColor,
  testID,
}: SettingsSectionLabelProps) {
  return (
    <View style={styles.row} testID={testID}>
      <View style={[styles.bar, { backgroundColor: accentColor }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  bar: {
    width: 3,
    height: 14,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.textSecondary,
  },
});