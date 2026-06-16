import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow, tones } from "../../../../theme";

interface Props {
  total: number;
  assigned: number;
  unassigned: number;
  employeesCount: number;
  testID?: string;
}

export function AssignmentStatsCards({ total, assigned, unassigned, employeesCount, testID }: Props) {
  return (
    <View style={styles.container} testID={testID}>
      {/* Total */}
      <View style={[styles.card, { backgroundColor: tones.purple.cardBg }]}>
        <View style={[styles.iconBg, { backgroundColor: tones.purple.iconBg }]}>
          <MaterialIcons name="grid-view" size={20} color={tones.purple.accent} />
        </View>
        <Text style={styles.statValue}>{total}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>

      {/* Assigned */}
      <View style={[styles.card, { backgroundColor: tones.green.cardBg }]}>
        <View style={[styles.iconBg, { backgroundColor: tones.green.iconBg }]}>
          <Ionicons name="checkmark-circle" size={20} color={tones.green.accent} />
        </View>
        <Text style={styles.statValue}>{assigned}</Text>
        <Text style={styles.statLabel}>Assigned</Text>
      </View>

      {/* Unassigned */}
      <View style={[styles.card, { backgroundColor: tones.red.cardBg }]}>
        <View style={[styles.iconBg, { backgroundColor: tones.red.iconBg }]}>
          <Ionicons name="close-circle" size={20} color={tones.red.accent} />
        </View>
        <Text style={styles.statValue}>{unassigned}</Text>
        <Text style={styles.statLabel}>Unassigned</Text>
      </View>

      {/* Employees */}
      <View style={[styles.card, { backgroundColor: tones.blue.cardBg }]}>
        <View style={[styles.iconBg, { backgroundColor: tones.blue.iconBg }]}>
          <Ionicons name="person" size={20} color={tones.blue.accent} />
        </View>
        <Text style={styles.statValue}>{employeesCount}</Text>
        <Text style={styles.statLabel}>Employees</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    minHeight: 80,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
