/**
 * StaffStartDayScreen - Main screen for Staff (Water Delivery) module
 * Shows hotel assignment status and allows staff to start their day
* 
 * Flow:
 *   - Staff enters total loaded cans and rate per can
 *   - Taps Start Day which creates the session with status OPEN
 *   - Navigates to StaffMain using navigation.replace (prevents back to StartDayScreen)
 */
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StaffStackParamList } from '../../../types/navigation';


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
import { STAFF_WITH_HOTELS, STAFF_WITHOUT_HOTELS } from './data/mockData';
import type { StaffStartDayData } from './types';

const BACKGROUND_COLOR = '#F7F8FA';

interface StaffStartDayScreenProps {
  /** Set to true to show the "no assignment" scenario */
  showNoAssignment?: boolean;
}

export default function StaffStartDayScreen({ showNoAssignment = false }: StaffStartDayScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  // Use mock data based on prop (for demo purposes)
  const [data] = useState<StaffStartDayData>(
    showNoAssignment ? STAFF_WITHOUT_HOTELS : STAFF_WITH_HOTELS
  );

  const hasAssignment = data.assignment !== null;

  const handleMenuPress = () => {
    // Navigation drawer will be connected later
    console.log('Menu pressed');
  };
  /**
   * Handles Start Day button press.
   * Creates session with OPEN status and navigates to StaffMain (bottom tabs).
   * Uses replace() so back button cannot return to StartDayScreen.
   */
  const handleStartDay = () => {

    // Navigate to StaffMain (bottom tabs) after starting day
    // Using replace prevents going back to StartDayScreen
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
    if (data.assignment) {
      const hotelNames = data.assignment.hotels
        .map((h, i) => `${i + 1}. ${h.hotelName}`)
        .join('\n');
      Alert.alert(
        'Assigned Hotels',
        hotelNames,
        [{ text: 'OK' }]
      );
    }
  };

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
        {/* Service & User Info */}
        <ServiceInfoCard
          businessName={data.staff.businessName}
          businessType={data.staff.businessType}
          userName={data.staff.name}
          role={data.staff.role}
        />

        {/* Assignment Status */}
        {hasAssignment && data.assignment ? (
          <>
            <HotelAssignmentCard
              hotelCount={data.assignment.hotelCount}
              onViewHotels={handleViewHotels}
            />
            <InfoBanner
              message="You have hotels assigned for today.
Tap Start Day to begin your work."
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
});
