/**
 * PaymentModeToggle - Toggle component for CASH/ONLINE payment selection.
 *
 * Strictly limited to CASH or ONLINE options as per requirements.
 * Visual design follows the reference image with toggle buttons.
 */
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';
import type { PaymentMode } from '../types';

/**
 * Props for PaymentModeToggle component.
 */
interface PaymentModeToggleProps {
  /** Currently selected payment mode */
  value: PaymentMode;
  /** Callback when mode is changed */
  onChange: (mode: PaymentMode) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Optional test ID */
  testID?: string;
}

/**
 * Toggle button component for payment mode selection.
 * @param props - Component props
 * @returns JSX element
 */
export function PaymentModeToggle({
  value,
  onChange,
  disabled = false,
  testID = 'payment-mode-toggle',
}: PaymentModeToggleProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Feather name="credit-card" size={20} color={colors.primaryBlue} />
        </View>
        <Text style={styles.title}>Payment Mode</Text>
      </View>

      <View style={styles.toggleContainer}>
        {/* CASH Button */}
        <Pressable
          style={[
            styles.toggleButton,
            value === 'CASH' && styles.toggleButtonActive,
            disabled && styles.toggleButtonDisabled,
          ]}
          onPress={() => !disabled && onChange('CASH')}
          disabled={disabled}
          testID={`${testID}-cash`}
        >
          <Feather
            name="dollar-sign"
            size={18}
            color={value === 'CASH' ? colors.surface : colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleText,
              value === 'CASH' && styles.toggleTextActive,
            ]}
          >
            Cash
          </Text>
        </Pressable>

        {/* ONLINE Button */}
        <Pressable
          style={[
            styles.toggleButton,
            value === 'ONLINE' && styles.toggleButtonActive,
            disabled && styles.toggleButtonDisabled,
          ]}
          onPress={() => !disabled && onChange('ONLINE')}
          disabled={disabled}
          testID={`${testID}-online`}
        >
          <Feather
            name="smartphone"
            size={18}
            color={value === 'ONLINE' ? colors.surface : colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleText,
              value === 'ONLINE' && styles.toggleTextActive,
            ]}
          >
            Online
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
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
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  toggleButtonActive: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },
  toggleButtonDisabled: {
    opacity: 0.5,
  },
  toggleText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.surface,
  },
});
