/**
 * AddExpenseScreen - Screen to add/edit expenses for a trip in Driver module
 * Allows driver to enter expense details: Fuel, Toll, Food, Other
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
  AddExpenseHeader,
  TripInfoCard,
  ExpenseDetailsCard,
  NotesSection,
  ActionButtons,
} from './components';
import { EXPENSE_CATEGORIES, INITIAL_EXPENSE_FORM } from './data/mockData';
import { useTripStore } from '../../../store/tripStore';
import type { ExpenseFormData, ExpenseField } from '../../../types/driver';
import type { AllTripsStackParamList } from '../../../types/navigation';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type AddExpenseNavigationProp = NativeStackNavigationProp<AllTripsStackParamList, 'AddExpenseForTrip'>;
type AddExpenseRouteProp = RouteProp<AllTripsStackParamList, 'AddExpenseForTrip'>;

export default function AddExpenseScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AddExpenseNavigationProp>();
  const route = useRoute<AddExpenseRouteProp>();

  const { tripId, mode } = route.params;
  
  // Get trip data and actions from store
  const { getTripById, addExpense, updateExpense } = useTripStore();
  const trip = getTripById(tripId);

  // Form state - initialized from trip's existing expense or empty
  const [formData, setFormData] = useState<ExpenseFormData>(INITIAL_EXPENSE_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data from existing expense if editing
  useEffect(() => {
    if (trip?.expense && mode === 'edit') {
      setFormData({
        fuel: trip.expense.fuel.toString(),
        toll: trip.expense.toll.toString(),
        food: trip.expense.food.toString(),
        other: trip.expense.other.toString(),
        notes: trip.expense.notes || '',
      });
    } else {
      // Reset to default for new expenses
      setFormData(INITIAL_EXPENSE_FORM);
    }
  }, [trip?.id, mode]);

  // Calculate total expense
  const totalExpense = useMemo(() => {
    const fuel = parseFloat(formData.fuel) || 0;
    const toll = parseFloat(formData.toll) || 0;
    const food = parseFloat(formData.food) || 0;
    const other = parseFloat(formData.other) || 0;
    return fuel + toll + food + other;
  }, [formData]);

  // Form handlers
  const handleFieldChange = useCallback((field: ExpenseField, value: string) => {
    // Only allow numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
  }, []);

  const handleNotesChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, notes: value }));
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHelpPress = useCallback(() => {
    Alert.alert(
      'Help',
      'Enter your expense details for this trip. You can add fuel, toll, food, and other expenses. The total will be calculated automatically.'
    );
  }, []);

  const handleSaveExpense = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const expenseData = {
        fuel: parseFloat(formData.fuel) || 0,
        toll: parseFloat(formData.toll) || 0,
        food: parseFloat(formData.food) || 0,
        other: parseFloat(formData.other) || 0,
        notes: formData.notes.trim(),
      };

      if (mode === 'edit' && trip?.hasExpense) {
        // Update existing expense
        updateExpense(tripId, expenseData);
      } else {
        // Add new expense
        addExpense(tripId, expenseData);
      }

      Alert.alert('Success', 'Expense saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigation, tripId, mode, trip?.hasExpense, addExpense, updateExpense]);

  const handleSkipExpense = useCallback(() => {
    Alert.alert(
      'Skip Expense',
      'Are you sure you want to skip adding expenses? You can add them later from All Trips.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }, [navigation]);

  // If trip not found, show error
  if (!trip) {
    Alert.alert('Error', 'Trip not found', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
    return null;
  }

  // Convert trip data to format expected by TripInfoCard
  const tripData = {
    tripId: trip.id,
    from: trip.from,
    to: trip.to,
    date: trip.date,
    time: trip.time,
    paymentMode: trip.paymentMode === 'cash' ? 'Cash' as const : 'Online' as const,
    amount: trip.amount,
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <AddExpenseHeader
          onBackPress={handleBackPress}
          onHelpPress={handleHelpPress}
          title={mode === 'edit' ? 'Edit Expense' : 'Add Expense'}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Trip Info Card */}
          <TripInfoCard tripData={tripData} />

          {/* Expense Details Card */}
          <ExpenseDetailsCard
            categories={EXPENSE_CATEGORIES}
            formData={formData}
            onFieldChange={handleFieldChange}
            totalExpense={totalExpense}
          />

          {/* Notes Section */}
          <NotesSection
            notes={formData.notes}
            onNotesChange={handleNotesChange}
          />

          {/* Action Buttons */}
          <ActionButtons
            onSaveExpense={handleSaveExpense}
            onSkipExpense={handleSkipExpense}
            isSubmitting={isSubmitting}
            isEditMode={mode === 'edit'}
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
