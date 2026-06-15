import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import type { BusinessStatusFilter } from "../types";

interface BusinessSearchBarProps {
  query: string;
  onQueryChange: (next: string) => void;
  filter: BusinessStatusFilter;
  onOpenFilter: () => void;
  testID?: string;
}

const FILTER_LABELS: Record<BusinessStatusFilter, string> = {
  all: "All Status",
  active: "Active",
  inactive: "Inactive",
};

/**
 * Search field + status filter pill rendered below the stat cards.
 *
 * Both controls live on a single horizontal row. The filter pill is just
 * a presentation surface — tapping it opens a bottom sheet picker mounted
 * by the parent screen so it can sit above the tab bar safely.
 */
export function BusinessSearchBar({
  query,
  onQueryChange,
  filter,
  onOpenFilter,
  testID,
}: BusinessSearchBarProps) {
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.searchBox}>
        <Feather name="search" size={16} color={colors.textTertiary} />
        <TextInput
          testID="business-search-input"
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search business name"
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <Pressable
        testID="business-filter-button"
        onPress={onOpenFilter}
        accessibilityRole="button"
        accessibilityLabel="Filter businesses by status"
        style={({ pressed }) => [styles.filterPill, pressed && styles.pressed]}
      >
        <Ionicons name="filter" size={16} color={colors.textSecondary} />
        <Text style={styles.filterLabel} numberOfLines={1}>
          {FILTER_LABELS[filter]}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    minWidth: 130,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
