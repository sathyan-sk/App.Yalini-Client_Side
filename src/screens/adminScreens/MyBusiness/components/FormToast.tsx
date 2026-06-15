import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface FormToastProps {
  visible: boolean;
  message: string;
  variant?: "success" | "error";
  onHide: () => void;
  testID?: string;
}

/**
 * Lightweight toast used to acknowledge save / delete operations on the
 * form screens. Auto-dismisses after 2 seconds and fades cleanly.
 *
 * Stacks at the top of the screen so it doesn't fight with the floating
 * tab bar / bottom CTAs. Mount this once near the screen root.
 */
export function FormToast({
  visible,
  message,
  variant = "success",
  onHide,
  testID,
}: FormToastProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, 2000);

    return () => clearTimeout(timer);
  }, [visible, opacity, translateY, onHide]);

  if (!visible) return null;

  const palette =
    variant === "success"
      ? { bg: "#ECFDF5", border: "#A7F3D0", text: "#065F46", icon: "checkmark-circle" as const }
      : { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B", icon: "alert-circle" as const };

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          top: insets.top + spacing.sm,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      testID={testID}
    >
      <Ionicons name={palette.icon} size={18} color={palette.text} />
      <Text style={[styles.message, { color: palette.text }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    zIndex: 10,
  },
  message: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  // Reference colors (kept for tooling — actual values driven via inline style).
  _colors: { display: "none", borderColor: colors.border },
});
