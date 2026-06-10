import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { StatusPill } from "../../components/common/StatusPill";
import { colors, fontSize, radius, spacing } from "../../theme";
import type { Submission } from "../../types/dashboard";
import { formatDisplayDate } from "../../utils/format";

interface SubmissionListItemProps {
  submission: Submission;
  isLast: boolean;
  onPress: () => void;
}

export function SubmissionListItem({
  submission,
  isLast,
  onPress,
}: SubmissionListItemProps) {
  return (
    <Pressable
      testID={`submission-item-${submission.id}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowBorder,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: submission.avatarColor }]}>
        <Text style={styles.avatarText}>
          {submission.employeeName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.nameBlock}>
        <Text style={styles.name} numberOfLines={1}>
          {submission.employeeName}
        </Text>
        <Text style={styles.business} numberOfLines={1}>
          {submission.businessName}
        </Text>
      </View>

      <View style={styles.dateBlock}>
        <Text style={styles.dateText}>{formatDisplayDate(submission.date)}</Text>
        <Text style={styles.timeText}>{submission.time}</Text>
      </View>

      <StatusPill
        status={submission.status}
        testID={`submission-status-${submission.id}`}
      />
      <Feather name="chevron-right" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 64,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  nameBlock: {
    flex: 1,
    gap: 2,
    marginLeft: spacing.xs,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  business: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  dateBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
});
