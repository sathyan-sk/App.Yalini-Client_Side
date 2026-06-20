/**
 * MotivationalMessage - Shows an encouraging message based on performance
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';

interface MotivationalMessageProps {
  netAmount: number;
  totalTrips: number;
}

export function MotivationalMessage({ netAmount, totalTrips }: MotivationalMessageProps) {
  // Generate message based on performance
  const getMessage = () => {
    if (totalTrips === 0) {
      return {
        icon: 'coffee' as const,
        title: 'Rest Day?',
        message: 'No trips today. Hope you had a good break!',
        bgColor: colors.infoSoft,
        iconColor: colors.info,
      };
    }
    
    if (netAmount >= 2000) {
      return {
        icon: 'award' as const,
        title: 'Outstanding Performance!',
        message: 'You had an excellent earning day. Keep up the great work!',
        bgColor: '#FFF9C4',
        iconColor: '#F9A825',
      };
    }
    
    if (netAmount >= 1000) {
      return {
        icon: 'thumbs-up' as const,
        title: 'Great Job!',
        message: 'You had a productive day. Your dedication is appreciated!',
        bgColor: colors.successSoft,
        iconColor: colors.successDark,
      };
    }
    
    if (netAmount >= 500) {
      return {
        icon: 'smile' as const,
        title: 'Good Work!',
        message: 'Every trip counts. Keep going strong tomorrow!',
        bgColor: colors.primaryBlueSoft,
        iconColor: colors.primaryBlue,
      };
    }
    
    return {
      icon: 'heart' as const,
      title: 'Thank You!',
      message: 'Your effort today is valued. Tomorrow is a new opportunity!',
      bgColor: '#FCE4EC',
      iconColor: '#E91E63',
    };
  };

  const { icon, title, message, bgColor, iconColor } = getMessage();

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Feather name={icon} size={28} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
