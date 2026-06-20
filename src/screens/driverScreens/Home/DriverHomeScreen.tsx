/**
 * DriverHomeScreen - Main home screen for Driver module
 * Shows today's session status, income/expense summary, quick actions, and recent activity
 * Connected to tripStore for real data
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
import { useNavigation, CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors, spacing, fontSize } from "../../../theme";
import { getGreeting } from "../../../services/driverService";
import { useTripStore } from "../../../store/tripStore";
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

  // Get data from tripStore
  const {
    session,
    trips,
    totalTrips,
    totalIncome,
    totalExpenses,
  } = useTripStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  // Update greeting periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh - in real app would refetch from API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  // Navigation handlers
  const handleNotificationPress = () => {
    console.log("Notifications pressed");
  };

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

  // Build recent activity from trips
  const recentActivity = trips.slice(-3).reverse().map((trip, index) => ({
    id: trip.id,
    type: 'trip' as const,
    description: `Trip to ${trip.to}`,
    amount: trip.amount,
    time: trip.time,
  }));

  // Build today's overview from tripStore
  const todayOverview = {
    totalTrips,
    totalIncome,
    totalExpenses,
  };

  // Vehicle assignment from session
  const hasAssignment = session.vehicleNumber && session.vehicleNumber !== 'Not Assigned';

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader
        driverName={session.driverName}
        greeting={greeting}
        notificationCount={2}
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
          businessName={session.serviceName}
          driverName={session.driverName}
          vehicleNumber={session.vehicleNumber}
          sessionDate={session.sessionDate}
          sessionStartTime={session.sessionTime}
          sessionStatus={session.sessionStatus === 'Day Started' ? 'OPEN' : 'SUBMITTED'}
        />

        {/* Vehicle Assignment Card (only if assigned) */}
        {hasAssignment && (
          <VehicleAssignmentCard
            vehicleNumber={session.vehicleNumber}
            isAssigned={true}
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

        {/* Today's Overview - Now using tripStore data */}
        <TodayOverview data={todayOverview} />

        {/* Recent Activity */}
        <RecentActivity
          activities={recentActivity}
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
});
