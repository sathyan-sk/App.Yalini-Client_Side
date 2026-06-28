import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../theme";
import type { Vehicle } from "../../../../types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  testID?: string;
}

export function VehicleCard({
  vehicle,
  onPress,
  onEdit,
  onDelete,
  testID,
}: VehicleCardProps) {
  const isRunning = vehicle.status === "enabled";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      testID={testID}
    >
      {/* Top Section */}
      <View style={styles.topSection}>
        <View
          style={[
            styles.iconBg,
            {
              backgroundColor: isRunning
                ? colors.runningSoft
                : colors.maintenanceSoft,
            },
          ]}
        >
          {isRunning ? (
            <Ionicons name="car" size={28} color={colors.running} />
          ) : (
            <Ionicons name="construct" size={28} color={colors.maintenance} />
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isRunning
                    ? colors.runningSoft
                    : colors.maintenanceSoft,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isRunning
                      ? colors.running
                      : colors.maintenance,
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: isRunning ? colors.running : colors.maintenance,
                  },
                ]}
              >
                {isRunning ? "Running" : "Maintenance"}
              </Text>
            </View>
          </View>

          <View style={styles.numberRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>123</Text>
            </View>
            <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
          </View>
        </View>
      </View>

      {/* Assignment Status Section */}
      {vehicle.assignmentStatus && (
        <View style={styles.assignmentSection}>
          <View
            style={[
              styles.assignmentBadge,
              {
                backgroundColor:
                  vehicle.assignmentStatus === 'available'
                    ? colors.successSoft
                    : vehicle.assignmentStatus === 'assigned'
                    ? colors.infoSoft
                    : colors.warningSoft,
              },
            ]}
          >
            <View
              style={[
                styles.assignmentDot,
                {
                  backgroundColor:
                    vehicle.assignmentStatus === 'available'
                      ? colors.success
                      : vehicle.assignmentStatus === 'assigned'
                      ? colors.info
                      : colors.warning,
                },
              ]}
            />
            <Text
              style={[
                styles.assignmentText,
                {
                  color:
                    vehicle.assignmentStatus === 'available'
                      ? colors.success
                      : vehicle.assignmentStatus === 'assigned'
                      ? colors.info
                      : colors.warning,
                },
              ]}
            >
              {vehicle.assignmentStatus === 'available'
                ? 'Available'
                : vehicle.assignmentStatus === 'assigned'
                ? 'Assigned'
                : 'Locked'}
            </Text>
          </View>
        </View>
      )}

      {/* Driver Section */}
      {vehicle.assignedDriver && (
        <View style={styles.driverSection}>
          <Feather name="user" size={16} color={colors.textTertiary} />
          <View>
            <Text style={styles.driverLabel}>Assigned Driver</Text>
            <Text style={styles.driverName}>{vehicle.assignedDriver}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.actionButton,
            styles.editButton,
            pressed && styles.actionButtonPressed,
          ]}
          testID={`${testID}-edit`}
        >
          <Feather name="edit-2" size={16} color={colors.brand} />
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>

        {vehicle.assignmentStatus === 'locked' ? (
          <Pressable
            onPress={() => {/* Unlock handler */}}
            style={({ pressed }) => [
              styles.actionButton,
              styles.unlockButton,
              pressed && styles.actionButtonPressed,
            ]}
            testID={`${testID}-unlock`}
          >
            <Feather name="unlock" size={16} color={colors.success} />
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {/* Lock handler */}}
            style={({ pressed }) => [
              styles.actionButton,
              styles.lockButton,
              pressed && styles.actionButtonPressed,
            ]}
            testID={`${testID}-lock`}
          >
            <Feather name="lock" size={16} color={colors.warning} />
            <Text style={styles.lockButtonText}>Lock</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && styles.actionButtonPressed,
          ]}
          testID={`${testID}-delete`}
        >
          <Feather name="trash-2" size={16} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  containerPressed: {
    opacity: 0.95,
  },
  topSection: {
    flexDirection: "row",
    gap: spacing.md,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vehicleName: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  numberBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  numberBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  vehicleNumber: {
    fontSize: fontSize.lg,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  driverSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  driverLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  driverName: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  editButton: {
    backgroundColor: "#F0E6FF",
  },
  editButtonText: {
    color: colors.brand,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  lockButton: {
    backgroundColor: colors.warningSoft,
  },
  lockButtonText: {
    color: colors.warning,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  unlockButton: {
    backgroundColor: colors.successSoft,
  },
  unlockButtonText: {
    color: colors.success,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: colors.errorSoft,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  // Assignment status styles
  assignmentSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  assignmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  assignmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  assignmentText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
