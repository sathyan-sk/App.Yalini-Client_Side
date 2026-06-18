import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../../../theme";
import { formatDisplayDate, formatCurrency } from "../../../../../../utils/format";
import { Avatar } from "../../common/Avatar";
import { StatusBadge } from "../../common/StatusBadge";
import type { WaterDeliveryRecord } from "../../../../../../types/waterRecords";

interface DeliveryPersonInfoHeaderProps {
  record: WaterDeliveryRecord;
  testID?: string;
}

export function DeliveryPersonInfoHeader({ record, testID }: DeliveryPersonInfoHeaderProps) {
  return (
    <View style={styles.container} testID={testID}>
      {/* Delivery Person Info Row */}
      <View style={styles.personRow}>
        <Avatar name={record.deliveryPersonName} color={record.avatarColor} size={48} />
        <View style={styles.personInfo}>
          <Text style={styles.personName}>{record.deliveryPersonName}</Text>
          <Text style={styles.date}>{formatDisplayDate(record.date)}</Text>
        </View>
        <StatusBadge status={record.status} />
      </View>

      {/* Key Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={styles.metricIconRow}>
            <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Total Hotels</Text>
          </View>
          <Text style={styles.metricValue}>{record.totalHotels}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <View style={styles.metricIconRow}>
            <Ionicons name="water" size={18} color={colors.textSecondary} />
            <Text style={styles.metricLabel}>Total Cans</Text>
          </View>
          <Text style={styles.metricValue}>{record.totalCans}</Text>
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
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  personInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  personName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metricItem: {
    flex: 1,
  },
  metricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },
});
