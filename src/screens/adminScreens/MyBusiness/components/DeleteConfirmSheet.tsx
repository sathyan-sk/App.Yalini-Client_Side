import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing, tones } from "../../../../theme";

interface DeleteConfirmSheetProps {
  visible: boolean;
  businessName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Destructive confirmation bottom sheet shown when a list-row trash button
 * is tapped.
 *
 * Same shell as `LogoutConfirmSheet` from the Settings screen for visual
 * consistency, with copy + accent colour tuned for delete operations.
 */
export function DeleteConfirmSheet({
  visible,
  businessName,
  onCancel,
  onConfirm,
}: DeleteConfirmSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onCancel}
        testID="delete-sheet-backdrop"
      >
        <Pressable
          onPress={() => {}}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.md },
          ]}
          testID="delete-confirm-sheet"
        >
          <View style={styles.grabber} />

          <View style={styles.iconCircle}>
            <Ionicons
              name="trash-outline"
              size={28}
              color={tones.red.accent}
            />
          </View>

          <Text style={styles.title}>Delete this business?</Text>
          <Text style={styles.body}>
            {"\u201C"}
            {businessName}
            {"\u201D"} will be removed from your list. This action cannot be
            undone.
          </Text>

          <View style={styles.actions}>
            <Pressable
              testID="delete-cancel-button"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              testID="delete-confirm-button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmText}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: "center",
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: tones.red.iconBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#0B1F3F",
    textAlign: "center",
  },
  body: {
    marginTop: spacing.sm,
    fontSize: fontSize.base,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
    marginTop: spacing.xl,
  },
  button: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.surfaceTertiary,
  },
  confirmButton: {
    backgroundColor: tones.red.accent,
  },
  cancelText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  confirmText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.85,
  },
});
