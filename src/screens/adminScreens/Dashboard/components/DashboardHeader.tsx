import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, spacing } from "../../../../theme";

interface DashboardHeaderProps {
  onMenuPress?: () => void;
  onBellPress: () => void;
}

export function DashboardHeader({ onBellPress }: DashboardHeaderProps) {
  return (
    <View style={styles.row} testID="dashboard-header">
      <View style={styles.titleBlock}>
        <Text style={styles.title} testID="dashboard-title">
          Dashboard
        </Text>
        <Text style={styles.subtitle} testID="dashboard-welcome-text">
          Welcome, Admin
        </Text>
      </View>

      <Pressable
        testID="dashboard-notifications-button"
        onPress={onBellPress}
        hitSlop={8}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Feather name="bell" size={22} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
