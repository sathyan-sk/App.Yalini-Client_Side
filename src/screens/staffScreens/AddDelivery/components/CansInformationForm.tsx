/**
 * CansInformationForm - Form section for cans-related inputs.
 *
 * Includes:
 * - Cans Delivered (numeric input)
 * - Cans Returned (numeric input)
 * - Outstanding Cans (auto-calculated, read-only)
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
        <View>
          <Text style={styles.sectionTitle}>Cans Information</Text>
          <Text style={styles.sectionSubtitle}>
            Enter delivery and return details
          </Text>
        </View>
      </View>

      {/* Cans Delivered */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Cans Delivered <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Cans delivered to hotel</Text>
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

      {/* Outstanding Cans (Read-only, Auto-calculated) */}
      <View style={styles.calculatedRow}>
        <View style={styles.calculatedIcon}>
          <Feather name="box" size={20} color={colors.primaryBlue} />
        </View>
        <View style={styles.calculatedInfo}>
          <Text style={styles.calculatedLabel}>Outstanding Cans</Text>
          <Text style={styles.calculatedSubtitle}>(Delivered - Returned)</Text>
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
  calculatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  calculatedIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  calculatedValueNegative: {
    color: colors.error,
  },
  calculatedUnit: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
