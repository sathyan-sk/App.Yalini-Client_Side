import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { BusinessStatusId } from "../types";

interface StatusSwitchRowProps {
  value: BusinessStatusId;
  onChange: (next: BusinessStatusId) => void;
  testID?: string;
}

/**
 * Enabled / Disabled toggle row used in the Add and Edit Business forms.
 *
 * Renders inside a white card matching the other form rows:
 *  [label + helper text] [native switch].
 *
 * The status copy + accent recolour the supporting text so the live state
 * is glanceable even when the switch is at the screen edge.
 */
export function StatusSwitchRow({
  value,
  onChange,
  testID,
}: StatusSwitchRowProps) {
  const isActive = value === "enabled";

  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>
          Status <Text style={styles.required}>*</Text>
        </Text>
        <Text
          style={[
            styles.statusText,
            { color: isActive ? colors.success : colors.warning },
          ]}
          testID={`${testID ?? "status-row"}-state`}
        >
          {isActive ? "Enabled" : "Disabled"}
          <Text style={styles.helperText}>
            {"  "}
            {isActive
              ? "— Business is visible and operational."
              : "— Business is hidden from employees."}
          </Text>
        </Text>
      </View>

      <Switch
        testID={`${testID ?? "status-row"}-switch`}
        value={isActive}
        onValueChange={(next) => onChange(next ? "enabled" : "disabled")}
        trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
        thumbColor={isActive ? colors.success : "#F3F4F6"}
        ios_backgroundColor="#D1D5DB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  helperText: {
    color: colors.textSecondary,
    fontWeight: "400",
  },
});
