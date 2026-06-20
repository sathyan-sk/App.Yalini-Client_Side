/**
 * StartDayScreen - Main screen for Driver module
 * Shows vehicle assignment status and allows driver to start their day
 */
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { StartDayHeader } from './components/StartDayHeader';
import { ServiceInfoCard } from './components/ServiceInfoCard';
import { VehicleAssignmentCard } from './components/VehicleAssignmentCard';
import { NoAssignmentCard } from './components/NoAssignmentCard';
import { InfoBanner } from './components/InfoBanner';
import { StartDayButton } from './components/StartDayButton';
import { ContactAdminButton } from './components/ContactAdminButton';
import { DRIVER_WITH_VEHICLE, DRIVER_WITHOUT_VEHICLE } from './data/mockData';
import type { StartDayData } from './types';
import type { DriverStackParamList } from '../../../types/navigation';


type NavigationProp = NativeStackNavigationProp<DriverStackParamList>;

const BACKGROUND_COLOR = '#F7F8FA';

interface DriverStartDayScreenProps {
  /** Set to true to show the \"no assignment\" scenario */
  showNoAssignment?: boolean;
}

export default function DriverStartDayScreen({ showNoAssignment = false }: DriverStartDayScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  
  // Use mock data based on prop (for demo purposes)
  const [data] = useState<StartDayData>(
    showNoAssignment ? DRIVER_WITHOUT_VEHICLE : DRIVER_WITH_VEHICLE
  );

  const hasAssignment = data.assignment !== null;

  const handleMenuPress = () => {
    // Navigation drawer will be connected later
    console.log('Menu pressed');
  };

  const handleStartDay = () => {

          // Navigate to DriverMain (bottom tabs) after starting day
          navigation.replace('DriverMain');
  };

  const handleContactAdmin = () => {
    Alert.alert(
      'Contact Admin',
      'Admin contact: +91 98765 43210',
      [{ text: 'OK' }]
    );
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
          businessName={data.driver.businessName}
          businessType={data.driver.businessType}
          userName={data.driver.name}
          role={data.driver.role}
        />

        {/* Assignment Status */}
        {hasAssignment && data.assignment ? (
          <>
            <VehicleAssignmentCard
              vehicleNumber={data.assignment.vehicleNumber}
              vehicleName={data.assignment.vehicleName}
            />
            <InfoBanner
              message="You have a vehicle assigned for today. Tap Start Day to begin your work."
            />
            <StartDayButton onPress={handleStartDay} />
          </>
        ) : (
          <>
            <NoAssignmentCard type="vehicle" />
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
