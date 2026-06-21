/**
 * SessionInfoCard - Displays current delivery session information.
 *
 * Shows service name, staff name, date, and session status.
 * Visual design matches the reference image header section.
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
  /** Rate per can for selected hotel */
  ratePerCan?: number;
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
  ratePerCan,
  testID = 'session-info-card',
}: SessionInfoCardProps): React.JSX.Element {
  const isSubmitted = session.sessionStatus === 'SUBMITTED';

  return (
    <View style={styles.container} testID={testID}>
      {/* Info Row: Hotel, Staff, Date */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <View style={styles.iconBg}>
            <Ionicons name="business" size={18} color={colors.primaryBlue} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Service</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {session.serviceName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <View style={styles.iconBg}>
            <Ionicons name="person" size={18} color={colors.primaryBlue} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Staff</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {session.staffName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <View style={styles.iconBg}>
            <Feather name="calendar" size={18} color={colors.primaryBlue} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{session.sessionDate}</Text>
            <Text style={styles.todayLabel}>Today</Text>
          </View>
        </View>
      </View>

      {/* Rate per Can */}
      {ratePerCan !== undefined && ratePerCan > 0 && (
        <View style={styles.rateSection}>
          <View style={styles.rateIconBg}>
            <Feather name="tag" size={20} color={colors.primaryBlue} />
          </View>
          <View>
            <Text style={styles.rateLabel}>Rate per Can (₹)</Text>
            <Text style={styles.rateValue}>₹{ratePerCan.toFixed(2)}</Text>
            <Text style={styles.rateNote}>Default rate set by admin</Text>
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
    marginTop: -spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  todayLabel: {
    fontSize: fontSize.xs,
    color: colors.primaryBlue,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  rateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: 'dashed',
    gap: spacing.md,
  },
  rateIconBg: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  rateValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  rateNote: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
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
