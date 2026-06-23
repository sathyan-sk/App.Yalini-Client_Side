import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { DeliveryPersonInfoHeader } from "./WaterType/DeliveryPersonInfoHeader";
import { WaterSummarySection } from "./WaterType/WaterSummarySection";
import { HotelDeliveryCard } from "./WaterType/HotelDeliveryCard";

import { colors, spacing, fontSize, radius } from "../../../../../theme";
import { getWaterRecordByIdService } from "../../../../../services/recordsService";
import type { WaterDeliveryRecord } from "../../../../../types/waterRecords";
import type { RecordsStackParamList } from "../../../../../types/navigation";

const TAB_BAR_CLEARANCE = 80;

type ScreenRouteProp = RouteProp<RecordsStackParamList, "WaterRecordDetails">;
type NavigationProp = NativeStackNavigationProp<RecordsStackParamList>;

export default function WaterRecordDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  
  const { recordId } = route.params;

  // State for async data loading
  const [record, setRecord] = useState<WaterDeliveryRecord | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch record data asynchronously
  useEffect(() => {
    let isMounted = true;
    
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWaterRecordByIdService(recordId);
        if (isMounted) {
          setRecord(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'Failed to load record');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecord();

    return () => {
      isMounted = false;
    };
  }, [recordId]);

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>Loading record...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Not found state
  if (!record) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
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
  centerContainer: {
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
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
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
