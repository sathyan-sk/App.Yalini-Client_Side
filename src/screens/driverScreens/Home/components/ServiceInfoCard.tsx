/**
 * ServiceInfoCard - Shows business info with taxi icon, driver info, and day status
 * Pixel-perfect match to design specifications
 */
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, fontSize, spacing, radius, cardShadow } from "../../../../theme";
import type { SessionStatus } from "../../../../types/driver";

interface ServiceInfoCardProps {
  businessName: string;
  driverName: string;
  vehicleNumber: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionStatus: SessionStatus;
}

const TAXI_BG = "#FFF3E0";
const TAXI_COLOR = "#FF9800";
const SUCCESS_BG = "#E8F5E9";
const SUCCESS_COLOR = "#4CAF50";

export function ServiceInfoCard({
  businessName,
  driverName,
  vehicleNumber,
  sessionDate,
  sessionStartTime,
  sessionStatus,
}: ServiceInfoCardProps) {
  const isOpen = sessionStatus === "OPEN";

  return (
    <View style={styles.container}>
      {/* Left side: Taxi icon and info */}
      <View style={styles.leftContent}>
        <View style={styles.taxiIconContainer}>
          <MaterialCommunityIcons name="taxi" size={32} color={TAXI_COLOR} />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View style={styles.infoRow}>
            <Feather name="user" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>Driver: {driverName}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="car"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.infoText, styles.vehicleNumber]}>
              Vehicle: <Text style={styles.vehicleNumberHighlight}>{vehicleNumber}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Right side: Status badge and date/time */}
      <View style={styles.rightContent}>
        <View style={[styles.statusBadge, isOpen && styles.statusBadgeOpen]}>
          <Text style={[styles.statusText, isOpen && styles.statusTextOpen]}>
            {isOpen ? "Day Started" : "Submitted"}
          </Text>
        </View>
        <Text style={styles.dateText}>{sessionDate}</Text>
        <Text style={styles.timeText}>{sessionStartTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...cardShadow,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
  },
  taxiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: TAXI_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
    justifyContent: "center",
  },
  businessName: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 2,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  vehicleNumber: {
    flexShrink: 1,
  },
  vehicleNumberHighlight: {
    color: colors.primaryBlue,
    fontWeight: "500",
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceTertiary,
    marginBottom: spacing.sm,
  },
  statusBadgeOpen: {
    backgroundColor: SUCCESS_BG,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  statusTextOpen: {
    color: SUCCESS_COLOR,
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
