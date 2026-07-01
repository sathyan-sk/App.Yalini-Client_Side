/**
 * StaffCheckoutScreen - Screen for submitting staff's daily session.
 * Shows tabular hotel-wise delivery summary and allows submission.
 *
 * Features:
 * - Tabular view of all deliveries grouped by hotel
 * - Total income, expense, and net amount
 * - Submit session button
 * - Navigation to success screen
 */
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import { useDeliveryStore } from '../../../store/deliveryStore';
import { useAuthStore } from '../../../store/authStore';
import { submitStaffSession } from '../../../services/deliveryService';
import type { StaffStackParamList } from '../../../types/navigation';

type CheckoutNavigationProp = NativeStackNavigationProp<StaffStackParamList>;

// Type for hotel-wise grouped deliveries (minimal)
interface HotelDeliverySummary {
  hotelId: string;
  hotelName: string;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
}

export default function StaffCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckoutNavigationProp>();
  const { session, deliveries, updateSessionStatus, reset } = useDeliveryStore();
  const authUser = useAuthStore((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Group deliveries by hotel and calculate summary (minimal: income, expense, profit)
  const hotelSummaries = useMemo(() => {
    const hotelMap = new Map<string, HotelDeliverySummary>();

    deliveries.forEach((delivery) => {
      const existing = hotelMap.get(delivery.hotelId);
      const income = delivery.receivedIncome || 0;
      const expense = delivery.expenseAmount || 0;
      const profit = income - expense;
      if (existing) {
        existing.totalIncome += income;
        existing.totalExpense += expense;
        existing.totalProfit += profit;
      } else {
        hotelMap.set(delivery.hotelId, {
          hotelId: delivery.hotelId,
          hotelName: delivery.hotelName,
          totalIncome: income,
          totalExpense: expense,
          totalProfit: profit,
        });
      }
    });

    return Array.from(hotelMap.values());
  }, [deliveries]);

  // Calculate grand total
  const grandTotal = useMemo(() => {
    const totalDeliveries = deliveries.length;
    const totalCansDelivered = deliveries.reduce((sum, d) => sum + (d.cansDelivered || 0), 0);
    const totalCansReturned = deliveries.reduce((sum, d) => sum + (d.cansReturned || 0), 0);
    const totalIncome = deliveries.reduce((sum, d) => sum + (d.receivedIncome || 0), 0);
    const totalExpense = deliveries.reduce((sum, d) => sum + (d.expenseAmount || 0), 0);
    const profit = totalIncome - totalExpense;

    return {
      totalDeliveries,
      totalCansDelivered,
      totalCansReturned,
      totalIncome,
      totalExpense,
      profit,
    };
  }, [deliveries]);

  const canSubmit = deliveries.length > 0 && session.sessionStatus === 'ACTIVE' && !isSubmitting;

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
          onPress: async () => {
            setIsSubmitting(true);
            try {
              // FIX: Submit to central store so Admin can see the record
              const result = await submitStaffSession({
                staffId: session.staffId || authUser?.userId || '',
                staffName: session.staffName,
                deliveries: deliveries,
                totalIncome: grandTotal.totalIncome,
                totalExpense: grandTotal.totalExpense,
                profit: grandTotal.profit,
              });

              if (result.success) {
                // Update local session status
            updateSessionStatus('SUBMITTED');
            // Navigate to submitted successfully screen
            navigation.getParent()?.navigate('SubmittedSuccessfully');
                          } else {
                Alert.alert('Submission Failed', result.message);
              }
            } catch (error) {
              console.error('Session submission error:', error);
              Alert.alert('Error', 'Failed to submit session. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
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
        <View style={[styles.card, cardShadow]}>
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

        {/* Hotel-wise Deliveries Table */}
        <View style={[styles.card, cardShadow]}>
          <Text style={styles.sectionTitle}>Hotel-wise Deliveries</Text>

          {/* Table Header - minimal: Hotel, Income, Expense, Profit */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.hotelColumn]}>Hotel</Text>
            <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Income</Text>
            <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Expense</Text>
            <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Profit</Text>
          </View>

          {/* Table Body */}
          {hotelSummaries.length > 0 ? (
            hotelSummaries.map((hotel, index) => (
              <View
                key={hotel.hotelId}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven,
                ]}
              >
                <View style={styles.hotelColumn}>
                  <Text style={styles.hotelName} numberOfLines={1}>
                    {hotel.hotelName}
                  </Text>
                </View>
                <Text style={[styles.tableCell, styles.amountColumn, styles.incomeValue]}>
                  ₹{hotel.totalIncome.toLocaleString()}
                </Text>
                <Text style={[styles.tableCell, styles.amountColumn, styles.expenseValue]}>
                  ₹{hotel.totalExpense.toLocaleString()}
                </Text>
                <Text style={[styles.tableCell, styles.amountColumn, styles.profitValue]}>
                  ₹{hotel.totalProfit.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyStateText}>No deliveries added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add deliveries to see them here
              </Text>
            </View>
          )}

          {/* Table Footer - Grand Total */}
          {hotelSummaries.length > 0 && (
            <View style={styles.tableFooter}>
              <Text style={[styles.tableFooterCell, styles.hotelColumn, styles.totalLabel]}>
                Grand Total
              </Text>
              <Text style={[styles.tableFooterCell, styles.amountColumn, styles.totalValue]}>
                ₹{grandTotal.totalIncome.toLocaleString()}
              </Text>
              <Text style={[styles.tableFooterCell, styles.amountColumn, styles.totalValue]}>
                ₹{grandTotal.totalExpense.toLocaleString()}
              </Text>
              <Text style={[styles.tableFooterCell, styles.amountColumn, styles.totalAmount]}>
                ₹{grandTotal.profit.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Financial Summary */}
        {hotelSummaries.length > 0 && (
          <View style={[styles.card, cardShadow]}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>

            <View style={styles.financialRow}>
              <View style={styles.financialItem}>
                <View style={[styles.finIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Feather name="arrow-down-circle" size={18} color="#4CAF50" />
                </View>
                <View>
                  <Text style={styles.finLabel}>Total Income</Text>
                  <Text style={[styles.finValue, { color: '#4CAF50' }]}>
                    ₹{grandTotal.totalIncome.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.financialItem}>
                <View style={[styles.finIcon, { backgroundColor: '#FFEBEE' }]}>
                  <Feather name="arrow-up-circle" size={18} color={colors.error} />
                </View>
                <View>
                  <Text style={styles.finLabel}>Total Expense</Text>
                  <Text style={[styles.finValue, { color: colors.error }]}>
                    ₹{grandTotal.totalExpense.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.netContainer}>
              <Text style={styles.netLabel}>Profit</Text>
              <Text
                style={[
                  styles.netValue,
                  { color: grandTotal.profit >= 0 ? '#4CAF50' : colors.error },
                ]}
              >
                ₹{grandTotal.profit.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Submit Button */}
        {session.sessionStatus === 'SUBMITTED' ? (
          <View style={[styles.card, cardShadow, styles.submittedCard]}>
            <Feather name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.submittedText}>Session Already Submitted</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitSession}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              <Feather name="check-circle" size={20} color={colors.surface} />
              <Text style={styles.submitButtonText}>Submit Session</Text>
            </TouchableOpacity>

            {!canSubmit && deliveries.length === 0 && (
              <View style={styles.warningContainer}>
                <Feather name="info" size={14} color={colors.textSecondary} />
                <Text style={styles.warningText}>
                  Add at least one delivery to submit
                </Text>
              </View>
            )}
          </>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.headerDark,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
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
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  // Table styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerDark,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  tableHeaderCell: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.surface,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: colors.surfaceSecondary,
  },
  tableCell: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  hotelColumn: {
    flex: 2,
    textAlign: 'left',
  },
  numColumn: {
    flex: 1,
    textAlign: 'center',
  },
  amountColumn: {
    flex: 1.5,
    textAlign: 'right',
  },
  hotelName: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  cellValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  incomeValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.successDark,
  },
  expenseValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.error,
  },
  profitValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primaryBlue,
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: colors.primaryBlueSoft,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
  },
  tableFooterCell: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  totalLabel: {
    textAlign: 'left',
    color: colors.primaryBlue,
  },
  totalValue: {
    color: colors.primaryBlue,
  },
  totalAmount: {
    textAlign: 'right',
    color: colors.primaryBlue,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    fontSize: fontSize.base,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  // Financial summary styles
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  finIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  finValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  netContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  netValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
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
    color: '#4CAF50',
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
