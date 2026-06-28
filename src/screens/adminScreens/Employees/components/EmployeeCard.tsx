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
import type { Employee } from "../types";
import { getInitials, formatMobileDisplay } from "../data/constants";

interface EmployeeCardProps {
  employee: Employee;
  businessMode?: 'auto' | 'manual';
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Avatar background colors based on initials
const AVATAR_COLORS = [
  { bg: "#EDE9FE", text: "#7C3AED" }, // purple
  { bg: "#DCFCE7", text: "#16A34A" }, // green
  { bg: "#FEE2E2", text: "#DC2626" }, // red
  { bg: "#DBEAFE", text: "#2563EB" }, // blue
  { bg: "#FEF3C7", text: "#D97706" }, // amber
  { bg: "#D1FAE5", text: "#059669" }, // emerald
];

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Single row card on the Employees list.
 *
 * Layout:
 *   ┌──────┬───────────────────────────────────┬──────────┐
 *   │avatar│ name                              │ Status > │
 *   │  RK  │ 🚕 City Taxi                      │ [edit]   │
 *   │      │ 📞 98765 43210                    │ [delete] │
 *   └──────┴───────────────────────────────────┴──────────┘
 */
export function EmployeeCard({
  employee,
  businessMode,
  onPress,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const initials = getInitials(employee.fullName);
  const avatarColor = getAvatarColor(employee.fullName);
  const statusColor = employee.status === "enabled" ? colors.success : colors.textTertiary;
  const statusLabel = employee.status === "enabled" ? "Enabled" : "Disabled";
  const businessIcon = employee.businessType === "taxi" ? "car-sport" : "water";
  const businessIconColor = employee.businessType === "taxi" ? tones.orange.accent : tones.blue.accent;
  const modeColor = businessMode === 'auto' ? colors.info : businessMode === 'manual' ? colors.warning : colors.textTertiary;
  const modeLabel = businessMode === 'auto' ? 'Auto Mode' : businessMode === 'manual' ? 'Manual Mode' : '';

  return (
    <Pressable
      testID={`employee-card-${employee.id}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${employee.fullName}, ${employee.businessName}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
          <Text style={[styles.avatarText, { color: avatarColor.text }]}>
            {initials}
          </Text>
        </View>

        {/* Info Block */}
        <View style={styles.infoBlock}>
          <Text
            style={styles.name}
            numberOfLines={1}
            testID={`employee-card-${employee.id}-name`}
          >
            {employee.fullName}
          </Text>
          
          <View style={styles.detailRow}>
            <Ionicons name={businessIcon} size={14} color={businessIconColor} />
            <Text style={styles.detailText} numberOfLines={1}>
              {employee.businessName}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.detailText}>
              {formatMobileDisplay(employee.mobile)}
            </Text>
          </View>

          {/* Assignment Status */}
          {employee.assignedVehicleId && (
            <View style={styles.assignmentRow}>
              <Ionicons name="car-outline" size={14} color={colors.info} />
              <Text style={styles.assignmentText} numberOfLines={1}>
                {employee.assignedVehicleName || 'Vehicle Assigned'}
              </Text>
            </View>
          )}
          {employee.assignedHotelId && (
            <View style={styles.assignmentRow}>
              <Ionicons name="business-outline" size={14} color={colors.info} />
              <Text style={styles.assignmentText} numberOfLines={1}>
                {employee.assignedHotelName || 'Hotel Assigned'}
              </Text>
            </View>
          )}
        </View>

        {/* Right Side: Status + Actions */}
        <View style={styles.rightBlock}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text
              style={[styles.statusText, { color: statusColor }]}
              testID={`employee-card-${employee.id}-status`}
            >
              {statusLabel}
            </Text>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </View>

          {/* Business Mode Badge */}
          {modeLabel && (
            <View style={[styles.modeBadge, { backgroundColor: modeColor + '20' }]}>
              <Text style={[styles.modeText, { color: modeColor }]}>
                {modeLabel}
              </Text>
            </View>
          )}
          
          <View style={styles.actionsRow}>
            <Pressable
              testID={`employee-card-${employee.id}-edit`}
              onPress={onEdit}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${employee.fullName}`}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: "#EEF2FF" },
                pressed && styles.pressed,
              ]}
            >
              <Feather name="edit-2" size={16} color="#4F46E5" />
            </Pressable>

            <Pressable
              testID={`employee-card-${employee.id}-delete`}
              onPress={onDelete}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${employee.fullName}`}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: "#FEE2E2" },
                pressed && styles.pressed,
              ]}
            >
              <Feather name="trash-2" size={16} color="#DC2626" />
            </Pressable>
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  infoBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  rightBlock: {
    alignItems: "flex-end",
    gap: spacing.sm,
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
  actionsRow: {
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  assignmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  assignmentText: {
    fontSize: fontSize.xs,
    color: colors.info,
    fontWeight: "500",
    flex: 1,
  },
  modeBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  modeText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
});
