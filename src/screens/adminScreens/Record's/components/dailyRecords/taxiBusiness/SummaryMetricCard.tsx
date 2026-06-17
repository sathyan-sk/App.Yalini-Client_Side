import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, lightShadow } from "../../../../../../theme";
import { formatCurrency } from "../../../../../../utils/format";

type SummaryMetricType = "trips" | "income" | "expense" | "settled" | "balance";

interface SummaryMetricCardProps {
  type: SummaryMetricType;
  value: number | string;
  label: string;
  testID?: string;
}

const getIconAndColor = (type: SummaryMetricType) => {
  switch (type) {
    case "trips":
      return {
        icon: <Feather name="truck" size={20} color={colors.textSecondary} />,
        valueColor: colors.textPrimary,
      };
    case "income":
      return {
        icon: <MaterialCommunityIcons name="currency-inr" size={20} color={colors.successDark} />,
        valueColor: colors.successDark,
      };
    case "expense":
      return {
        icon: <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.error} />,
        valueColor: colors.error,
      };
    case "settled":
      return {
        icon: <MaterialCommunityIcons name="wallet-bifold-outline" size={20} color={colors.primaryBlue} />,
        valueColor: colors.primaryBlue,
      };
    case "balance":
      return {
        icon: <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.error} />,
        valueColor: colors.error,
      };
    default:
      return {
        icon: <Feather name="info" size={20} color={colors.textSecondary} />,
        valueColor: colors.textPrimary,
      };
  }
};

export function SummaryMetricCard({ type, value, label, testID }: SummaryMetricCardProps) {
  const { icon, valueColor } = getIconAndColor(type);
  const displayValue = typeof value === "number" ? 
    (type === "trips" ? value.toString() : formatCurrency(value)) : 
    value;

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{displayValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...lightShadow,
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
});
