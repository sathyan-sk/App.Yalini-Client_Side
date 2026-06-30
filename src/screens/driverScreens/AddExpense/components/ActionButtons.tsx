/**
 * ActionButtons - Save and Skip buttons for expense screen
 * Contains primary save button and secondary skip action
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';

interface ActionButtonsProps {
  onSaveExpense: () => void;
  isSubmitting: boolean;
}

export function ActionButtons({
  onSaveExpense,
  isSubmitting,
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Save Expense Button */}
      <TouchableOpacity
        style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
        onPress={onSaveExpense}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={colors.surface} />
        ) : (
          <>
            <Feather name="save" size={20} color={colors.surface} />
            <Text style={styles.saveButtonText}>Save Expense</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#2E7D32',
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.surface,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  skipButtonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.primaryBlue,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
