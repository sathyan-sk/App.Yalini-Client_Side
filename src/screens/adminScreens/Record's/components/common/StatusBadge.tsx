import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, radius } from "../../../../../theme";
import type { RecordStatus } from "../../../../../types/dailyRecords";

const STATUS_CONFIG: Record<
  RecordStatus,
  { label: string; bg: string; text: string }
> = {
  submitted: { label: "Submitted", bg: colors.successSoft, text: colors.success },
  pending: { label: "Pending", bg: colors.warningSoft, text: colors.warning },
};

interface StatusBadgeProps {
  status: RecordStatus;
  testID?: string;
}

export function StatusBadge({ status, testID }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]} testID={testID}>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
