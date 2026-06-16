import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";
import type { HotelStatusFilter } from "../types";
import { HOTEL_STATUS_OPTIONS } from "../data/constants";

interface StatusFilterSheetProps {
  visible: boolean;
  value: HotelStatusFilter;
  onSelect: (next: HotelStatusFilter) => void;
  onClose: () => void;
}

/**
 * Bottom sheet for filtering hotels by status.
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
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Filter by Status</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Feather name="x" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.options}>
            {HOTEL_STATUS_OPTIONS.map((option) => {
              const isSelected = value === option.id;
              return (
                <Pressable
                  key={option.id}
                  testID={`filter-option-${option.id}`}
                  onPress={() => onSelect(option.id)}
                  style={({ pressed }) => [
                    styles.option,
                    isSelected && styles.optionSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.optionContent}>
                    {option.id === "enabled" && (
                      <View
                        style={[styles.dot, { backgroundColor: colors.success }]}
                      />
                    )}
                    {option.id === "disabled" && (
                      <View
                        style={[styles.dot, { backgroundColor: colors.warning }]}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.brand}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.brand,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
