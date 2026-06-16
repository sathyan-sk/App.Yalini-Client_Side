import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
}

export function AssignmentSearchBar({ value, onChangeText, placeholder, testID }: Props) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || "Search by employee or asset..."}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          testID={`${testID}-input`}
        />
        {value.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textTertiary}
            onPress={() => onChangeText("")}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
});
