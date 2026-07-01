import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, spacing } from "../../theme";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  testID: string;
  rightElement?: React.ReactNode;
}

export function SectionHeader({ title, onViewAll, testID, rightElement }: SectionHeaderProps) {
  return (
    <View style={styles.row} testID={testID}>
      <Text style={styles.title}>{title}</Text>
      {rightElement || (onViewAll ? (
        <Pressable
          testID={`${testID}-view-all`}
          onPress={onViewAll}
          hitSlop={8}
          style={({ pressed }) => [styles.viewAll, pressed && styles.pressed]}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Feather name="chevron-right" size={16} color={colors.brand} />
        </Pressable>
      ) : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 44,
    paddingLeft: spacing.sm,
  },
  viewAllText: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.brand,
  },
  pressed: {
    opacity: 0.6,
  },
});
