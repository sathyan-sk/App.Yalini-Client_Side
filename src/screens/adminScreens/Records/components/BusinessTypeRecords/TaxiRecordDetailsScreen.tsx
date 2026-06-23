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

import { DriverInfoHeader } from "./TaxiType/DriverInfoHeader";
import { SummarySection } from "./TaxiType/SummarySection";
import { TripCard } from "./TaxiType/TripCard";
import { FooterSummaryCard } from "./TaxiType/FooterSummaryCard";

import { colors, spacing, fontSize, radius } from "../../../../../theme";
import { getDriverRecordByIdService } from "../../../../../services/recordsService";
import type { DriverRecord } from "../../../../../types/taxiRecords";
import type { RecordsStackParamList } from "../../../../../types/navigation";


const TAB_BAR_CLEARANCE = 80;

type ScreenRouteProp = RouteProp<RecordsStackParamList, "TaxiRecordDetails">;
type NavigationProp = NativeStackNavigationProp<RecordsStackParamList>;

export default function TaxiRecordDetailed() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  
  const { recordId } = route.params;
  
  // State for async data loading
  const [record, setRecord] = useState<DriverRecord | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch record data asynchronously
  useEffect(() => {
    let isMounted = true;
    
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDriverRecordByIdService(recordId);
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
        {/* Driver Info Header Card */}
        <DriverInfoHeader record={record} />

        {/* Summary Section */}
        <SummarySection record={record} />

        {/* Trip Details Section */}
        <View style={styles.tripSection}>
          <Text style={styles.sectionTitle}>
            Trip Details ({record.tripDetails.length})
          </Text>
          {record.tripDetails.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </View>

        {/* Footer Cards */}
        <View style={styles.footerSection}>
          <FooterSummaryCard type="fuel" value={record.fuelExpense} />
          <FooterSummaryCard type="balance" value={record.balanceShortage} />
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
  tripSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  footerSection: {
    marginTop: spacing.md,
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
