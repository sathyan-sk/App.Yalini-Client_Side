/**
 * ActionButtons - Primary and secondary action buttons for the success screen
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';

interface ActionButtonsProps {
  onStartNewDay: () => void;
  onViewHistory: () => void;
}

export function ActionButtons({ onStartNewDay, onViewHistory }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Primary Button - Start New Day */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onStartNewDay}
        activeOpacity={0.8}
      >
        <Feather name="sun" size={22} color={colors.surface} style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>Start New Day</Text>
      </TouchableOpacity>

      {/* Secondary Button - View History (Future feature) */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onViewHistory}
        activeOpacity={0.7}
      >
        <Feather name="clock" size={20} color={colors.primaryBlue} style={styles.buttonIcon} />
        <Text style={styles.secondaryButtonText}>View Trip History</Text>
      </TouchableOpacity>

      {/* Footer Message */}
      <Text style={styles.footerText}>
        Your session has been saved and synced.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.successDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.surface,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    marginBottom: spacing.lg,
  },
  secondaryButtonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.primaryBlue,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
