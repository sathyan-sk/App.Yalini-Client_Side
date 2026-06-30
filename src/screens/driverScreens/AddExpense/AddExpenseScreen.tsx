/**
 * AddExpenseScreen - Screen to add/edit expenses for a trip in Driver module
 * Allows driver to enter expense details: Fuel, Toll, Food, Other
 * Uses tripStore for data management
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import {
  AddExpenseHeader,
  TripInfoCard,
  ExpenseDetailsCard,
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
  const [settledCash, setSettledCash] = useState(0);
  const [settledOnline, setSettledOnline] = useState(0);
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
    // Help functionality removed
  }, []);
  /**
   * Navigate to AllTripsScreen (AllTripsList) after saving expense
   * This ensures proper navigation flow: AddTrip -> AddExpense -> AllTrips
   * Uses reset to clear the navigation stack and go directly to AllTripsList
   */
  const navigateToAllTrips = useCallback(() => {
    // Get the parent navigator (tab navigator) and navigate to AllTripsStack
    // Then reset the AllTripsStack to show AllTripsList
    const parent = navigation.getParent();
    if (parent) {
      // Navigate to the AllTripsStack tab and reset to AllTripsList
      parent.navigate('AllTripsStack', {
        screen: 'AllTripsList',
      });
    } else {
      // Fallback: Navigate within the current stack
      navigation.navigate('AllTripsList');
    }
  }, [navigation]);

  const handleSaveExpense = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const expenseData = {
        fuel: parseFloat(formData.fuel) || 0,
        toll: parseFloat(formData.toll) || 0,
        food: parseFloat(formData.food) || 0,
        other: parseFloat(formData.other) || 0,
        notes: formData.notes.trim(),
        settledCash,
        settledOnline,
      };

      if (mode === 'edit' && trip?.hasExpense) {
        // Update existing expense
        updateExpense(tripId, expenseData);
      } else {
        // Add new expense
        addExpense(tripId, expenseData);
      }

      // Navigate directly without alert
      navigateToAllTrips();
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, settledCash, settledOnline, navigation, tripId, mode, trip?.hasExpense, addExpense, updateExpense, navigateToAllTrips]);

  // If trip not found, go back
  if (!trip) {
    navigation.goBack();
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
            categories={EXPENSE_CATEGORIES as any}
            formData={formData}
            onFieldChange={handleFieldChange}
            totalExpense={totalExpense}
          />

          {/* Profit Section (auto-calculated) */}
          <View style={styles.profitSection}>
            <View style={styles.profitRow}>
              <View style={styles.profitInfo}>
                <View style={styles.profitIconBg}>
                  <Feather name="trending-up" size={18} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.profitLabel}>Profit</Text>
                  <Text style={styles.profitSubtitle}>Trip Amount − Expense</Text>
                </View>
              </View>
              <Text style={styles.profitValue}>₹{Math.max(0, trip.amount - totalExpense)}</Text>
            </View>
          </View>

          {/* Settlement Section - based on PROFIT */}
          <View style={styles.settlementSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Settlement to Owner <Text style={styles.required}>*</Text></Text>
              <Text style={styles.sectionSubtitle}>Amount to settle: ₹{Math.max(0, trip.amount - totalExpense)} (= Profit)</Text>
            </View>
            <View style={styles.settlementRow}>
              <View style={styles.settlementField}>
                <Text style={styles.inputLabel}>Settled via Cash</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="money-bill-wave" size={16} color={colors.success} />
                  <TextInput
                    style={styles.input}
                    value={settledCash.toString()}
                    onChangeText={(value) => setSettledCash(parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
              <View style={styles.settlementField}>
                <Text style={styles.inputLabel}>Settled via Online</Text>
                <View style={styles.inputContainer}>
                  <Feather name="smartphone" size={18} color={colors.primaryBlue} />
                  <TextInput
                    style={styles.input}
                    value={settledOnline.toString()}
                    onChangeText={(value) => setSettledOnline(parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
            </View>
            <View style={[
              styles.shortageRow,
              (settledCash + settledOnline) === Math.max(0, trip.amount - totalExpense) 
                ? styles.shortageOk 
                : styles.shortageDue
            ]}>
              <Feather 
                name={(settledCash + settledOnline) === Math.max(0, trip.amount - totalExpense) ? 'check-circle' : 'alert-circle'} 
                size={16} 
                color={(settledCash + settledOnline) === Math.max(0, trip.amount - totalExpense) ? colors.success : colors.error} 
              />
              <Text style={styles.shortageText}>
                Settled: ₹{settledCash + settledOnline} | Shortage: ₹{Math.max(0, Math.max(0, trip.amount - totalExpense) - (settledCash + settledOnline))}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <ActionButtons
            onSaveExpense={handleSaveExpense}
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
  settlementSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  settlementRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  settlementField: {
    flex: 1,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  expenseValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.error,
  },
  settledValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.success,
  },
  profitSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profitIconBg: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profitLabel: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profitSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  profitValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  required: {
    color: colors.error,
    fontWeight: '700',
  },
  shortageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  shortageOk: {
    backgroundColor: colors.successSoft,
  },
  shortageDue: {
    backgroundColor: colors.errorSoft,
  },
  shortageText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
});
