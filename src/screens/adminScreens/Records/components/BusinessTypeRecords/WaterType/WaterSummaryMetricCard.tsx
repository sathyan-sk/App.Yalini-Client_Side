import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, lightShadow } from "../../../../../../theme";
import { formatCurrency } from "../../../../../../utils/format";

type WaterSummaryMetricType = 
  | "delivered" 
  | "returned" 
  | "outstanding" 
  | "income" 
  | "expense" 
  | "profit"
  | "settled"
  | "cash_settled"
  | "online_settled";

interface WaterSummaryMetricCardProps {
  type: WaterSummaryMetricType;
  value: number | string;
  label: string;
  testID?: string;
}

const getIconAndColor = (type: WaterSummaryMetricType) => {
  switch (type) {
    case "delivered":
      return {
        icon: <Feather name="check-circle" size={20} color={colors.successDark} />,
        valueColor: colors.successDark,
        bgColor: colors.successSoft,
      };
    case "returned":
      return {
        icon: <Feather name="rotate-ccw" size={20} color={colors.primaryBlue} />,
        valueColor: colors.primaryBlue,
        bgColor: colors.primaryBlueSoft,
      };
    case "outstanding":
      return {
        icon: <Feather name="alert-circle" size={20} color={colors.warning} />,
        valueColor: colors.warning,
        bgColor: colors.warningSoft,
      };
    case "income":
      return {
        icon: <MaterialCommunityIcons name="currency-inr" size={20} color={colors.successDark} />,
        valueColor: colors.successDark,
        bgColor: colors.successSoft,
      };
    case "expense":
      return {
        icon: <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.error} />,
        valueColor: colors.error,
        bgColor: colors.errorSoft,
      };
    case "profit":
      return {
        icon: <Feather name="trending-up" size={20} color={colors.brand} />,
        valueColor: colors.brand,
        bgColor: colors.brandSoft,
      };
    case "settled":
      return {
        icon: <Feather name="dollar-sign" size={20} color="#FF9800" />,
        valueColor: '#FF9800',
        bgColor: '#FFF3E0',
      };
    case "cash_settled":
      return {
        icon: <MaterialCommunityIcons name="cash" size={20} color={colors.successDark} />,
        valueColor: colors.successDark,
        bgColor: colors.successSoft,
      };
    case "online_settled":
      return {
        icon: <Feather name="smartphone" size={20} color={colors.primaryBlue} />,
        valueColor: colors.primaryBlue,
        bgColor: colors.primaryBlueSoft,
      };
    default:
      return {
        icon: <Feather name="info" size={20} color={colors.textSecondary} />,
        valueColor: colors.textPrimary,
        bgColor: colors.surfaceSecondary,
      };
  }
};

export function WaterSummaryMetricCard({ type, value, label, testID }: WaterSummaryMetricCardProps) {
  const { icon, valueColor, bgColor } = getIconAndColor(type);
  const isCurrency = ["income", "expense", "profit", "settled", "cash_settled", "online_settled"].includes(type);
  const displayValue = typeof value === "number" 
    ? (isCurrency ? formatCurrency(value) : value.toString()) 
    : value;

  return (
    <View style={styles.container} testID={testID}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
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
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
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
