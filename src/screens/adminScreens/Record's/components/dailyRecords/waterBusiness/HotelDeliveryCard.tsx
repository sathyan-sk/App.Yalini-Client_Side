import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { colors, fontSize, radius, spacing, lightShadow, cardShadow } from "../../../../../../../src/theme";
import { formatCurrency } from "../../../../../../../src/utils/format";
import type { HotelDelivery } from "../../../../../../../src/types/waterRecords";

interface HotelDeliveryCardProps {
  hotel: HotelDelivery;
  index: number;
  testID?: string;
}

export function HotelDeliveryCard({ hotel, index, testID }: HotelDeliveryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const animationProgress = useSharedValue(0);

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    animationProgress.value = withTiming(newExpanded ? 1 : 0, { duration: 250 });
  };

  const chevronStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    return {
      height,
      opacity,
    };
  });

  return (
    <View style={styles.container} testID={testID}>
      {/* Collapsible Header */}
      <Pressable
        onPress={toggleExpand}
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
      >
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index}</Text>
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.hotelName}>{hotel.hotelName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.location} numberOfLines={1}>{hotel.location}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.cansPreview}>
            <Ionicons name="water" size={14} color={colors.primaryBlue} />
            <Text style={styles.cansPreviewText}>{hotel.deliveredCans}/{hotel.totalCans}</Text>
          </View>
          <Animated.View style={chevronStyle}>
            <Feather name="chevron-down" size={20} color={colors.textSecondary} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Expandable Content */}
      <Animated.View style={[styles.expandableContent, contentStyle]}>
        <View style={styles.divider} />
        
        {/* Cans Details Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total Cans</Text>
            <Text style={styles.metricValue}>{hotel.totalCans}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Delivered</Text>
            <Text style={[styles.metricValue, styles.deliveredValue]}>{hotel.deliveredCans}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Returned</Text>
            <Text style={[styles.metricValue, styles.returnedValue]}>{hotel.returnedCans}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Outstanding</Text>
            <Text style={[styles.metricValue, styles.outstandingValue]}>{hotel.outstandingCans}</Text>
          </View>
        </View>

        {/* Financial Details Row */}
        <View style={styles.financialRow}>
          <View style={styles.financialItem}>
            <View style={[styles.financialIcon, { backgroundColor: colors.successSoft }]}>
              <MaterialCommunityIcons name="currency-inr" size={14} color={colors.successDark} />
            </View>
            <View>
              <Text style={styles.financialLabel}>Income</Text>
              <Text style={[styles.financialValue, styles.incomeValue]}>
                {formatCurrency(hotel.income)}
              </Text>
            </View>
          </View>
          <View style={styles.financialItem}>
            <View style={[styles.financialIcon, { backgroundColor: colors.errorSoft }]}>
              <MaterialCommunityIcons name="wallet-outline" size={14} color={colors.error} />
            </View>
            <View>
              <Text style={styles.financialLabel}>Expense</Text>
              <Text style={[styles.financialValue, styles.expenseValue]}>
                {formatCurrency(hotel.expense)}
              </Text>
            </View>
          </View>
          <View style={styles.financialItem}>
            <View style={[styles.financialIcon, { backgroundColor: colors.brandSoft }]}>
              <Feather name="trending-up" size={14} color={colors.brand} />
            </View>
            <View>
              <Text style={styles.financialLabel}>Profit</Text>
              <Text style={[styles.financialValue, styles.profitValue]}>
                {formatCurrency(hotel.profit)}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryBlue,
    overflow: "hidden",
    ...lightShadow,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  headerPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  indexContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  indexText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  headerContent: {
    flex: 1,
  },
  hotelName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  location: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cansPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryBlueSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  cansPreviewText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primaryBlue,
  },
  expandableContent: {
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  deliveredValue: {
    color: colors.successDark,
  },
  returnedValue: {
    color: colors.primaryBlue,
  },
  outstandingValue: {
    color: colors.warning,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  financialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  financialIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  financialLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  financialValue: {
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  incomeValue: {
    color: colors.successDark,
  },
  expenseValue: {
    color: colors.error,
  },
  profitValue: {
    color: colors.brand,
  },
});
