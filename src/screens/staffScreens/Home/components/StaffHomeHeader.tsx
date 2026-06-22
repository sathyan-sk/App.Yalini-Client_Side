/**
 * StaffHomeHeader - Header component for Staff Home Screen
 * Shows staff name, greeting, and logout option
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize } from '../../../../theme';

interface StaffHomeHeaderProps {
  staffName: string;
  greeting: string;
  onLogout: () => void;
}

export function StaffHomeHeader({ staffName, greeting, onLogout }: StaffHomeHeaderProps) {
  const insets = useSafeAreaInsets();

  const StaffFirstName=staffName.split(" ")[0]; // Extract first name from full name

  return (
    <LinearGradient
      colors={[colors.avatarCyan, colors.avatarCyan]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.staffName}>{StaffFirstName}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  staffName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.surface,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
