/**
 * EditPreviewScreen - Screen to view and edit trip details in Driver module
 * Allows driver to view trip info, update details, and navigate to edit expense
 * Uses tripStore for data management
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing } from '../../../theme';
import {
  EditTripHeader,
  TripSummaryCard,
  EditTripForm,
  ExpenseSummaryCard,
  ActionButtons,
} from './components';
import { useTripStore, TripWithExpense, TripExpense } from '../../../store/tripStore';
import type { AllTripsStackParamList } from '../../../types/navigation';
import type { EditTripFormData, PaymentMode } from '../../../types/driver';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type EditPreviewNavigationProp = NativeStackNavigationProp<AllTripsStackParamList, 'EditPreview'>;
type EditPreviewRouteProp = RouteProp<AllTripsStackParamList, 'EditPreview'>;

// Default expense data when no expense exists
const DEFAULT_EXPENSE: TripExpense = {
  fuel: 0,
  toll: 0,
  food: 0,
  other: 0,
  notes: '',
  total: 0,
};

export default function EditPreviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<EditPreviewNavigationProp>();
  const route = useRoute<EditPreviewRouteProp>();

  const { tripId } = route.params;

  // Get trip data and actions from store
  const { getTripById, updateTrip, deleteTrip } = useTripStore();
  const trip = getTripById(tripId);

  // Form state initialized from trip data
  const [formData, setFormData] = useState<EditTripFormData>({
    from: '',
    to: '',
    amount: '',
    paymentMode: 'cash',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when trip loads
  useEffect(() => {
    if (trip) {
      setFormData({
        from: trip.from,
        to: trip.to,
        amount: trip.amount.toString(),
        paymentMode: trip.paymentMode,
      });
    }
  }, [trip?.id]); // Only re-initialize when tripId changes

  // Get expense data (use default if no expense)
  const expenseData = trip?.expense || DEFAULT_EXPENSE;

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
    // Navigate to AddExpenseForTrip screen with mode 'edit'
    const mode = trip?.hasExpense ? 'edit' : 'add';
    navigation.navigate('AddExpenseForTrip', { tripId, mode });
  }, [navigation, tripId, trip?.hasExpense]);

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
      // Update trip in store
      updateTrip(tripId, {
        from: formData.from.trim(),
        to: formData.to.trim(),
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
      });

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
  }, [formData, navigation, tripId, updateTrip]);

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
            deleteTrip(tripId);
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
  }, [navigation, tripId, deleteTrip]);

  // If trip not found, show error and go back
  if (!trip) {
    return (
      <View style={styles.container}>
        <EditTripHeader onBackPress={handleBackPress} />
        <View style={styles.errorContainer}>
          <Alert.alert('Error', 'Trip not found', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        </View>
      </View>
    );
  }

  // Create a display trip object with current form data
  const displayTrip: TripWithExpense = {
    ...trip,
    from: formData.from || trip.from,
    to: formData.to || trip.to,
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
            hasExpense={trip.hasExpense}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
