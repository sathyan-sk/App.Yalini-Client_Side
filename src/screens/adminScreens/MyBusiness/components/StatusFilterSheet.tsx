import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { BusinessStatusFilter } from "../types";

interface StatusFilterSheetProps {
  visible: boolean;
  value: BusinessStatusFilter;
  onSelect: (next: BusinessStatusFilter) => void;
  onClose: () => void;
}

const OPTIONS: Array<{ value: BusinessStatusFilter; label: string; helper: string }> = [
  { value: "all", label: "All Status", helper: "Show every business" },
  { value: "enabled", label: "Enabled", helper: "Only enabled businesses" },
  { value: "disabled", label: "Disabled", helper: "Disabled or paused businesses" },
];

/**
 * Bottom-sheet status filter for the Businesses list.
 *
 * Triple-option radio list backed by an opaque overlay. Closes on backdrop
 * tap, close button, or option selection.
 */
export function StatusFilterSheet({
  visible,
  value,
  onSelect,
  onClose,
}: StatusFilterSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        testID="status-filter-backdrop"
      >
        <Pressable
          onPress={() => {}}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.md },
          ]}
          testID="status-filter-sheet"
        >
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>Filter by status</Text>
            <Pressable
              testID="status-filter-close"
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {OPTIONS.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                testID={`status-filter-option-${option.value}`}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => onSelect(option.value)}
                style={({ pressed }) => [
                  styles.row,
                  selected && styles.rowSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{option.label}</Text>
                  <Text style={styles.rowHelper}>{option.helper}</Text>
                </View>
                <Ionicons
                  name={selected ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={selected ? colors.brand : colors.textTertiary}
                />
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  rowSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  rowHelper: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
