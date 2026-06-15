import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../../../theme";
import type { SettingsStackParamList as MoreStackParamList } from "../../../navigation/types";
import { useBusinesses } from "../../../hooks/useBusinesses";

import { BusinessCard } from "./components/BusinessCard";
import { BusinessListHeader } from "./components/BusinessListHeader";
import { BusinessSearchBar } from "./components/BusinessSearchBar";
import { BusinessStatCards } from "./components/BusinessStatCards";
import { DeleteConfirmSheet } from "./components/DeleteConfirmSheet";
import { EmptyBusinessState } from "./components/EmptyBusinessState";
import { InfoBanner } from "./components/InfoBanner";
import { StatusFilterSheet } from "./components/StatusFilterSheet";
import type { Business, BusinessStatusFilter } from "./types";

/** Bottom-tab clearance so cards aren't tucked behind the floating tab bar. */
const TAB_BAR_CLEARANCE = 72;

type Nav = NativeStackNavigationProp<MoreStackParamList, "MyBusiness">;

/**
 * Settings → My Business landing screen.
 *
 * Top to bottom:
 *   1. Sticky header (title + Add CTA).
 *   2. Stat cards (Total / Active / Disabled).
 *   3. Search + status filter row.
 *   4. Scrollable list of `BusinessCard` items.
 *   5. Dashed \"About Business Types\" footer banner.
 *
 * State lives in `useBusinesses` (AsyncStorage-backed). Search + filter are
 * derived client-side so navigation back/forward stays instant.
 */
export default function MyBusinessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const { businesses, loading, removeBusiness } = useBusinesses();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BusinessStatusFilter>("all");
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Business | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      const matchesQuery = q ? b.name.toLowerCase().includes(q) : true;
      const matchesFilter = filter === "all" ? true : b.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [businesses, query, filter]);

  const counts = useMemo(() => {
    const active = businesses.filter((b) => b.status === "active").length;
    return {
      total: businesses.length,
      active,
      disabled: businesses.length - active,
    };
  }, [businesses]);

  const handleAdd = useCallback(() => {
    navigation.navigate("AddBusiness");
  }, [navigation]);

  const handleEdit = useCallback(
    (id: string) => {
      navigation.navigate("EditBusiness", { businessId: id });
    },
    [navigation],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await removeBusiness(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, removeBusiness]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setFilter("all");
  }, []);

  const hasFilters = query.trim().length > 0 || filter !== "all";

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      testID="my-business-screen"
    >
      <View style={styles.stickyHeader}>
        <BusinessListHeader
          onMenuPress={handleBack}
          onAddPress={handleAdd}
          testID="business-list-header"
        />
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <ScrollView
          testID="my-business-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
          }}
        >
          <BusinessStatCards
            total={counts.total}
            active={counts.active}
            disabled={counts.disabled}
            testID="business-stat-cards"
          />

          <BusinessSearchBar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onOpenFilter={() => setFilterSheetVisible(true)}
            testID="business-search-bar"
          />

          {filtered.length === 0 ? (
            <EmptyBusinessState
              hasFilters={hasFilters}
              onAddPress={handleAdd}
              onClearFilters={clearFilters}
              testID="business-empty-state"
            />
          ) : (
            filtered.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onPress={() => handleEdit(business.id)}
                onEdit={() => handleEdit(business.id)}
                onDelete={() => setPendingDelete(business)}
              />
            ))
          )}

          <View style={styles.footerBanner}>
            <InfoBanner
              title="About Business Types"
              body="Taxi Business is for taxi / cab services and Water Business is for water delivery services."
              dashed
              testID="business-about-types"
            />
          </View>
        </ScrollView>
      )}

      <StatusFilterSheet
        visible={filterSheetVisible}
        value={filter}
        onSelect={(next) => {
          setFilter(next);
          setFilterSheetVisible(false);
        }}
        onClose={() => setFilterSheetVisible(false)}
      />

      <DeleteConfirmSheet
        visible={pendingDelete !== null}
        businessName={pendingDelete?.name ?? ""}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  stickyHeader: {
    backgroundColor: colors.surfaceSecondary,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  footerBanner: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
