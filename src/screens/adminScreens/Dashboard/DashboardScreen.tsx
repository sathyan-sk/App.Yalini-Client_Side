import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SectionHeader } from "../../../components/common/SectionHeader";
import { BusinessOverviewCard } from "../../../components/dashboard/BusinessOverviewCard";
import { CalendarSheet } from "../../../components/dashboard/CalendarSheet";
import { DashboardHeader } from "../../../components/dashboard/DashboardHeader";
import { DateSelectorPill } from "../../../components/dashboard/DateSelectorPill";
import { StatCard, StatCardConfig } from "../../../components/dashboard/StatCard";
import { SubmissionListItem } from "../../../components/dashboard/SubmissionListItem";
import { useDashboard } from "../../../hooks/useDashboard";
import {
  cardShadow,
  colors,
  fontSize,
  radius,
  spacing,
} from "../../../theme";
import type { DashboardStats, Submission } from "../../../types/dashboard";
import { todayISO } from "../../../utils/format";

const STAT_CARDS: (StatCardConfig & { pick: (s: DashboardStats) => number })[] = [
  {
    key: "active-employees",
    label: "Active Employees",
    tone: "purple",
    icon: { family: "feather", name: "users" },
    pick: (s) => s.activeEmployees,
  },
  {
    key: "submitted-today",
    label: "Submitted Today",
    tone: "green",
    icon: { family: "feather", name: "check-square" },
    pick: (s) => s.submittedToday,
  },
  {
    key: "pending-today",
    label: "Pending Today",
    tone: "orange",
    icon: { family: "feather", name: "clock" },
    pick: (s) => s.pendingToday,
  },
  {
    key: "businesses",
    label: "Businesses",
    tone: "blue",
    icon: { family: "ion", name: "business-outline" },
    pick: (s) => s.businesses,
  },
];

/** Height reserved for the floating tab bar so content is never hidden. */
const TAB_BAR_CLEARANCE = 72;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const { data, loading, refreshing, error, refresh } = useDashboard(selectedDate);

  const noop = () => {
    // Hooked up when the corresponding feature/back end arrives.
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sticky header area */}
      <View style={styles.stickyHeader}>
        <DashboardHeader onMenuPress={noop} onBellPress={noop} />
        <DateSelectorPill
          isoDate={selectedDate}
          onPress={() => setCalendarVisible(true)}
        />
      </View>

      {loading ? (
        <View style={styles.centerState} testID="dashboard-loading">
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : error ? (
        <View style={styles.centerState} testID="dashboard-error">
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            testID="dashboard-retry-button"
            onPress={refresh}
            style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : data ? (
        <ScrollView
          testID="dashboard-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.brand}
            />
          }
        >
          {/* Stat cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statRow}
            testID="dashboard-stat-cards"
          >
            {STAT_CARDS.map((card) => (
              <StatCard key={card.key} config={card} value={card.pick(data.stats)} />
            ))}
          </ScrollView>

          {/* Business overview */}
          <SectionHeader
            title="Business Overview (Today)"
            onViewAll={noop}
            testID="business-overview-header"
          />
          {data.businesses.map((business) => (
            <BusinessOverviewCard
              key={business.id}
              business={business}
              onPress={noop}
            />
          ))}

          {/* Recent submissions */}
          <SectionHeader
            title="Recent Submissions"
            onViewAll={noop}
            testID="recent-submissions-header"
          />
          <View style={styles.submissionsCard} testID="recent-submissions-list">
            {data.submissions.map((submission: Submission, index: number) => (
              <SubmissionListItem
                key={submission.id}
                submission={submission}
                isLast={index === data.submissions.length - 1}
                onPress={noop}
              />
            ))}
          </View>
            <Pressable
            testID="recent-submissions-load-more"
            onPress={noop}
            style={({ pressed }) => [
              styles.loadMore,
              pressed && { opacity: 0.6 },
            ]}
          >
          <Text style={styles.loadMoreText}>load more...</Text>
          </Pressable>
        </ScrollView>
      ) : null}

      <CalendarSheet
        visible={calendarVisible}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setCalendarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  stickyHeader: {
    backgroundColor: colors.surfaceSecondary,
  },
  statRow: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  submissionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: spacing.lg,
    overflow: "hidden",
    ...cardShadow,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    minHeight: 44,
    justifyContent: "center",
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: fontSize.base,
    fontWeight: "500",
  },
    loadMore: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    marginTop: spacing.xs,
  },
  loadMoreText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});
