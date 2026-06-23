import React, { useState, useMemo, useEffect } from "react";
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

import { ScreenHeader } from "./components/common/ScreenHeader";
import { BusinessSelector } from "./components/common/BusinessSelector";
import { DateSelector } from "./components/common/DateSelector";
import { TabSwitcher } from "./components/common/TabSwitcher";
import { DriverCard } from "./components/BusinessTypeRecords/TaxiType/DriverCard";
import { DeliveryPersonCard } from "./components/BusinessTypeRecords/WaterType/DeliveryPersonCard";

import { colors, spacing, fontSize } from "../../../theme";
import { useRecords } from "../../../hooks/useRecords";
import type { RecordStatus } from "../../../types/taxiRecords";
import type { RecordStatus as WaterRecordStatus } from "../../../types/waterRecords";
import type { RecordsStackParamList } from "../../../types/navigation";
import type { Business } from "../../../types/taxiRecords";

const TAB_BAR_CLEARANCE = 80;

type NavigationProp = NativeStackNavigationProp<RecordsStackParamList>;

export default function RecordsHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  // Use the new records hook that connects to the mock service layer
  const { businesses, driverRecords, waterRecords, loading, refresh } = useRecords();
  
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<RecordStatus | WaterRecordStatus>("submitted");
  const [refreshing, setRefreshing] = useState(false);

  // Set initial selected business when businesses load
  useEffect(() => {
    if (businesses.length > 0 && !selectedBusiness) {
      setSelectedBusiness(businesses[0] as Business);
    }
  }, [businesses, selectedBusiness]);

  // Determine if current business is water type
  const isWaterBusiness = selectedBusiness?.type === "water_delivery";

  // Handle business selection change
  const handleBusinessChange = (business: Business) => {
    setSelectedBusiness(business);
    // Reset to submitted tab
    setActiveTab("submitted");
  };

  // Filter records based on tab, business type, and date
  const filteredRecords = useMemo(() => {
    if (isWaterBusiness) {
      return waterRecords.filter(
        (record) => record.status === activeTab && record.date === selectedDate
      );
    }
    return driverRecords.filter(
      (record) => record.status === activeTab && record.date === selectedDate
    );
  }, [activeTab, isWaterBusiness, driverRecords, waterRecords, selectedDate]);

  // Calculate counts based on business type and date
  const submittedCount = useMemo(() => {
    if (isWaterBusiness) {
      return waterRecords.filter(
        (r) => r.status === "submitted" && r.date === selectedDate
      ).length;
    }
    return driverRecords.filter(
      (r) => r.status === "submitted" && r.date === selectedDate
    ).length;
  }, [isWaterBusiness, driverRecords, waterRecords, selectedDate]);

  const pendingCount = useMemo(() => {
    if (isWaterBusiness) {
      return waterRecords.filter(
        (r) => r.status === "pending" && r.date === selectedDate
      ).length;
    }
    return driverRecords.filter(
      (r) => r.status === "pending" && r.date === selectedDate
    ).length;
  }, [isWaterBusiness, driverRecords, waterRecords, selectedDate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Handle record press based on business type
  const handleRecordPress = (recordId: string) => {
    if (isWaterBusiness) {
      navigation.navigate("WaterRecordDetails", { recordId });
    } else {
      navigation.navigate("TaxiRecordDetails", { recordId });
    }
  };

  // Show loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>Loading records...</Text>
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
            businesses={businesses as Business[]}
            selectedBusiness={selectedBusiness}
            onSelect={handleBusinessChange}
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

        {/* Records List - Conditionally render based on business type */}
        <View style={styles.listContainer}>
          {filteredRecords.length > 0 ? (
            isWaterBusiness ? (
              // Render Water Delivery Records
              filteredRecords.map((record: any) => (
                <DeliveryPersonCard
                  key={record.id}
                  record={record}
                  onPress={() => handleRecordPress(record.id)}
                />
              ))
            ) : (
              // Render Taxi Driver Records
              filteredRecords.map((record: any) => (
                <DriverCard
                  key={record.id}
                  record={record}
                  onPress={() => handleRecordPress(record.id)}
                />
              ))
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No records found</Text>
              <Text style={styles.emptySubtext}>
                {selectedDate === new Date().toISOString().split('T')[0]
                  ? "No submissions for today"
                  : "Try selecting a different date"}
              </Text>
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.textSecondary,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});