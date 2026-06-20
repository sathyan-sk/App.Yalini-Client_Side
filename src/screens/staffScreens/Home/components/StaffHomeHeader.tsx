/**
 * StaffHomeHeader - Gradient header with greeting, subtitle, logout button, and water bottle image
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { fontSize, spacing } from '../../../../theme';

interface StaffHomeHeaderProps {
  staffName: string;
  greeting: string;
  onLogout?: () => void;
}

export function StaffHomeHeader({
  staffName,
  greeting,
  onLogout,
}: StaffHomeHeaderProps) {
  const insets = useSafeAreaInsets();

  // Extract first name
  const firstName = staffName.split(' ')[0];

  return (
    <LinearGradient
      colors={['#1A237E', '#3F51B5', '#7986CB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          paddingTop:
            insets.top > 0
              ? insets.top + spacing.sm
              : Platform.OS === 'android'
              ? (StatusBar.currentHeight || 24) + spacing.sm
              : spacing.lg,
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      <View style={styles.content}>
        {/* Left: Greeting Text */}
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            {greeting}, {firstName}
          </Text>
          <Text style={styles.subtitle}>Let's complete today's deliveries</Text>
        </View>

        {/* Right: Logout Button */}
        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          hitSlop={8}
        >
          <Feather name="log-out" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Water Bottle Visual Element (decorative) */}
      <View style={styles.decorativeElement}>
        <View style={styles.waterBottle}>
          <View style={styles.bottleTop} />
          <View style={styles.bottleBody} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  logoutButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  decorativeElement: {
    position: 'absolute',
    right: 16,
    bottom: -20,
    opacity: 0.15,
    zIndex: 1,
  },
  waterBottle: {
    alignItems: 'center',
  },
  bottleTop: {
    width: 30,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottleBody: {
    width: 80,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
