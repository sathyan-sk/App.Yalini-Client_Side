/**
 * AllTripsScreen - Screen to view all trips and manage expenses in Driver module
 * Shows session info, trips list with expense status, and summary
 * Follows the design specifications with pixel-perfect implementation
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing } from '../../../theme';
import {
  AllTripsHeader,
  ServiceInfoCard,
  SummaryStatsRow,
  TripsList,
  InfoBanner,
  SummaryFooter,
} from './components';
import { MOCK_ALL_TRIPS_DATA, MOCK_TRIPS } from './data/mockData';
import type { Trip, AllTripsData } from '../../../types/driver';

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function AllTripsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State
  const [data, setData] = useState<AllTripsData>(MOCK_ALL_TRIPS_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if all trips have expenses added
  const allExpensesAdded = useMemo(() => {
    return data.trips.every((trip) => trip.hasExpense);
  }, [data.trips]);

  // Handlers
  const handleMenuPress = useCallback(() => {
    Alert.alert('Menu', 'Menu functionality coming soon');
  }, []);

  const handleFilterPress = useCallback(() => {
    Alert.alert('Filter', 'Filter trips by date, payment mode, etc.');
  }, []);

  const handleTripPress = useCallback((trip: Trip) => {
    // Navigate to EditTrip screen with trip data
    // @ts-ignore - Stack navigator handles this
    navigation.navigate('EditTrip', { tripId: trip.id, trip });
  }, [navigation]);

  const handleAddExpense = useCallback((trip: Trip) => {
    // Navigate to AddExpense screen with trip data
    // @ts-ignore - Stack navigator handles this
    navigation.navigate('AddExpense', { tripId: trip.id, trip });
  }, [navigation]);

  const handleProceedToCheckout = useCallback(() => {
    if (allExpensesAdded) {
      // @ts-ignore
      navigation.navigate('Checkout');
    } else {
      Alert.alert(
        'Cannot Proceed',
        'Please add expenses for all trips before proceeding to checkout.'
      );
    }
  }, [allExpensesAdded, navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Reset to mock data (in real app, would fetch fresh data)
    setData(MOCK_ALL_TRIPS_DATA);
    setIsRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <AllTripsHeader
        onMenuPress={handleMenuPress}
        onFilterPress={handleFilterPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }, // Extra padding for tab bar
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
        <ServiceInfoCard sessionInfo={data.sessionInfo} />

        {/* Summary Stats Row */}
        <SummaryStatsRow
          totalTrips={data.totalTrips}
          totalIncome={data.totalIncome}
        />

        {/* Trips List */}
        <TripsList
          trips={data.trips}
          onTripPress={handleTripPress}
          onAddExpense={handleAddExpense}
        />

        {/* Info Banner */}
        <InfoBanner message="All trips must have expenses added to complete your day." />

        {/* Summary Footer */}
        <SummaryFooter
          totalIncome={data.totalIncome}
          totalExpenses={data.totalExpenses}
          netAmount={data.netAmount}
          canProceed={allExpensesAdded}
          onProceedToCheckout={handleProceedToCheckout}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
