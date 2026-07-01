/**
 * CheckoutScreen - Session checkout/submit screen for Driver module
 * Shows tabular trip-wise summary and allows session submission
 * Updated UI to list all trips for confirmation before submission
 * 
 * Features:
 * - Session info card with driver and vehicle details
 * - Tabular view of all trips for review
 * - Financial summary (income, expenses, net)
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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import { useTripStore, TripWithExpense } from '../../../store/tripStore';
import type { DriverStackParamList } from '../../../types/navigation';

type CheckoutNavigationProp = NativeStackNavigationProp<DriverStackParamList>;

// Type for trip summary in the table
interface TripSummaryRow {
  id: string;
  tripNumber: number;
  route: string;
  tripType: string;
  paymentMode: string;
  income: number;
  expense: number;
  hasExpense: boolean;
}

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckoutNavigationProp>();
  
  const {
    session,
    trips,
    totalTrips,
    totalIncome,
    totalExpenses,
    submitSession,
    isSubmitting,
    clearSubmissionError,
  } = useTripStore();
  
  // Compute profit locally from available store values
  const profit = (totalIncome || 0) - (totalExpenses || 0);

  // Transform trips to summary rows
  const tripSummaries: TripSummaryRow[] = useMemo(() => {
    return trips.map((trip: TripWithExpense) => ({
      id: trip.id,
      tripNumber: trip.tripNumber,
      route: `${trip.from} → ${trip.to}`,
      tripType: trip.tripType === 'vendor' ? 'Vendor' : 'Private',
      paymentMode: trip.paymentMode === 'cash' ? 'Cash' : 'Online',
      income: trip.amount || 0,
      expense: trip.totalExpense || 0,
      hasExpense: trip.hasExpense,
    }));
  }, [trips]);

  // Check if all trips have expenses
  const allExpensesAdded = useMemo(() => {
    return trips.every((trip) => trip.hasExpense);
  }, [trips]);

  const canSubmit = allExpensesAdded && totalTrips > 0 && session.sessionStatus !== 'Submitted';

  const handleSubmitSession = async () => {
    if (!canSubmit) {
      if (totalTrips === 0) {
        Alert.alert('Cannot Submit', 'Please add at least one trip before submitting.');
      } else if (!allExpensesAdded) {
        const missingCount = trips.filter((t) => !t.hasExpense).length;
        Alert.alert('Cannot Submit', `${missingCount} trip(s) are missing expenses. Please add expenses for all trips.`);
      }
      return;
    }

    try {
      const result = await submitSession();
      if (result.success) {
        navigation.navigate('SubmittedSuccessfully');
      } else {
        Alert.alert('Submission Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // Get status info for the banner
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
      const missingCount = trips.filter((t) => !t.hasExpense).length;
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
              <Text style={styles.cardTitle}>{session.driverName || 'Driver'}</Text>
              <Text style={styles.cardSubtitle}>{session.serviceName || ''}</Text>
            </View>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{session.sessionDate || ''}</Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name="truck" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{session.vehicleNumber || ''}</Text>
            </View>
          </View>
        </View>

        {/* Trip-wise Summary Table */}
        <View style={[styles.card, cardShadow]}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.tripNumColumn]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.routeColumn]}>Route</Text>
            <Text style={[styles.tableHeaderCell, styles.typeColumn]}>Type</Text>
            <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Income</Text>
            <Text style={[styles.tableHeaderCell, styles.expenseColumn]}>Exp.</Text>
          </View>

          {/* Table Body */}
          {tripSummaries.length > 0 ? (
            tripSummaries.map((trip, index) => (
              <View
                key={trip.id}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven,
                ]}
              >
                <View style={[styles.tripNumColumn, styles.tripNumCell]}>
                  <View style={styles.tripNumberBadge}>
                    <Text style={styles.tripNumberText}>{trip.tripNumber}</Text>
                  </View>
                </View>
                <View style={[styles.routeColumn, styles.routeCell]}>
                  <Text style={styles.routeText} numberOfLines={1}>
                    {trip.route}
                  </Text>
                  <View style={styles.routeDetails}>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: trip.tripType === 'Vendor' ? '#FFF3E0' : '#E8F5E9' }
                    ]}>
                      <Text style={[
                        styles.typeBadgeText,
                        { color: trip.tripType === 'Vendor' ? '#E65100' : '#2E7D32' }
                      ]}>
                        {trip.tripType}
                      </Text>
                    </View>
                    <View style={styles.paymentBadge}>
                      <MaterialIcons 
                        name={trip.paymentMode === 'Cash' ? 'local-atm' : 'smartphone'} 
                        size={10} 
                        color={colors.textSecondary} 
                      />
                      <Text style={styles.paymentText}>{trip.paymentMode}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.typeColumn, styles.statusCell]}>
                  {trip.hasExpense ? (
                    <Feather name="check-circle" size={16} color={colors.successDark} />
                  ) : (
                    <Feather name="alert-circle" size={16} color="#F57C00" />
                  )}
                </View>
                <Text style={[styles.tableCell, styles.amountColumn, styles.incomeValue]}>
                  ₹{(trip.income || 0).toLocaleString('en-IN')}
                </Text>
                <Text style={[
                  styles.tableCell, 
                  styles.expenseColumn, 
                  trip.hasExpense ? styles.expenseValue : styles.noExpenseValue
                ]}>
                  {trip.hasExpense ? `₹${(trip.expense || 0).toLocaleString('en-IN')}` : '-'}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="car-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyStateText}>No trips added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add trips to see them here
              </Text>
            </View>
          )}

          {/* Table Footer - Grand Total */}
          {tripSummaries.length > 0 && (
            <View style={styles.tableFooter}>
              <Text style={[styles.tableFooterCell, styles.tripNumColumn]}></Text>
              <Text style={[styles.tableFooterCell, styles.routeColumn, styles.totalLabel]}>
                Total ({totalTrips} trips)
              </Text>
              <Text style={[styles.tableFooterCell, styles.typeColumn]}></Text>
              <Text style={[styles.tableFooterCell, styles.amountColumn, styles.totalIncome]}>
                ₹{(totalIncome || 0).toLocaleString('en-IN')}
              </Text>
              <Text style={[styles.tableFooterCell, styles.expenseColumn, styles.totalExpense]}>
                ₹{(totalExpenses || 0).toLocaleString('en-IN')}
              </Text>
            </View>
          )}
        </View>

        {/* Financial Summary */}
        {tripSummaries.length > 0 && (
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
                    ₹{(totalIncome || 0).toLocaleString('en-IN')}
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
                    ₹{(totalExpenses || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.netContainer}>
              <Text style={styles.netLabel}>Net Earnings</Text>
              <Text
                style={[
                  styles.netValue,
                  { color: (profit || 0) >= 0 ? '#4CAF50' : colors.error },
                ]}
              >
                ₹{(profit || 0).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        )}

        {/* Status Banner */}
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
        {session.sessionStatus === 'Submitted' ? (
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
              disabled={!canSubmit || isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.surface} size="small" />
              ) : (
                <>
                  <Feather name="check-circle" size={20} color={colors.surface} />
                  <Text style={styles.submitButtonText}>Submit Session</Text>
                </>
              )}
            </TouchableOpacity>

            {!canSubmit && totalTrips > 0 && !allExpensesAdded && (
              <View style={styles.warningContainer}>
                <Feather name="info" size={14} color={colors.textSecondary} />
                <Text style={styles.warningText}>
                  Add expenses for all trips to submit
                </Text>
              </View>
            )}

            {totalTrips === 0 && (
              <View style={styles.warningContainer}>
                <Feather name="info" size={14} color={colors.textSecondary} />
                <Text style={styles.warningText}>
                  Add at least one trip to submit
                </Text>
              </View>
            )}
          </>
        )}

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          Once submitted, you can view this day's record in your history.
        </Text>
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
    minHeight: 56,
  },
  tableRowEven: {
    backgroundColor: colors.surfaceSecondary,
  },
  tableCell: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  tripNumColumn: {
    width: 36,
    textAlign: 'center',
  },
  tripNumCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFA000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripNumberText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.surface,
  },
  routeColumn: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: spacing.xs,
  },
  routeCell: {
    justifyContent: 'center',
  },
  routeText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  paymentText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  typeColumn: {
    width: 40,
    textAlign: 'center',
  },
  statusCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountColumn: {
    flex: 1,
    textAlign: 'right',
  },
  expenseColumn: {
    flex: 1,
    textAlign: 'right',
  },
  incomeValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.successDark,
  },
  expenseValue: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.error,
  },
  noExpenseValue: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: colors.primaryBlueSoft,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
    alignItems: 'center',
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
    paddingHorizontal: spacing.xs,
  },
  totalIncome: {
    textAlign: 'right',
    color: colors.successDark,
  },
  totalExpense: {
    textAlign: 'right',
    color: colors.error,
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
  // Status card
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  statusMessage: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.base,
    fontWeight: '500',
    lineHeight: 22,
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
  footerNote: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});