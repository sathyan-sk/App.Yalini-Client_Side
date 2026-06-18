import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../../../theme";
import { formatCurrency } from "../../../../../../utils/format";

type FooterCardType = "fuel" | "balance";

interface FooterSummaryCardProps {
  type: FooterCardType;
  value: number;
  testID?: string;
}

export function FooterSummaryCard({ type, value, testID }: FooterSummaryCardProps) {
  const isFuel = type === "fuel";
  const backgroundColor = isFuel ? colors.warningSoft : colors.errorSoft;
  const iconColor = isFuel ? colors.warning : colors.error;
  const valueColor = isFuel ? colors.textPrimary : colors.error;

  return (
    <View style={[styles.container, { backgroundColor }]} testID={testID}>
      <View style={styles.leftContent}>
        {isFuel ? (
          <MaterialCommunityIcons name="fuel" size={24} color={iconColor} />
        ) : (
          <MaterialCommunityIcons name="wallet-outline" size={24} color={iconColor} />
        )}
        <Text style={styles.label}>
          {isFuel ? "Fuel Expense (Total)" : "Final Balance (Shortage)"}
        </Text>
      </View>
      <Text style={[styles.value, { color: valueColor }]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
});
