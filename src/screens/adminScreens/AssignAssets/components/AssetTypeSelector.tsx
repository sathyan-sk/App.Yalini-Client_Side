import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";
import { ASSET_TYPE_OPTIONS } from "../data/constants";
import type { AssetType } from "../types";

interface AssetTypeSelectorProps {
  selectedType: AssetType;
  onSelect: (type: AssetType) => void;
  testID?: string;
}

export function AssetTypeSelector({
  selectedType,
  onSelect,
  testID,
}: AssetTypeSelectorProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>SELECT ASSET TYPE</Text>
      <View style={styles.optionsRow}>
        {ASSET_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;
          const tone = tones[option.tone];

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && { borderColor: tone.accent, borderWidth: 2 },
              ]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
              testID={`${testID}-${option.id}`}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: tone.iconBg },
                ]}
              >
                <Ionicons
                  name={option.iconName}
                  size={24}
                  color={tone.accent}
                />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription} numberOfLines={2}>
                {option.description}
              </Text>
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: tone.accent }]}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  optionLabel: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  checkmark: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
