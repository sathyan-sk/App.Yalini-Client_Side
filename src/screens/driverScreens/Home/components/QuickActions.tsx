/**
 * QuickActions - Grid of quick action buttons
 * Pixel-perfect match to design specifications
 */
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

import { colors, fontSize, spacing, radius, cardShadow } from "../../../../theme";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

interface QuickActionsProps {
  onAddTrip: () => void;
  onAddExpense: () => void;
  onAllTrips: () => void;
  onCheckout: () => void;
  onStartDayInfo: () => void;
}

export function QuickActions({
  onAddTrip,
  onAddExpense,
  onAllTrips,
  onCheckout,
  onStartDayInfo,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "add_trip",
      label: "Add Trip",
      icon: <MaterialCommunityIcons name="car-side" size={24} color="#1976D2" />,
      iconBgColor: "#E3F2FD",
      onPress: onAddTrip,
    },
    {
      id: "add_expense",
      label: "Add Expense",
      icon: <MaterialCommunityIcons name="text-box-plus" size={24} color="#388E3C" />,
      iconBgColor: "#E8F5E9",
      onPress: onAddExpense,
    },
    {
      id: "all_trips",
      label: "All Trips",
      icon: <Ionicons name="list" size={24} color="#F57C00" />,
      iconBgColor: "#FFF3E0",
      onPress: onAllTrips,
    },
    {
      id: "checkout",
      label: "Checkout",
      icon: <MaterialCommunityIcons name="file-document-outline" size={24} color="#7B1FA2" />,
      iconBgColor: "#F3E5F5",
      onPress: onCheckout,
    },
    {
      id: "start_day_info",
      label: "Start Day\nInfo",
      icon: <MaterialCommunityIcons name="clipboard-text-outline" size={24} color="#00897B" />,
      iconBgColor: "#E0F2F1",
      onPress: onStartDayInfo,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: action.iconBgColor },
              ]}
            >
              {action.icon}
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionButton: {
    width: "18.5%",
    minWidth: 64,
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  actionButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: fontSize.xs,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 14,
  },
});
