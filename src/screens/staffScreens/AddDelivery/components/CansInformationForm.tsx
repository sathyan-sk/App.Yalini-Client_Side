/**
 * CansInformationForm - Form section for cans-related inputs.
 *
 * Includes:
 * - Cans Delivered (numeric input)
 * - Cans Returned (numeric input)
 * - Outstanding Cans (auto-calculated, read-only)
 * - Est. Amount (auto-calculated, read-only)
 *
 * NOTE: Loaded Cans is now centralized at session level (set on first delivery).
 * Rate per can is shown here per-hotel since it varies by hotel.
 */
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';
import type { DeliveryFormErrors } from '../types';

/**
 * Props for CansInformationForm component.
 */
interface CansInformationFormProps {
  /** Number of cans delivered */
  cansDelivered: number;
  /** Number of cans returned */
  cansReturned: number;
  /** Auto-calculated outstanding cans */
  outstandingCans: number;
  /** Auto-calculated estimated amount */
  estAmount: number;
  /** Rate per can for this hotel */
  ratePerCan: number;
  /** Previous outstanding cans from hotel's history */
  previousOutstandingCans?: number;
  /** Remaining cans from centralized pool */
  remainingCans?: number;
  /** Callback when cans delivered changes */
  onCansDeliveredChange: (value: string) => void;
  /** Callback when cans returned changes */
  onCansReturnedChange: (value: string) => void;
  /** Form validation errors */
  errors: DeliveryFormErrors;
  /** Whether the form is disabled */
  disabled?: boolean;
  /** Optional test ID */
  testID?: string;
}

/**
 * Form component for cans information input.
 * @param props - Component props
 * @returns JSX element
 */
export function CansInformationForm({
  cansDelivered,
  cansReturned,
  outstandingCans,
  estAmount,
  ratePerCan,
  previousOutstandingCans = 0,
  remainingCans,
  onCansDeliveredChange,
  onCansReturnedChange,
  errors,
  disabled = false,
  testID = 'cans-info-form',
}: CansInformationFormProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconBg}>
          <Feather name="package" size={24} color={colors.primaryBlue} />
        </View>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>Cans Information</Text>
          <Text style={styles.sectionSubtitle}>
            Enter delivery details for this hotel
          </Text>
        </View>
      </View>

      {/* Rate per Can (per-hotel) */}
      {ratePerCan > 0 && (
        <View style={styles.rateRow}>
          <View style={styles.rateIconBg}>
            <Feather name="tag" size={16} color={colors.primaryBlue} />
          </View>
          <Text style={styles.rateLabel}>Rate: </Text>
          <Text style={styles.rateValue}>₹{ratePerCan}/can</Text>
        </View>
      )}

      {/* Remaining Cans Warning */}
      {remainingCans !== undefined && (
        <View style={[styles.remainingRow, remainingCans <= 0 && styles.remainingRowEmpty]}>
          <Feather
            name={remainingCans > 0 ? "check-circle" : "alert-triangle"}
            size={16}
            color={remainingCans > 0 ? colors.success : colors.warning}
          />
          <Text style={[styles.remainingText, remainingCans <= 0 && styles.remainingTextEmpty]}>
            {remainingCans > 0
              ? `${remainingCans} cans remaining from today's load`
              : 'No cans remaining! Please load more.'}
          </Text>
        </View>
      )}

      {/* Cans Delivered */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Cans Delivered <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Cans delivered to this hotel</Text>
        <View
          style={[
            styles.inputContainer,
            errors.cansDelivered && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
        >
          <TextInput
            value={cansDelivered > 0 ? cansDelivered.toString() : ''}
            onChangeText={onCansDeliveredChange}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            keyboardType="numeric"
            editable={!disabled}
            maxLength={4}
            testID={`${testID}-delivered-input`}
          />
          <Text style={styles.unitLabel}>Cans</Text>
        </View>
        {errors.cansDelivered ? (
          <Text style={styles.errorText} testID={`${testID}-delivered-error`}>
            {errors.cansDelivered}
          </Text>
        ) : null}
      </View>

      {/* Cans Returned */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Cans Returned <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Empty cans received from hotel</Text>
        <View
          style={[
            styles.inputContainer,
            errors.cansReturned && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
        >
          <TextInput
            value={cansReturned > 0 ? cansReturned.toString() : ''}
            onChangeText={onCansReturnedChange}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            keyboardType="numeric"
            editable={!disabled}
            maxLength={4}
            testID={`${testID}-returned-input`}
          />
          <Text style={styles.unitLabel}>Cans</Text>
        </View>
        {errors.cansReturned ? (
          <Text style={styles.errorText} testID={`${testID}-returned-error`}>
            {errors.cansReturned}
          </Text>
        ) : null}
      </View>

      {/* Outstanding Calculations Section */}
      <View style={styles.calculationsSection}>
        <Text style={styles.calculationsSectionTitle}>Outstanding Calculations</Text>
        
        {/* Previous Outstanding (if exists) */}
        {previousOutstandingCans > 0 && (
          <View style={styles.calculatedRow}>
            <View style={[styles.calculatedIcon, styles.previousIconBg]}>
              <Feather name="archive" size={18} color={colors.warning} />
            </View>
            <View style={styles.calculatedInfo}>
              <Text style={styles.calculatedLabel}>Previous Outstanding</Text>
              <Text style={styles.calculatedSubtitle}>From hotel's history</Text>
            </View>
            <Text style={styles.equalsSign}>=</Text>
            <Text style={[styles.calculatedValue, styles.previousValue]}>
              {previousOutstandingCans} <Text style={styles.calculatedUnit}>Cans</Text>
            </Text>
          </View>
        )}

        {/* Outstanding Cans (Read-only, Auto-calculated) */}
        <View style={styles.calculatedRow}>
          <View style={styles.calculatedIcon}>
            <Feather name="box" size={18} color={colors.primaryBlue} />
          </View>
          <View style={styles.calculatedInfo}>
            <Text style={styles.calculatedLabel}>New Outstanding</Text>
            <Text style={styles.calculatedSubtitle}>
              (Previous: {previousOutstandingCans} + Delivered: {cansDelivered} - Returned: {cansReturned})
            </Text>
          </View>
          <Text style={styles.equalsSign}>=</Text>
          <Text
            style={[
              styles.calculatedValue,
              outstandingCans < 0 && styles.calculatedValueNegative,
            ]}
            testID={`${testID}-outstanding-value`}
          >
            {outstandingCans} <Text style={styles.calculatedUnit}>Cans</Text>
          </Text>
        </View>

        {/* Est. Amount (Read-only, Auto-calculated) */}
        <View style={styles.calculatedRow}>
          <View style={[styles.calculatedIcon, styles.estAmountIconBg]}>
            <Feather name="dollar-sign" size={18} color={colors.success} />
          </View>
          <View style={styles.calculatedInfo}>
            <Text style={styles.calculatedLabel}>Est. Amount</Text>
            <Text style={styles.calculatedSubtitle}>
              (Delivered × ₹{ratePerCan.toFixed(0)}/can)
            </Text>
          </View>
          <Text style={styles.equalsSign}>=</Text>
          <Text
            style={[styles.calculatedValue, styles.estAmountValue]}
            testID={`${testID}-est-amount-value`}
          >
            ₹{estAmount.toFixed(0)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Rate per can row
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBlueSoft,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  rateIconBg: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  rateValue: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.primaryBlue,
  },
  // Remaining cans warning
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  remainingRowEmpty: {
    backgroundColor: colors.warningSoft,
  },
  remainingText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: '500',
  },
  remainingTextEmpty: {
    color: colors.warning,
  },
  // Fields
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  fieldHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    textAlign: 'right',
  },
  unitLabel: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 40,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  // Calculations
  calculationsSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: 'dashed',
  },
  calculationsSectionTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  calculatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  calculatedIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousIconBg: {
    backgroundColor: colors.warningSoft,
  },
  estAmountIconBg: {
    backgroundColor: colors.successSoft,
  },
  previousValue: {
    color: colors.warning,
  },
  calculatedInfo: {
    flex: 1,
  },
  calculatedLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  calculatedSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  equalsSign: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textTertiary,
    marginHorizontal: spacing.xs,
  },
  calculatedValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primaryBlue,
    minWidth: 70,
    textAlign: 'right',
  },
  calculatedValueNegative: {
    color: colors.error,
  },
  estAmountValue: {
    color: colors.success,
  },
  calculatedUnit: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});