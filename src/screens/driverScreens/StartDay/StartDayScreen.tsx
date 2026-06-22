/**
 * StartDayScreen - Main screen for Driver module
 * Shows vehicle assignment status and allows driver to start their day
 * 
 * Uses centralized driverService for data fetching to ensure
 * consistency with admin module and seed data.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
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
import { getStartDayData } from '../../../services/driverService';
import type { StartDayData } from '@/types/driver';
import type { DriverStackParamList } from '../../../types/navigation';
import { colors } from '../../../theme';

type NavigationProp = NativeStackNavigationProp<DriverStackParamList>;

const BACKGROUND_COLOR = '#F7F8FA';

interface DriverStartDayScreenProps {
  /** Set to true to show the \"no assignment\" scenario */
  showNoAssignment?: boolean;
}

export default function DriverStartDayScreen({ showNoAssignment = false }: DriverStartDayScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [data, setData] = useState<StartDayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from centralized driverService
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const startDayData = await getStartDayData();
        
        // If showNoAssignment is true, override the assignment for demo
        if (showNoAssignment) {
          setData({
            ...startDayData,
            assignment: null,
          });
        } else {
          setData(startDayData);
        }
      } catch (err) {
        console.error('Error fetching start day data:', err);
        setError('Failed to load driver data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [showNoAssignment]);

  const hasAssignment = data?.assignment !== null;

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

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show error state
  if (error || !data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || 'Failed to load data'}</Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
