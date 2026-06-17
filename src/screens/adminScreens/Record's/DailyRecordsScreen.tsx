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

import { ScreenHeader } from "../Record's/components/common/ScreenHeader";
import { BusinessSelector } from "../Record's/components/common/BusinessSelector";
import { DateSelector } from "../Record's/components/common/DateSelector";
import { TabSwitcher } from "../Record's/components/common/TabSwitcher";
import { DriverCard } from "./components/dailyRecords/taxiBusiness/DriverCard";

import { colors, spacing, fontSize } from "../../../theme";
import { mockBusinesses, mockDriverRecords } from "../../../data/mockDailyRecords";
import type { RecordStatus } from "../../../types/dailyRecords";
import type { DailyRecordsStackParamList } from "../../../types/navigation";

const TAB_BAR_CLEARANCE = 80;

type NavigationProp = NativeStackNavigationProp<DailyRecordsStackParamList>;

export default function DailyRecordsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const [selectedBusiness, setSelectedBusiness] = useState(mockBusinesses[0]);
  const [selectedDate, setSelectedDate] = useState("2026-06-10"); // Match mock data date
  const [activeTab, setActiveTab] = useState<RecordStatus>("submitted");
  const [refreshing, setRefreshing] = useState(false);

  // Filter records based on tab
  const filteredRecords = useMemo(() => {
    return mockDriverRecords.filter((record) => record.status === activeTab);
  }, [activeTab]);

  const submittedCount = mockDriverRecords.filter((r) => r.status === "submitted").length;
  const pendingCount = mockDriverRecords.filter((r) => r.status === "pending").length;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRecordPress = (recordId: string) => {
    navigation.navigate("RecordDetails", { recordId });
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
            businesses={mockBusinesses}
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
              <DriverCard
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
