import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../../theme";

interface BusinessSelectorProps {
  businessName: string;
  onPress: () => void;
  testID?: string;
}

export function BusinessSelector({ businessName, onPress, testID }: BusinessSelectorProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <Feather name="truck" size={18} color={colors.textSecondary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Business</Text>
        <Text style={styles.value}>{businessName}</Text>
      </View>
      <Feather name="chevron-down" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flex: 1,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
