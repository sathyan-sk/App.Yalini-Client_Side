import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../../src/theme";
import type { HotelStatusId } from "../types";

interface StatusSelectorProps {
  value: HotelStatusId;
  onChange: (next: HotelStatusId) => void;
  testID?: string;
}

/**
 * Enabled/Disabled toggle buttons matching the design exactly.
 * Enabled has green border and check icon, Disabled has orange border and X icon.
 */
export function StatusSelector({
  value,
  onChange,
  testID,
}: StatusSelectorProps) {
  const isActive = value === "enabled";

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.sectionHeader}>
        <Ionicons name="options" size={20} color="#0B1F3F" />
        <Text style={styles.sectionTitle}>Hotel Status</Text>
      </View>

      <Text style={styles.label}>
        Status <Text style={styles.required}>*</Text>
      </Text>

      <View style={styles.toggleRow}>
        <Pressable
          testID="status-active-button"
          onPress={() => onChange("enabled")}
          style={({ pressed }) => [
            styles.toggleButton,
            isActive && styles.activeButton,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.buttonContent}>
            <View
              style={[
                styles.radioOuter,
                isActive && styles.radioOuterActive,
              ]}
            >
              {isActive && <View style={styles.radioInner} />}
            </View>
            <Text style={[styles.buttonText, isActive && styles.activeText]}>
              Enabled
            </Text>
          </View>
          {isActive && (
            <Feather name="check" size={20} color="#16A34A" />
          )}
        </Pressable>

        <Pressable
          testID="status-disabled-button"
          onPress={() => onChange("disabled")}
          style={({ pressed }) => [
            styles.toggleButton,
            !isActive && styles.inactiveButton,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.buttonContent}>
            <View
              style={[
                styles.radioOuter,
                !isActive && styles.radioOuterInactive,
              ]}
            >
              {!isActive && <View style={styles.radioInnerInactive} />}
            </View>
            <Text style={[styles.buttonText, !isActive && styles.inactiveText]}>
              Disabled
            </Text>
          </View>
          {!isActive && (
            <Feather name="x" size={20} color="#EA580C" />
          )}
        </Pressable>
      </View>

      <Text style={styles.helperText}>
        Enabled hotels will be available for deliveries.{"\n"}
        Disabled hotels will be temporarily unavailable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#0B1F3F",
  },
  required: {
    color: colors.error,
  },
  toggleRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeButton: {
    borderColor: "#16A34A",
    backgroundColor: "#ECFDF5",
  },
  inactiveButton: {
    borderColor: "#EA580C",
    backgroundColor: "#FFF7ED",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#16A34A",
  },
  radioOuterInactive: {
    borderColor: "#EA580C",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },
  radioInnerInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EA580C",
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeText: {
    color: "#16A34A",
  },
  inactiveText: {
    color: "#EA580C",
  },
  helperText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.8,
  },
});
