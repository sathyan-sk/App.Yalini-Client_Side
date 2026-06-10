import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius } from "../../theme";
import type { SubmissionStatus } from "../../types/dashboard";

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; bg: string; text: string }
> = {
  submitted: { label: "Submitted", bg: colors.successSoft, text: colors.success },
  pending: { label: "Pending", bg: colors.warningSoft, text: colors.warning },
};

interface StatusPillProps {
  status: SubmissionStatus;
  testID: string;
}

export function StatusPill({ status, testID }: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.pill, { backgroundColor: config.bg }]} testID={testID}>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
});
