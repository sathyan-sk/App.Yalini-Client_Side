/**
 * CheckoutScreen - Session checkout/submit screen
 * Driver submits all trips and expenses for the day
 * Updated with proper navigation to SubmittedSuccessfully screen
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import { useTripStore } from '../../../store/tripStore';
import type { DriverStackParamList } from '../../../types/navigation';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type NavigationProp = NativeStackNavigationProp<DriverStackParamList>;

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const { 
    trips, 
    totalTrips, 
    totalIncome, 
    totalExpenses, 
    netAmount, 
    session,
    submitSession,
    isSubmitting,
    submissionError,
    clearSubmissionError,
  } = useTripStore();
  
  const allExpensesAdded = trips.every((trip) => trip.hasExpense);
  const canSubmit = allExpensesAdded && totalTrips > 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (totalTrips === 0) {
        Alert.alert('No Trips', 'Please add at least one trip before submitting.');
      } else {
        Alert.alert('Missing Expenses', 'Please add expenses for all trips before submitting.');
      }
      return;
    }

    // Confirm submission
    Alert.alert(
      'Submit Day',
      `Are you sure you want to submit your day?\n\nTotal Trips: ${totalTrips}\nNet Earnings: ₹${netAmount.toLocaleString('en-IN')}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          style: 'default',
          onPress: async () => {
            const result = await submitSession();
            
            if (result.success) {
              // Navigate to success screen using parent navigator
              navigation.getParent()?.dispatch(
                CommonActions.navigate({
                  name: 'SubmittedSuccessfully',
                })
              );
            } else {
              Alert.alert(
                'Submission Failed',
                result.error || 'Something went wrong. Please try again.',
                [{ text: 'OK', onPress: clearSubmissionError }]
              );
            }
          },
        },
      ]
    );
  };

  const getStatusInfo = () => {
    if (totalTrips === 0) {
      return {
        icon: 'info' as const,
        message: 'No trips recorded yet. Add trips to proceed.',
        color: colors.info,
        bgColor: colors.infoSoft,
        borderColor: '#90CAF9',
      };
    }
    if (!allExpensesAdded) {
      const missingCount = trips.filter(t => !t.hasExpense).length;
      return {
        icon: 'alert-circle' as const,
        message: `${missingCount} trip(s) missing expenses. Please add expenses for all trips.`,
        color: '#F57C00',
        bgColor: '#FFF3E0',
        borderColor: '#FFCC80',
      };
    }
    return {
      icon: 'check-circle' as const,
      message: 'All trips have expenses. Ready to submit!',
      color: colors.successDark,
      bgColor: colors.successSoft,
      borderColor: '#A5D6A7',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.headerSubtitle}>Review and submit your day</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Day Summary</Text>
          <View style={styles.sessionBadge}>
            <Feather name="calendar" size={14} color={colors.primaryBlue} />
            <Text style={styles.sessionDateText}>{session.sessionDate}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.primaryBlueSoft }]}>
              <Feather name="navigation" size={18} color={colors.primaryBlue} />
            </View>
            <Text style={styles.statValue}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.successSoft }]}>
              <Feather name="trending-up" size={18} color={colors.successDark} />
            </View>
            <Text style={[styles.statValue, styles.incomeText]}>₹{totalIncome.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Income</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.errorSoft }]}>
              <Feather name="trending-down" size={18} color={colors.error} />
            </View>
            <Text style={[styles.statValue, styles.expenseText]}>₹{totalExpenses.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.brandSoft }]}>
              <Feather name="dollar-sign" size={18} color={colors.brand} />
            </View>
            <Text style={[styles.statValue, styles.netText]}>₹{netAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Net Amount</Text>
          </View>
        </View>
      </View>

      {/* Status Message */}
      <View style={[
        styles.statusCard,
        { backgroundColor: statusInfo.bgColor, borderColor: statusInfo.borderColor }
      ]}>
        <Feather 
          name={statusInfo.icon} 
          size={24} 
          color={statusInfo.color} 
        />
        <Text style={[styles.statusMessage, { color: statusInfo.color }]}>
          {statusInfo.message}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !canSubmit && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        activeOpacity={0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.surface} size="small" />
        ) : (
          <>
            <Feather name="check-circle" size={22} color={colors.surface} style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>Submit Day</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Footer Note */}
      <Text style={styles.footerNote}>
        Once submitted, you can view this day's record in your history.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBlueSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  sessionDateText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primaryBlue,
    marginLeft: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  incomeText: {
    color: colors.successDark,
  },
  expenseText: {
    color: colors.error,
  },
  netText: {
    color: colors.brand,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  statusMessage: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.base,
    fontWeight: '500',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: colors.successDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  submitButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.surface,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  footerNote: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
