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
import { useVehicles } from "../../../hooks/useVehicles";
import type { Vehicle, VehicleStatusFilter } from "../../../types/vehicle";

import { VehicleListHeader } from "./components/VehicleListHeader";
import { VehicleSearchBar } from "./components/VehicleSearchBar";
import { VehicleStatCards } from "./components/VehicleStatCards";
import { VehicleCard } from "./components/VehicleCard";
import { EmptyVehicleState } from "./components/EmptyVehicleState";
import { StatusFilterSheet } from "./components/StatusFilterSheet";
import { DeleteConfirmSheet } from "./components/DeleteConfirmSheet";

/** Bottom-tab clearance so cards aren't tucked behind the floating tab bar. */
const TAB_BAR_CLEARANCE = 72;

type VehiclesStackParamList = {
  AllVehicles: undefined;
  AddVehicle: undefined;
  EditVehicle: { vehicleId: string };
};

type Nav = NativeStackNavigationProp<VehiclesStackParamList, "AllVehicles">;

/**
 * All Vehicles Screen - Admin Module
 *
 * Displays list of all vehicles with:
 *   1. Sticky header (title + Add CTA)
 *   2. Stat cards (Total / Enabled / Disabled)
 *   3. Search + status filter row
 *   4. Scrollable list of VehicleCard items
 *   5. Pull to refresh
 */
export default function AllVehiclesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const { vehicles, loading, removeVehicle, refresh } = useVehicles();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<VehicleStatusFilter>("all");
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      const matchesQuery = q
        ? v.name.toLowerCase().includes(q) ||
          v.number.toLowerCase().includes(q)
        : true;
      const matchesFilter = filter === "all" ? true : v.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [vehicles, query, filter]);

  const counts = useMemo(() => {
    const enabled = vehicles.filter((v) => v.status === "enabled").length;
    const available = vehicles.filter((v) => v.assignmentStatus === "available").length;
    const assigned = vehicles.filter((v) => v.assignmentStatus === "assigned").length;
    const locked = vehicles.filter((v) => v.assignmentStatus === "locked").length;
    return {
      total: vehicles.length,
      enabled,
      disabled: vehicles.length - enabled,
      available,
      assigned,
      locked,
    };
  }, [vehicles]);

  const handleAdd = useCallback(() => {
    navigation.navigate("AddVehicle");
  }, [navigation]);

  const handleEdit = useCallback(
    (id: string) => {
      navigation.navigate("EditVehicle", { vehicleId: id });
    },
    [navigation],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await removeVehicle(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, removeVehicle]);

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
      testID="all-vehicles-screen"
    >
      <View style={styles.stickyHeader}>
        <VehicleListHeader
          onMenuPress={handleBack}
          onAddPress={handleAdd}
          testID="vehicle-list-header"
        />
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <ScrollView
          testID="vehicles-scroll"
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
          <VehicleStatCards
            total={counts.total}
            enabled={counts.enabled}
            disabled={counts.disabled}
            available={counts.available}
            assigned={counts.assigned}
            locked={counts.locked}
            testID="vehicle-stat-cards"
          />

          <VehicleSearchBar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onOpenFilter={() => setFilterSheetVisible(true)}
            testID="vehicle-search-bar"
          />

          {filtered.length === 0 ? (
            <EmptyVehicleState
              hasFilters={hasFilters}
              onAddPress={handleAdd}
              onClearFilters={clearFilters}
              testID="vehicle-empty-state"
            />
          ) : (
            filtered.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPress={() => handleEdit(vehicle.id)}
                onEdit={() => handleEdit(vehicle.id)}
                onDelete={() => setPendingDelete(vehicle)}
                testID={`vehicle-card-${vehicle.id}`}
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
        vehicleName={pendingDelete?.name ?? ""}
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
