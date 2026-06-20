/**
 * ServiceInfoCard - Displays taxi service info with session status
 * Shows service name, driver, vehicle, and current session details
 * Matching AllTrips screen design
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { SessionInfo } from '../../../../types/driver';

interface ServiceInfoCardProps {
  sessionInfo: SessionInfo;
}

const TAXI_BG = '#FFF8E1';
const TAXI_COLOR = '#FFC107';

export function ServiceInfoCard({ sessionInfo }: ServiceInfoCardProps) {
  const {
    serviceName,
    driverName,
    vehicleNumber,
    sessionStatus,
    sessionDate,
    sessionTime,
  } = sessionInfo;

  return (
    <View style={styles.container}>
      {/* Left Section - Taxi Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.taxiIconWrapper}>
          {/* Custom Taxi Icon using View components */}
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

      {/* Middle Section - Service Info */}
      <View style={styles.infoSection}>
        <Text style={styles.serviceName}>{serviceName}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.driverName}>{driverName}</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.vehicleNumber}>{vehicleNumber}</Text>
        </View>
      </View>

      {/* Right Section - Status & Time */}
      <View style={styles.statusSection}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{sessionStatus}</Text>
        </View>
        <Text style={styles.dateText}>{sessionDate}</Text>
        <Text style={styles.timeText}>{sessionTime}</Text>
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
  iconContainer: {
    marginRight: spacing.md,
  },
  taxiIconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: TAXI_BG,
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
  serviceName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.headerDark,
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  driverName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  bullet: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  vehicleNumber: {
    fontSize: fontSize.sm,
    color: colors.primaryBlue,
    fontWeight: '600',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#2E7D32',
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
