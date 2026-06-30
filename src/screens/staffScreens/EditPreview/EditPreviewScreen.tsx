/**
 * EditPreviewScreen - Screen to view and edit delivery details in Staff module.
 * Allows staff to view delivery info, update details, and delete delivery.
 * Uses deliveryStore for data management.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing } from '../../../theme';
import {
  EditDeliveryHeader,
  DeliverySummaryCard,
  EditDeliveryForm,
  ActionButtons,
} from './components';
import { useDeliveryStore } from '../../../store/deliveryStore';
import type { AllDeliveriesStackParamList } from '../../../types/navigation';
import type { ExpenseCategory } from '../AddDelivery/types';
import type { EditDeliveryFormData, EditDeliveryFormErrors } from './types';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type EditPreviewNavigationProp = NativeStackNavigationProp<AllDeliveriesStackParamList, 'EditPreview'>;
type EditPreviewRouteProp = RouteProp<AllDeliveriesStackParamList, 'EditPreview'>;

export default function EditPreviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<EditPreviewNavigationProp>();
  const route = useRoute<EditPreviewRouteProp>();

  const { deliveryId } = route.params;

  // Get delivery data and actions from store
  const { getDeliveryById, updateDelivery, removeDelivery, deliveries } = useDeliveryStore();

  // Find the delivery record
  const delivery = deliveries.find(d => d.id === deliveryId);

  // Form state initialized from delivery data
  const [formData, setFormData] = useState<EditDeliveryFormData>({
    loadedCans: 0,
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
  });
  const [errors, setErrors] = useState<EditDeliveryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryNotFound, setDeliveryNotFound] = useState(false);

  // Handle delivery not found
  useEffect(() => {
    if (!delivery && !deliveryNotFound) {
      setDeliveryNotFound(true);
      Alert.alert('Error', 'Delivery not found', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [delivery, deliveryNotFound, navigation]);

  // Initialize form data when delivery loads
  useEffect(() => {
    if (delivery) {
      setFormData({
        loadedCans: delivery.loadedCans,
        cansDelivered: delivery.cansDelivered,
        cansReturned: delivery.cansReturned,
        outstandingCans: delivery.outstandingCans,
        estAmount: delivery.estAmount,
        receivedIncome: delivery.receivedIncome,
        settledCash: delivery.settledCash,
        settledOnline: delivery.settledOnline,
        shortage: delivery.shortage,
        expenseCategory: delivery.expenseCategory,
        expenseAmount: delivery.expenseAmount,
      });
            // Reset deliveryNotFound flag when we find the delivery
      setDeliveryNotFound(false);
    }
   }, [deliveryId, delivery]);

  // Update outstanding cans when delivered or returned changes
  useEffect(() => {
    const outstanding = formData.cansDelivered - formData.cansReturned;
    if (outstanding !== formData.outstandingCans) {
      setFormData((prev) => ({ ...prev, outstandingCans: outstanding }));
    }
  }, [formData.cansDelivered, formData.cansReturned]);

  // Update estimated amount when delivered cans changes
  useEffect(() => {
    if (delivery) {
      const estAmount = formData.cansDelivered * delivery.ratePerCan;
      if (estAmount !== formData.estAmount) {
        setFormData((prev) => ({ ...prev, estAmount }));
      }
    }
  }, [formData.cansDelivered, delivery?.ratePerCan]);

  // Form handlers
  const handleLoadedCansChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({ ...prev, loadedCans: numValue }));
    if (errors.loadedCans) {
      setErrors((prev) => ({ ...prev, loadedCans: undefined }));
    }
  }, [errors.loadedCans]);

  const handleCansDeliveredChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({ ...prev, cansDelivered: numValue }));
    if (errors.cansDelivered) {
      setErrors((prev) => ({ ...prev, cansDelivered: undefined }));
    }
  }, [errors.cansDelivered]);

  const handleCansReturnedChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({ ...prev, cansReturned: numValue }));
    if (errors.cansReturned) {
      setErrors((prev) => ({ ...prev, cansReturned: undefined }));
    }
  }, [errors.cansReturned]);

  const handleReceivedIncomeChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({ ...prev, receivedIncome: numValue }));
    if (errors.receivedIncome) {
      setErrors((prev) => ({ ...prev, receivedIncome: undefined }));
    }
  }, [errors.receivedIncome]);

  const handleSettledCashChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const expense = formData.expenseAmount || 0;
    const profit = formData.receivedIncome - expense;
    setFormData((prev) => ({
      ...prev,
      settledCash: numValue,
      shortage: Math.max(0, profit - numValue - prev.settledOnline),
    }));
    if (errors.settledCash) {
      setErrors((prev) => ({ ...prev, settledCash: undefined }));
    }
  }, [errors.settledCash, formData.expenseAmount, formData.receivedIncome]);

  const handleSettledOnlineChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const expense = formData.expenseAmount || 0;
    const profit = formData.receivedIncome - expense;
    setFormData((prev) => ({
      ...prev,
      settledOnline: numValue,
      shortage: Math.max(0, profit - prev.settledCash - numValue),
    }));
    if (errors.settledOnline) {
      setErrors((prev) => ({ ...prev, settledOnline: undefined }));
    }
  }, [errors.settledOnline, formData.expenseAmount, formData.receivedIncome]);

  const handleExpenseCategoryChange = useCallback((category: ExpenseCategory | undefined) => {
    setFormData((prev) => ({
      ...prev,
      expenseCategory: category,
      expenseAmount: category ? prev.expenseAmount : undefined,
    }));
  }, []);

  const handleExpenseAmountChange = useCallback((value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData((prev) => ({ ...prev, expenseAmount: numValue }));
    if (errors.expenseAmount) {
      setErrors((prev) => ({ ...prev, expenseAmount: undefined }));
    }
  }, [errors.expenseAmount]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: EditDeliveryFormErrors = {};

    if (formData.loadedCans <= 0) {
      newErrors.loadedCans = 'Loaded cans must be greater than 0';
    }

    if (formData.cansDelivered <= 0) {
      newErrors.cansDelivered = 'Cans delivered must be greater than 0';
    }

    if (formData.cansDelivered > formData.loadedCans) {
      newErrors.cansDelivered = 'Cans delivered cannot exceed loaded cans';
    }

    if (formData.cansReturned < 0) {
      newErrors.cansReturned = 'Cans returned cannot be negative';
    }

    if (formData.cansReturned > formData.cansDelivered) {
      newErrors.cansReturned = 'Cans returned cannot exceed cans delivered';
    }

    if (formData.receivedIncome < 0) {
      newErrors.receivedIncome = 'Income received cannot be negative';
    }

    if (formData.expenseCategory && (formData.expenseAmount === undefined || formData.expenseAmount <= 0)) {
      newErrors.expenseAmount = 'Please enter expense amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Save changes
  const handleSaveChanges = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update delivery in store
      updateDelivery(deliveryId, {
        loadedCans: formData.loadedCans,
        cansDelivered: formData.cansDelivered,
        cansReturned: formData.cansReturned,
        outstandingCans: formData.outstandingCans,
        estAmount: formData.estAmount,
        receivedIncome: formData.receivedIncome,
        settledCash: formData.settledCash,
        settledOnline: formData.settledOnline,
        shortage: formData.shortage,
        expenseCategory: formData.expenseCategory,
        expenseAmount: formData.expenseAmount,
      });

      Alert.alert('Success', 'Delivery updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigation, deliveryId, updateDelivery, validateForm]);

  // Delete delivery
  const handleDeleteDelivery = useCallback(() => {
    Alert.alert(
      'Delete Delivery',
      'Are you sure you want to delete this delivery? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeDelivery(deliveryId);
            Alert.alert('Deleted', 'Delivery deleted successfully!', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]);
          },
        },
      ]
    );
  }, [navigation, deliveryId, removeDelivery]);

  // If delivery not found, show loading/error state
  if (!delivery) {
    return (
      <View style={styles.container}>
        <EditDeliveryHeader onBackPress={handleBackPress} />
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.errorText}>Loading delivery...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <EditDeliveryHeader onBackPress={handleBackPress} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Delivery Summary Card */}
          <DeliverySummaryCard
            delivery={delivery}
            formValues={{
              cansDelivered: formData.cansDelivered,
              cansReturned: formData.cansReturned,
              outstandingCans: formData.outstandingCans,
              estAmount: formData.estAmount,
              receivedIncome: formData.receivedIncome,
            }}
          />

          {/* Edit Delivery Form */}
          <EditDeliveryForm
            loadedCans={formData.loadedCans}
            cansDelivered={formData.cansDelivered}
            cansReturned={formData.cansReturned}
            receivedIncome={formData.receivedIncome}
            settledCash={formData.settledCash}
            settledOnline={formData.settledOnline}
            expenseCategory={formData.expenseCategory}
            expenseAmount={formData.expenseAmount}
            errors={errors}
            onLoadedCansChange={handleLoadedCansChange}
            onCansDeliveredChange={handleCansDeliveredChange}
            onCansReturnedChange={handleCansReturnedChange}
            onReceivedIncomeChange={handleReceivedIncomeChange}
            onSettledCashChange={handleSettledCashChange}
            onSettledOnlineChange={handleSettledOnlineChange}
            onExpenseCategoryChange={handleExpenseCategoryChange}
            onExpenseAmountChange={handleExpenseAmountChange}
          />

          {/* Action Buttons */}
          <ActionButtons
            onSave={handleSaveChanges}
            onDelete={handleDeleteDelivery}
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
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
