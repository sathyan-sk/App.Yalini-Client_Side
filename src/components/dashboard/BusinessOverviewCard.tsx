import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import {
  cardShadow,
  colors,
  fontSize,
  radius,
  spacing,
  tones,
} from "../../theme";
import type { BusinessOverview, MetricColor } from "../../types/dashboard";
import { formatINR } from "../../utils/format";

const METRIC_COLORS: Record<MetricColor, string> = {
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
};

interface BusinessOverviewCardProps {
  business: BusinessOverview;
  onPress: () => void;
}

export function BusinessOverviewCard({
  business,
  onPress,
}: BusinessOverviewCardProps) {
  const tone = tones[business.tone];

  return (
    <Pressable
      testID={`business-card-${business.id}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconTile, { backgroundColor: tone.iconBg }]}>
          {business.icon.family === "feather" ? (
            <Feather name={business.icon.name} size={22} color={tone.accent} />
          ) : (
            <Ionicons name={business.icon.name} size={22} color={tone.accent} />
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {business.name}
        </Text>
        <View style={[styles.tag, { backgroundColor: tone.iconBg }]}>
          <Text style={[styles.tagText, { color: tone.accent }]}>
            {business.category}
          </Text>
        </View>
        <View style={styles.spacer} />
        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
      </View>

      <View style={styles.metricsRow}>
        {business.metrics.map((metric, index) => (
          <View
            key={metric.label}
            style={[styles.metricColumn, index > 0 && styles.metricDivider]}
          >
            <Text style={styles.metricLabel} numberOfLines={2}>
              {metric.label}
            </Text>
            <Text
              style={[styles.metricValue, { color: METRIC_COLORS[metric.color] }]}
              numberOfLines={1}
            >
              {"\u20B9"} {formatINR(metric.amount)}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    flexShrink: 1,
  },
  tag: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: "500",
  },
  spacer: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
  },
  metricColumn: {
    flex: 1,
    paddingRight: spacing.sm,
    gap: spacing.xs,
  },
  metricDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: spacing.md,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
});
