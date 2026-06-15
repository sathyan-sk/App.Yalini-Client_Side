import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import { BUSINESS_TYPE_MAP } from "../data/constants";
import type { BusinessTypeId } from "../types";

interface TypeDisplayCardProps {
  typeId: BusinessTypeId;
  testID?: string;
}

/**
 * Read-only \"Business Type\" tile rendered on the Edit screen.
 *
 * The selected type is locked once a business is created — switching type
 * would invalidate all downstream assignments (vehicles, hotels). The card
 * surfaces the locked value with a soft tint matching the type's tone.
 */
export function TypeDisplayCard({ typeId, testID }: TypeDisplayCardProps) {
  const option = BUSINESS_TYPE_MAP[typeId];
  const palette = tones[option.tone];

  return (
    <View
      style={[styles.card, { backgroundColor: colors.brandSoft }]}
      testID={testID}
    >
      <View style={[styles.iconTile, { backgroundColor: palette.iconBg }]}>
        <Ionicons name={option.iconName} size={22} color={palette.accent} />
      </View>
      <Text style={styles.label}>{option.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
