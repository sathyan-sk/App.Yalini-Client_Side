/**
 * StaffHomeScreen - Main home screen for Staff (Water Delivery) module
 * Shows today's overview, quick actions, and assigned hotels list
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing } from '../../../theme';
import { useAuthStore } from '../../../store/authStore';
import type { StaffTabParamList } from '../../../types/navigation';

import {
  StaffHomeHeader,
  TodayOverview,
  QuickActions,
  AssignedHotelsList,
} from '../Home/components';
import { MOCK_STAFF_SESSION } from '../Home/data/mockData';
import type { StaffSessionData, HotelInfo } from '../Home/types';

type NavigationProp = BottomTabNavigationProp<StaffTabParamList, 'StaffHome'>;

const BACKGROUND_COLOR = colors.surfaceSecondary;

/**
 * Returns time-based greeting
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function StaffHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const signOut = useAuthStore((state) => state.signOut);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [sessionData, setSessionData] = useState<StaffSessionData>(MOCK_STAFF_SESSION);

  // Update greeting periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh - in real app would refetch from API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  // Logout handler
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  }, [signOut]);

  // Navigation handlers
  const handleAddDelivery = useCallback(() => {
    navigation.navigate('AddDelivery');
  }, [navigation]);

  const handleAllDeliveries = useCallback(() => {
    navigation.navigate('AllDeliveries');
  }, [navigation]);

  const handleCheckout = useCallback(() => {
    navigation.navigate('StaffCheckout');
  }, [navigation]);

  const handleHotelPress = useCallback((hotel: HotelInfo) => {
    // Navigate to Add Delivery with pre-selected hotel (when implemented)
    console.log('Hotel pressed:', hotel.hotelName);
    navigation.navigate('AddDelivery');
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <StaffHomeHeader
        staffName={sessionData.staffName}
        greeting={greeting}
        onLogout={handleLogout}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }, // Account for tab bar
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryBlue}
            colors={[colors.primaryBlue]}
          />
        }
      >
        {/* Today's Overview */}
        <TodayOverview data={sessionData.overview} />

        {/* Quick Actions */}
        <QuickActions
          onAddDelivery={handleAddDelivery}
          onAllDeliveries={handleAllDeliveries}
          onCheckout={handleCheckout}
        />

        {/* Assigned Hotels List */}
        <AssignedHotelsList
          hotels={sessionData.assignedHotels}
          onHotelPress={handleHotelPress}
        />
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
  },
});
