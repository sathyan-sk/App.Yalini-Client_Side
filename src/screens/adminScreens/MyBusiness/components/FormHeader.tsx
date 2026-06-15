import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontSize, spacing } from "../../../../theme";
import { FORM_HEADER_BG } from "../data/constants";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  /** Extra top padding applied by the parent (typically `insets.top`). */
  topInset: number;
  testID?: string;
}

/**
 * Sticky deep-navy hero shared by the Add / Edit Business screens.
 *
 * Layout: [← back] [title (2-line stack)].
 * - Background continues edge-to-edge under the status bar (parent passes
 *   the safe-area top inset so the header stretches into the cutout area).
 * - Always-on chevron-style back button for predictable affordance.
 */
export function FormHeader({
  title,
  subtitle,
  onBack,
  topInset,
  testID,
}: FormHeaderProps) {
  return (
    <View
      style={[styles.container, { paddingTop: topInset + spacing.sm }]}
      testID={testID}
    >
      <Pressable
        testID={`${testID ?? "form-header"}-back`}
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
      </Pressable>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: FORM_HEADER_BG,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  titleBlock: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: fontSize.base,
    lineHeight: 20,
    color: "#C8D2F0",
  },
});
