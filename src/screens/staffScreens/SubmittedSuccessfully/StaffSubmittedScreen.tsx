/**
 * StaffSubmittedScreen - Success screen after staff submits their daily session.
 * Shows a success message, day summary, and option to start a new day.
 * Design follows the existing app patterns with a celebratory feel.
 */
import React, { useEffect, useRef, useMemo } from 'react';
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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../theme';
import { useDeliveryStore } from '../../../store/deliveryStore';
import type { StaffStackParamList } from '../../../types/navigation';

type NavigationProp = NativeStackNavigationProp<StaffStackParamList>;

const BACKGROUND_COLOR = colors.surfaceSecondary;

export default function StaffSubmittedScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  // Get data from delivery store
  const { session, deliveries, reset } = useDeliveryStore();

  // Calculate summary metrics
  const summary = useMemo(() => {
    const totalDeliveries = deliveries.length;
    const totalCansDelivered = deliveries.reduce((sum, d) => sum + d.cansDelivered, 0);
    const totalCansReturned = deliveries.reduce((sum, d) => sum + d.cansReturned, 0);
    const totalIncome = deliveries.reduce((sum, d) => sum + d.receivedIncome, 0);
    const totalExpense = deliveries.reduce((sum, d) => sum + (d.expenseAmount || 0), 0);
    const netAmount = totalIncome - totalExpense;
    const uniqueHotels = new Set(deliveries.map(d => d.hotelId)).size;

    return {
      totalDeliveries,
      totalCansDelivered,
      totalCansReturned,
      totalIncome,
      totalExpense,
      netAmount,
      uniqueHotels,
    };
  }, [deliveries]);

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
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'StaffStartDay' }],
      })
    );
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
        <View style={styles.headerContainer}>
          <Animated.View
            style={[
              styles.checkmarkContainer,
              { transform: [{ scale: checkmarkScale }] },
            ]}
          >
            <View style={styles.checkmarkCircle}>
              <Feather name="check" size={48} color={colors.surface} />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.successTitle}>Submission Complete!</Text>
            <Text style={styles.successSubtitle}>
              Your deliveries for today have been submitted successfully.
            </Text>
          </Animated.View>
        </View>

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
          <View style={[styles.card, cardShadow]}>
            <View style={styles.cardHeader}>
              <Feather name="calendar" size={18} color={colors.primaryBlue} />
              <Text style={styles.cardHeaderText}>{session.sessionDate}</Text>
            </View>
            <View style={styles.divider} />

            {/* Staff Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="user" size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Staff</Text>
                <Text style={styles.infoValue}>{session.staffName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="briefcase" size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Service</Text>
                <Text style={styles.infoValue}>{session.serviceName}</Text>
              </View>
            </View>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <View style={[styles.metricIcon, { backgroundColor: colors.primaryBlueSoft }]}>
                  <MaterialCommunityIcons name="truck-delivery" size={20} color={colors.primaryBlue} />
                </View>
                <Text style={styles.metricValue}>{summary.totalDeliveries}</Text>
                <Text style={styles.metricLabel}>Deliveries</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={[styles.metricIcon, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="water" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.metricValue}>{summary.totalCansDelivered}</Text>
                <Text style={styles.metricLabel}>Cans Delivered</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={[styles.metricIcon, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="arrow-u-left-top" size={20} color="#FF9800" />
                </View>
                <Text style={styles.metricValue}>{summary.totalCansReturned}</Text>
                <Text style={styles.metricLabel}>Cans Returned</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={[styles.metricIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Feather name="home" size={20} color={colors.primaryBlue} />
                </View>
                <Text style={styles.metricValue}>{summary.uniqueHotels}</Text>
                <Text style={styles.metricLabel}>Hotels Served</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Financial Summary Card */}
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.card, cardShadow]}>
            <Text style={styles.sectionTitle}>Day's Earnings</Text>

            <View style={styles.financialGrid}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Income</Text>
                <Text style={[styles.financialValue, { color: colors.successDark }]}>
                  ₹{(summary.totalIncome || 0).toLocaleString()}
                </Text>
              </View>
              <View style={styles.financialDivider} />
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Expenses</Text>
                <Text style={[styles.financialValue, { color: colors.error }]}>
                  ₹{(summary.totalExpense || 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.netAmountContainer}>
              <Text style={styles.netAmountLabel}>Net Amount</Text>
              <Text
                style={[
                  styles.netAmountValue,
                  { color: (summary.netAmount || 0) >= 0 ? colors.successDark : colors.error },
                ]}
              >
                ₹{(summary.netAmount || 0).toLocaleString()}
              </Text>
            </View>
          </View>
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
          <View style={styles.motivationalContainer}>
            <Text style={styles.motivationalEmoji}>🎉</Text>
            <Text style={styles.motivationalText}>
              {summary.netAmount >= 1000
                ? "Excellent work today! You've had a great day."
                : summary.netAmount >= 500
                ? "Good job! Keep up the great work."
                : "Thank you for your hard work today!"}
            </Text>
          </View>
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
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartNewDay}
            activeOpacity={0.8}
          >
            <Feather name="sun" size={20} color={colors.surface} />
            <Text style={styles.primaryButtonText}>Start New Day</Text>
          </TouchableOpacity>
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
  headerContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  checkmarkContainer: {
    marginBottom: spacing.xl,
  },
  checkmarkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.successDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  animatedContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardHeaderText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  infoItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metricItem: {
    width: '47%',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  financialGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  financialItem: {
    alignItems: 'center',
    flex: 1,
  },
  financialDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  financialLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  financialValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  netAmountContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netAmountLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  netAmountValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  motivationalContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  motivationalEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  motivationalText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDark,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.surface,
  },
});
