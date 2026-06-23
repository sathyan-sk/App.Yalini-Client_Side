import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, lightShadow } from "../../../../../../theme";
import { formatCurrency } from "../../../../../../utils/format";
import type { TripDetail } from "../../../../../../types/taxiRecords";

interface TripCardProps {
  trip: TripDetail;
  onPress?: () => void;
  testID?: string;
}

export function TripCard({ trip, onPress, testID }: TripCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasExpenseBreakdown = 
    trip.expenseCategories.fuel > 0 ||
    trip.expenseCategories.toll > 0 ||
    trip.expenseCategories.food > 0 ||
    trip.expenseCategories.other > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && onPress && styles.pressed,
      ]}
      testID={testID}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.tripNumberContainer}>
          <Text style={styles.tripNumber}>{trip.tripNumber}</Text>
        </View>
        <Text style={styles.destination}>{trip.destination}</Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Trip Type</Text>
          <Text style={[styles.metricValue, styles.typeValue]}>
            {trip.tripType === 'vendor' ? '🏢 Vendor' : '👤 Private'}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Payment</Text>
          <Text style={[styles.metricValue, styles.paymentValue]}>
            {trip.paymentMode === 'cash' ? '💵 Cash' : '📱 Online'}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Profit</Text>
          <Text style={[styles.metricValue, styles.profitValue]}>
            {formatCurrency(trip.profit)}
          </Text>
        </View>
      </View>

      {/* Income & Expense Row with Expand Toggle */}
      <Pressable 
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.financeRow}
      >
        <View style={styles.financeItem}>
          <Text style={styles.financeLabel}>Income:</Text>
          <Text style={[styles.financeValue, styles.incomeValue]}>
            {formatCurrency(trip.income)}
          </Text>
        </View>
        <View style={styles.financeItem}>
          <Text style={styles.financeLabel}>Expense:</Text>
          <Text style={[styles.financeValue, styles.expenseValue]}>
            {formatCurrency(trip.expense)}
          </Text>
        </View>
        <View style={styles.expandIconContainer}>
          <Feather 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={18} 
            color={colors.textSecondary} 
          />
        </View>
      </Pressable>

      {/* Expandable Expense Breakdown */}
      {isExpanded && hasExpenseBreakdown && (
        <View style={styles.expenseBreakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Fuel:</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.fuel)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Toll:</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.toll)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Food:</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.food)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Other:</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.other)}</Text>
          </View>
          {trip.expenseCategories.notes && (
            <View style={styles.notesRow}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesValue}>{trip.expenseCategories.notes}</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    ...lightShadow,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  tripNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  tripNumber: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  destination: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  metricsRow: {
    flexDirection: "row",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  profitValue: {
    color: colors.brand,
  },
  typeValue: {
    color: colors.primaryBlue,
  },
  paymentValue: {
    color: colors.brand,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  financeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  financeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  financeValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  incomeValue: {
    color: colors.successDark,
  },
  expenseValue: {
    color: colors.error,
  },
  expandIconContainer: {
    marginLeft: spacing.sm,
  },
  expenseBreakdown: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  breakdownLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notesRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  notesLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  notesValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
});
