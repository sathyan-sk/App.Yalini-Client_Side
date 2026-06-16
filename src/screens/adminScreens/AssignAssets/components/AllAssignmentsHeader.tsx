import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../../theme";

interface Props {
  title: string;
  subtitle: string;
  onBack: () => void;
  onAssignNew: () => void;
  testID?: string;
}

export function AllAssignmentsHeader({ title, subtitle, onBack, onAssignNew, testID }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
      testID={testID}
    >
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={8}
          testID={`${testID}-back`}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <Pressable
          onPress={onAssignNew}
          style={({ pressed }) => [styles.assignButton, pressed && styles.assignButtonPressed]}
          testID={`${testID}-assign-new`}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.assignButtonText}>Assign New Asset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    ...cardShadow,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  assignButtonPressed: {
    opacity: 0.85,
  },
  assignButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
});
