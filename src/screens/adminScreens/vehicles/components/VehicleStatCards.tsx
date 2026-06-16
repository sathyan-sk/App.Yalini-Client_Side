import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../theme";

interface VehicleStatCardsProps {
  total: number;
  enabled: number;
  disabled: number;
  testID?: string;
}

export function VehicleStatCards({
  total,
  enabled,
  disabled,
  testID,
}: VehicleStatCardsProps) {
  return (
    <View style={styles.container} testID={testID}>
      {/* Total */}
      <View style={styles.iconContainer}>
        <View style={styles.iconBg}>
          <Ionicons name="car" size={24} color={colors.brand} />
        </View>
      </View>
      
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{total}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={styles.labelRow}>
            <View style={[styles.dot, { backgroundColor: colors.running }]} />
            <Text style={styles.statLabel}>Enabled</Text>
          </View>
          <Text style={styles.statValue}>{enabled}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={styles.labelRow}>
            <View style={[styles.dot, { backgroundColor: colors.maintenance }]} />
            <Text style={styles.statLabel}>Disabled</Text>
          </View>
          <Text style={styles.statValue}>{disabled}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    ...cardShadow,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
});
