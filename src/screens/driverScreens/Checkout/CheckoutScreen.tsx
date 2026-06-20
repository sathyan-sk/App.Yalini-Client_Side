/**
 * CheckoutScreen - Placeholder for session checkout/submit
 * Driver submits all trips and expenses for the day
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, fontSize, radius } from '../../../theme';
import { useTripStore } from '../../../store/tripStore';

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const { trips, totalTrips, totalIncome, totalExpenses, netAmount, session } = useTripStore();
  
  const allExpensesAdded = trips.every((trip) => trip.hasExpense);

  const handleSubmit = () => {
    if (!allExpensesAdded) {
      alert('Please add expenses for all trips before submitting.');
      return;
    }
    // TODO: Implement actual submission logic
    alert('Session submitted successfully! (Placeholder)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Day Summary</Text>
        
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionText}>{session.sessionDate}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{session.sessionStatus}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Trips</Text>
            <Text style={styles.statValue}>{totalTrips}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={[styles.statValue, styles.incomeText]}>₹{totalIncome.toLocaleString('en-IN')}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={[styles.statValue, styles.expenseText]}>₹{totalExpenses.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Net Amount</Text>
            <Text style={[styles.statValue, styles.netText]}>₹{netAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>

      {/* Status Message */}
      <View style={[
        styles.statusCard,
        allExpensesAdded ? styles.statusCardSuccess : styles.statusCardWarning
      ]}>
        <Feather 
          name={allExpensesAdded ? "check-circle" : "alert-circle"} 
          size={24} 
          color={allExpensesAdded ? "#2E7D32" : "#F57C00"} 
        />
        <Text style={[
          styles.statusMessage,
          allExpensesAdded ? styles.statusMessageSuccess : styles.statusMessageWarning
        ]}>
          {allExpensesAdded 
            ? "All trips have expenses. Ready to submit!" 
            : "Some trips are missing expenses. Please add expenses for all trips."}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !allExpensesAdded && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!allExpensesAdded}
        activeOpacity={0.7}
      >
        <Text style={styles.submitButtonText}>Submit Day</Text>
        <Feather name="check" size={20} color={colors.surface} />
      </TouchableOpacity>
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
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sessionText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#2E7D32',
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
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  incomeText: {
    color: '#2E7D32',
  },
  expenseText: {
    color: '#D32F2F',
  },
  netText: {
    color: '#1565C0',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },
  statusCardSuccess: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  statusCardWarning: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  statusMessage: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  statusMessageSuccess: {
    color: '#2E7D32',
  },
  statusMessageWarning: {
    color: '#F57C00',
  },
  submitButton: {
    backgroundColor: colors.primaryBlue,
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
    marginRight: spacing.sm,
  },
});
