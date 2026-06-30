/**
 * AllDeliveriesScreen - Screen to view all saved deliveries and manage them.
 * Shows session info, deliveries list, summary stats, and checkout button.
 * Follows the design specifications from Driver module AllTripsScreen.
 */

import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing } from '../../../theme';
import {
  AllDeliveriesHeader,
  SessionInfoCard,
  SummaryStatsRow,
  DeliveriesList,
  InfoBanner,
  SummaryFooter,
} from './components';
import { useDeliveryStore } from '../../../store/deliveryStore';
import type { AllDeliveriesStackParamList } from '../../../types/navigation';
import type { DeliveryRecord } from '../AddDelivery/types';

const BACKGROUND_COLOR = colors.surfaceSecondary;

type AllDeliveriesNavigationProp = NativeStackNavigationProp<AllDeliveriesStackParamList, 'AllDeliveriesList'>;

export default function AllDeliveriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AllDeliveriesNavigationProp>();

  // Get data from deliveryStore
  const { session, deliveries } = useDeliveryStore();

  // Calculate summary statistics (minimal: only financial totals)
  const summary = useMemo(() => {
    const totalIncome = deliveries.reduce((sum, d) => sum + (d.receivedIncome || 0), 0);
    const totalExpense = deliveries.reduce((sum, d) => sum + (d.expenseAmount || 0), 0);
    const totalProfit = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      totalProfit,
    };
  }, [deliveries]);

  // Check if user can proceed to checkout
  const canProceed = deliveries.length > 0;

  // Handlers
  const handleMenuPress = useCallback(() => {
    Alert.alert('Menu', 'Menu functionality coming soon');
  }, []);

  const handleFilterPress = useCallback(() => {
    Alert.alert('Filter', 'Filter deliveries by date, hotel, etc.');
  }, []);

  const handleDeliveryPress = useCallback((delivery: DeliveryRecord) => {
    // Navigate to EditPreview screen with delivery ID
    navigation.navigate('EditPreview', { deliveryId: delivery.id });
  }, [navigation]);

  const handleEditDelivery = useCallback((delivery: DeliveryRecord) => {
    // Navigate to EditPreview screen with delivery ID in edit mode
    navigation.navigate('EditPreview', { deliveryId: delivery.id });
  }, [navigation]);

  const handleProceedToCheckout = useCallback(() => {
    if (canProceed) {
      // Navigate to Checkout tab
      navigation.getParent()?.navigate('StaffCheckout');
    } else {
      Alert.alert(
        'Cannot Proceed',
        'Please add at least one delivery before proceeding to checkout.'
      );
    }
  }, [canProceed, navigation]);

  // Refresh handler
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // In a real app, this would refetch data from API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <AllDeliveriesHeader
        onMenuPress={handleMenuPress}
        onFilterPress={handleFilterPress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primaryBlue}
            colors={[colors.primaryBlue]}
          />
        }
      >
        {/* Service Info Card */}
        <SessionInfoCard sessionInfo={session} />

        {/* Deliveries List */}
        <DeliveriesList
          deliveries={deliveries}
          onDeliveryPress={handleDeliveryPress}
          onEditDelivery={handleEditDelivery}
        />

        {/* Info Banner */}
        <InfoBanner message="Review your deliveries and proceed to checkout when ready." />

        {/* Summary Footer - minimal financial totals */}
        <SummaryFooter
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          totalProfit={summary.totalProfit}
          canProceed={canProceed}
          onProceedToCheckout={handleProceedToCheckout}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
