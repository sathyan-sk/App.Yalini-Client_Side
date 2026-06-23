/**
 * AddDeliveryScreen - Main screen for recording water can deliveries.
 *
 * This screen allows staff members to record a single water can delivery to a hotel.
 * Features:
 * - Searchable hotel dropdown from admin hotel master list
 * - Loaded Cans, Cans Delivered and Cans Returned numeric inputs
 * - Outstanding Cans auto-calculated (delivered - returned)
 * - Est. Amount auto-calculated (deliveredCans * ratePerCan)
 * - Income Received input for money collected
 * - Payment Mode toggle (CASH or ONLINE only)
 * - Optional Expense section (Fuel/Others category + amount)
 * - Save button disabled when session status is SUBMITTED
 * - Prevents duplicate deliveries (saved hotels are unclickable)
 * - Full validation before save
 * - Navigation to AllDeliveriesScreen on success
 *
 * Design follows the Admin module patterns with:
 * - USE_MOCK flag for mock service layer
 * - Theme-based colors (no hardcoded values)
 * - Strict TypeScript (no any types)
 * - StyleSheet.create() (no inline styles)
 * - JSDoc on all functions and components
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing, cardShadow, radius } from '../../../theme';
import { useAuthStore } from '../../../store/authStore';
import { useDeliveryStore } from '../../../store/deliveryStore';
import {
  loadHotelsForDelivery,
  getDeliverySession,
  saveDeliveryRecord,
} from '../../../services/deliveryService';
import type { StaffTabParamList } from '../../../types/navigation';
import type {
  DeliveryFormValues,
  DeliveryFormErrors,
  HotelOption,
  PaymentMode,
  ExpenseCategory,
} from './types';

import {
  AddDeliveryHeader,
  HotelSelector,
  SessionInfoCard,
  CansInformationForm,
  IncomeInput,
  PaymentModeToggle,
  SaveButton,
  FormToast,
  ExpenseSection,
} from './components';

/** Navigation prop type for AddDelivery screen */
type NavigationProp = BottomTabNavigationProp<StaffTabParamList, 'AddDelivery'>;

/** Initial form values */
const INITIAL_FORM_VALUES: DeliveryFormValues = {
  hotelId: '',
  hotelName: '',
  ratePerCan: 0,
  loadedCans: 0,
  cansDelivered: 0,
  cansReturned: 0,
  outstandingCans: 0,
  estAmount: 0,
  receivedIncome: 0,
  paymentMode: 'CASH',
  expenseCategory: undefined,
  expenseAmount: undefined,
};

/**
 * AddDeliveryScreen component.
 * Main screen for recording water can deliveries to hotels.
 * @returns JSX element
 */
export default function AddDeliveryScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const authUser = useAuthStore((state) => state.user);

  // Store state
  const { session, hotels, deliveries, setSession, setHotels, addDelivery } =
    useDeliveryStore();

  // Local state
  const [formValues, setFormValues] =
    useState<DeliveryFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<DeliveryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Computed values
  const isSessionSubmitted = session.sessionStatus === 'SUBMITTED';
  const isHotelSelected = formValues.hotelId !== '';

  /**
   * Filters out hotels that already have saved deliveries.
   * This prevents duplicate deliveries to the same hotel.
   */
  const availableHotels = useMemo(() => {
    const savedHotelIds = new Set(deliveries.map((d) => d.hotelId));
    return hotels.filter((h) => !savedHotelIds.has(h.id));
  }, [hotels, deliveries]);

  /**
   * Loads session and hotels data on mount.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [sessionData, hotelsData] = await Promise.all([
          getDeliverySession(authUser?.userId),
          loadHotelsForDelivery(authUser?.userId),
        ]);
        setSession(sessionData);
        setHotels(hotelsData);
      } catch (error) {
        console.error('[AddDeliveryScreen] Failed to load data:', error);
        showToast('Failed to load data. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setSession, setHotels]);

  /**
   * Updates outstanding cans when delivered or returned changes.
   */
  useEffect(() => {
    const outstanding = formValues.cansDelivered - formValues.cansReturned;
    if (outstanding !== formValues.outstandingCans) {
      setFormValues((prev) => ({ ...prev, outstandingCans: outstanding }));
    }
  }, [formValues.cansDelivered, formValues.cansReturned, formValues.outstandingCans]);

  /**
   * Updates estimated amount when delivered cans or rate changes.
   */
  useEffect(() => {
    const estAmount = formValues.cansDelivered * formValues.ratePerCan;
    if (estAmount !== formValues.estAmount) {
      setFormValues((prev) => ({ ...prev, estAmount }));
    }
  }, [formValues.cansDelivered, formValues.ratePerCan, formValues.estAmount]);

  /**
   * Shows a toast notification.
   * @param message - Toast message
   * @param type - Toast type
   */
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    },
    []
  );

  /**
   * Handles hotel selection.
   * @param hotel - Selected hotel option
   */
  const handleHotelSelect = useCallback((hotel: HotelOption) => {
    setFormValues((prev) => ({
      ...prev,
      hotelId: hotel.id,
      hotelName: hotel.name,
      ratePerCan: hotel.ratePerCan,
      // Recalculate estAmount with new rate
      estAmount: prev.cansDelivered * hotel.ratePerCan,
    }));
    if (errors.hotelId) {
      setErrors((prev) => ({ ...prev, hotelId: undefined }));
    }
  }, [errors.hotelId]);

  /**
   * Handles loaded cans change.
   * @param value - String value from input
   */
  const handleLoadedCansChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, loadedCans: numValue }));
    if (errors.loadedCans) {
      setErrors((prev) => ({ ...prev, loadedCans: undefined }));
    }
  }, [errors.loadedCans]);

  /**
   * Handles cans delivered change.
   * @param value - String value from input
   */
  const handleCansDeliveredChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, cansDelivered: numValue }));
    if (errors.cansDelivered) {
      setErrors((prev) => ({ ...prev, cansDelivered: undefined }));
    }
  }, [errors.cansDelivered]);

  /**
   * Handles cans returned change.
   * @param value - String value from input
   */
  const handleCansReturnedChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, cansReturned: numValue }));
    if (errors.cansReturned) {
      setErrors((prev) => ({ ...prev, cansReturned: undefined }));
    }
  }, [errors.cansReturned]);

  /**
   * Handles income received change.
   * @param value - String value from input
   */
  const handleReceivedIncomeChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, receivedIncome: numValue }));
    if (errors.receivedIncome) {
      setErrors((prev) => ({ ...prev, receivedIncome: undefined }));
    }
  }, [errors.receivedIncome]);

  /**
   * Handles payment mode change.
   * @param mode - Selected payment mode
   */
  const handlePaymentModeChange = useCallback((mode: PaymentMode) => {
    setFormValues((prev) => ({ ...prev, paymentMode: mode }));
  }, []);

  /**
   * Handles expense category change.
   * @param category - Selected expense category or undefined
   */
  const handleExpenseCategoryChange = useCallback((category: ExpenseCategory | undefined) => {
    setFormValues((prev) => ({
      ...prev,
      expenseCategory: category,
      // Reset amount if category is cleared
      expenseAmount: category ? prev.expenseAmount : undefined,
    }));
  }, []);

  /**
   * Handles expense amount change.
   * @param value - String value from input
   */
  const handleExpenseAmountChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, expenseAmount: numValue }));
    if (errors.expenseAmount) {
      setErrors((prev) => ({ ...prev, expenseAmount: undefined }));
    }
  }, [errors.expenseAmount]);

  /**
   * Navigates back to previous screen.
   */
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  /**
   * Validates the form fields.
   * @returns True if form is valid
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: DeliveryFormErrors = {};

    if (!formValues.hotelId) {
      newErrors.hotelId = 'Please select a hotel';
    }

    if (formValues.loadedCans <= 0) {
      newErrors.loadedCans = 'Loaded cans must be greater than 0';
    }

    if (formValues.cansDelivered <= 0) {
      newErrors.cansDelivered = 'Cans delivered must be greater than 0';
    }

    if (formValues.cansDelivered > formValues.loadedCans) {
      newErrors.cansDelivered = 'Cans delivered cannot exceed loaded cans';
    }

    if (formValues.cansReturned < 0) {
      newErrors.cansReturned = 'Cans returned cannot be negative';
    }

    if (formValues.cansReturned > formValues.cansDelivered) {
      newErrors.cansReturned = 'Cans returned cannot exceed cans delivered';
    }

    if (formValues.receivedIncome < 0) {
      newErrors.receivedIncome = 'Income received cannot be negative';
    }

    // Validate expense amount if category is selected
    if (formValues.expenseCategory && (formValues.expenseAmount === undefined || formValues.expenseAmount <= 0)) {
      newErrors.expenseAmount = 'Please enter expense amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValues]);

  /**
   * Resets form to initial state.
   */
  const resetForm = useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
    setErrors({});
  }, []);

  /**
   * Handles save delivery action.
   */
  const handleSaveDelivery = useCallback(async () => {
    // Check session status
    if (isSessionSubmitted) {
      Alert.alert(
        'Session Submitted',
        'Your session has been submitted. You cannot add new deliveries.'
      );
      return;
    }

    // Validate form
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save the delivery record
      const savedRecord = await saveDeliveryRecord(formValues);

      // Update store
      addDelivery(savedRecord);

      // Show success toast
      showToast('Delivery saved successfully!', 'success');

      // Reset form
      resetForm();

      // Navigate to AllDeliveries after a short delay
      setTimeout(() => {
        navigation.navigate('AllDeliveries');
      }, 500);
    } catch (error) {
      console.error('[AddDeliveryScreen] Failed to save delivery:', error);
      showToast('Failed to save delivery. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSessionSubmitted,
    validateForm,
    formValues,
    addDelivery,
    showToast,
    resetForm,
    navigation,
  ]);

  return (
    <View style={styles.container} testID="add-delivery-screen">

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbWrap}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          testID="add-delivery-scroll"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl + 80,
          }}
          >
          {/* Header */}
          <AddDeliveryHeader
            onBackPress={handleBackPress}
            topInset={insets.top}
            testID="add-delivery-header"
          />
          
          {/* Session Info Card */}
          <SessionInfoCard
            session={session}
            ratePerCan={formValues.ratePerCan}
            testID="session-info"
          />

          {/* Hotel Selector */}
          <View style={styles.formCard}>
            <HotelSelector
              hotels={availableHotels}
              selectedHotelId={formValues.hotelId}
              onSelectHotel={handleHotelSelect}
              error={errors.hotelId}
              disabled={isSessionSubmitted || isLoading}
              testID="hotel-selector"
            />
          </View>

          {/* Cans Information Section */}
          <View style={styles.formCard}>
            <CansInformationForm
              loadedCans={formValues.loadedCans}
              cansDelivered={formValues.cansDelivered}
              cansReturned={formValues.cansReturned}
              outstandingCans={formValues.outstandingCans}
              estAmount={formValues.estAmount}
              ratePerCan={formValues.ratePerCan}
              onLoadedCansChange={handleLoadedCansChange}
              onCansDeliveredChange={handleCansDeliveredChange}
              onCansReturnedChange={handleCansReturnedChange}
              errors={errors}
              disabled={isSessionSubmitted}
              testID="cans-info"
            />
          </View>

          {/* Income Received Section */}
          <View style={styles.formCard}>
            <IncomeInput
              value={formValues.receivedIncome}
              onChange={handleReceivedIncomeChange}
              error={errors.receivedIncome}
              disabled={isSessionSubmitted}
              testID="income-input"
            />
          </View>

          {/* Payment Mode Section */}
          <View style={styles.formCard}>
            <PaymentModeToggle
              value={formValues.paymentMode}
              onChange={handlePaymentModeChange}
              disabled={isSessionSubmitted}
              testID="payment-mode"
            />
          </View>

          {/* Expense Section - Only visible when hotel is selected */}
          {isHotelSelected && (
            <View style={styles.formCard}>
              <ExpenseSection
                category={formValues.expenseCategory}
                amount={formValues.expenseAmount || 0}
                onCategoryChange={handleExpenseCategoryChange}
                onAmountChange={handleExpenseAmountChange}
                amountError={errors.expenseAmount}
                disabled={isSessionSubmitted}
                testID="expense-section"
              />
            </View>
          )}

          {/* Save Button */}
          <View style={styles.submitContainer}>
            <SaveButton
              onPress={handleSaveDelivery}
              isLoading={isSubmitting}
              disabled={isLoading}
              isSessionSubmitted={isSessionSubmitted}
              testID="save-delivery"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Toast Notification */}
      <FormToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
        testID="delivery-toast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  kbWrap: {
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  submitContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
});
