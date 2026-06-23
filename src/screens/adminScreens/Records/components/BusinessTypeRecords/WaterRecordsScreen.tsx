import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenHeader } from "../common/ScreenHeader";
import { BusinessSelector } from "../common/BusinessSelector";
import { DateSelector } from "../common/DateSelector";
import { TabSwitcher } from "../common/TabSwitcher";
import { DeliveryPersonCard } from "./WaterType/DeliveryPersonCard";

import { colors, spacing, fontSize } from "../../../../../theme";
import { getBusinessesForSelector, getWaterDeliveryRecords } from "../../../../../services/mockData";
import type { MockWaterDeliveryRecord } from "../../../../../services/mockData/types";
import type { RecordStatus } from "../../../../../types/waterRecords";
import type { RecordsStackParamList } from "../../../../../types/navigation";

const TAB_BAR_CLEARANCE = 80;

type NavigationProp = NativeStackNavigationProp<RecordsStackParamList>;

interface BusinessSelectorItem {
  id: string;
  name: string;
  type: 'taxi' | 'water';
}

export default function WaterRecords() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  // State for async data
  const [waterBusinesses, setWaterBusinesses] = useState<BusinessSelectorItem[]>([]);
  const [allRecords, setAllRecords] = useState<MockWaterDeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter state
  // keep this as any|null to match the Business|null shape expected by BusinessSelector
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-10"); // Match mock data date
  const [activeTab, setActiveTab] = useState<RecordStatus>("submitted");

  // Load data function
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }

      const [businesses, records] = await Promise.all([
        getBusinessesForSelector(),
        getWaterDeliveryRecords(),
      ]);

      // Filter to only show water businesses
      const waterBiz = businesses.filter(b => b.type === 'water');
      setWaterBusinesses(waterBiz);
      setAllRecords(records);
      
      // Set initial selected business if not set
      if (!selectedBusiness && waterBiz.length > 0) {
        setSelectedBusiness(waterBiz[0]);
      }
    } catch (error) {
      console.error('Failed to load water records data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedBusiness]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Filter records based on tab
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => record.status === activeTab);
  }, [allRecords, activeTab]);

  const submittedCount = useMemo(() => {
    return allRecords.filter((r) => r.status === "submitted").length;
  }, [allRecords]);

  const pendingCount = useMemo(() => {
    return allRecords.filter((r) => r.status === "pending").length;
  }, [allRecords]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  const handleRecordPress = (recordId: string) => {
    navigation.navigate("WaterRecordDetails", { recordId });
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Daily Records"
          leftIcon="menu"
          rightIcon="filter"
          onLeftPress={() => {}}
          onRightPress={() => {}}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={styles.loadingText}>Loading records...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Daily Records"
        leftIcon="menu"
        rightIcon="filter"
        onLeftPress={() => {}}
        onRightPress={() => {}}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.brand}
          />
        }
      >
        {/* Selectors Row */}
        <View style={styles.selectorsRow}>
          <BusinessSelector
            businesses={waterBusinesses as any}
            selectedBusiness={selectedBusiness}
            onSelect={setSelectedBusiness}
          />
          <View style={styles.selectorGap} />
          <DateSelector 
            selectedDate={selectedDate} 
            onSelect={setSelectedDate} 
          />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TabSwitcher
            activeTab={activeTab}
            submittedCount={submittedCount}
            pendingCount={pendingCount}
            onTabChange={setActiveTab}
          />
        </View>

        {/* Records List */}
        <View style={styles.listContainer}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <DeliveryPersonCard
                key={record.id}
                record={record}
                onPress={() => handleRecordPress(record.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  selectorsRow: {
    flexDirection: "row",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  selectorGap: {
    width: spacing.md,
  },
  tabContainer: {
    marginBottom: spacing.lg,
  },
  listContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});
