/**
 * SessionInfoCard - Displays current delivery session information.
 *
 * Shows service name, staff name, date, session status,
 * and centralized loaded/remaining cans info.
 * Rate per can is now shown per-hotel in the CansInformationForm.
 */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';
import type { DeliverySessionData } from '../types';

/**
 * Props for SessionInfoCard component.
 */
interface SessionInfoCardProps {
  /** Session data to display */
  session: DeliverySessionData;
  /** Total cans loaded for the day (centralized) */
  totalLoadedCans?: number;
  /** Remaining cans available for delivery */
  remainingCans?: number;
  /** Whether loaded cans has been set (locked) */
  isLoadedCansLocked?: boolean;
  /** Optional test ID */
  testID?: string;
}

/**
 * Card component displaying session information.
 * @param props - Component props
 * @returns JSX element
 */
export function SessionInfoCard({
  session,
  totalLoadedCans,
  remainingCans,
  isLoadedCansLocked = false,
  testID = 'session-info-card',
}: SessionInfoCardProps): React.JSX.Element {
  const isSubmitted = session.sessionStatus === 'SUBMITTED';

  return (
    <View style={styles.container} testID={testID}>
      {/* Info Row: Service, Staff, Date */}
      <View style={styles.infoRow}>
        {/* Service Info */}
        <View style={styles.infoItem}>
          <View style={styles.iconBg}>
            <Ionicons name="business" size={16} color={colors.primaryBlue} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Service</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {session.serviceName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Staff Info */}
        <View style={styles.infoItem}>
          <View style={styles.iconBg}>
            <Ionicons name="person" size={16} color={colors.primaryBlue} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Staff</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {session.staffName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Date Info */}
        <View style={styles.infoItem}>
          <View style={styles.iconBg}>
            <Feather name="calendar" size={16} color={colors.primaryBlue} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {session.sessionDate}
            </Text>
            <Text style={styles.todayLabel}>Today</Text>
          </View>
        </View>
      </View>

      {/* Centralized Loaded & Remaining Cans Section */}
      {isLoadedCansLocked && totalLoadedCans !== undefined && (
        <View style={styles.cansSection}>
          <View style={styles.cansRow}>
            {/* Total Loaded */}
            <View style={styles.cansItem}>
              <View style={[styles.cansIconBg, { backgroundColor: colors.primaryBlueSoft }]}>
                <Feather name="package" size={18} color={colors.primaryBlue} />
              </View>
              <View style={styles.cansTextContainer}>
                <Text style={styles.cansLabel}>Total Loaded</Text>
                <Text style={[styles.cansValue, { color: colors.primaryBlue }]}>
                  {totalLoadedCans}
                </Text>
              </View>
            </View>

            {/* Remaining */}
            <View style={styles.cansItem}>
              <View style={[
                styles.cansIconBg,
                { backgroundColor: (remainingCans ?? 0) > 0 ? colors.successSoft : colors.warningSoft }
              ]}>
                <Feather
                  name={(remainingCans ?? 0) > 0 ? "check-circle" : "alert-circle"}
                  size={18}
                  color={(remainingCans ?? 0) > 0 ? colors.success : colors.warning}
                />
              </View>
              <View style={styles.cansTextContainer}>
                <Text style={styles.cansLabel}>Remaining</Text>
                <Text style={[
                  styles.cansValue,
                  { color: (remainingCans ?? 0) > 0 ? colors.success : colors.warning }
                ]}>
                  {remainingCans ?? 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Session Status Badge */}
      {isSubmitted && (
        <View style={styles.statusBadge}>
          <Feather name="lock" size={14} color={colors.warning} />
          <Text style={styles.statusText}>Session Submitted</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  todayLabel: {
    fontSize: fontSize.xs,
    color: colors.primaryBlue,
    marginTop: 1,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
    alignSelf: 'stretch',
  },
  // Centralized cans section
  cansSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: 'dashed',
  },
  cansRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cansItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  cansIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cansTextContainer: {
    flex: 1,
  },
  cansLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  cansValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.warning,
  },
});