import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { cardShadow, colors, fontSize, radius, spacing } from "../../../../theme";
import { formatDisplayDate } from "../../../../utils/format";

interface DateSelectorPillProps {
  isoDate: string;
  onPress: () => void;
}

export function DateSelectorPill({ isoDate, onPress }: DateSelectorPillProps) {
  return (
    <Pressable
      testID="dashboard-date-selector"
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <Feather name="calendar" size={18} color={colors.textSecondary} />
      <Text style={styles.dateText} testID="dashboard-selected-date">
        {formatDisplayDate(isoDate)}
      </Text>
      <Feather name="chevron-down" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.7,
  },
  dateText: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.textPrimary,
  },
});
