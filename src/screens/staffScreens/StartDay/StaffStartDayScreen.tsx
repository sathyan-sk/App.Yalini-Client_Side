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
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StaffStackParamList } from '../../../types/navigation';
import { colors, spacing, fontSize, radius } from '../../../theme';
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
console.log('=== STAFF START DAY SCREEN LOADED ===');
export default function StaffStartDayScreen() {
  console.log('[StaffStartDay] COMPONENT MOUNTED');
  
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const authUser = useAuthStore((state) => state.user);

  const [staffData, setStaffData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [businessMode, setBusinessMode] = useState<'auto' | 'manual'>('manual');
  const [availableHotels, setAvailableHotels] = useState<any[]>([]);

  // Fetch real staff data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const employeeId = authUser?.userId;
        const data = await getStaffHomeData(employeeId);
        setStaffData(data);
        // Extract business mode and available hotels
        setBusinessMode(data?.staff?.businessMode || 'manual');
        setAvailableHotels(data?.availableHotels || []);
        
        // DEBUG: Log what we got
        console.log('[StaffStartDay] Business mode:', data?.staff?.businessMode);
        console.log('[StaffStartDay] Available hotels:', data?.availableHotels?.length || 0);
        console.log('[StaffStartDay] Has assignment:', data?.assignedHotels?.length > 0);
        console.log('[StaffStartDay] Full staff data:', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('[StaffStartDay] Failed to load staff data:', error);
        setLoadError('Failed to load staff data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [authUser]);

  const handleSelectHotel = async (hotelId: string) => {
    try {
      const { assignEmployeeToHotel } = await import('../../../services/hotelService');
      await assignEmployeeToHotel(hotelId, authUser?.userId || '');
      // Refresh data
      const employeeId = authUser?.userId;
      const data = await getStaffHomeData(employeeId);
      setStaffData(data);
      setBusinessMode(data?.staff?.businessMode || 'manual');
      setAvailableHotels(data?.availableHotels || []);
    } catch (error) {
      console.error('Failed to select hotel:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to select hotel');
    }
  };

  const hasAssignment = staffData?.assignedHotels && staffData.assignedHotels.length > 0;
  const hasAvailableHotels = availableHotels.length > 0;
  
  // DEBUG: Log rendering decision
  console.log('[StaffStartDay] Rendering - hasAssignment:', hasAssignment, 'businessMode:', businessMode, 'hasAvailableHotels:', hasAvailableHotels);

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
  const signOut = useAuthStore((state) => state.signOut);

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
        <StartDayHeader onMenuPress={signOut} />
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
      <StartDayHeader onMenuPress={signOut} />
      
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
          // HAS ASSIGNMENT - Show hotels and start button
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
        ) : businessMode === 'auto' && hasAvailableHotels ? (
          // AUTO MODE - Show hotel selection
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Select Your Hotels</Text>
            <Text style={styles.selectionSubtitle}>
              Choose hotels to start your deliveries
            </Text>
            {availableHotels.map((hotel: any) => (
              <Pressable
                key={hotel.id}
                style={({ pressed }) => [
                  styles.hotelOption,
                  pressed && styles.hotelOptionPressed,
                ]}
                onPress={() => handleSelectHotel(hotel.id)}
              >
                <Ionicons name="business" size={28} color={colors.primaryBlue} />
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.name}</Text>
                  <Text style={styles.hotelLocation}>{hotel.location || 'No location'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>
        ) : (
          // MANUAL MODE or NO AVAILABLE HOTELS - Show waiting state
          <>
            <NoAssignmentCard type="hotel" />
            <ContactAdminButton onPress={handleContactAdmin} />
            {businessMode === 'auto' && (
              <InfoBanner message="No hotels available. Please try again later or contact admin." />
            )}
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
  selectionContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  selectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  selectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  hotelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  hotelOptionPressed: {
    opacity: 0.7,
    backgroundColor: colors.brandSoft,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  hotelLocation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
