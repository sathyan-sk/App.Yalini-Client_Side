import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { cardShadow, colors, fontSize, radius, spacing } from "../../../../../theme";
import type { Business } from "../../../../../types/dailyRecords";

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusiness: Business | null;
  onSelect: (business: Business) => void;
}

export function BusinessSelector({
  businesses,
  selectedBusiness,
  onSelect,
}: BusinessSelectorProps) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (business: Business) => {
    onSelect(business);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
        onPress={() => setVisible(true)}
        testID="business-selector"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="car" size={16} color={colors.brand} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Business</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value} numberOfLines={1}>
              {selectedBusiness?.name || "Select"}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textTertiary} />
          </View>
        </View>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select Business</Text>
            <ScrollView style={styles.list}>
              {businesses.map((business) => (
                <Pressable
                  key={business.id}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                    selectedBusiness?.id === business.id && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(business)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedBusiness?.id === business.id && styles.optionTextSelected,
                    ]}
                  >
                    {business.name}
                  </Text>
                  {selectedBusiness?.id === business.id && (
                    <Ionicons name="checkmark" size={20} color={colors.brand} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    maxHeight: "60%",
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  optionPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  optionSelected: {
    backgroundColor: colors.brandSoft,
  },
  optionText: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.brand,
    fontWeight: "600",
  },
});