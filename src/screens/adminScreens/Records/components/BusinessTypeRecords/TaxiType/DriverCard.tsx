import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../../../theme";
import { formatCurrency } from "../../../../../../utils/format";
import { Avatar } from "../../common/Avatar";
import { StatusBadge } from "../../common/StatusBadge";
import type { DriverRecord } from "../../../../../../types/taxiRecords";


interface DriverCardProps {
  record: DriverRecord;
  onPress: () => void;
  testID?: string;
}

export function DriverCard({ record, onPress, testID }: DriverCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      testID={testID}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <Avatar name={record.driverName} color={record.avatarColor} size={44} />
        <View style={styles.headerContent}>
          <Text style={styles.driverName}>{record.driverName}</Text>
          <Text style={styles.vehicleName}>{record.vehicleName}</Text>
        </View>
        <StatusBadge status={record.status} />
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
          style={styles.chevron}
        />
      </View>

      {/* Metrics Row 1 */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Feather name="truck" size={16} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Trips</Text>
          </View>
          <Text style={styles.metricValue}>{record.trips}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Income</Text>
          <Text style={[styles.metricValue, styles.incomeValue]}>
            {formatCurrency(record.totalIncome)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Expense</Text>
          <Text style={[styles.metricValue, styles.expenseValue]}>
            {formatCurrency(record.totalExpense)}
          </Text>
        </View>
      </View>

      {/* Metrics Row 2 */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Settled to Admin</Text>
          <Text style={[styles.metricValue, styles.settledValue]}>
            {formatCurrency(record.settledToAdmin)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Balance (Shortage)</Text>
          <Text style={[styles.metricValue, styles.shortageValue]}>
            {formatCurrency(record.balanceShortage)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  driverName: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  vehicleName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  metricItem: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  incomeValue: {
    color: colors.successDark,
  },
  expenseValue: {
    color: colors.error,
  },
  settledValue: {
    color: colors.primaryBlue,
  },
  shortageValue: {
    color: colors.error,
  },
});
