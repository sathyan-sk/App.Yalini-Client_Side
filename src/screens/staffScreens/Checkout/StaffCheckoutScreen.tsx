/**
 * StaffCheckoutScreen - Screen for submitting staff's daily session.
 * Shows summary of all deliveries and allows submission.
 * 
 * Features (Placeholder for now):
 * - Summary of all deliveries made
 * - Total income, expense, and net amount
 * - Submit session button
 * - Navigation to success screen
 */

import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import { useDeliveryStore } from '../../../store/deliveryStore';
import type { StaffStackParamList } from '../../../types/navigation';

type CheckoutNavigationProp = NativeStackNavigationProp<StaffStackParamList>;

export default function StaffCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckoutNavigationProp>();
  
  const { session, deliveries, updateSessionStatus } = useDeliveryStore();

  // Calculate summary
  const summary = useMemo(() => {
    const totalDeliveries = deliveries.length;
    const totalCansDelivered = deliveries.reduce((sum, d) => sum + d.cansDelivered, 0);
    const totalCansReturned = deliveries.reduce((sum, d) => sum + d.cansReturned, 0);
    const totalIncome = deliveries.reduce((sum, d) => sum + d.receivedIncome, 0);
    const totalExpense = deliveries.reduce((sum, d) => sum + (d.expenseAmount || 0), 0);
    const netAmount = totalIncome - totalExpense;

    return {
      totalDeliveries,
      totalCansDelivered,
      totalCansReturned,
      totalIncome,
      totalExpense,
      netAmount,
    };
  }, [deliveries]);

  const canSubmit = deliveries.length > 0 && session.sessionStatus === 'ACTIVE';

  const handleSubmitSession = () => {
    if (!canSubmit) {
      Alert.alert(
        'Cannot Submit',
        'Please add at least one delivery before submitting.'
      );
      return;
    }

    Alert.alert(
      'Submit Session',
      'Are you sure you want to submit your daily session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'default',
          onPress: () => {
            updateSessionStatus('SUBMITTED');
            Alert.alert(
              'Success',
              'Your session has been submitted successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate to submitted successfully screen
                    navigation.getParent()?.navigate('SubmittedSuccessfully');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.headerSubtitle}>Review and submit your session</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Feather name="user" size={20} color={colors.primaryBlue} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{session.staffName}</Text>
              <Text style={styles.cardSubtitle}>{session.serviceName}</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{session.sessionDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="clock" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{session.sessionTime}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Summary</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.primaryBlueSoft }]}>
                <MaterialCommunityIcons name="truck-delivery" size={20} color={colors.primaryBlue} />
              </View>
              <Text style={styles.statValue}>{summary.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="water" size={20} color="#1976D2" />
              </View>
              <Text style={styles.statValue}>{summary.totalCansDelivered}</Text>
              <Text style={styles.statLabel}>Cans Delivered</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                <Feather name="refresh-ccw" size={18} color="#F57C00" />
              </View>
              <Text style={styles.statValue}>{summary.totalCansReturned}</Text>
              <Text style={styles.statLabel}>Cans Returned</Text>
            </View>
          </View>
        </View>

        {/* Financial Summary Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Total Income</Text>
              <Text style={[styles.financialValue, { color: '#2E7D32' }]}>
                ₹{summary.totalIncome.toLocaleString('en-IN')}
              </Text>
            </View>
            
            <View style={styles.financialDivider} />
            
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Total Expense</Text>
              <Text style={[styles.financialValue, { color: '#F44336' }]}>
                ₹{summary.totalExpense.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
          
          <View style={styles.netAmountContainer}>
            <Text style={styles.netAmountLabel}>Net Amount</Text>
            <Text style={styles.netAmountValue}>
              ₹{summary.netAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Status Card */}
        {session.sessionStatus === 'SUBMITTED' && (
          <View style={[styles.card, styles.submittedCard]}>
            <Feather name="check-circle" size={24} color="#2E7D32" />
            <Text style={styles.submittedText}>Session Already Submitted</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmitSession}
          activeOpacity={0.8}
          disabled={!canSubmit}
        >
          <Feather name="check-circle" size={22} color={colors.surface} />
          <Text style={styles.submitButtonText}>Submit Session</Text>
        </TouchableOpacity>

        {/* Warning */}
        {!canSubmit && session.sessionStatus === 'ACTIVE' && (
          <View style={styles.warningContainer}>
            <Feather name="alert-circle" size={16} color={colors.warning} />
            <Text style={styles.warningText}>
              Add at least one delivery to submit
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    backgroundColor: colors.headerDark,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sessionDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  financialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  financialItem: {
    flex: 1,
    alignItems: 'center',
  },
  financialDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  financialLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  financialValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  netAmountContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netAmountLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  netAmountValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: '#2E7D32',
  },
  submittedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    gap: spacing.md,
  },
  submittedText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#2E7D32',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.surface,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  warningText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
