/**
 * SummaryStatsRow - Displays Total Trips and Total Income in a row
 * Two stat cards side by side matching the design
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';

interface SummaryStatsRowProps {
  totalTrips: number;
  totalIncome: number;
}

export function SummaryStatsRow({ totalTrips, totalIncome }: SummaryStatsRowProps) {
  return (
    <View style={styles.container}>
      {/* Total Trips Card */}
      <View style={styles.statCard}>
        <View style={[styles.iconWrapper, styles.tripsIconBg]}>
          <MaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.primaryBlue} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Total Trips</Text>
          <Text style={styles.statValue}>{totalTrips}</Text>
        </View>
      </View>

      {/* Total Income Card */}
      <View style={styles.statCard}>
        <View style={[styles.iconWrapper, styles.incomeIconBg]}>
          <FontAwesome5 name="rupee-sign" size={20} color="#2E7D32" />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Total Income</Text>
          <Text style={[styles.statValue, styles.incomeValue]}>
            ₹{totalIncome.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tripsIconBg: {
    backgroundColor: '#E3F2FD',
  },
  incomeIconBg: {
    backgroundColor: '#E8F5E9',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  incomeValue: {
    color: '#2E7D32',
  },
});
