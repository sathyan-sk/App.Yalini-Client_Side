import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "../../../../../../../src/theme";
import { WaterSummaryMetricCard } from "./WaterSummaryMetricCard";
import type { WaterDeliveryRecord } from "../../../../../../../src/types/waterRecords";

interface WaterSummarySectionProps {
  record: WaterDeliveryRecord;
  testID?: string;
}

export function WaterSummarySection({ record, testID }: WaterSummarySectionProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>Summary (Overall)</Text>
      
      <View style={styles.grid}>
        {/* Row 1: Delivered & Returned */}
        <View style={styles.row}>
          <View style={styles.gridItem}>
            <WaterSummaryMetricCard
              type="delivered"
              value={record.totalDelivered}
              label="Total Delivered"
            />
          </View>
          <View style={styles.gridItem}>
            <WaterSummaryMetricCard
              type="returned"
              value={record.totalReturned}
              label="Total Returned"
            />
          </View>
        </View>
        
        {/* Row 2: Outstanding & Income */}
        <View style={styles.row}>
          <View style={styles.gridItem}>
            <WaterSummaryMetricCard
              type="outstanding"
              value={record.totalOutstanding}
              label="Outstanding Cans"
            />
          </View>
          <View style={styles.gridItem}>
            <WaterSummaryMetricCard
              type="income"
              value={record.totalIncome}
              label="Total Income"
            />
          </View>
        </View>
        
        {/* Row 3: Expense & Profit */}
        <View style={styles.row}>
          <View style={styles.gridItem}>
            <WaterSummaryMetricCard
              type="expense"
              value={record.totalExpense}
              label="Total Expense"
            />
          </View>
          <View style={styles.gridItem}>
            <WaterSummaryMetricCard
              type="profit"
              value={record.totalProfit}
              label="Total Profit"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  gridItem: {
    flex: 1,
  },
});
