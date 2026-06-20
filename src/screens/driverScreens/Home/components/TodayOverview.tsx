/**
 * TodayOverview - Shows today's summary stats (trips, income, expenses)
 * Pixel-perfect match to design specifications
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, spacing, radius, cardShadow } from "../../../../theme";
import type { TodayOverview as TodayOverviewType } from "../../../../types/driver";

interface TodayOverviewProps {
  data: TodayOverviewType;
}

const INFO_BG = "#E3F2FD";
const INFO_COLOR = "#1976D2";

export function TodayOverview({ data }: TodayOverviewProps) {
  const { totalTrips, totalIncome, totalExpenses } = data;
  const hasNoTrips = totalTrips === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Overview</Text>
      
      <View style={styles.card}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Total Trips */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Trips</Text>
            <Text style={[styles.statValue, styles.blueValue]}>{totalTrips}</Text>
            <Text style={styles.statSubLabel}>Trips Added</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total Income */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={[styles.statValue, styles.blueValue]}>
              <Text style={styles.rupeeSymbol}>₹</Text>{totalIncome}
            </Text>
            <Text style={styles.statSubLabel}>Income Today</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total Expenses */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={[styles.statValue, styles.redValue]}>
              <Text style={styles.rupeeSymbol}>₹</Text>{totalExpenses}
            </Text>
            <Text style={styles.statSubLabel}>Expenses Today</Text>
          </View>
        </View>

        {/* Info Banner (shown when no trips) */}
        {hasNoTrips && (
          <View style={styles.infoBanner}>
            <Feather name="info" size={16} color={INFO_COLOR} />
            <Text style={styles.infoBannerText}>
              No trips added yet. Add your first trip to get started.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
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
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    marginBottom: 2,
  },
  blueValue: {
    color: colors.primaryBlue,
  },
  redValue: {
    color: colors.error,
  },
  rupeeSymbol: {
    fontSize: fontSize.xl,
  },
  statSubLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: INFO_BG,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: INFO_COLOR,
  },
});
