import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow, tones } from "../../../../theme";
import type { Employee } from "../../Employees/types";
import type { Vehicle } from "../../../../types/vehicle";
import type { Hotel } from "../../Hotels/types";

interface Props {
  employee: Employee;
  assetType: "vehicle" | "hotel";
  asset: Vehicle | Hotel | null;
  isAssigned: boolean;
  onEdit: () => void;
  testID?: string;
}

export function AssignmentCard({ employee, assetType, asset, isAssigned, onEdit, testID }: Props) {
  const businessLabel = assetType === "vehicle" ? "Taxi Business" : "Delivery Business";
  const businessColor = assetType === "vehicle" ? tones.purple : tones.orange;

  // Get asset details based on type
  const getAssetDetails = () => {
    if (!asset) {
      return {
        name: assetType === "vehicle" ? "No Vehicle" : "No Hotel",
        subInfo: assetType === "vehicle" ? "Not assigned" : "Not assigned",
      };
    }

    if (assetType === "vehicle" && "number" in asset) {
      return {
        name: asset.name,
        subInfo: (asset as Vehicle).number || "No Vehicle No",
      };
    } else if (assetType === "hotel" && "location" in asset) {
      return {
        name: asset.name,
        subInfo: (asset as Hotel).location || "No Location",
      };
    }

    return {
      name: asset.name,
      subInfo: assetType === "vehicle" ? "Vehicle" : "Hotel",
    };
  };

  const assetDetails = getAssetDetails();

  return (
    <View style={styles.container} testID={testID}>
      {/* Employee Section */}
      <View style={styles.employeeSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color={tones.orange.accent} />
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName} numberOfLines={1}>
            {employee.fullName}
          </Text>
          <Text style={styles.employeeRole}>Employee</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Asset Section */}
      <View style={styles.assetSection}>
        {/* Business Type Badge */}
        <View style={[styles.businessBadge, { backgroundColor: businessColor.cardBg }]}>
          <Text style={[styles.businessBadgeText, { color: businessColor.accent }]}>
            {businessLabel}
          </Text>
        </View>

        <View style={styles.assetRow}>
          <View style={[styles.assetIconBg, { backgroundColor: businessColor.iconBg }]}>
            {assetType === "vehicle" ? (
              <Ionicons name="car" size={18} color={businessColor.accent} />
            ) : (
              <MaterialCommunityIcons name="office-building" size={18} color={businessColor.accent} />
            )}
          </View>
          <View style={styles.assetInfo}>
            <Text style={styles.assetName} numberOfLines={1}>
              {assetDetails.name}
            </Text>
            <Text style={styles.assetSubInfo} numberOfLines={1}>
              {assetDetails.subInfo}
            </Text>
          </View>
        </View>
      </View>

      {/* Status and Edit Section */}
      <View style={styles.actionSection}>
        <View style={[
          styles.statusBadge,
          isAssigned ? styles.statusAssigned : styles.statusUnassigned
        ]}>
          <View style={[
            styles.statusDot,
            { backgroundColor: isAssigned ? colors.success : colors.error }
          ]} />
          <Text style={[
            styles.statusText,
            { color: isAssigned ? colors.success : colors.error }
          ]}>
            {isAssigned ? "Assigned" : "Unassigned"}
          </Text>
        </View>

        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
          hitSlop={8}
          testID={`${testID}-edit`}
        >
          <Feather name="edit-2" size={16} color={colors.brand} />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...cardShadow,
  },
  employeeSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tones.orange.cardBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tones.orange.iconBg,
  },
  employeeInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  employeeName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  employeeRole: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  assetSection: {
    flex: 1.5,
  },
  businessBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  businessBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetIconBg: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  assetInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  assetName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  assetSubInfo: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statusAssigned: {
    backgroundColor: colors.successSoft,
  },
  statusUnassigned: {
    backgroundColor: colors.errorSoft,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  editButtonPressed: {
    opacity: 0.7,
  },
  editText: {
    fontSize: fontSize.sm,
    color: colors.brand,
    fontWeight: "500",
  },
});
