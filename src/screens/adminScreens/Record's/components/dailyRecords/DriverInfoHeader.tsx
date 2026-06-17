import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../../theme";
import { formatDisplayDate, formatCurrency } from "../../../../../utils/format";
import { Avatar } from "../common/Avatar";
import { StatusBadge } from "../common/StatusBadge";
import type { DriverRecord } from "../../../../../types/dailyRecords";

interface DriverInfoHeaderProps {
  record: DriverRecord;
  testID?: string;
}

export function DriverInfoHeader({ record, testID }: DriverInfoHeaderProps) {
  return (
    <View style={styles.container} testID={testID}>
      {/* Driver Info Row */}
      <View style={styles.driverRow}>
        <Avatar name={record.driverName} color={record.avatarColor} size={48} />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{record.driverName}</Text>
          <Text style={styles.date}>{formatDisplayDate(record.date)}</Text>
        </View>
        <StatusBadge status={record.status} />
      </View>

      {/* Key Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={styles.metricIconRow}>
            <Feather name="activity" size={18} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Total Trips</Text>
          </View>
          <Text style={styles.metricValue}>{record.trips}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <View style={styles.metricIconRow}>
            <MaterialCommunityIcons name="currency-inr" size={18} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Per Km Rate</Text>
          </View>
          <Text style={styles.metricValue}>{formatCurrency(record.perKmRate)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  driverInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  driverName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metricItem: {
    flex: 1,
  },
  metricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },
});
