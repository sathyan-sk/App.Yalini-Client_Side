import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { MoreStackParamList } from "../../../navigation/types";
import { colors, fontSize, radius, spacing } from "../../../theme";
import { useBusinesses } from "../../../hooks/useBusinesses";

import { BusinessListCard } from "./components/BusinessListCard";
import { BusinessListHeader } from "./components/BusinessListHeader";
import { BusinessStatsCard } from "./components/BusinessStatsCard";

/** Height the floating bottom tab bar reserves on every screen. */
const TAB_BAR_CLEARANCE = 72;

type MyBusinessNavigationProp = NativeStackNavigationProp<
  MoreStackParamList,
  "MyBusiness"
>;

/**
 * Admin → My Businesses listing.
 *
 * Layout: navy \"My Businesses\" header with an Add Business CTA, then a
 * white stats summary card (Total / Active), then the section title and
 * one tappable card per business. Tapping a row drills into the edit
 * flow; tapping the CTA opens the create flow.
 *
 * Data is loaded via `useBusinesses`, which is invalidated every time
 * this screen regains focus (so writes from Add/Edit refresh the list
 * without manual plumbing).
 */
export default function MyBusinessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MyBusinessNavigationProp>();
  const [reloadKey, setReloadKey] = useState(0);
  const { data, loading, refreshing, error, refresh } = useBusinesses(reloadKey);

  // Bump the reload key whenever this screen regains focus so writes from
  // the Add / Edit screens are reflected immediately.
  useFocusEffect(
    useCallback(() => {
      setReloadKey((prev) => prev + 1);
    }, []),
  );

  const stats = useMemo(() => {
    const total = data?.length ?? 0;
    const active = data?.filter((entry) => entry.active).length ?? 0;
    return { total, active };
  }, [data]);

  const handleAddPress = useCallback(() => {
    navigation.navigate("AddBusiness");
  }, [navigation]);

  const handleCardPress = useCallback(
    (id: string) => {
      navigation.navigate("EditBusiness", { businessId: id });
    },
    [navigation],
  );

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <View style={styles.container} testID="my-business-screen">
      <BusinessListHeader
        onAddPress={handleAddPress}
        onBackPress={handleBackPress}
      />

      {loading && !data ? (
        <View style={styles.centerState} testID="my-business-loading">
          <ActivityIndicator color="#1D4ED8" />
        </View>
      ) : error ? (
        <View style={styles.centerState} testID="my-business-error">
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            testID="my-business-retry-button"
            onPress={refresh}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          testID="my-business-scroll"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#1D4ED8"
            />
          }
        >
          <BusinessStatsCard
            totalBusinesses={stats.total}
            activeBusinesses={stats.active}
          />

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Business List</Text>
          </View>

          {data && data.length > 0 ? (
            data.map((business) => (
              <BusinessListCard
                key={business.id}
                business={business}
                onPress={() => handleCardPress(business.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState} testID="my-business-empty">
              <Text style={styles.emptyTitle}>No businesses yet</Text>
              <Text style={styles.emptyBody}>
                Tap "+ Add Business" to set up your first business and start
                configuring assets.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
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
    backgroundColor: "#1D4ED8",
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
  pressed: {
    opacity: 0.85,
  },
  sectionTitleRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  emptyState: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  emptyBody: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
});