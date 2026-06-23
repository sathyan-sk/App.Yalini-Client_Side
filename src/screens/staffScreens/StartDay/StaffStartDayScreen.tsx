/**
 * StaffStartDayScreen - Start Day screen for Staff (Water Delivery) module
 * Fetches real data from Supabase - NO mock data fallback
 *
 * Flow:
 *   - Fetches staff data + assigned hotels from Supabase via employeeId
 *   - Shows hotel assignment status
 *   - Taps Start Day to begin session and navigate to StaffMain
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StaffStackParamList } from '../../../types/navigation';
import { colors, spacing, fontSize } from '../../../theme';
import { useAuthStore } from '../../../store/authStore';
import { getStaffHomeData } from '../../../services/deliveryService';

type NavigationProp = NativeStackScreenProps<StaffStackParamList, 'StaffStartDay'>['navigation'];

import {
  StartDayHeader,
  ServiceInfoCard,
  NoAssignmentCard,
  InfoBanner,
  StartDayButton,
  ContactAdminButton,
  HotelAssignmentCard,
} from '../StartDay/components';

const BACKGROUND_COLOR = '#F7F8FA';

export default function StaffStartDayScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const authUser = useAuthStore((state) => state.user);

  const [staffData, setStaffData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch real staff data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const employeeId = authUser?.userId;
        const data = await getStaffHomeData(employeeId);
        setStaffData(data);
      } catch (error) {
        console.error('[StaffStartDay] Failed to load staff data:', error);
        setLoadError('Failed to load staff data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [authUser]);

  const hasAssignment = staffData?.assignedHotels && staffData.assignedHotels.length > 0;

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleStartDay = () => {
    navigation.replace('StaffMain');
  };

  const handleContactAdmin = () => {
    Alert.alert(
      'Contact Admin',
      'Admin contact: +91 98765 43210',
      [{ text: 'OK' }]
    );
  };

  const handleViewHotels = () => {
    if (staffData?.assignedHotels && staffData.assignedHotels.length > 0) {
      const hotelNames = staffData.assignedHotels
        .map((h: any, i: number) => `${i + 1}. ${h.hotelName}`)
        .join('\n');
      Alert.alert(
        'Assigned Hotels',
        hotelNames,
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StartDayHeader onMenuPress={handleMenuPress} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Loading staff information...</Text>
        </View>
      </View>
    );
  }

  if (loadError || !staffData) {
    return (
      <View style={styles.container}>
        <StartDayHeader onMenuPress={handleMenuPress} />
        <View style={styles.centerContainer}>
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
      <StartDayHeader onMenuPress={handleMenuPress} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service & User Info - from Supabase */}
        <ServiceInfoCard
          businessName={staffData.staff.businessName}
          businessType={staffData.staff.businessType}
          userName={staffData.staff.name}
          role={staffData.staff.role}
        />

        {/* Assignment Status */}
        {hasAssignment ? (
          <>
            <HotelAssignmentCard
              hotelCount={staffData.assignedHotels.length}
              onViewHotels={handleViewHotels}
            />
            <InfoBanner
              message="You have hotels assigned for today. Tap Start Day to begin your work."
            />
            <StartDayButton onPress={handleStartDay} />
          </>
        ) : (
          <>
            <NoAssignmentCard type="hotel" />
            <ContactAdminButton onPress={handleContactAdmin} />
          </>
        )}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
