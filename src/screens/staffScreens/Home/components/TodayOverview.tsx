/**
 * TodayOverview - Shows today's stats in a horizontal card layout
 * Displays: Assigned Hotels, Deliveries Done, Cash Collected, Credit Sales
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';
import type { TodayOverviewData } from '../types';

interface TodayOverviewProps {
  data: TodayOverviewData;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  value: string | number;
  label: string;
  valueColor?: string;
}

function StatCard({ icon, iconBgColor, value, label, valueColor = colors.textPrimary }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>{label}</Text>
    </View>
  );
}

export function TodayOverview({ data }: TodayOverviewProps) {
  const { assignedHotels, deliveriesDone, cashCollected, creditSales, totalOutstandingCans } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Overview</Text>
      
      <View style={styles.card}>
        <View style={styles.statsRow}>
          {/* Assigned Hotels */}
          <StatCard
            icon={<MaterialCommunityIcons name="office-building" size={24} color="#1976D2" />}
            iconBgColor="#E3F2FD"
            value={assignedHotels}
            label="Assigned Hotels"
            valueColor="#1976D2"
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Outstanding Cans */}
          <StatCard
            icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color="#E65100" />}
            iconBgColor="#FFF3E0"
            value={totalOutstandingCans || 0}
            label="Outstanding Cans"
            valueColor="#E65100"
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Deliveries Done */}
          <StatCard
            icon={<MaterialCommunityIcons name="clipboard-check-outline" size={24} color="#388E3C" />}
            iconBgColor="#E8F5E9"
            value={deliveriesDone}
            label="Deliveries Done"
            valueColor="#388E3C"
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Cash Collected */}
          <StatCard
            icon={<FontAwesome5 name="rupee-sign" size={20} color="#F57C00" />}
            iconBgColor="#FFF3E0"
            value={`₹${cashCollected}`}
            label="Cash Collected"
            valueColor="#388E3C"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    margin: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  divider: {
    width: 1,
    height: 80,
    backgroundColor: colors.border,
  },
});
