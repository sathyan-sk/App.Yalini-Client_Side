/**
 * DaySummaryCard - Shows the summary of the completed day
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';

interface DaySummaryCardProps {
  sessionDate: string;
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  driverName: string;
  vehicleNumber: string;
}

export function DaySummaryCard({
  sessionDate,
  totalTrips,
  totalIncome,
  totalExpenses,
  netAmount,
  driverName,
  vehicleNumber,
}: DaySummaryCardProps) {
  const formatCurrency = (amount: number | undefined) => `\u20B9${(amount || 0).toLocaleString('en-IN')}`;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="calendar" size={20} color={colors.primaryBlue} />
          <Text style={styles.dateText}>{sessionDate || ''}</Text>
        </View>
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Completed</Text>
        </View>
      </View>

      {/* Driver Info */}
      <View style={styles.driverInfo}>
        <View style={styles.infoRow}>
          <Feather name="user" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{driverName || ''}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="truck" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{vehicleNumber || ''}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, styles.tripsIconBg]}>
            <Feather name="navigation" size={18} color={colors.primaryBlue} />
          </View>
          <Text style={styles.statValue}>{totalTrips || 0}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, styles.incomeIconBg]}>
            <Feather name="trending-up" size={18} color={colors.successDark} />
          </View>
          <Text style={[styles.statValue, styles.incomeText]}>
            {formatCurrency(totalIncome)}
          </Text>
          <Text style={styles.statLabel}>Income</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, styles.expenseIconBg]}>
            <Feather name="trending-down" size={18} color={colors.error} />
          </View>
          <Text style={[styles.statValue, styles.expenseText]}>
            {formatCurrency(totalExpenses)}
          </Text>
          <Text style={styles.statLabel}>Expenses</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Net Amount */}
      <View style={styles.netAmountContainer}>
        <Text style={styles.netLabel}>Net Earnings</Text>
        <Text style={[styles.netAmount, (netAmount || 0) >= 0 ? styles.positiveNet : styles.negativeNet]}>
          {formatCurrency(netAmount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  completedBadge: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  completedText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.successDark,
  },
  driverInfo: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tripsIconBg: {
    backgroundColor: colors.primaryBlueSoft,
  },
  incomeIconBg: {
    backgroundColor: colors.successSoft,
  },
  expenseIconBg: {
    backgroundColor: colors.errorSoft,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  incomeText: {
    color: colors.successDark,
  },
  expenseText: {
    color: colors.error,
  },
  netAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  netAmount: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  positiveNet: {
    color: colors.successDark,
  },
  negativeNet: {
    color: colors.error,
  },
});
