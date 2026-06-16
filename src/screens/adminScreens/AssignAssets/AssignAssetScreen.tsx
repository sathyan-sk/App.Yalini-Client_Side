/**
 * Admin → Assign Assets screen.
 *
 * Allows admin to assign/unassign Vehicles to Taxi employees
 * or Hotels to Water Delivery employees.
 *
 * The screen dynamically changes based on the selected asset type:
 * - Vehicle: Shows taxi business employees and available vehicles
 * - Hotel: Shows water delivery employees and available hotels
 */
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../../../theme";
import { useEmployees } from "../../../hooks/useEmployees";
import { useVehicles } from "../../../hooks/useVehicles";
import { useHotels } from "../../../hooks/useHotels";
import {
  assignEmployeeToVehicle,
  unassignEmployeeFromVehicle,
  loadVehicles,
  saveVehicles,
} from "../../../services/vehicleService";
import {
  assignEmployeeToHotel,
  unassignEmployeeFromHotel,
  loadHotels,
  saveHotels,
} from "../../../services/hotelService";

import type { AssetType } from "./types";
import type { Employee } from "../Employees/types";
import type { Vehicle } from "../../../types/vehicle";
import type { Hotel } from "../Hotels/types";

import { AssignmentHeader } from "./components/AssignmentHeader";
import { AssetTypeSelector } from "./components/AssetTypeSelector";
import { AssignmentStatsCards } from "./components/AssignmentStatsCards";
import { EmployeeListSection } from "./components/EmployeeListSection";
import { AssetSelectionSheet } from "./components/AssetSelectionSheet";
import { ConfirmUnassignSheet } from "./components/ConfirmUnassignSheet";

/** Reserve room for the floating bottom tab bar (matches DashboardScreen). */
const TAB_BAR_CLEARANCE = 72;

export default function AssignAssetScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Data hooks
  const { employees, loading: employeesLoading, refresh: refreshEmployees } = useEmployees();
  const { vehicles, loading: vehiclesLoading, refresh: refreshVehicles } = useVehicles();
  const { hotels, loading: hotelsLoading, refresh: refreshHotels } = useHotels();

  // Local state
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>("vehicle");
  const [assetSheetVisible, setAssetSheetVisible] = useState(false);
  const [unassignSheetVisible, setUnassignSheetVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssetName, setSelectedAssetName] = useState<string>("");

  const loading = employeesLoading || vehiclesLoading || hotelsLoading;

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle asset type selection
  const handleAssetTypeChange = useCallback((type: AssetType) => {
    setSelectedAssetType(type);
  }, []);

  // Handle assign button press - opens asset selection sheet
  const handleAssignPress = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setAssetSheetVisible(true);
  }, []);

  // Handle asset selection from sheet
  const handleAssetSelect = useCallback(
    async (assetId: string) => {
      if (!selectedEmployee) return;

      try {
        if (selectedAssetType === "vehicle") {
          await assignEmployeeToVehicle(
            assetId,
            selectedEmployee.id,
            selectedEmployee.fullName
          );
          await refreshVehicles();
        } else {
          await assignEmployeeToHotel(
            assetId,
            selectedEmployee.id,
            selectedEmployee.fullName
          );
          await refreshHotels();
        }
      } catch (error) {
        console.error("Failed to assign asset:", error);
      }

      setAssetSheetVisible(false);
      setSelectedEmployee(null);
    },
    [selectedEmployee, selectedAssetType, refreshVehicles, refreshHotels]
  );

  // Handle unassign button press - opens confirmation sheet
  const handleUnassignPress = useCallback(
    (employee: Employee, assetId: string) => {
      setSelectedEmployee(employee);
      setSelectedAssetId(assetId);

      // Find asset name
      if (selectedAssetType === "vehicle") {
        const vehicle = vehicles.find((v) => v.id === assetId);
        setSelectedAssetName(vehicle?.name || "Vehicle");
      } else {
        const hotel = hotels.find((h) => h.id === assetId);
        setSelectedAssetName(hotel?.name || "Hotel");
      }

      setUnassignSheetVisible(true);
    },
    [selectedAssetType, vehicles, hotels]
  );

  // Handle unassign confirmation
  const handleUnassignConfirm = useCallback(async () => {
    if (!selectedAssetId) return;

    try {
      if (selectedAssetType === "vehicle") {
        await unassignEmployeeFromVehicle(selectedAssetId);
        await refreshVehicles();
      } else {
        await unassignEmployeeFromHotel(selectedAssetId);
        await refreshHotels();
      }
    } catch (error) {
      console.error("Failed to unassign asset:", error);
    }

    setUnassignSheetVisible(false);
    setSelectedEmployee(null);
    setSelectedAssetId(null);
    setSelectedAssetName("");
  }, [selectedAssetId, selectedAssetType, refreshVehicles, refreshHotels]);

  // Handle unassign cancel
  const handleUnassignCancel = useCallback(() => {
    setUnassignSheetVisible(false);
    setSelectedEmployee(null);
    setSelectedAssetId(null);
    setSelectedAssetName("");
  }, []);

  // Close asset sheet
  const handleAssetSheetClose = useCallback(() => {
    setAssetSheetVisible(false);
    setSelectedEmployee(null);
  }, []);

  return (
    <View style={styles.container} testID="assign-asset-screen">
      <AssignmentHeader
        title="Assign Assets"
        subtitle="Manage vehicle and hotel assignments"
        onBack={handleBack}
        testID="assign-asset-header"
      />

      <ScrollView
        testID="assign-asset-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
        }}
      >

        <AssignmentStatsCards
          employees={employees}
          vehicles={vehicles}
          hotels={hotels}
          assetType={selectedAssetType}
          testID="assignment-stats"
        />

        <AssetTypeSelector
          selectedType={selectedAssetType}
          onSelect={handleAssetTypeChange}
          testID="asset-type-selector"
        />

        <EmployeeListSection
          employees={employees}
          vehicles={vehicles}
          hotels={hotels}
          assetType={selectedAssetType}
          loading={loading}
          onAssign={handleAssignPress}
          onUnassign={handleUnassignPress}
          testID="employee-list"
        />
      </ScrollView>

      <AssetSelectionSheet
        visible={assetSheetVisible}
        assetType={selectedAssetType}
        employee={selectedEmployee}
        vehicles={vehicles}
        hotels={hotels}
        onSelect={handleAssetSelect}
        onClose={handleAssetSheetClose}
        testID="asset-selection-sheet"
      />

      <ConfirmUnassignSheet
        visible={unassignSheetVisible}
        employee={selectedEmployee}
        assetName={selectedAssetName}
        assetType={selectedAssetType}
        onConfirm={handleUnassignConfirm}
        onCancel={handleUnassignCancel}
        testID="confirm-unassign-sheet"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
});