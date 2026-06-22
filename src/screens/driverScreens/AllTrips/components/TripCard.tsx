/**
 * TripCard - Individual trip card showing trip details and expense status
 * Shows trip number, time, route, payment mode, date, amount, and expense status
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { TripWithExpense } from '../../../../store/tripStore';

interface TripCardProps {
  trip: TripWithExpense;
  onPress: () => void;
  onAddExpense: () => void;
}

export function TripCard({ trip, onPress, onAddExpense }: TripCardProps) {
  const paymentIcon = trip.paymentMode === 'cash' ? 'local-atm' : 'smartphone';
  const paymentLabel = trip.paymentMode === 'cash' ? 'Cash' : 'Online';
  const tripTypeLabel = trip.tripType === 'vendor' ? 'Vendor' : 'Private';
  const tripTypeBgColor = trip.tripType === 'vendor' ? '#FFF3E0' : '#E8F5E9';
  const tripTypeTextColor = trip.tripType === 'vendor' ? '#E65100' : '#2E7D32';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Side - Trip Number Badge */}
      <View style={styles.leftSection}>
        <View style={styles.tripNumberBadge}>
          <Text style={styles.tripNumberText}>{trip.tripNumber}</Text>
        </View>
      </View>

      {/* Middle Section - Trip Details */}
      <View style={styles.middleSection}>
        {/* Time */}
        <Text style={styles.timeText}>{trip.time}</Text>
        
        {/* Route */}
        <View style={styles.routeRow}>
          <Text style={styles.routeText}>{trip.from}</Text>
          <Feather name="arrow-right" size={14} color={colors.textSecondary} style={styles.arrowIcon} />
          <Text style={styles.routeText}>{trip.to}</Text>
        </View>

        {/* Payment Mode & Date */}
        <View style={styles.detailsRow}>
          <View style={styles.paymentBadge}>
            <MaterialIcons name={paymentIcon} size={12} color={colors.textSecondary} />
            <Text style={styles.paymentText}>{paymentLabel}</Text>
          </View>
          <View style={styles.dateDivider} />
          <Text style={styles.dateText}>{trip.date}</Text>
        </View>
      </View>

      {/* Right Section - Amount & Expense Status */}
      <View style={styles.rightSection}>
        {/* Amount */}
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>₹{trip.amount.toLocaleString('en-IN')}</Text>
          <Feather name="chevron-right" size={20} color={colors.textTertiary} />
        </View>

        {/* Expense Status */}
        {trip.hasExpense ? (
          <View style={styles.expenseAddedContainer}>
            <View style={styles.expenseAddedBadge}>
              <Feather name="check-circle" size={14} color="#2E7D32" />
              <Text style={styles.expenseAddedText}>Expense Added</Text>
            </View>
            <Text style={styles.expenseAmountText}>Total Expense: ₹{trip.totalExpense}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addExpenseButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddExpense();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.addExpenseBadge}>
              <Feather name="info" size={14} color="#F57C00" />
              <Text style={styles.addExpenseText}>Add Expense</Text>
            </View>
            <Text style={styles.expenseNotAddedText}>Expense not added</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  leftSection: {
    marginRight: spacing.md,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  tripNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripNumberText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.surface,
  },
  middleSection: {
    flex: 1,
  },
  timeText: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  arrowIcon: {
    marginHorizontal: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  paymentText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dateDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#2E7D32',
    marginRight: spacing.xs,
  },
  expenseAddedContainer: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  expenseAddedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  expenseAddedText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 4,
  },
  expenseAmountText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  addExpenseButton: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  addExpenseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  addExpenseText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 4,
  },
  expenseNotAddedText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
