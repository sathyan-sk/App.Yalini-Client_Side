/**
 * IncomeInput - Input component for income/money collected.
 *
 * Displays a numeric input with rupee symbol for entering
 * the income received from the hotel.
 */
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';

/**
 * Props for IncomeInput component.
 */
interface IncomeInputProps {
  /** Current income value */
  value: number;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Error message to display */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Optional test ID */
  testID?: string;
}

/**
 * Income Received input component with rupee symbol.
 * @param props - Component props
 * @returns JSX element
 */
export function IncomeInput({
  value,
  onChange,
  error,
  disabled = false,
  testID = 'income-input',
}: IncomeInputProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Feather name="dollar-sign" size={20} color={colors.primaryBlue} />
        </View>
        <View>
          <Text style={styles.title}>
            Income Received <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.subtitle}>Amount received from hotel</Text>
        </View>
      </View>

      <View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
      >
        <Text style={styles.rupeeSymbol}>₹</Text>
        <TextInput
          value={value > 0 ? value.toString() : ''}
          onChangeText={onChange}
          placeholder="0"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          keyboardType="numeric"
          editable={!disabled}
          maxLength={8}
          testID={`${testID}-field`}
        />
      </View>

      {error ? (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
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
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    minHeight: 56,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.7,
  },
  rupeeSymbol: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
