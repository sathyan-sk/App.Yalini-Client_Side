import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface EmptyBusinessStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
  testID?: string;
}

/**
 * Empty-state surface for the Businesses list.
 *
 * Two messages:
 *  - \"No businesses match your filters\" → shows a \"Clear filters\" CTA.
 *  - \"No businesses yet\"                → shows the primary \"Add Business\" CTA.
 *
 * Always rendered inside the scrollable area, never as a sticky overlay.
 */
export function EmptyBusinessState({
  hasFilters,
  onClearFilters,
  testID,
}: EmptyBusinessStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconCircle}>
        <Ionicons name="storefront-outline" size={32} color="#4F46E5" />
      </View>
      <Text style={styles.title}>
        {hasFilters ? "No businesses match" : "No businesses found"}
      </Text>
      <Text style={styles.body}>
        {hasFilters
          ? "Try a different status or clear the search query to see all businesses."
          : "Businesses are pre-configured. Contact administrator if you need assistance."}
      </Text>
      {hasFilters && onClearFilters ? (
        <Pressable
          testID="empty-clear-filters"
          onPress={onClearFilters}
          style={({ pressed }) => [
            styles.ghostButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.ghostText}>Clear filters</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  body: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  ghostButton: {
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  ghostText: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
