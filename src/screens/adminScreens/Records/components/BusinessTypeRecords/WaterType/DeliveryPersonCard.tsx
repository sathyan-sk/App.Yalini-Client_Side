import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../../../theme";
import { formatCurrency } from "../../../../../../utils/format";
import { Avatar } from "../../common/Avatar";
import { StatusBadge } from "../../common/StatusBadge";
import type { WaterDeliveryRecord } from "../../../../../../types/waterRecords";

interface DeliveryPersonCardProps {
  record: WaterDeliveryRecord;
  onPress: () => void;
  testID?: string;
  showDate?: boolean;
}

export function DeliveryPersonCard({ record, onPress, testID, showDate }: DeliveryPersonCardProps) {
  // Get first hotel name for subtitle
  const firstHotelName = record.hotelDeliveries[0]?.hotelName || "No deliveries";

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
        <Avatar name={record.deliveryPersonName} color={record.avatarColor} size={44} />
        <View style={styles.headerContent}>
          <Text style={styles.deliveryPersonName}>{record.deliveryPersonName}</Text>
          <View style={styles.subtitleRow}>
            <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.subtitle} numberOfLines={1}>{firstHotelName}</Text>
          </View>
          {showDate && (
            <Text style={styles.date}>{record.date}</Text>
          )}
        </View>
        <StatusBadge status={record.status} />
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
          style={styles.chevron}
        />
      </View>

      {/* Metrics Row 1 - Delivery Stats (Hotels, Delivered, Settled) */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Total Hotels</Text>
          </View>
          <Text style={styles.metricValue}>{record.totalHotels}</Text>
        </View>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Feather name="check-circle" size={14} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Total Delivered</Text>
          </View>
          <Text style={[styles.metricValue, styles.deliveredValue]}>{record.totalDelivered}</Text>
        </View>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Total Settled</Text>
          </View>
          <Text style={[styles.metricValue, styles.settledValue]}>
            {formatCurrency(record.totalSettled || 0)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Metrics Row 2 - Financial Stats (Income, Expense, Profit) */}
      <View style={styles.metricsRow}>
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
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Profit</Text>
          <Text style={[styles.metricValue, styles.profitValue]}>
            {formatCurrency(record.totalProfit)}
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
  deliveryPersonName: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
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
    marginTop: spacing.sm,
  },
  metricItem: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  deliveredValue: {
    color: colors.primaryBlue,
  },
  settledValue: {
    color: '#FF9800',
  },
  incomeValue: {
    color: colors.successDark,
  },
  expenseValue: {
    color: colors.error,
  },
  profitValue: {
    color: colors.brand,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
});
