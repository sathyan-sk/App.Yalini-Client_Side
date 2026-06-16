import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { VehicleStatusFilter } from "../../../../types/vehicle";

interface StatusFilterSheetProps {
  visible: boolean;
  value: VehicleStatusFilter;
  onSelect: (filter: VehicleStatusFilter) => void;
  onClose: () => void;
}

const FILTER_OPTIONS: {
  id: VehicleStatusFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { id: "all", label: "All Vehicles", icon: "car", color: colors.brand },
  { id: "enabled", label: "Enabled", icon: "car-sport", color: colors.running },
  { id: "disabled", label: "Disabled", icon: "car-sport", color: colors.maintenance },
];

export function StatusFilterSheet({
  visible,
  value,
  onSelect,
  onClose,
}: StatusFilterSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter by Status</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Feather name="x" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          {FILTER_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={({ pressed }) => [
                styles.option,
                value === option.id && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                <Ionicons name={option.icon} size={20} color={option.color} />
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  value === option.id && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              {value === option.id && (
                <Feather name="check" size={20} color={colors.brand} />
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionSelected: {
    backgroundColor: colors.brandSoft,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    fontWeight: "600",
    color: colors.brand,
  },
});
