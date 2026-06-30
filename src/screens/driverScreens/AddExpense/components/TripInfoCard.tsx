/**
 * TripInfoCard - Displays trip information at top of expense screen
 * Shows trip ID, route, date, time, payment mode and amount
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { TripData } from '../../../../types/driver';

interface TripInfoCardProps {
  tripData: TripData;
}

export function TripInfoCard({ tripData }: TripInfoCardProps) {
  return (
    <View style={styles.container}>
      {/* Left Section - Taxi Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.taxiIconWrapper}>
          {/* Taxi representation */}
          <View style={styles.taxiBody}>
            <View style={styles.taxiTop}>
              <Text style={styles.taxiLabel}>TAXI</Text>
            </View>
            <View style={styles.taxiBottom}>
              <View style={styles.taxiWindow} />
              <View style={styles.taxiWindow} />
            </View>
            <View style={styles.taxiWheels}>
              <View style={styles.wheel} />
              <View style={styles.wheel} />
            </View>
          </View>
        </View>
      </View>

      {/* Middle Section - Trip Info */}
      <View style={styles.infoSection}>
        
        {/* Route */}
        <View style={styles.routeRow}>
          <Text style={styles.routeText}>{tripData.from}</Text>
          <Feather name="arrow-right" size={14} color={colors.textSecondary} style={styles.arrowIcon} />
          <Text style={styles.routeText}>{tripData.to}</Text>
        </View>

        {/* Date, Time, Payment Mode */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={12} color={colors.textSecondary} />
            <Text style={styles.detailText}>{tripData.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="clock" size={12} color={colors.textSecondary} />
            <Text style={styles.detailText}>{tripData.time}</Text>
          </View>
        </View>
      </View>

      {/* Right Section - Trip Amount & ID */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Trip Amount</Text>
        <Text style={styles.amountValue}>₹{tripData.amount}</Text>
        <Text style={styles.tripIdText}>ID: ...{tripData.tripId.slice(-6)}</Text>
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
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  taxiIconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: '#FFF8E1',
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  taxiBody: {
    width: 48,
    height: 40,
    position: 'relative',
  },
  taxiTop: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 12,
    backgroundColor: '#FFB300',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taxiLabel: {
    fontSize: 6,
    fontWeight: '700',
    color: '#C62828',
  },
  taxiBottom: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#FFC107',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  taxiWindow: {
    width: 12,
    height: 10,
    backgroundColor: '#81D4FA',
    borderRadius: 2,
  },
  taxiWheels: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wheel: {
    width: 10,
    height: 10,
    backgroundColor: '#424242',
    borderRadius: 5,
  },
  infoSection: {
    flex: 1,
  },
  routeText: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  arrowIcon: {
    marginHorizontal: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  detailText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  tripIdText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
