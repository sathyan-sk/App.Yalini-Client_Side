/**
 * EditTripScreen - Screen to edit trip details in Driver module
 * Allows driver to update trip info and view/edit expenses
 * Follows the design specifications with pixel-perfect implementation
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { colors, spacing } from '../../../theme';
import {
  EditTripHeader,
  TripSummaryCard,
  EditTripForm,
  ExpenseSummaryCard,
  ActionButtons,
} from './components';
import { MOCK_ALL_TRIPS_DATA } from '../AllTrips/data/mockData';
import { DEFAULT_EXPENSE } from './data/mockData';
import type { EditTripFormData, PaymentMode, AllTripsTrip } from '../../../types/driver';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type EditTripRouteParams = {
  EditTrip: {
    tripId: string;
  };
};

export default function EditTripScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<EditTripRouteParams, 'EditTrip'>>();

  // Get trip ID from route params (default to first trip for demo)
  const tripId = route.params?.tripId || MOCK_ALL_TRIPS_DATA.trips[0].id;

  // Find the trip from mock data
  const trip = useMemo(() => {
    return MOCK_ALL_TRIPS_DATA.trips.find((t) => t.id === tripId) || MOCK_ALL_TRIPS_DATA.trips[0];
  }, [tripId]);

  // Form state initialized from trip data
  const [formData, setFormData] = useState<EditTripFormData>({
    from: trip.from,
    to: trip.to,
    amount: trip.amount.toString(),
    paymentMode: trip.paymentMode,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get expense data (use default if no expense)
  const expenseData = trip.expense || DEFAULT_EXPENSE;

  // Form handlers
  const handleFromChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, from: value }));
  }, []);

  const handleToChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, to: value }));
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setFormData((prev) => ({ ...prev, amount: sanitized }));
  }, []);

  const handlePaymentModeChange = useCallback((mode: PaymentMode) => {
    setFormData((prev) => ({ ...prev, paymentMode: mode }));
  }, []);

  const handleClearFrom = useCallback(() => {
    setFormData((prev) => ({ ...prev, from: '' }));
  }, []);

  const handleClearTo = useCallback(() => {
    setFormData((prev) => ({ ...prev, to: '' }));
  }, []);

  const handleClearAmount = useCallback(() => {
    setFormData((prev) => ({ ...prev, amount: '' }));
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEditExpense = useCallback(() => {
    Alert.alert('Edit Expense', 'Expense editing screen coming soon!');
  }, []);

  const handleSaveChanges = useCallback(async () => {
    // Validation
    if (!formData.from.trim()) {
      Alert.alert('Error', 'Please enter pickup location');
      return;
    }
    if (!formData.to.trim()) {
      Alert.alert('Error', 'Please enter drop location');
      return;
    }
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Success', 'Trip updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigation]);

  const handleDeleteTrip = useCallback(() => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Trip deleted successfully!', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]);
          },
        },
      ]
    );
  }, [navigation]);

  // Create a modified trip object for the summary card
  const displayTrip: AllTripsTrip = {
    ...trip,
    from: formData.from,
    to: formData.to,
    amount: parseFloat(formData.amount) || trip.amount,
    paymentMode: formData.paymentMode,
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <EditTripHeader onBackPress={handleBackPress} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Trip Summary Card */}
          <TripSummaryCard trip={displayTrip} />

          {/* Edit Trip Form */}
          <EditTripForm
            formData={formData}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
            onAmountChange={handleAmountChange}
            onPaymentModeChange={handlePaymentModeChange}
            onClearFrom={handleClearFrom}
            onClearTo={handleClearTo}
            onClearAmount={handleClearAmount}
          />

          {/* Expense Summary */}
          <ExpenseSummaryCard
            expense={expenseData}
            onEditExpense={handleEditExpense}
          />

          {/* Action Buttons */}
          <ActionButtons
            onSave={handleSaveChanges}
            onDelete={handleDeleteTrip}
            isSubmitting={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  flex: {
    flex: 1,
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
