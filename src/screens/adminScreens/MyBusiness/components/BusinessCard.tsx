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
} from "../../../../theme";
import { BUSINESS_TYPE_MAP } from "../data/constants";
import type { Business } from "../types";
import { formatDisplayDate } from "../../../../utils/format";

interface BusinessCardProps {
  business: Business;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single row card on the Businesses list.
 *
 * Layout:
 *   ┌──────┬───────────────────────────────────┬──────┐
 *   │ icon │ name / tag / location             │ edit │
 *   │ tile │                                   │ del  │ ›
 *   ├──────┴───────────────────────────────────┴──────┤
 *   │  Employees    Status (• active)    Created On   │
 *   └─────────────────────────────────────────────────┘
 *
 * Edit + Delete actions are explicit (no overflow menu) to match the
 * reference design and keep the affordances thumb-friendly.
 */
export function BusinessCard({
  business,
  onPress,
  onEdit,
  onDelete,
}: BusinessCardProps) {
  const typeMeta = BUSINESS_TYPE_MAP[business.type];
  const palette = tones[typeMeta.tone];
  const statusColor =
    business.status === "active" ? colors.success : colors.warning;
  const statusLabel = business.status === "active" ? "Active" : "Inactive";

  return (
    <Pressable
      testID={`business-card-${business.id}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${business.name}, ${typeMeta.label} business`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconTile, { backgroundColor: palette.iconBg }]}>
          <Ionicons name={typeMeta.iconName} size={26} color={palette.accent} />
        </View>

        <View style={styles.titleBlock}>
          <Text
            style={styles.name}
            numberOfLines={1}
            testID={`business-card-${business.id}-name`}
          >
            {business.name}
          </Text>
          <View style={styles.tagWrap}>
            <View style={[styles.tag, { backgroundColor: palette.iconBg }]}>
              <Text style={[styles.tagText, { color: palette.accent }]}>
                {typeMeta.tagLabel}
              </Text>
            </View>
          </View>
          {business.location ? (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.textTertiary}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {business.location}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsBlock}>
          <Pressable
            testID={`business-card-${business.id}-edit`}
            onPress={onEdit}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${business.name}`}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: "#EEF2FF" },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="edit-2" size={16} color="#4F46E5" />
          </Pressable>

          <Pressable
            testID={`business-card-${business.id}-delete`}
            onPress={onDelete}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${business.name}`}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: "#FEE2E2" },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="trash-2" size={16} color="#DC2626" />
          </Pressable>

          <Feather
            name="chevron-right"
            size={18}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricsRow}>
        <View style={styles.metricColumn}>
          <View style={styles.metricLabelRow}>
            <Ionicons
              name="people-outline"
              size={12}
              color={colors.textTertiary}
            />
            <Text style={styles.metricLabel}>Employees</Text>
          </View>
          <Text style={styles.metricValue}>{business.employees}</Text>
        </View>

        <View style={[styles.metricColumn, styles.metricDivider]}>
          <Text style={styles.metricLabel}>Status</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text
              style={[styles.statusText, { color: statusColor }]}
              testID={`business-card-${business.id}-status`}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.metricColumn, styles.metricDivider]}>
          <Text style={styles.metricLabel}>Created On</Text>
          <View style={styles.metricLabelRow}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={colors.textTertiary}
            />
            <Text style={styles.metricValue} numberOfLines={1}>
              {formatDisplayDate(business.createdAt)}
            </Text>
          </View>
        </View>
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
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.95,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  tagWrap: {
    flexDirection: "row",
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionsBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginTop: spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  metricColumn: {
    flex: 1,
    gap: 4,
  },
  metricDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
    paddingLeft: spacing.sm,
    marginLeft: spacing.sm,
  },
  metricLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  metricValue: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
