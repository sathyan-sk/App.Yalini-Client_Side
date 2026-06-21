/**
 * SaveButton - Button component for saving the delivery.
 *
 * Shows a disabled state with lock message when session is submitted.
 * Displays loading state during save operation.
 */
import React from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';

/**
 * Props for SaveButton component.
 */
interface SaveButtonProps {
  /** Callback when button is pressed */
  onPress: () => void;
  /** Whether the button is in loading state */
  isLoading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether session is submitted (shows lock message) */
  isSessionSubmitted?: boolean;
  /** Optional test ID */
  testID?: string;
}

/**
 * Save delivery button component.
 * @param props - Component props
 * @returns JSX element
 */
export function SaveButton({
  onPress,
  isLoading = false,
  disabled = false,
  isSessionSubmitted = false,
  testID = 'save-button',
}: SaveButtonProps): React.JSX.Element {
  const isDisabled = disabled || isLoading || isSessionSubmitted;

  return (
    <View style={styles.container} testID={testID}>
      {isSessionSubmitted && (
        <View style={styles.lockedMessage}>
          <Feather name="lock" size={16} color={colors.warning} />
          <Text style={styles.lockedText}>
            Session has been submitted. Cannot add new deliveries.
          </Text>
        </View>
      )}

      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          isDisabled && styles.buttonDisabled,
          pressed && !isDisabled && styles.buttonPressed,
        ]}
        testID={`${testID}-btn`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.surface} />
        ) : (
          <>
            <Feather
              name="save"
              size={20}
              color={isDisabled ? colors.textTertiary : colors.surface}
            />
            <Text
              style={[
                styles.buttonText,
                isDisabled && styles.buttonTextDisabled,
              ]}
            >
              Save Delivery
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  lockedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  lockedText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.warning,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBlue,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.surface,
  },
  buttonTextDisabled: {
    color: colors.textTertiary,
  },
});
