/**
 * AddDeliveryHeader - Header component for Add Delivery Screen.
 *
 * Displays a gradient header with title, subtitle, and back navigation.
 * Follows the design pattern from Admin module headers.
 */
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius } from '../../../../theme';

/**
 * Props for AddDeliveryHeader component.
 */
interface AddDeliveryHeaderProps {
  /** Callback when back button is pressed */
  onBackPress: () => void;
  /** Top inset for safe area */
  topInset: number;
  /** Optional test ID */
  testID?: string;
}

/**
 * Header component with gradient background for Add Delivery screen.
 * @param props - Component props
 * @returns JSX element
 */
export function AddDeliveryHeader({
  onBackPress,
  topInset,
  testID = 'add-delivery-header',
}: AddDeliveryHeaderProps): React.JSX.Element {
  return (
    <LinearGradient
      colors={[colors.headerDark, colors.primaryBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: topInset + spacing.md }]}
      testID={testID}
    >
      <View style={styles.headerContent}>
        <Pressable
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID={`${testID}-back-btn`}
        >
          <Feather name="arrow-left" size={24} color={colors.surface} />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add Delivery</Text>
          <Text style={styles.subtitle}>Enter delivery details</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
