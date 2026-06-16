import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones, cardShadow } from "../../../../theme";
import type { Employee } from "../../Employees/types";
import type { Vehicle } from "../../../../types/vehicle";
import type { Hotel } from "../../Hotels/types";
import type { AssetType } from "../types";

interface AssignmentStatsCardsProps {
  employees: Employee[];
  vehicles: Vehicle[];
  hotels: Hotel[];
  assetType: AssetType;
  testID?: string;
}

export function AssignmentStatsCards({
  employees,
  vehicles,
  hotels,
  assetType,
  testID,
}: AssignmentStatsCardsProps) {
  // Calculate stats based on asset type
  const stats = React.useMemo(() => {
    if (assetType === "vehicle") {
      const taxiEmployees = employees.filter((e) => e.businessType === "taxi" && e.status === "enabled");
      const assignedVehicles = vehicles.filter((v) => v.assignedEmployeeId);
      const availableVehicles = vehicles.filter((v) => !v.assignedEmployeeId && v.status === "enabled");

      return {
        total: taxiEmployees.length,
        assigned: assignedVehicles.length,
        available: availableVehicles.length,
        label: "Taxi",
        icon: "car-sport" as const,
        tone: tones.purple,
      };
    }

    const deliveryEmployees = employees.filter((e) => e.businessType === "water_delivery" && e.status === "enabled");
    const assignedHotels = hotels.filter((h) => h.assignedEmployeeId);
    const availableHotels = hotels.filter((h) => !h.assignedEmployeeId && h.status === "enabled");

    return {
      total: deliveryEmployees.length,
      assigned: assignedHotels.length,
      available: availableHotels.length,
      label: "Delivery",
      icon: "bed" as const,
      tone: tones.blue,
    };
  }, [assetType, employees, vehicles, hotels]);

  return (
    <View style={styles.container} testID={testID}>
      <View style={[styles.card, cardShadow]}>
        <View style={[styles.iconContainer, { backgroundColor: stats.tone.iconBg }]}>
          <Ionicons name="people" size={20} color={stats.tone.accent} />
        </View>
        <Text style={styles.statValue}>{stats.total}</Text>
        <Text style={styles.statLabel}>{stats.label} Employees</Text>
      </View>

      <View style={[styles.card, cardShadow]}>
        <View style={[styles.iconContainer, { backgroundColor: tones.green.iconBg }]}>
          <Ionicons name="checkmark-circle" size={20} color={tones.green.accent} />
        </View>
        <Text style={styles.statValue}>{stats.assigned}</Text>
        <Text style={styles.statLabel}>Assigned</Text>
      </View>

      <View style={[styles.card, cardShadow]}>
        <View style={[styles.iconContainer, { backgroundColor: tones.orange.iconBg }]}>
          <Ionicons name={stats.icon} size={20} color={tones.orange.accent} />
        </View>
        <Text style={styles.statValue}>{stats.available}</Text>
        <Text style={styles.statLabel}>Available</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
});
