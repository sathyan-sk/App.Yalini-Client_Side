import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import { BUSINESS_TYPE_MAP } from "../data/constants";
import type { BusinessTypeId } from "../types";

interface TypeSelectorCardProps {
  typeId: BusinessTypeId;
  selected: boolean;
  onSelect: () => void;
  testID: string;
}

/**
 * Single radio-card used in the Add Business \"Business Type\" picker.
 *
 * - Selected → 2px brand border + soft brand tint background.
 * - Unselected → 1px neutral border on white.
 * The actual icon tile colour is driven by the type's tone (theme.tones).
 */
export function TypeSelectorCard({
  typeId,
  selected,
  onSelect,
  testID,
}: TypeSelectorCardProps) {
  const option = BUSINESS_TYPE_MAP[typeId];
  const palette = tones[option.tone];

  return (
    <Pressable
      testID={testID}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: palette.iconBg }]}>
        <Ionicons name={option.iconName} size={22} color={palette.accent} />
      </View>
      <Text style={styles.label}>{option.label}</Text>
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={20}
        color={selected ? colors.brand : colors.textTertiary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  pressed: {
    opacity: 0.85,
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