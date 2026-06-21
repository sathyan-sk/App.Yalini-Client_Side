/**
 * AddDeliveryScreen - Main screen for recording water can deliveries.
 *
 * This screen allows staff members to record a single water can delivery to a hotel.
 * Features:
 * - Searchable hotel dropdown from admin hotel master list
 * - Cans Delivered and Cans Returned numeric inputs
 * - Outstanding Cans auto-calculated (delivered - returned)
 * - Income input for money collected
 * - Payment Mode toggle (CASH or ONLINE only)
 * - Save button disabled when session status is SUBMITTED
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
import React, { useState, useEffect, useCallback } from 'react';
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
} from './components';

/** Navigation prop type for AddDelivery screen */
type NavigationProp = BottomTabNavigationProp<StaffTabParamList, 'AddDelivery'>;

/** Initial form values */
const INITIAL_FORM_VALUES: DeliveryFormValues = {
  hotelId: '',
  hotelName: '',
  ratePerCan: 0,
  cansDelivered: 0,
  cansReturned: 0,
  outstandingCans: 0,
  income: 0,
  paymentMode: 'CASH',
};

/**
 * AddDeliveryScreen component.
 * Main screen for recording water can deliveries to hotels.
 * @returns JSX element
 */
export default function AddDeliveryScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  // Store state
  const { session, hotels, setSession, setHotels, addDelivery } =
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

  /**
   * Loads session and hotels data on mount.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [sessionData, hotelsData] = await Promise.all([
          getDeliverySession(),
          loadHotelsForDelivery(),
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
    }));
    if (errors.hotelId) {
      setErrors((prev) => ({ ...prev, hotelId: undefined }));
    }
  }, [errors.hotelId]);

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
   * Handles income change.
   * @param value - String value from input
   */
  const handleIncomeChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, income: numValue }));
    if (errors.income) {
      setErrors((prev) => ({ ...prev, income: undefined }));
    }
  }, [errors.income]);

  /**
   * Handles payment mode change.
   * @param mode - Selected payment mode
   */
  const handlePaymentModeChange = useCallback((mode: PaymentMode) => {
    setFormValues((prev) => ({ ...prev, paymentMode: mode }));
  }, []);

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

    if (formValues.cansDelivered <= 0) {
      newErrors.cansDelivered = 'Cans delivered must be greater than 0';
    }

    if (formValues.cansReturned < 0) {
      newErrors.cansReturned = 'Cans returned cannot be negative';
    }

    if (formValues.cansReturned > formValues.cansDelivered) {
      newErrors.cansReturned = 'Cans returned cannot exceed cans delivered';
    }

    if (formValues.income < 0) {
      newErrors.income = 'Income cannot be negative';
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
      {/* Header */}
      <AddDeliveryHeader
        onBackPress={handleBackPress}
        topInset={insets.top}
        testID="add-delivery-header"
      />

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
          {/* Session Info Card */}
          <SessionInfoCard
            session={session}
            ratePerCan={formValues.ratePerCan}
            testID="session-info"
          />

          {/* Hotel Selector */}
          <View style={styles.formCard}>
            <HotelSelector
              hotels={hotels}
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
              cansDelivered={formValues.cansDelivered}
              cansReturned={formValues.cansReturned}
              outstandingCans={formValues.outstandingCans}
              onCansDeliveredChange={handleCansDeliveredChange}
              onCansReturnedChange={handleCansReturnedChange}
              errors={errors}
              disabled={isSessionSubmitted}
              testID="cans-info"
            />
          </View>

          {/* Income Section */}
          <View style={styles.formCard}>
            <IncomeInput
              value={formValues.income}
              onChange={handleIncomeChange}
              error={errors.income}
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
