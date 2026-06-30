/**
 * DriverHomeScreen - Main home screen for Driver module
 * Shows today's session status, income/expense summary, quick actions, and recent activity
 * Connected to tripStore for real data
 */
import React, { useEffect, useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors, spacing, fontSize, radius } from "../../../theme";
import { useAuthStore } from "../../../store/authStore";
import { useTripStore } from "../../../store/tripStore";
import { getGreeting, getDriverHomeData } from "../../../services/driverService";
import type { DriverHomeData } from "../../../types/driver";
import type { DriverTabParamList, AllTripsStackParamList } from "../../../types/navigation";

import {
  HomeHeader,
  ServiceInfoCard,
  VehicleAssignmentCard,
  QuickActions,
  TodayOverview,
  RecentActivity,
} from "./components";

// Composite navigation type to navigate within tabs and to stack screens
type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DriverTabParamList, 'DriverHome'>,
  NativeStackNavigationProp<AllTripsStackParamList>
>;

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const signOut = useAuthStore((state) => state.signOut);
  const authUser = useAuthStore((state) => state.user);
  const userRole = useAuthStore((state) => state.user?.role);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [sessionLoading, setSessionLoading] = useState(true);
  const [driverData, setDriverData] = useState<DriverHomeData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Redirect if not a driver (security check beyond navigation)
  useEffect(() => {
    if (userRole && userRole !== 'DRIVER') {
      signOut();
    }
  }, [userRole, signOut]);

  // Update greeting periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Load driver data from Supabase on mount
  useEffect(() => {
    const loadDriverData = async () => {
      setSessionLoading(true);
      setLoadError(null);
      try {
        const employeeId = authUser?.userId;
        const data = await getDriverHomeData(employeeId);
        setDriverData(data);
      } catch (error) {
        console.error('Failed to load driver data:', error);
        setLoadError('Failed to load driver data');
      } finally {
        setSessionLoading(false);
      }
    };
    loadDriverData();
  }, [authUser]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Refetch driver data from Supabase
    try {
      const employeeId = authUser?.userId;
      const data = await getDriverHomeData(employeeId);
      setDriverData(data);
    } catch (error) {
      console.error('Failed to refresh driver data:', error);
    }
    setIsRefreshing(false);
  }, [authUser]);

const handleLogout = () => {
    signOut();
  }

  const handleAddTrip = () => {
    navigation.navigate("AddTrip");
  };

  const handleAddExpense = () => {
    // Navigate to AllTrips stack so user can select a trip to add expense
    navigation.navigate("AllTripsStack");
  };

  const handleAllTrips = () => {
    navigation.navigate("AllTripsStack");
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleStartDayInfo = () => {
    console.log("Start Day Info pressed");
  };

  const handleViewAllActivity = () => {
    navigation.navigate("AllTripsStack");
  };

  const handleSelectVehicle = async (vehicleId: string) => {
    // In auto mode, driver selects their own vehicle
    // This assigns the vehicle to the driver
    try {
      const { assignEmployeeToVehicle } = await import('../../../services/vehicleService');
      await assignEmployeeToVehicle(vehicleId, authUser?.userId || '');
      // Refresh data to show the assignment
      const employeeId = authUser?.userId;
      const data = await getDriverHomeData(employeeId);
      setDriverData(data);
    } catch (error) {
      console.error('Failed to select vehicle:', error);
    }
  };

  // Use ONLY Supabase data - no fallback to mock/tripStore
  const displayData = driverData;
  const hasAssignment = displayData?.assignment?.isAssigned || false;
  const businessMode = displayData?.businessMode || 'manual';
  const availableVehicles = displayData?.availableVehicles || [];

  // Populate tripStore session with vehicle info when data loads
  const { useTripStore } = require('../../../store/tripStore');
  useEffect(() => {
    if (displayData?.assignment && displayData.assignment.isAssigned) {
      useTripStore.getState().updateSession({
        vehicleId: displayData.assignment.vehicleId,
        vehicleNumber: displayData.assignment.vehicleNumber,
        driverName: displayData.driver.name,
        driverId: displayData.driver.id,
      });
    }
  }, [displayData]);

  if (sessionLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Loading driver information...</Text>
        </View>
      </View>
    );
  }

  if (loadError || !displayData) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No Driver Data Available</Text>
          <Text style={styles.errorSubtext}>
            {loadError || 'No employee found for your account'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        driverName={displayData.driver.name}
        greeting={greeting}
        onLogout={handleLogout}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }, // Account for tab bar
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryBlue}
            colors={[colors.primaryBlue]}
          />
        }
      >
        {/* Service Info Card */}
        <ServiceInfoCard
          businessName={displayData.driver.businessName}
          driverName={displayData.driver.name}
          vehicleNumber={displayData.assignment?.vehicleNumber || 'Not Assigned'}
          sessionDate={displayData.sessionDate}
          sessionStartTime={displayData.sessionStartTime}
          sessionStatus={displayData.sessionStatus}
        />

        {/* Vehicle Assignment Card */}
        {hasAssignment && displayData.assignment ? (
          // Manual mode or already assigned in auto mode
          <VehicleAssignmentCard
            vehicleNumber={displayData.assignment.vehicleNumber}
            isAssigned={true}
          />
        ) : businessMode === 'auto' && availableVehicles.length > 0 ? (
          // Auto mode: Show vehicle selection
          <View style={styles.vehicleSelectionContainer}>
            <Text style={styles.selectionTitle}>Select Your Vehicle</Text>
            {availableVehicles.map((vehicle) => (
              <Pressable
                key={vehicle.id}
                style={({ pressed }) => [
                  styles.vehicleOption,
                  pressed && styles.vehicleOptionPressed,
                ]}
                onPress={() => handleSelectVehicle(vehicle.id)}
              >
                <Ionicons name="car" size={24} color={colors.primaryBlue} />
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Quick Actions */}
        <QuickActions
          onAddTrip={handleAddTrip}
          onAddExpense={handleAddExpense}
          onAllTrips={handleAllTrips}
          onCheckout={handleCheckout}
          onStartDayInfo={handleStartDayInfo}
        />

        {/* Today's Overview - Only from Supabase data */}
        <TodayOverview data={{
          totalTrips: displayData.todayOverview.totalTrips,
          totalIncome: displayData.todayOverview.totalIncome,
          totalExpenses: displayData.todayOverview.totalExpenses,
        }} />

        {/* Recent Activity */}
        <RecentActivity
          activities={displayData.recentActivity}
          onViewAll={handleViewAllActivity}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  vehicleSelectionContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  selectionTitle: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  vehicleOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  vehicleOptionPressed: {
    opacity: 0.7,
    backgroundColor: colors.brandSoft,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  vehicleNumber: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
