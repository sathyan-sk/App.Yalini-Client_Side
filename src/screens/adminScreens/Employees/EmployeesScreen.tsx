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
import type { EmployeesStackParamList } from "../../../types/navigation";
import { useEmployees } from "../../../hooks/useEmployees";
import { useBusinesses } from "../../../hooks/useBusinesses";

import { EmployeeCard } from "./components/EmployeeCard";
import { EmployeeListHeader } from "./components/EmployeeListHeader";
import { EmployeeSearchBar } from "./components/EmployeeSearchBar";
import { EmployeeStatCards } from "./components/EmployeeStatCards";
import { DeleteEmployeeSheet } from "./components/DeleteEmployeeSheet";
import { EmptyEmployeeState } from "./components/EmptyEmployeeState";
import { BusinessFilterSheet } from "./components/BusinessFilterSheet";
import type { Employee, EmployeeBusinessFilter } from "./types";

/** Bottom-tab clearance so cards aren't tucked behind the floating tab bar. */
const TAB_BAR_CLEARANCE = 72;

type Nav = NativeStackNavigationProp<EmployeesStackParamList, "EmployeesList">;

/**
 * Employees tab landing screen.
 *
 * Top to bottom:
 *   1. Sticky header (title + Add CTA).
 *   2. Stat cards (Total / Active / Disabled).
 *   3. Search + business filter row.
 *   4. Scrollable list of `EmployeeCard` items.
 */
export default function EmployeesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const { employees, loading, removeEmployee } = useEmployees();
  const { businesses } = useBusinesses();

  const [query, setQuery] = useState("");
  const [businessFilter, setBusinessFilter] = useState<EmployeeBusinessFilter>("all");
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      const matchesQuery = q
        ? e.fullName.toLowerCase().includes(q) || e.mobile.includes(q)
        : true;
      const matchesFilter = businessFilter === "all" ? true : e.businessId === businessFilter;
      return matchesQuery && matchesFilter;
    });
  }, [employees, query, businessFilter]);

  const counts = useMemo(() => {
    const enabled = employees.filter((e) => e.status === "enabled").length;
    return {
      total: employees.length,
      active: enabled,
      disabled: employees.length - enabled,
    };
  }, [employees]);

  // Get business mode for each employee
  const getBusinessMode = (businessId: string): 'auto' | 'manual' | undefined => {
    const business = businesses.find(b => b.id === businessId);
    return business?.mode;
  };

  const handleAdd = useCallback(() => {
    navigation.navigate("AddEmployee");
  }, [navigation]);

  const handleEdit = useCallback(
    (id: string) => {
      navigation.navigate("EditEmployee", { employeeId: id });
    },
    [navigation],
  );

  const handleMenuPress = useCallback(() => {
    // Menu press - could open drawer in future
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await removeEmployee(pendingDelete.id);
    setPendingDelete(null);
  }, [pendingDelete, removeEmployee]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setBusinessFilter("all");
  }, []);

  const hasFilters = query.trim().length > 0 || businessFilter !== "all";

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      testID="employees-screen"
    >
      <View style={styles.stickyHeader}>
        <EmployeeListHeader
          onMenuPress={handleMenuPress}
          onAddPress={handleAdd}
          testID="employee-list-header"
        />
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <ScrollView
          testID="employees-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
          }}
        >
          <EmployeeStatCards
            total={counts.total}
            active={counts.active}
            disabled={counts.disabled}
            testID="employee-stat-cards"
          />

          <EmployeeSearchBar
            query={query}
            onQueryChange={setQuery}
            businessFilter={businessFilter}
            businesses={businesses}
            onOpenFilter={() => setFilterSheetVisible(true)}
            testID="employee-search-bar"
          />

          {filtered.length === 0 ? (
            <EmptyEmployeeState
              hasFilters={hasFilters}
              onAddPress={handleAdd}
              onClearFilters={clearFilters}
              testID="employee-empty-state"
            />
          ) : (
            filtered.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                businessMode={getBusinessMode(employee.businessId)}
                onPress={() => handleEdit(employee.id)}
                onEdit={() => handleEdit(employee.id)}
                onDelete={() => setPendingDelete(employee)}
              />
            ))
          )}
        </ScrollView>
      )}

      <BusinessFilterSheet
        visible={filterSheetVisible}
        value={businessFilter}
        businesses={businesses}
        onSelect={(next) => {
          setBusinessFilter(next);
          setFilterSheetVisible(false);
        }}
        onClose={() => setFilterSheetVisible(false)}
      />

      <DeleteEmployeeSheet
        visible={pendingDelete !== null}
        employeeName={pendingDelete?.fullName ?? ""}
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
});
