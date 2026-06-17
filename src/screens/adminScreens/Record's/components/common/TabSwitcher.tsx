import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "../../../../../theme";
import type { RecordStatus } from "../../../../../types/dailyRecords";

interface TabSwitcherProps {
  activeTab: RecordStatus | "all";
  submittedCount: number;
  pendingCount: number;
  onTabChange: (tab: RecordStatus) => void;
  testID?: string;
}

export function TabSwitcher({
  activeTab,
  submittedCount,
  pendingCount,
  onTabChange,
  testID,
}: TabSwitcherProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        onPress={() => onTabChange("submitted")}
        style={[
          styles.tab,
          activeTab === "submitted" && styles.tabActive,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "submitted" && styles.tabTextActive,
          ]}
        >
          Submitted ({submittedCount})
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onTabChange("pending")}
        style={[
          styles.tab,
          activeTab === "pending" && styles.tabActive,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "pending" && styles.tabTextActive,
          ]}
        >
          Pending ({pendingCount})
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: colors.brand,
  },
  tabText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.surface,
  },
});
