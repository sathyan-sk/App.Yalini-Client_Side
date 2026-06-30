/**
 * AddDeliveryScreen - Main screen for recording water can deliveries.
 *
 * Features:
 * - Centralized Loaded Cans: Enter total cans loaded on first delivery (then locked)
 * - SessionInfoCard shows Total Loaded & Remaining cans
 * - Rate per can shown per-hotel in CansInformationForm
 * - Outstanding cans auto-calculated (previous + delivered - returned)
 * - Est. Amount auto-calculated (deliveredCans * ratePerCan)
 * - Income Received input for money collected
 * - Payment Mode toggle (CASH or ONLINE only)
 * - Full validation including remaining cans check
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, cardShadow, radius, fontSize } from '../../../theme';
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
  PaymentInfoSection,
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
  estAmount: 0,
  receivedIncome: 0,
  settledCash: 0,
  settledOnline: 0,
  shortage: 0,
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
  const { session, hotels, deliveries, setSession, setHotels, addDelivery, getDeliveryById } =
    useDeliveryStore();

  // Local state
  const [formValues, setFormValues] = useState<DeliveryFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<DeliveryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Centralized loaded cans state (Option B: set on first delivery, then locked)
  const [totalLoadedCans, setTotalLoadedCans] = useState<number>(0);
  const [isLoadedCansLocked, setIsLoadedCansLocked] = useState(false);

  // Computed values
  const isSessionSubmitted = session.sessionStatus === 'SUBMITTED';
  const isHotelSelected = formValues.hotelId !== '';

  // Compute remaining cans (total loaded - sum of all delivered cans)
  const totalDeliveredSoFar = useMemo(() => {
    return deliveries.reduce((sum, d) => sum + d.cansDelivered, 0);
  }, [deliveries]);

  const remainingCans = useMemo(() => {
    if (!isLoadedCansLocked) return undefined;
    return Math.max(0, totalLoadedCans - totalDeliveredSoFar - formValues.cansDelivered);
  }, [totalLoadedCans, totalDeliveredSoFar, formValues.cansDelivered, isLoadedCansLocked]);

  // Outstanding cans calculation with previous value
  const previousOutstandingCans = formValues.hotelId ? (formValues as any).previousOutstandingCans || 0 : 0;
  const newOutstandingCans = previousOutstandingCans + formValues.cansDelivered - formValues.cansReturned;

  /**
   * Filters out hotels that already have saved deliveries.
   */
  const availableHotels = useMemo(() => {
    const savedHotelIds = new Set(deliveries.map((d) => d.hotelId));
    return hotels.filter((h) => !savedHotelIds.has(h.id));
  }, [hotels, deliveries]);

  /**
   * Loads session and hotels data on mount.
   * Also refreshes when screen comes into focus (to pick up new hotel assignments).
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

    // Refresh hotels when screen focuses (picks up new assignments from admin)
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const refreshedHotels = await loadHotelsForDelivery(authUser?.userId);
        setHotels(refreshedHotels);
      } catch (error) {
        console.error('[AddDeliveryScreen] Failed to refresh hotels:', error);
      }
    });

    return unsubscribe;
  }, [setSession, setHotels, navigation, authUser?.userId]);

  /**
   * Updates outstanding cans when delivered or returned changes.
   * Formula: previousOutstanding + delivered - returned
   */
  useEffect(() => {
    const previousOutstanding = (formValues as any).previousOutstandingCans || 0;
    const newOutstanding = previousOutstanding + formValues.cansDelivered - formValues.cansReturned;
    if (newOutstanding !== formValues.outstandingCans) {
      setFormValues((prev) => ({ ...prev, outstandingCans: Math.max(0, newOutstanding) }));
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
   */
  const handleHotelSelect = useCallback((hotel: HotelOption) => {
    const fetchHotelOutstanding = async () => {
      try {
        const { getHotelById } = await import('../../../services/hotelService');
        const hotelData = await getHotelById(hotel.id);
        const previousOutstanding = hotelData?.outstandingCans || 0;

        setFormValues((prev) => ({
          ...prev,
          hotelId: hotel.id,
          hotelName: hotel.name,
          ratePerCan: hotel.ratePerCan,
          previousOutstandingCans: previousOutstanding,
          outstandingCans: Math.max(0, previousOutstanding + prev.cansDelivered - prev.cansReturned),
          estAmount: prev.cansDelivered * hotel.ratePerCan,
        }));
      } catch (error) {
        console.error('Failed to fetch hotel outstanding cans:', error);
        setFormValues((prev) => ({
          ...prev,
          hotelId: hotel.id,
          hotelName: hotel.name,
          ratePerCan: hotel.ratePerCan,
          previousOutstandingCans: 0,
          estAmount: prev.cansDelivered * hotel.ratePerCan,
        }));
      }
    };

    fetchHotelOutstanding();

    if (errors.hotelId) {
      setErrors((prev) => ({ ...prev, hotelId: undefined }));
    }
  }, [errors.hotelId]);

  /**
   * Handles cans delivered change.
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
   */
  const handleReceivedIncomeChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormValues((prev) => ({ ...prev, receivedIncome: numValue }));
    if (errors.receivedIncome) {
      setErrors((prev) => ({ ...prev, receivedIncome: undefined }));
    }
  }, [errors.receivedIncome]);

  /**
   * Handles settled cash change.
   */
  const handleSettledCashChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const expense = formValues.expenseAmount || 0;
    const profit = formValues.receivedIncome - expense;
    setFormValues((prev) => ({
      ...prev,
      settledCash: numValue,
      shortage: Math.max(0, profit - numValue - prev.settledOnline),
    }));
    if (errors.settledCash) {
      setErrors((prev) => ({ ...prev, settledCash: undefined }));
    }
  }, [errors.settledCash, formValues.expenseAmount, formValues.receivedIncome]);

  /**
   * Handles settled online change.
   */
  const handleSettledOnlineChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const expense = formValues.expenseAmount || 0;
    const profit = formValues.receivedIncome - expense;
    setFormValues((prev) => ({
      ...prev,
      settledOnline: numValue,
      shortage: Math.max(0, profit - prev.settledCash - numValue),
    }));
    if (errors.settledOnline) {
      setErrors((prev) => ({ ...prev, settledOnline: undefined }));
    }
  }, [errors.settledOnline, formValues.expenseAmount, formValues.receivedIncome]);

  /**
   * Handles expense category change.
   */
  const handleExpenseCategoryChange = useCallback((category: ExpenseCategory | undefined) => {
    setFormValues((prev) => ({
      ...prev,
      expenseCategory: category,
      expenseAmount: category ? prev.expenseAmount : undefined,
    }));
  }, []);

  /**
   * Handles expense amount change.
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
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: DeliveryFormErrors = {};

    if (!formValues.hotelId) {
      newErrors.hotelId = 'Please select a hotel';
    }

    // Validate loaded cans if not yet locked (first delivery)
    if (!isLoadedCansLocked && totalLoadedCans <= 0) {
      newErrors.loadedCans = 'Please enter total cans loaded for today';
    }

    if (formValues.cansDelivered <= 0) {
      newErrors.cansDelivered = 'Cans delivered must be greater than 0';
    }

    // Check against remaining cans (only if loaded cans is locked)
    if (isLoadedCansLocked && formValues.cansDelivered > (totalLoadedCans - totalDeliveredSoFar)) {
      newErrors.cansDelivered = `Only ${totalLoadedCans - totalDeliveredSoFar} cans remaining`;
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

    if (formValues.expenseCategory && (formValues.expenseAmount === undefined || formValues.expenseAmount <= 0)) {
      newErrors.expenseAmount = 'Please enter expense amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValues, isLoadedCansLocked, totalLoadedCans, totalDeliveredSoFar]);

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
      // If this is the first delivery, lock the loaded cans value
      let effectiveLoadedCans = totalLoadedCans;
      if (!isLoadedCansLocked) {
        // Loaded cans was set via the input; lock it now
        if (totalLoadedCans <= 0) {
          showToast('Please enter total cans loaded for today', 'error');
          setIsSubmitting(false);
          return;
        }
        setIsLoadedCansLocked(true);
      }

      // Save the delivery record (include loadedCans for record keeping)
      const savedRecord = await saveDeliveryRecord({
        ...formValues,
        loadedCans: effectiveLoadedCans,
      } as any);

      // Update store
      addDelivery(savedRecord);

      // Show success toast
      showToast('Delivery saved successfully!', 'success');

      // Reset form (but keep loaded cans locked)
      setFormValues(INITIAL_FORM_VALUES);

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
    totalLoadedCans,
    isLoadedCansLocked,
    addDelivery,
    showToast,
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

          {/* Session Info Card - shows loaded/remaining cans */}
          <SessionInfoCard
            session={session}
            totalLoadedCans={totalLoadedCans}
            remainingCans={
              isLoadedCansLocked
                ? Math.max(0, totalLoadedCans - totalDeliveredSoFar)
                : undefined
            }
            isLoadedCansLocked={isLoadedCansLocked}
            testID="session-info"
          />

          {/* Centralized Loaded Cans Input (shown only before first delivery) */}
          {!isLoadedCansLocked && !isSessionSubmitted && (
            <View style={styles.formCard}>
              <View style={styles.loadedCansSection}>
                <View style={styles.loadedCansHeader}>
                  <View style={styles.loadedCansIconBg}>
                    <Feather name="package" size={22} color={colors.primaryBlue} />
                  </View>
                  <View style={styles.loadedCansHeaderText}>
                    <Text style={styles.loadedCansTitle}>Total Cans Loaded Today</Text>
                    <Text style={styles.loadedCansSubtitle}>
                      Enter total cans loaded on vehicle (set once)
                    </Text>
                  </View>
                </View>
                <View style={styles.loadedCansInputContainer}>
                  <TextInput
                    value={totalLoadedCans > 0 ? totalLoadedCans.toString() : ''}
                    onChangeText={(text) => {
                      const num = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
                      setTotalLoadedCans(num);
                      if (errors.loadedCans) {
                        setErrors((prev) => ({ ...prev, loadedCans: undefined }));
                      }
                    }}
                    placeholder="Enter total cans"
                    placeholderTextColor={colors.textTertiary}
                    style={styles.loadedCansInput}
                    keyboardType="numeric"
                    maxLength={5}
                    autoFocus={true}
                    testID="total-loaded-cans-input"
                  />
                  <Text style={styles.loadedCansUnit}>Cans</Text>
                </View>
                {errors.loadedCans ? (
                  <Text style={styles.errorText}>{errors.loadedCans}</Text>
                ) : null}
                <View style={styles.loadedCansHint}>
                  <Feather name="info" size={14} color={colors.textTertiary} />
                  <Text style={styles.loadedCansHintText}>
                    This will be locked after saving the first delivery
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Loaded cans locked indicator */}
          {isLoadedCansLocked && (
            <View style={styles.lockedBanner}>
              <Feather name="lock" size={14} color={colors.success} />
              <Text style={styles.lockedBannerText}>
                Total Loaded: {totalLoadedCans} cans (locked)
              </Text>
            </View>
          )}

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
              cansDelivered={formValues.cansDelivered}
              cansReturned={formValues.cansReturned}
              outstandingCans={formValues.outstandingCans}
              estAmount={formValues.estAmount}
              ratePerCan={formValues.ratePerCan}
              previousOutstandingCans={(formValues as any).previousOutstandingCans}
              remainingCans={isLoadedCansLocked ? remainingCans : undefined}
              onCansDeliveredChange={handleCansDeliveredChange}
              onCansReturnedChange={handleCansReturnedChange}
              errors={errors}
              disabled={isSessionSubmitted}
              testID="cans-info"
            />
          </View>

          {/* Payment Info Section - Income → Expense → Profit → Settlement */}
          {isHotelSelected && (
            <View style={styles.formCard}>
              <PaymentInfoSection
                income={formValues.receivedIncome}
                expenseCategory={formValues.expenseCategory}
                expenseAmount={formValues.expenseAmount || 0}
                profit={formValues.receivedIncome - (formValues.expenseAmount || 0)}
                settledCash={formValues.settledCash}
                settledOnline={formValues.settledOnline}
                shortage={formValues.shortage}
                onIncomeChange={handleReceivedIncomeChange}
                onExpenseCategoryChange={handleExpenseCategoryChange}
                onExpenseAmountChange={handleExpenseAmountChange}
                onCashChange={handleSettledCashChange}
                onOnlineChange={handleSettledOnlineChange}
                errors={errors}
                disabled={isSessionSubmitted}
                testID="payment-info-section"
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
  // Centralized Loaded Cans Section
  loadedCansSection: {},
  loadedCansHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  loadedCansIconBg: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadedCansHeaderText: {
    flex: 1,
  },
  loadedCansTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  loadedCansSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  loadedCansInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 56,
  },
  loadedCansInput: {
    flex: 1,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    textAlign: 'right',
  },
  loadedCansUnit: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 40,
    fontWeight: '600',
  },
  loadedCansHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  loadedCansHintText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    flex: 1,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  // Locked indicator
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    gap: spacing.sm,
  },
  lockedBannerText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: '600',
  },
});