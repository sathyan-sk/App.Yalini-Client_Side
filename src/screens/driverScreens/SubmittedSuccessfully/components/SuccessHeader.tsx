/**
 * SuccessHeader - Animated success header with checkmark and congratulations message
 */

import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';

interface SuccessHeaderProps {
  checkmarkScale: Animated.Value;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export function SuccessHeader({
  checkmarkScale,
  fadeAnim,
  slideAnim,
}: SuccessHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Animated Checkmark Circle */}
      <Animated.View
        style={[
          styles.checkmarkCircle,
          {
            transform: [{ scale: checkmarkScale }],
          },
        ]}
      >
        <View style={styles.checkmarkInner}>
          <Feather name="check" size={48} color={colors.surface} />
        </View>
      </Animated.View>

      {/* Title and Subtitle */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Day Submitted!</Text>
        <Text style={styles.subtitle}>
          Thank you for your hard work today.
        </Text>
        <Text style={styles.subtitle}>
          Your records have been saved successfully.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkmarkInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
