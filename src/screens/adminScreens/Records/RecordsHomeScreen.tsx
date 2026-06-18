import React, { useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Text,
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
import { mockBusinesses, mockDriverRecords } from "../../../data/mockDailyRecords";
import { mockWaterDeliveryRecords } from "../../../data/mockWaterRecords";
import type { RecordStatus } from "../../../types/taxiRecords";
import type { RecordStatus as WaterRecordStatus } from "../../../types/waterRecords";
import type { DailyRecordsStackParamList } from "../../../types/navigation";
import type { Business } from "../../../types/waterRecords";

const TAB_BAR_CLEARANCE = 80;

type NavigationProp = NativeStackNavigationProp<DailyRecordsStackParamList>;

export default function DailyRecord() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  // Use unified business list with type information
  const allBusinesses: Business[] = mockBusinesses as Business[];
  
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(allBusinesses[0]);
  const [selectedDate, setSelectedDate] = useState("2026-06-10"); // Default date for taxi data
  const [activeTab, setActiveTab] = useState<RecordStatus | WaterRecordStatus>("submitted");
  const [refreshing, setRefreshing] = useState(false);

  // Determine if current business is water type
  const isWaterBusiness = selectedBusiness?.type === "water";

  // Handle business selection change
  const handleBusinessChange = (business: Business) => {
    setSelectedBusiness(business);
    // Update default date based on business type
    if (business.type === "water") {
      setSelectedDate("2025-07-10"); // Date for water mock data
    } else {
      setSelectedDate("2026-06-10"); // Date for taxi mock data
    }
    // Reset to submitted tab
    setActiveTab("submitted");
  };

  // Filter records based on tab and business type
  const filteredRecords = useMemo(() => {
    if (isWaterBusiness) {
      return mockWaterDeliveryRecords.filter((record) => record.status === activeTab);
    }
    return mockDriverRecords.filter((record) => record.status === activeTab);
  }, [activeTab, isWaterBusiness]);

  // Calculate counts based on business type
  const submittedCount = useMemo(() => {
    if (isWaterBusiness) {
      return mockWaterDeliveryRecords.filter((r) => r.status === "submitted").length;
    }
    return mockDriverRecords.filter((r) => r.status === "submitted").length;
  }, [isWaterBusiness]);

  const pendingCount = useMemo(() => {
    if (isWaterBusiness) {
      return mockWaterDeliveryRecords.filter((r) => r.status === "pending").length;
    }
    return mockDriverRecords.filter((r) => r.status === "pending").length;
  }, [isWaterBusiness]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Handle record press based on business type
  const handleRecordPress = (recordId: string) => {
    if (isWaterBusiness) {
      navigation.navigate("WaterRecordDetails", { recordId });
    } else {
      navigation.navigate("RecordDetails", { recordId });
    }
  };

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
            businesses={allBusinesses}
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