/**
 * AllTripsScreen - Screen to view all trips and manage expenses in Driver module
 * Shows session info, trips list with expense status, and summary
 * Follows the design specifications with pixel-perfect implementation
 * Now connected to tripStore for real data management
 */

import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing } from '../../../theme';
import {
  AllTripsHeader,
  SummaryStatsRow,
  TripsList,
  InfoBanner,
  SummaryFooter,
} from './components';
import { useTripStore, TripWithExpense } from '../../../store/tripStore';
import type { AllTripsStackParamList } from '../../../types/navigation';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type AllTripsNavigationProp = NativeStackNavigationProp<AllTripsStackParamList, 'AllTripsList'>;

export default function AllTripsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AllTripsNavigationProp>();

  // Get data from tripStore
  const {
    session,
    trips,
    totalTrips,
    totalIncome,
    totalExpenses,
  } = useTripStore();

  // Calculate total settlement and profit
  const totalSettlement = useMemo(() => {
    return trips.reduce((sum, trip) => {
      if (trip.expense) {
        return sum + (trip.expense.settledCash || 0) + (trip.expense.settledOnline || 0);
      }
      return sum;
    }, 0);
  }, [trips]);

  const profit = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  // Check if all trips have expenses added
  const allExpensesAdded = useMemo(() => {
    return trips.every((trip) => trip.hasExpense);
  }, [trips]);

  // Handlers
  const handleMenuPress = useCallback(() => {
    Alert.alert('Menu', 'Menu functionality coming soon');
  }, []);

  const handleFilterPress = useCallback(() => {
    Alert.alert('Filter', 'Filter trips by date, payment mode, etc.');
  }, []);

  const handleTripPress = useCallback((trip: TripWithExpense) => {
    // Navigate to EditPreview screen with trip ID
    navigation.navigate('EditPreview', { tripId: trip.id });
  }, [navigation]);

  const handleAddExpense = useCallback((trip: TripWithExpense) => {
    // Navigate to AddExpense screen with trip ID
    const mode = trip.hasExpense ? 'edit' : 'add';
    navigation.navigate('AddExpenseForTrip', { tripId: trip.id, mode });
  }, [navigation]);

  const handleProceedToCheckout = useCallback(() => {
    if (allExpensesAdded) {
      // Navigate to Checkout tab
      // Since we're inside a stack within a tab, we need to navigate to parent
      navigation.getParent()?.navigate('Checkout');
    } else {
      Alert.alert(
        'Cannot Proceed',
        'Please add expenses for all trips before proceeding to checkout.'
      );
    }
  }, [allExpensesAdded, navigation]);

  const handleRefresh = useCallback(async () => {
    // In a real app, this would refetch data from API
    // For now, the store already has the data
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, []);

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await handleRefresh();
    setIsRefreshing(false);
  }, [handleRefresh]);

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
            onRefresh={onRefresh}
            tintColor={colors.primaryBlue}
            colors={[colors.primaryBlue]}
          />
        }
      >

        {/* Summary Stats Row */}
        <SummaryStatsRow
          totalTrips={totalTrips}
          totalIncome={totalIncome}
        />

        {/* Trips List */}
        <TripsList
          trips={trips}
          onTripPress={handleTripPress}
          onAddExpense={handleAddExpense}
        />

        {/* Info Banner */}
        <InfoBanner message="All trips must have expenses added to complete your day." />

        {/* Summary Footer */}
        <SummaryFooter
          totalIncome={totalIncome || 0}
          totalExpenses={totalExpenses || 0}
          totalSettlement={totalSettlement || 0}
          profit={profit || 0}
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
