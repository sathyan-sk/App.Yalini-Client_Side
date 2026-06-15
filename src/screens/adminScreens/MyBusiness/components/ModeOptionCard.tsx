import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import type { BusinessModeOption } from "../data/constants";

interface ModeOptionCardProps {
  option: BusinessModeOption;
  selected: boolean;
  onSelect: () => void;
  testID: string;
}

/**
 * Radio-card used inside the \"Business Mode\" picker.
 *
 * Each card stacks: [tinted icon tile] [title + multi-line description]
 * [radio glyph]. Selected card flips to brand border + soft brand tint.
 */
export function ModeOptionCard({
  option,
  selected,
  onSelect,
  testID,
}: ModeOptionCardProps) {
  const palette = tones[option.tone];
  const containerStyles = [
    styles.card,
    selected ? styles.cardSelected : null,
  ];

  return (
    <Pressable
      testID={testID}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        ...containerStyles,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: palette.iconBg }]}>
        <Ionicons name={option.iconName} size={22} color={palette.accent} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.description}>{option.description}</Text>
      </View>

      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={20}
        color={selected ? "#059669" : colors.textTertiary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
  },
  pressed: {
    opacity: 0.9,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
    gap: 4,
    paddingRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  description: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
