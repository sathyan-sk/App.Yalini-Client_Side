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
        
        {/* Trip Type Badge in right corner */}
        <View style={[styles.typeBadge, { backgroundColor: trip.tripType === 'vendor' ? '#E8F5E9' : '#FFF3E0' }]}>
          <Text style={[styles.typeBadgeText, { color: trip.tripType === 'vendor' ? colors.successDark : '#F57C00' }]}>
            {trip.tripType === 'vendor' ? 'Vendor' : 'Private'}
          </Text>
        </View>
      </View>

      {/* Metrics Row - Income, Profit, Settled */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Income</Text>
          <Text style={[styles.metricValue, styles.incomeValue]}>
            {formatCurrency(trip.income)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Profit</Text>
          <Text style={[styles.metricValue, styles.profitValue]}>
            {formatCurrency(trip.profit)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Settled</Text>
          <Text style={[styles.metricValue, { color: '#FF9800' }]}>
            {formatCurrency(trip.settledCash + trip.settledOnline)}
          </Text>
        </View>
      </View>

      {/* Expand Toggle Row - Settled Cash, Settled Online, Expense */}
      <Pressable 
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.financeRow}
      >
        <View style={styles.financeItem}>
          <Text style={styles.financeLabel}>Cash:</Text>
          <Text style={[styles.financeValue, { color: colors.successDark }]}>
            {formatCurrency(trip.settledCash)}
          </Text>
        </View>
        <View style={styles.dividerLine} />
        <View style={styles.financeItem}>
          <Text style={styles.financeLabel}>Online:</Text>
          <Text style={[styles.financeValue, { color: colors.primaryBlue }]}>
            {formatCurrency(trip.settledOnline)}
          </Text>
        </View>
        <View style={styles.dividerLine} />
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
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Fuel</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.fuel)}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Toll</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.toll)}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Food</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.food)}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Other</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(trip.expenseCategories.other)}</Text>
            </View>
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
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginLeft: spacing.sm,
  },
  typeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
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
  incomeValue: {
    color: colors.successDark,
  },
  expenseValue: {
    color: colors.error,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dividerLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.borderLight,
  },
  financeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  financeValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
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
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
    flex: 1,
  },
  breakdownDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
  },
  breakdownLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
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