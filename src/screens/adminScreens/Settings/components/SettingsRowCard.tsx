import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { cardShadow, colors, fontSize, radius, spacing, tones } from "../../../../theme";
import type { SettingsRowIcon } from "../types";

interface SettingsRowCardProps {
  title: string;
  subtitle: string;
  icon: SettingsRowIcon;
  onPress: () => void;
  /**
   * Destructive variant — used for the Logout row.
   * Repaints the card background, text and chevron in the red tone.
   */
  destructive?: boolean;
  testID: string;
}

const ICON_TILE_SIZE = 56;
const ICON_SIZE = 28;

/**
 * Tappable card row used inside every settings section.
 *
 * Layout: [tinted icon tile] [title + subtitle stack] [chevron].
 * The icon tile colour is driven by `icon.tone` (see `theme.tones`),
 * keeping every row visually consistent with the rest of the app.
 */
export function SettingsRowCard({
  title,
  subtitle,
  icon,
  onPress,
  destructive = false,
  testID,
}: SettingsRowCardProps) {
  const palette = tones[icon.tone];
  const accent = destructive ? tones.red.accent : palette.accent;
  const cardBg = destructive ? tones.red.cardBg : colors.surface;
  const tileBg = destructive ? tones.red.iconBg : palette.iconBg;
  const titleColor = destructive ? tones.red.accent : "#0B1F3F";
  const chevronColor = destructive ? tones.red.accent : "#2563EB";

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      android_ripple={{ color: colors.borderLight }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBg },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: tileBg }]}>
        <Ionicons name={icon.name} size={ICON_SIZE} color={accent} />
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color={chevronColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    minHeight: 88,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.997 }],
  },
  iconTile: {
    width: ICON_TILE_SIZE,
    height: ICON_TILE_SIZE,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});