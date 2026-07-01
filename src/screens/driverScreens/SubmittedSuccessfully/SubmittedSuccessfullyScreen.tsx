/**
 * SubmittedSuccessfullyScreen - Congratulations screen after driver ends their day
 * Shows a success message, day summary, and option to start a new day
 * Design follows the existing app patterns with a celebratory feel
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import { useTripStore } from '../../../store/tripStore';
import type { DriverStackParamList } from '../../../types/navigation';
import { SuccessHeader } from './components/SuccessHeader';
import { DaySummaryCard } from './components/DaySummaryCard';
import { MotivationalMessage } from './components/MotivationalMessage';
import { ActionButtons } from './components/ActionButtons';

type NavigationProp = NativeStackNavigationProp<DriverStackParamList>;

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function SubmittedSuccessfullyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  // Get session data from store
  const {
    session,
    totalTrips,
    totalIncome,
    totalExpenses,
    resetStore,
  } = useTripStore();
  
  // Compute netAmount from store values
  const netAmount = (totalIncome || 0) - (totalExpenses || 0);

  // Animations
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate checkmark bounce in
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1.2,
        duration: 400,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Fade and slide in content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [checkmarkScale, fadeAnim, slideAnim]);

  const handleStartNewDay = () => {
    // Reset the store and navigate back to StartDay
    resetStore();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'DriverStartDay' }],
      })
    );
  };

  const handleViewHistory = () => {
    // Future: Navigate to history screen
    console.log('View History pressed - Feature coming soon');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header with Animated Checkmark */}
        <SuccessHeader
          checkmarkScale={checkmarkScale}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        {/* Day Summary Card */}
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <DaySummaryCard
            sessionDate={session.sessionDate}
            totalTrips={totalTrips}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netAmount={netAmount}
            driverName={session.driverName}
            vehicleNumber={session.vehicleNumber}
          />
        </Animated.View>

        {/* Motivational Message */}
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <MotivationalMessage netAmount={netAmount} totalTrips={totalTrips} />
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ActionButtons
            onStartNewDay={handleStartNewDay}
            onViewHistory={handleViewHistory}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  animatedContainer: {
    width: '100%',
  },
});
