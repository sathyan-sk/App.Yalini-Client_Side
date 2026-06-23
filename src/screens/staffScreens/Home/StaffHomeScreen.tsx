/**
 * StaffHomeScreen - Main home screen for Staff (Water Delivery) module
 * Fetches real data from Supabase - NO mock data fallback
 * RootNavigator handles role-based navigation
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing, fontSize } from '../../../theme';
import { useAuthStore } from '../../../store/authStore';
import { getStaffHomeData } from '../../../services/deliveryService';
import type { StaffTabParamList } from '../../../types/navigation';
import {
  StaffHomeHeader,
  TodayOverview,
  QuickActions,
  AssignedHotelsList,
} from '../Home/components';
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
  const authUser = useAuthStore((state) => state.user);
  const userRole = useAuthStore((state) => state.user?.role);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [sessionData, setSessionData] = useState<StaffSessionData | null>(null);
  const [assignedHotels, setAssignedHotels] = useState<HotelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Update greeting periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Load staff data from Supabase on mount
  useEffect(() => {
    const loadStaffData = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const employeeId = authUser?.userId;
        const data = await getStaffHomeData(employeeId);
        
        // Convert to StaffSessionData format
        const session: StaffSessionData = {
          staffId: data.staff.id,
          staffName: data.staff.name,
          businessName: data.staff.businessName,
          sessionDate: data.sessionDate,
          sessionTime: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          assignedHotels: data.assignedHotels || [],
          overview: {
            assignedHotels: data.assignedHotels?.length || 0,
            deliveriesDone: 0,
            cashCollected: 0,
            creditSales: 0,
          },
        };
        
        setSessionData(session);
        setAssignedHotels(data.assignedHotels || []);
      } catch (error) {
        console.error('Failed to load staff data:', error);
        setLoadError('Failed to load staff data');
      } finally {
        setIsLoading(false);
      }
    };
    loadStaffData();
  }, [authUser]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Refetch staff data from Supabase
    try {
      const employeeId = authUser?.userId;
      const data = await getStaffHomeData(employeeId);
      
      const session: StaffSessionData = {
        staffId: data.staff.id,
        staffName: data.staff.name,
        businessName: data.staff.businessName,
        sessionDate: data.sessionDate,
        sessionTime: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        assignedHotels: data.assignedHotels || [],
        overview: {
          assignedHotels: data.assignedHotels?.length || 0,
          deliveriesDone: 0,
          cashCollected: 0,
          creditSales: 0,
        },
      };
      
      setSessionData(session);
      setAssignedHotels(data.assignedHotels || []);
    } catch (error) {
      console.error('Failed to refresh staff data:', error);
    }
    setIsRefreshing(false);
  }, [authUser]);

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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Loading staff information...</Text>
        </View>
      </View>
    );
  }

  if (loadError || !sessionData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No Staff Data Available</Text>
          <Text style={styles.errorSubtext}>
            {loadError || 'No employee found for your account'}
          </Text>
        </View>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
  },
  errorSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
