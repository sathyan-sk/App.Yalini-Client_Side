import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { DeliveryPersonInfoHeader } from "../dailyRecords/waterBusiness/DeliveryPersonInfoHeader";
import { WaterSummarySection } from "../dailyRecords/waterBusiness/WaterSummarySection";
import { HotelDeliveryCard } from "../dailyRecords/waterBusiness/HotelDeliveryCard";

import { colors, spacing, fontSize, radius } from "../../../../../theme";
import { getMockWaterRecordById } from "../../../../../data/mockWaterRecords";
import type { WaterRecordsStackParamList } from "../../../../../types/navigation";

const TAB_BAR_CLEARANCE = 80;

type ScreenRouteProp = RouteProp<WaterRecordsStackParamList, "WaterRecordDetails">;
type NavigationProp = NativeStackNavigationProp<WaterRecordsStackParamList>;

export default function WaterRecordDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  
  const { recordId } = route.params;
  const record = getMockWaterRecordById(recordId);

  if (!record) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Record not found</Text>
        <Pressable 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backIconButton}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={24} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Record Details</Text>
        <Pressable style={styles.shareButton} hitSlop={8}>
          <Feather name="share-2" size={20} color={colors.brand} />
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Person Info Header Card */}
        <DeliveryPersonInfoHeader record={record} />

        {/* Summary Section */}
        <WaterSummarySection record={record} />

        {/* Hotel Deliveries Section */}
        <View style={styles.hotelSection}>
          <Text style={styles.sectionTitle}>
            Hotel Deliveries ({record.hotelDeliveries.length})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Tap on a card to expand details
          </Text>
          {record.hotelDeliveries.map((hotel, index) => (
            <HotelDeliveryCard 
              key={hotel.id} 
              hotel={hotel} 
              index={index + 1}
            />
          ))}
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backIconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  shareText: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.brand,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  hotelSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
});
