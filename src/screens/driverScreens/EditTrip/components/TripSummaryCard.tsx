/**
 * TripSummaryCard - Shows trip summary at top of edit screen
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { AllTripsTrip } from '../../../../types/driver';

interface TripSummaryCardProps {
  trip: AllTripsTrip;
}

export function TripSummaryCard({ trip }: TripSummaryCardProps) {
  return (
    <View style={styles.container}>
      {/* Trip Number Badge */}
      <View style={styles.tripNumberBadge}>
        <Text style={styles.tripNumberText}>{trip.tripNumber}</Text>
      </View>

      {/* Route */}
      <View style={styles.routeSection}>
        <View style={styles.routeRow}>
          <Text style={styles.routeText}>{trip.from}</Text>
          <Feather name="arrow-right" size={16} color={colors.textSecondary} style={styles.arrowIcon} />
          <Text style={styles.routeText}>{trip.to}</Text>
        </View>

        {/* Payment Mode & Amount */}
        <View style={styles.detailsRow}>
          {trip.paymentMode === 'cash' ? (
            <MaterialIcons name="account-balance-wallet" size={14} color="#4CAF50" />
          ) : (
            <MaterialIcons name="smartphone" size={14} color={colors.primaryBlue} />
          )}
          <Text style={styles.paymentText}>
            {trip.paymentMode === 'cash' ? 'Cash' : 'Online'}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.amountText}>₹{trip.amount}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  tripNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  tripNumberText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.surface,
  },
  routeSection: {
    flex: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  routeText: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  arrowIcon: {
    marginHorizontal: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  amountText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#1B5E20',
  },
});
