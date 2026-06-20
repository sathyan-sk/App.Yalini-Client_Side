/**
 * RecentActivity - Shows recent trips/expenses or empty state
 * Pixel-perfect match to design specifications
 */
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { colors, fontSize, spacing, radius, cardShadow } from "../../../../theme";
import type { RecentActivity as RecentActivityType } from "../../../../types/driver";

interface RecentActivityProps {
  activities: RecentActivityType[];
  onViewAll: () => void;
}

export function RecentActivity({ activities, onViewAll }: RecentActivityProps) {
  const hasActivities = activities.length > 0;

  return (
    <View style={styles.container}>
      {/* Header with View All */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        {hasActivities ? (
          <View style={styles.activityList}>
            {activities.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index < activities.length - 1 && styles.activityItemBorder,
                ]}
              >
                <View
                  style={[
                    styles.activityIcon,
                    activity.type === "trip"
                      ? styles.tripIconBg
                      : styles.expenseIconBg,
                  ]}
                >
                  {activity.type === "trip" ? (
                    <MaterialCommunityIcons
                      name="car"
                      size={18}
                      color="#1976D2"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="cash-minus"
                      size={18}
                      color="#C62828"
                    />
                  )}
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Text
                  style={[
                    styles.activityAmount,
                    activity.type === "trip"
                      ? styles.incomeAmount
                      : styles.expenseAmount,
                  ]}
                >
                  {activity.type === "trip" ? "+" : "-"}₹{activity.amount}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={40}
                color={colors.textTertiary}
              />
            </View>
            <Text style={styles.emptyTitle}>No activity yet for today.</Text>
            <Text style={styles.emptySubtitle}>
              Start adding trips to see your activity here.
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
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.primaryBlue,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  activityList: {
    gap: spacing.sm,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.md,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  tripIconBg: {
    backgroundColor: "#E3F2FD",
  },
  expenseIconBg: {
    backgroundColor: "#FFEBEE",
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  activityTime: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  incomeAmount: {
    color: colors.success,
  },
  expenseAmount: {
    color: colors.error,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
