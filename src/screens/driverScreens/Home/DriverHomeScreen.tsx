/**
 * DriverHomeScreen - Main home screen for Driver module
 * Shows today's session status, income/expense summary, quick actions, and recent activity
 * All data comes from mock service layer
 */
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { colors, spacing, fontSize } from "../../../theme";
import { getDriverHomeData, getGreeting } from "../../../services/driverService";
import type { DriverHomeData } from "../../../types/driver";
import type { DriverTabParamList } from "../../../types/navigation";

import {
  HomeHeader,
  ServiceInfoCard,
  VehicleAssignmentCard,
  QuickActions,
  TodayOverview,
  RecentActivity,
} from "./components";

type NavigationProp = BottomTabNavigationProp<DriverTabParamList>;

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [data, setData] = useState<DriverHomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  // Fetch data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Update greeting periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const homeData = await getDriverHomeData();
      setData(homeData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading driver home data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const homeData = await getDriverHomeData();
      setData(homeData);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Navigation handlers
  const handleNotificationPress = () => {
    console.log("Notifications pressed");
  };

  const handleAddTrip = () => {
    navigation.navigate("AddTrip");
  };

  const handleAddExpense = () => {
    // Navigate to Add Expense stack screen
    // @ts-ignore - Stack navigator handles this
    navigation.getParent()?.navigate("AddExpense", {});
  };

  const handleAllTrips = () => {
    navigation.navigate("AllTrips");
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleStartDayInfo = () => {
    // Navigate to Start Day Info stack screen
    // @ts-ignore - Stack navigator handles this
    navigation.getParent()?.navigate("StartDayInfo");
  };

  const handleViewAllActivity = () => {
    navigation.navigate("AllTrips");
  };

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Something went wrong"}</Text>
        <Text style={styles.retryText} onPress={loadData}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const hasAssignment = data.assignment !== null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        driverName={data.driver.name}
        greeting={greeting}
        notificationCount={data.notificationCount}
        onNotificationPress={handleNotificationPress}
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
          businessName={data.driver.businessName}
          driverName={data.driver.name}
          vehicleNumber={data.assignment?.vehicleNumber || "Not Assigned"}
          sessionDate={data.sessionDate}
          sessionStartTime={data.sessionStartTime}
          sessionStatus={data.sessionStatus}
        />

        {/* Vehicle Assignment Card (only if assigned) */}
        {hasAssignment && data.assignment && (
          <VehicleAssignmentCard
            vehicleNumber={data.assignment.vehicleNumber}
            isAssigned={data.assignment.isAssigned}
          />
        )}

        {/* Quick Actions */}
        <QuickActions
          onAddTrip={handleAddTrip}
          onAddExpense={handleAddExpense}
          onAllTrips={handleAllTrips}
          onCheckout={handleCheckout}
          onStartDayInfo={handleStartDayInfo}
        />

        {/* Today's Overview */}
        <TodayOverview data={data.todayOverview} />

        {/* Recent Activity */}
        <RecentActivity
          activities={data.recentActivity}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: fontSize.base,
    color: colors.error,
    textAlign: "center",
  },
  retryText: {
    fontSize: fontSize.base,
    color: colors.primaryBlue,
    fontWeight: "500",
  },
});
