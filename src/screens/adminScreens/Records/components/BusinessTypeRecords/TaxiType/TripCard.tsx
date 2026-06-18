import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, lightShadow } from "../../../../../../theme";
import { formatCurrency, formatDistance } from "../../../../../../utils/format";
import type { TripDetail } from "../../../../../../types/taxiRecords";

interface TripCardProps {
  trip: TripDetail;
  onPress?: () => void;
  testID?: string;
}

export function TripCard({ trip, onPress, testID }: TripCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && onPress && styles.pressed,
      ]}
      testID={testID}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.tripNumberContainer}>
          <Text style={styles.tripNumber}>{trip.tripNumber}</Text>
        </View>
        <Text style={styles.destination}>{trip.destination}</Text>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>{formatDistance(trip.distance)}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Income</Text>
          <Text style={[styles.metricValue, styles.incomeValue]}>
            {formatCurrency(trip.income)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Expense</Text>
          <Text style={[styles.metricValue, styles.expenseValue]}>
            {formatCurrency(trip.expense)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    ...lightShadow,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  tripNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  tripNumber: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  destination: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  metricsRow: {
    flexDirection: "row",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  incomeValue: {
    color: colors.successDark,
  },
  expenseValue: {
    color: colors.error,
  },
});
