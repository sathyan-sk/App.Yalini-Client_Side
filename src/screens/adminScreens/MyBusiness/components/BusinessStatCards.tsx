import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones, ToneKey } from "../../../../theme";

interface BusinessStatCardsProps {
  total: number;
  active: number;
  disabled: number;
  testID?: string;
}

interface CardConfig {
  key: string;
  value: number;
  label: string;
  tone: ToneKey;
  iconName: keyof typeof Ionicons.glyphMap;
}

/**
 * Three-up summary row shown above the businesses search bar.
 *
 *   [Total Businesses]  [Active]  [Disabled]
 *
 * Cards are equal width and clip cleanly within the row. The tones come
 * straight from `theme.tones` so they match every other surface in the app.
 */
export function BusinessStatCards({
  total,
  active,
  disabled,
  testID,
}: BusinessStatCardsProps) {
  const configs: CardConfig[] = [
    {
      key: "total",
      value: total,
      label: "Total Businesses",
      tone: "purple",
      iconName: "storefront",
    },
    {
      key: "active",
      value: active,
      label: "Active",
      tone: "green",
      iconName: "checkmark-circle",
    },
    {
      key: "disabled",
      value: disabled,
      label: "Disabled",
      tone: "orange",
      iconName: "close-circle",
    },
  ];

  return (
    <View style={styles.row} testID={testID}>
      {configs.map((c) => {
        const palette = tones[c.tone];
        return (
          <View
            key={c.key}
            style={[styles.card, { backgroundColor: palette.cardBg }]}
            testID={`business-stat-${c.key}`}
          >
            <View
              style={[styles.iconCircle, { backgroundColor: palette.iconBg }]}
            >
              <Ionicons name={c.iconName} size={18} color={palette.accent} />
            </View>
            <View style={styles.textBlock}>
              <Text
                style={styles.value}
                testID={`business-stat-${c.key}-value`}
              >
                {c.value}
              </Text>
              <Text style={styles.label} numberOfLines={1}>
                {c.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 72,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
