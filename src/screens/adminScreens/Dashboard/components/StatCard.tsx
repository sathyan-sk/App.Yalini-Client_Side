import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, ToneKey, tones } from "../../../../theme";

export interface StatCardConfig {
  key: string;
  label: string;
  tone: ToneKey;
  icon:
    | { family: "feather"; name: keyof typeof Feather.glyphMap }
    | { family: "ion"; name: keyof typeof Ionicons.glyphMap };
}

interface StatCardProps {
  config: StatCardConfig;
  value: number;
}

export function StatCard({ config, value }: StatCardProps) {
  const tone = tones[config.tone];

  return (
    <View
      style={[styles.card, { backgroundColor: tone.cardBg }]}
      testID={`stat-card-${config.key}`}
    >
      <View style={[styles.iconCircle, { backgroundColor: tone.iconBg }]}>
        {config.icon.family === "feather" ? (
          <Feather name={config.icon.name} size={20} color={tone.accent} />
        ) : (
          <Ionicons name={config.icon.name} size={20} color={tone.accent} />
        )}
      </View>
      <Text style={styles.value} testID={`stat-card-${config.key}-value`}>
        {value}
      </Text>
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    alignItems: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
