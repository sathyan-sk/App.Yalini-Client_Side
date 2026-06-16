import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones, cardShadow } from "../../../../theme";
import type { Employee } from "../../Employees/types";
import type { Vehicle } from "../../../../types/vehicle";
import type { Hotel } from "../../Hotels/types";
import type { AssetType } from "../types";

interface EmployeeListSectionProps {
  employees: Employee[];
  vehicles: Vehicle[];
  hotels: Hotel[];
  assetType: AssetType;
  loading: boolean;
  onAssign: (employee: Employee) => void;
  onUnassign: (employee: Employee, assetId: string) => void;
  testID?: string;
}

export function EmployeeListSection({
  employees,
  vehicles,
  hotels,
  assetType,
  loading,
  onAssign,
  onUnassign,
  testID,
}: EmployeeListSectionProps) {
  // Filter employees based on asset type (taxi employees for vehicles, water delivery for hotels)
  const filteredEmployees = employees.filter((emp) => {
        // Exclude disabled employees
    if (emp.status === "disabled") {
      return false;
    }
    if (assetType === "vehicle") {
      return emp.businessType === "taxi";
    }
    return emp.businessType === "water_delivery";
  });

  // Get assigned asset for an employee
  const getAssignedAsset = (employeeId: string) => {
    if (assetType === "vehicle") {
      return vehicles.find((v) => v.assignedEmployeeId === employeeId);
    }
    return hotels.find((h) => h.assignedEmployeeId === employeeId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>Loading employees...</Text>
      </View>
    );
  }

  if (filteredEmployees.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>No Employees Found</Text>
        <Text style={styles.emptySubtitle}>
          {assetType === "vehicle"
            ? "Add employees to a Taxi business first"
            : "Add employees to a Water Delivery business first"}
        </Text>
      </View>
    );
  }

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>EMPLOYEES</Text>
        <Text style={styles.countBadge}>
          {filteredEmployees.length} {assetType === "vehicle" ? "Taxi" : "Delivery"} Employees
        </Text>
      </View>

      {filteredEmployees.map((employee) => {
        const assignedAsset = getAssignedAsset(employee.id);
        const isAssigned = !!assignedAsset;
        const tone = isAssigned ? tones.green : tones.orange;

        return (
          <View
            key={employee.id}
            style={[styles.employeeCard, cardShadow]}
            testID={`${testID}-employee-${employee.id}`}
          >
            <View style={styles.employeeRow}>
              <View style={[styles.avatar, { backgroundColor: tone.iconBg }]}>
                <Text style={[styles.avatarText, { color: tone.accent }]}>
                  {getInitials(employee.fullName)}
                </Text>
              </View>

              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.fullName}</Text>
                <Text style={styles.businessName}>{employee.businessName}</Text>
                {isAssigned && assignedAsset && (
                  <View style={styles.assignedBadge}>
                    <Ionicons
                      name={assetType === "vehicle" ? "car" : "bed"}
                      size={12}
                      color={tones.green.accent}
                    />
                    <Text style={styles.assignedText}>
                      {'name' in assignedAsset ? assignedAsset.name : ''}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                {isAssigned ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.unassignBtn]}
                    onPress={() => onUnassign(employee, assignedAsset!.id)}
                    testID={`${testID}-unassign-${employee.id}`}
                  >
                    <Ionicons name="close" size={18} color={tones.red.accent} />
                    <Text style={[styles.actionBtnText, { color: tones.red.accent }]}>
                      Unassign
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.assignBtn]}
                    onPress={() => onAssign(employee)}
                    testID={`${testID}-assign-${employee.id}`}
                  >
                    <Ionicons name="add" size={18} color={colors.brand} />
                    <Text style={[styles.actionBtnText, { color: colors.brand }]}>
                      Assign
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  countBadge: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  employeeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  employeeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  employeeName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  businessName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  assignedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    backgroundColor: tones.green.cardBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
    gap: 4,
  },
  assignedText: {
    fontSize: fontSize.xs,
    color: tones.green.accent,
    fontWeight: "500",
  },
  actionButtons: {
    marginLeft: spacing.md,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    gap: 4,
  },
  assignBtn: {
    backgroundColor: colors.brandSoft,
  },
  unassignBtn: {
    backgroundColor: tones.red.cardBg,
  },
  actionBtnText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
