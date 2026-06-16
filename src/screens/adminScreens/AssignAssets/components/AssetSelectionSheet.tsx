import React, { useCallback, useMemo } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing, tones, cardShadow } from "../../../../theme";
import type { Vehicle } from "../../../../types/vehicle";
import type { Hotel } from "../../Hotels/types";
import type { Employee } from "../../Employees/types";
import type { AssetType } from "../types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AssetSelectionSheetProps {
  visible: boolean;
  assetType: AssetType;
  employee: Employee | null;
  vehicles: Vehicle[];
  hotels: Hotel[];
  onSelect: (assetId: string) => void;
  onClose: () => void;
  testID?: string;
}

export function AssetSelectionSheet({
  visible,
  assetType,
  employee,
  vehicles,
  hotels,
  onSelect,
  onClose,
  testID,
}: AssetSelectionSheetProps) {
  const insets = useSafeAreaInsets();

  // Get available (unassigned) assets
  const availableAssets = useMemo(() => {
    if (assetType === "vehicle") {
      return vehicles.filter(
        (v) => !v.assignedEmployeeId && v.status === "enabled"
      );
    }
    return hotels.filter(
      (h) => !h.assignedEmployeeId && h.status === "enabled"
    );
  }, [assetType, vehicles, hotels]);

  const handleSelect = useCallback(
    (assetId: string) => {
      onSelect(assetId);
      onClose();
    },
    [onSelect, onClose]
  );

  if (!employee) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>
            Select {assetType === "vehicle" ? "Vehicle" : "Hotel"}
          </Text>
          <Text style={styles.subtitle}>
            Assigning to {employee.fullName}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {availableAssets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name={assetType === "vehicle" ? "car-outline" : "bed-outline"}
                size={48}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>
                No Available {assetType === "vehicle" ? "Vehicles" : "Hotels"}
              </Text>
              <Text style={styles.emptySubtitle}>
                All {assetType === "vehicle" ? "running vehicles are" : "active hotels are"} currently assigned
              </Text>
            </View>
          ) : (
            availableAssets.map((asset) => {
              const isVehicle = assetType === "vehicle";
              const tone = isVehicle ? tones.purple : tones.blue;

              return (
                <TouchableOpacity
                  key={asset.id}
                  style={[styles.assetCard, cardShadow]}
                  onPress={() => handleSelect(asset.id)}
                  activeOpacity={0.7}
                  testID={`${testID}-asset-${asset.id}`}
                >
                  <View
                    style={[
                      styles.assetIcon,
                      { backgroundColor: tone.iconBg },
                    ]}
                  >
                    <Ionicons
                      name={isVehicle ? "car-sport" : "bed"}
                      size={24}
                      color={tone.accent}
                    />
                  </View>

                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    {isVehicle && 'number' in asset && (
                      <Text style={styles.assetDetail}>{asset.number}</Text>
                    )}
                    {!isVehicle && 'ratePerCan' in asset && (
                      <Text style={styles.assetDetail}>
                        Rate: ₹{asset.ratePerCan}/can
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  closeBtn: {
    position: "absolute",
    right: spacing.lg,
    top: spacing.lg,
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  assetInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  assetName: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  assetDetail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
