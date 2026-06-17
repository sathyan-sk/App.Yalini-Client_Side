import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, spacing } from "../../../../../theme";

interface ScreenHeaderProps {
  title: string;
  leftIcon?: "menu" | "back";
  rightIcon?: "filter" | "share";
  onLeftPress?: () => void;
  onRightPress?: () => void;
  testID?: string;
}

export function ScreenHeader({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  testID,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  const getLeftIconName = (): keyof typeof Feather.glyphMap => {
    switch (leftIcon) {
      case "menu":
        return "menu";
      case "back":
        return "arrow-left";
      default:
        return "menu";
    }
  };

  const getRightIconName = (): keyof typeof Feather.glyphMap => {
    switch (rightIcon) {
      case "filter":
        return "filter";
      case "share":
        return "upload";
      default:
        return "filter";
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]} testID={testID}>
      <View style={styles.row}>
        {leftIcon ? (
          <Pressable
            onPress={onLeftPress}
            style={styles.iconButton}
            hitSlop={8}
          >
            <Feather
              name={getLeftIconName()}
              size={24}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            style={styles.iconButton}
            hitSlop={8}
          >
            <Feather
              name={getRightIconName()}
              size={22}
              color={rightIcon === "filter" ? colors.primaryBlue : colors.brand}
            />
            {rightIcon === "filter" && (
              <Text style={styles.filterText}>Filter</Text>
            )}
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  filterText: {
    fontSize: fontSize.base,
    color: colors.primaryBlue,
    marginLeft: 4,
    fontWeight: "500",
  },
});
