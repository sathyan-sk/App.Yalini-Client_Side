/**
 * VehicleAssignmentCard - Shows vehicle assignment status
 * Pixel-perfect match to design specifications
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, spacing, radius, cardShadow } from "../../../../theme";

interface VehicleAssignmentCardProps {
  vehicleNumber: string;
  isAssigned: boolean;
}

const SUCCESS_COLOR = "#4CAF50";
const SUCCESS_BG = "#E8F5E9";

export function VehicleAssignmentCard({
  vehicleNumber,
  isAssigned,
}: VehicleAssignmentCardProps) {
  return (
    <View style={styles.container}>
      {/* Left: Check icon and status text */}
      <View style={styles.leftContent}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title}>Vehicle Assigned</Text>
          <Text style={styles.subtitle}>You are active for today.</Text>
        </View>
      </View>

      {/* Right: Vehicle number */}
      <Text style={styles.vehicleNumber}>{vehicleNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SUCCESS_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    gap: 2,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: SUCCESS_COLOR,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  vehicleNumber: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
});
