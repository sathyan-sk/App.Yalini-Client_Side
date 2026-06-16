import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import type { VehicleStatusId } from "../../../../types/vehicle";
import { VEHICLE_STATUS_OPTIONS } from "../../../../data/vehicleConstants";

interface StatusSelectorCardProps {
  statusId: VehicleStatusId;
  selected: boolean;
  onSelect: () => void;
  testID?: string;
}

export function StatusSelectorCard({
  statusId,
  selected,
  onSelect,
  testID,
}: StatusSelectorCardProps) {
  const option = VEHICLE_STATUS_OPTIONS.find((o) => o.id === statusId)!;
  const tone = tones[option.tone];
  const isEnabled = statusId === "enabled";

  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.container,
        selected && styles.containerSelected,
        pressed && styles.containerPressed,
      ]}
      testID={testID}
    >
      {/* Radio button */}
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>

      {/* Icon */}
      <View style={[styles.iconBg, { backgroundColor: tone.iconBg }]}>
        {isEnabled ? (
          <Ionicons name="car-sport" size={24} color={tone.accent} />
        ) : (
          <Ionicons name="construct" size={24} color={tone.accent} />
        )}
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.label}>{option.label}</Text>
        <Text style={styles.description}>{option.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  containerSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  containerPressed: {
    opacity: 0.9,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.brand,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  description: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
