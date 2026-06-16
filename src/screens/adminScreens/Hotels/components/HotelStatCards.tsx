import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import {
  colors,
  fontSize,
  radius,
  spacing,
  tones,
  ToneKey,
} from "../../../../../src/theme";

interface HotelStatCardsProps {
  total: number;
  enabled: number;
  disabled: number;
  testID?: string;
}

interface CardConfig {
  key: string;
  value: number;
  label: string;
  tone: ToneKey;
  iconName: keyof typeof Ionicons.glyphMap;
  dotColor?: string;
}

/**
 * Three-up summary row shown above the hotels search bar.
 *
 *   [Total]  [Enabled (green dot)]  [Disabled (red dot)]
 *
 * Cards are equal width and match the design pixel-perfectly.
 */
export function HotelStatCards({
  total,
  enabled,
  disabled,
  testID,
}: HotelStatCardsProps) {
  const configs: CardConfig[] = [
    {
      key: "total",
      value: total,
      label: "Total",
      tone: "purple",
      iconName: "business",
    },
    {
      key: "enabled",
      value: enabled,
      label: "Enabled",
      tone: "green",
      iconName: "ellipse",
      dotColor: "#16A34A",
    },
    {
      key: "disabled",
      value: disabled,
      label: "Disabled",
      tone: "red",
      iconName: "ellipse",
      dotColor: "#DC2626",
    },
  ];

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.card}>
        {configs.map((c, index) => {
          const palette = tones[c.tone];
          const isLast = index === configs.length - 1;
          return (
            <React.Fragment key={c.key}>
              <View style={styles.statItem} testID={`hotel-stat-${c.key}`}>
                {c.key === "total" ? (
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: palette.iconBg },
                    ]}
                  >
                    <Ionicons
                      name={c.iconName}
                      size={20}
                      color={palette.accent}
                    />
                  </View>
                ) : (
                  <View style={styles.dotLabelRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: c.dotColor }]}
                    />
                  </View>
                )}
                <View style={styles.textBlock}>
                  <Text style={styles.label}>{c.label}</Text>
                  <Text
                    style={styles.value}
                    testID={`hotel-stat-${c.key}-value`}
                  >
                    {c.value}
                  </Text>
                </View>
              </View>
              {!isLast && <View style={styles.divider} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    justifyContent: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  dotLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  textBlock: {
    alignItems: "flex-start",
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
});
