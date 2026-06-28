import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { colors, fontSize, spacing } from "../../../theme";
import { useHotels } from "../../../hooks/useHotels";
import type { Hotel, HotelStatusFilter } from "./types";

import { HotelListHeader } from "./components/HotelListHeader";
import { HotelSearchBar } from "./components/HotelSearchBar";
import { HotelStatCards } from "./components/HotelStatCards";
import { HotelCard } from "./components/HotelCard";
import { EmptyHotelState } from "./components/EmptyHotelState";
import { StatusFilterSheet } from "./components/StatusFilterSheet";
import { DeleteConfirmSheet } from "./components/DeleteConfirmSheet";

/** Bottom-tab clearance so cards aren't tucked behind the floating tab bar. */
const TAB_BAR_CLEARANCE = 72;

type HotelsStackParamList = {
  AllHotels: undefined;
  AddHotel: undefined;
  EditHotel: { hotelId: string };
};

type Nav = NativeStackNavigationProp<HotelsStackParamList, "AllHotels">;

/**
 * All Hotels Screen - Admin Module
 *
 * Displays list of all hotels with:
 *   1. Sticky header (title + Add CTA)
 *   2. Stat cards (Total / Enabled / Disabled)
 *   3. Search + status filter row
 *   4. Scrollable list of HotelCard items
 *   5. Pull to refresh
 */
export default function AllHotelsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const { hotels, loading, removeHotel, refresh } = useHotels();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<HotelStatusFilter>("all");
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Hotel | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hotels.filter((h) => {
      const matchesQuery = q ? h.name.toLowerCase().includes(q) : true;
      const matchesFilter = filter === "all" ? true : h.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [hotels, query, filter]);

  const counts = useMemo(() => {
    const enabled = hotels.filter((h) => h.status === "enabled").length;
    const totalOutstandingCans = hotels.reduce((sum, h) => sum + (h.outstandingCans || 0), 0);
    return {
      disabled: hotels.length - enabled,
      total: hotels.length,
      enabled,
      outstandingCans: totalOutstandingCans,
    };
  }, [hotels]);

  const handleAdd = useCallback(() => {
    navigation.navigate("AddHotel");
  }, [navigation]);

  const handleEdit = useCallback(
    (id: string) => {
      navigation.navigate("EditHotel", { hotelId: id });
    },
    [navigation]
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await removeHotel(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, removeHotel]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setFilter("all");
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const hasFilters = query.trim().length > 0 || filter !== "all";

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      testID="all-hotels-screen"
    >
      <View style={styles.stickyHeader}>
        <HotelListHeader
          onMenuPress={handleBack}
          onAddPress={handleAdd}
          testID="hotel-list-header"
        />
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <ScrollView
          testID="hotels-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.brand]}
              tintColor={colors.brand}
            />
          }
        >
          <HotelStatCards
            total={counts.total}
            enabled={counts.enabled}
            disabled={counts.disabled}
            outstandingCans={counts.outstandingCans}
            testID="hotel-stat-cards"
          />

          <HotelSearchBar
            query={query}
            onQueryChange={setQuery}
            onOpenFilter={() => setFilterSheetVisible(true)}
            testID="hotel-search-bar"
          />

          {filtered.length === 0 ? (
            <EmptyHotelState
              hasFilters={hasFilters}
              onAddPress={handleAdd}
              onClearFilters={clearFilters}
              testID="hotel-empty-state"
            />
          ) : (
            filtered.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onPress={() => handleEdit(hotel.id)}
                onEdit={() => handleEdit(hotel.id)}
                onDelete={() => setPendingDelete(hotel)}
              />
            ))
          )}

          {/* Swipe down to refresh hint */}
          <View style={styles.refreshHint}>
            <Feather name="chevron-down" size={16} color={colors.textTertiary} />
            <Text style={styles.refreshHintText}>Swipe down to refresh</Text>
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
        hotelName={pendingDelete?.name ?? ""}
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
  refreshHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  refreshHintText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
});
