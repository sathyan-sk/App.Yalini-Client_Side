/**
 * AllAssignments Screen
 * 
 * Displays all employee-asset assignments in a single view.
 * Shows employees with their assigned vehicles (taxi business) or hotels (delivery business).
 * Features:
 *   - Stats cards (Total, Assigned, Unassigned, Employees)
 *   - Search by employee or asset
 *   - Assignment cards with edit functionality
 *   - Link to AssignAsset screen
 */
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow, tones } from "../../../theme";
import { useEmployees } from "../../../hooks/useEmployees";
import { useVehicles } from "../../../hooks/useVehicles";
import { useHotels } from "../../../hooks/useHotels";
import type { Employee } from "../Employees/types";
import type { Vehicle } from "../../../types/vehicle";
import type { Hotel } from "../Hotels/types";

import { AllAssignmentsHeader } from "./components/AllAssignmentsHeader";
import { AssignmentStatsCards } from "./components/AssignmentStatsCards";
import { AssignmentCard } from "./components/AssignmentCard";
import { AssignmentSearchBar } from "./components/AssignmentSearchBar";

type AllAssignmentsStackParamList = {
  AllAssignments: undefined;
  AssignAsset: undefined;
};

type Nav = NativeStackNavigationProp<AllAssignmentsStackParamList, "AllAssignments">;

const TAB_BAR_CLEARANCE = 72;

interface AssignmentItem {
  employee: Employee;
  assetType: "vehicle" | "hotel";
  asset: Vehicle | Hotel | null;
  isAssigned: boolean;
}

export default function AllAssignmentsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  
  const { employees, loading: employeesLoading } = useEmployees();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { hotels, loading: hotelsLoading } = useHotels();
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const loading = employeesLoading || vehiclesLoading || hotelsLoading;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAssignNewAsset = useCallback(() => {
    navigation.navigate("AssignAsset" as never);
  }, [navigation]);

  // Build assignment items from employees, vehicles, and hotels
  const assignmentItems = useMemo((): AssignmentItem[] => {
    const items: AssignmentItem[] = [];
    
    // Process taxi employees with vehicles
    employees
      .filter(emp => emp.businessType === "taxi")
      .forEach(emp => {
        const vehicle = vehicles.find(v => v.assignedEmployeeId === emp.id);
        items.push({
          employee: emp,
          assetType: "vehicle",
          asset: vehicle || null,
          isAssigned: !!vehicle,
        });
      });
    
    // Process water_delivery employees with hotels
    employees
      .filter(emp => emp.businessType === "water_delivery")
      .forEach(emp => {
        const hotel = hotels.find(h => h.assignedEmployeeId === emp.id);
        items.push({
          employee: emp,
          assetType: "hotel",
          asset: hotel || null,
          isAssigned: !!hotel,
        });
      });
    
    return items;
  }, [employees, vehicles, hotels]);

  // Filter assignments by search query
  const filteredAssignments = useMemo(() => {
    if (!searchQuery.trim()) return assignmentItems;
    
    const query = searchQuery.toLowerCase();
    return assignmentItems.filter(item => {
      const employeeMatch = item.employee.fullName.toLowerCase().includes(query);
      const assetMatch = item.asset 
        ? (item.asset.name?.toLowerCase().includes(query) || 
           ('number' in item.asset && item.asset.number?.toLowerCase().includes(query)) ||
           ('location' in item.asset && item.asset.location?.toLowerCase().includes(query)))
        : false;
      return employeeMatch || assetMatch;
    });
  }, [assignmentItems, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = assignmentItems.length;
    const assigned = assignmentItems.filter(i => i.isAssigned).length;
    const unassigned = total - assigned;
    return {
      total,
      assigned,
      unassigned,
      employees: employees.length,
    };
  }, [assignmentItems, employees]);

  const handleEdit = useCallback((item: AssignmentItem) => {
    navigation.navigate("AssignAsset" as never);
  }, [navigation]);

  return (
    <View style={styles.container} testID="all-assignments-screen">
      <AllAssignmentsHeader
        title="All Assignments"
        subtitle="View and manage all assigned assets"
        onBack={handleBack}
        onAssignNew={handleAssignNewAsset}
        testID="all-assignments-header"
      />

      <ScrollView
        testID="all-assignments-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
        }}
      >
        <AssignmentStatsCards
          total={stats.total}
          assigned={stats.assigned}
          unassigned={stats.unassigned}
          employeesCount={stats.employees}
          testID="assignment-stats"
        />

        <AssignmentSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by employee or asset..."
          testID="assignment-search"
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={styles.loadingText}>Loading assignments...</Text>
          </View>
        ) : filteredAssignments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No assignments found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "Try a different search term" : "Start by assigning assets to employees"}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredAssignments.map((item, index) => (
              <AssignmentCard
                key={`${item.employee.id}-${index}`}
                employee={item.employee}
                assetType={item.assetType}
                asset={item.asset}
                isAssigned={item.isAssigned}
                onEdit={() => handleEdit(item)}
                testID={`assignment-card-${index}`}
              />
            ))}
          </View>
        )}

        {/* Footer message */}
        <View style={styles.footerContainer}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.textTertiary} />
          <Text style={styles.footerText}>
            Keep your assignments organized and your operations running smoothly.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
