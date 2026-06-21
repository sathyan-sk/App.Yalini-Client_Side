/**
 * FormToast - Toast notification component for form feedback.
 *
 * Displays success/error messages with auto-dismiss functionality.
 */
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';

/**
 * Props for FormToast component.
 */
interface FormToastProps {
  /** Whether the toast is visible */
  visible: boolean;
  /** Message to display */
  message: string;
  /** Toast type: success or error */
  type?: 'success' | 'error';
  /** Callback when toast hides */
  onHide: () => void;
  /** Duration in milliseconds before auto-hide */
  duration?: number;
  /** Optional test ID */
  testID?: string;
}

/**
 * Toast notification component.
 * @param props - Component props
 * @returns JSX element or null
 */
export function FormToast({
  visible,
  message,
  type = 'success',
  onHide,
  duration = 2500,
  testID = 'form-toast',
}: FormToastProps): React.JSX.Element | null {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, opacity, duration, onHide]);

  if (!visible) return null;

  const isSuccess = type === 'success';
  const iconName = isSuccess ? 'check-circle' : 'alert-circle';
  const iconColor = isSuccess ? colors.success : colors.error;
  const bgColor = isSuccess ? colors.successSoft : colors.errorSoft;
  const textColor = isSuccess ? colors.successDark : colors.error;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity },
      ]}
      testID={testID}
    >
      <Feather name={iconName} size={20} color={iconColor} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
    ...cardShadow,
  },
  message: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});
