import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "../../../../../../theme";
import { SummaryMetricCard } from "./SummaryMetricCard";
import type { DriverRecord } from "../../../../../../types/dailyRecords";

interface SummarySectionProps {
  record: DriverRecord;
  testID?: string;
}

export function SummarySection({ record, testID }: SummarySectionProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>Summary (Overall)</Text>
      
      <View style={styles.grid}>
        <View style={styles.row}>
          <View style={styles.gridItem}>
            <SummaryMetricCard
              type="trips"
              value={record.trips}
              label="Total Trips"
            />
          </View>
          <View style={styles.gridItem}>
            <SummaryMetricCard
              type="income"
              value={record.totalIncome}
              label="Total Income"
            />
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.gridItem}>
            <SummaryMetricCard
              type="expense"
              value={record.totalExpense}
              label="Total Expense"
            />
          </View>
          <View style={styles.gridItem}>
            <SummaryMetricCard
              type="settled"
              value={record.settledToAdmin}
              label="Settled to Admin"
            />
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.gridItemFull}>
            <SummaryMetricCard
              type="balance"
              value={record.balanceShortage}
              label="Balance (Shortage)"
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
  gridItemFull: {
    flex: 1,
  },
});
