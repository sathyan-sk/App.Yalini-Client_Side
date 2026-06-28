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
} from "../../../../../src/theme";
import type { Hotel } from "../types";

interface HotelCardProps {
  hotel: Hotel;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single row card on the Hotels list.
 *
 * Layout:
 *   ┌──────┬─────────────────────────────┬─────────┐
 *   │ icon │ name + rate per can         │ status  │
 *   │ tile │                             │ badge   │
 *   ├──────┴─────────────────────────────┴─────────┤
 *   │            [Edit]    [Delete]                │
 *   └─────────────────────────────────────────────┘
 */
export function HotelCard({ hotel, onPress, onEdit, onDelete }: HotelCardProps) {
  const palette = tones.green;
  const statusColor = hotel.status === "enabled" ? colors.success : colors.warning;
  const statusLabel = hotel.status === "enabled" ? "Enabled" : "Disabled";
  const statusBgColor =
    hotel.status === "enabled" ? colors.successSoft : colors.warningSoft;

  return (
    <Pressable
      testID={`hotel-card-${hotel.id}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${hotel.name}, ₹${hotel.ratePerCan} per can`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconTile, { backgroundColor: palette.iconBg }]}>
          <Ionicons name="business" size={28} color={palette.accent} />
        </View>

        <View style={styles.titleBlock}>
          <Text
            style={styles.name}
            numberOfLines={1}
            testID={`hotel-card-${hotel.id}-name`}
          >
            {hotel.name}
          </Text>
          <View style={styles.rateRow}>
            <View style={styles.rateBadge}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <Text style={styles.rateValue}>{hotel.ratePerCan}</Text>
            </View>
            <Text style={styles.perCanText}>per can</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text
            style={[styles.statusText, { color: statusColor }]}
            testID={`hotel-card-${hotel.id}-status`}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Outstanding Cans Section */}
      {hotel.outstandingCans !== undefined && hotel.outstandingCans > 0 && (
        <View style={styles.pendingSection}>
          <View style={styles.pendingBadge}>
            <Ionicons name="cube-outline" size={14} color={colors.warning} />
            <Text style={styles.pendingText}>
              {hotel.outstandingCans} outstanding can{hotel.outstandingCans !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.actionsRow}>
        <Pressable
          testID={`hotel-card-${hotel.id}-edit`}
          onPress={onEdit}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${hotel.name}`}
          style={({ pressed }) => [
            styles.actionButton,
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather name="edit-2" size={16} color="#4F46E5" />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>

        <Pressable
          testID={`hotel-card-${hotel.id}-delete`}
          onPress={onDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${hotel.name}`}
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather name="trash-2" size={16} color="#DC2626" />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
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
    gap: 6,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    gap: 2,
  },
  rupeeSymbol: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: "#4F46E5",
  },
  rateValue: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: "#4F46E5",
  },
  perCanText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
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
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  pendingSection: {
    marginTop: spacing.sm,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  pendingText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.warning,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: 6,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: "#EEF2FF",
    borderColor: "#E0E7FF",
  },
  editText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: "#4F46E5",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  deleteText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: "#DC2626",
  },
});
