/**
 * Asset Selection Sheet — Bottom sheet for assigning assets to employees.
 *
 * For VEHICLES (Taxi): Single-select list (1:1 assignment) — UNCHANGED.
 * For HOTELS (Water): Multi-select checkbox list (N:N assignment via junction table).
 *   - Shows ALL enabled hotels
 *   - Pre-checked = already assigned to this employee
 *   - "Save Assignments" button applies all changes at once
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing, tones, cardShadow } from "../../../../theme";
import type { Vehicle } from "../../../../types/vehicle";
import type { Hotel } from "../../Hotels/types";
import type { Employee } from "../../Employees/types";
import type { AssetType } from "../types";
import { getAssignedHotelIds } from "../../../../services/hotelService";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AssetSelectionSheetProps {
  visible: boolean;
  assetType: AssetType;
  employee: Employee | null;
  vehicles: Vehicle[];
  hotels: Hotel[];
  onSelect: (assetId: string) => void;
  onBatchSave?: (staffId: string, hotelIds: string[]) => Promise<void>;
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
  onBatchSave,
  onClose,
  testID,
}: AssetSelectionSheetProps) {
  const insets = useSafeAreaInsets();
  const isVehicle = assetType === "vehicle";

  // Multi-select state for hotels
  const [selectedHotelIds, setSelectedHotelIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load currently assigned hotels when sheet opens
  useEffect(() => {
    if (visible && !isVehicle && employee) {
      setLoading(true);
      getAssignedHotelIds(employee.id)
        .then((assignedIds) => {
          setSelectedHotelIds(new Set(assignedIds));
        })
        .catch((err) => {
          console.error("[AssetSelectionSheet] Error loading assigned hotels:", err);
          setSelectedHotelIds(new Set());
        })
        .finally(() => setLoading(false));
    } else if (visible) {
      setSelectedHotelIds(new Set());
    }
  }, [visible, isVehicle, employee]);

  // Get available (unassigned) vehicles for single-select
  const availableVehicles = useMemo(() => {
    if (!isVehicle) return [];
    return vehicles.filter(
      (v) => !v.assignedEmployeeId && v.status === "enabled"
    );
  }, [isVehicle, vehicles]);

  // Toggle hotel checkbox
  const toggleHotel = useCallback((hotelId: string) => {
    setSelectedHotelIds((prev) => {
      const next = new Set(prev);
      if (next.has(hotelId)) {
        next.delete(hotelId);
      } else {
        next.add(hotelId);
      }
      return next;
    });
  }, []);

  // Handle single vehicle select
  const handleVehicleSelect = useCallback(
    (assetId: string) => {
      onSelect(assetId);
      onClose();
    },
    [onSelect, onClose]
  );

  // Handle batch save for hotels
  const handleBatchSave = useCallback(async () => {
    if (!employee || !onBatchSave) return;
    setSaving(true);
    try {
      await onBatchSave(employee.id, Array.from(selectedHotelIds));
      onClose();
    } catch (error) {
      console.error("[AssetSelectionSheet] Batch save failed:", error);
    } finally {
      setSaving(false);
    }
  }, [employee, selectedHotelIds, onBatchSave, onClose]);

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
            {isVehicle ? "Select Vehicle" : "Manage Hotel Assignments"}
          </Text>
          <Text style={styles.subtitle}>
            {isVehicle
              ? `Assigning to ${employee.fullName}`
              : `${employee.fullName} — ${selectedHotelIds.size} hotel(s) selected`}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={styles.loadingText}>Loading assignments...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {isVehicle ? (
                // ============================================================
                // VEHICLE MODE: Single-select list (UNCHANGED)
                // ============================================================
                availableVehicles.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="car-outline" size={48} color={colors.textTertiary} />
                    <Text style={styles.emptyTitle}>No Available Vehicles</Text>
                    <Text style={styles.emptySubtitle}>
                      All running vehicles are currently assigned
                    </Text>
                  </View>
                ) : (
                  availableVehicles.map((asset) => {
                    const tone = tones.purple;
                    return (
                      <TouchableOpacity
                        key={asset.id}
                        style={[styles.assetCard, cardShadow]}
                        onPress={() => handleVehicleSelect(asset.id)}
                        activeOpacity={0.7}
                        testID={`${testID}-asset-${asset.id}`}
                      >
                        <View style={[styles.assetIcon, { backgroundColor: tone.iconBg }]}>
                          <Ionicons name="car-sport" size={24} color={tone.accent} />
                        </View>
                        <View style={styles.assetInfo}>
                          <Text style={styles.assetName}>{asset.name}</Text>
                          <Text style={styles.assetDetail}>{asset.number}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    );
                  })
                )
              ) : (
                // ============================================================
                // HOTEL MODE: Multi-select checkbox list (NEW)
                // ============================================================
                <>
                  {hotels.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="bed-outline" size={48} color={colors.textTertiary} />
                      <Text style={styles.emptyTitle}>No Hotels Available</Text>
                      <Text style={styles.emptySubtitle}>
                        Add hotels first in the Hotels section
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/* Select All / Deselect All toggle */}
                      <TouchableOpacity
                        style={styles.selectAllRow}
                        onPress={() => {
                          if (selectedHotelIds.size === hotels.length) {
                            setSelectedHotelIds(new Set());
                          } else {
                            setSelectedHotelIds(new Set(hotels.map((h) => h.id)));
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={selectedHotelIds.size === hotels.length ? "checkbox" : "square-outline"}
                          size={22}
                          color={selectedHotelIds.size === hotels.length ? colors.brand : colors.textTertiary}
                        />
                        <Text style={styles.selectAllText}>
                          {selectedHotelIds.size === hotels.length ? "Deselect All" : "Select All"}
                        </Text>
                        <Text style={styles.selectAllCount}>
                          {selectedHotelIds.size}/{hotels.length}
                        </Text>
                      </TouchableOpacity>

                      {hotels.map((hotel) => {
                        const isChecked = selectedHotelIds.has(hotel.id);
                        const tone = isChecked ? tones.green : tones.blue;

                        return (
                          <TouchableOpacity
                            key={hotel.id}
                            style={[
                              styles.checkboxCard,
                              isChecked && styles.checkboxCardChecked,
                              cardShadow,
                            ]}
                            onPress={() => toggleHotel(hotel.id)}
                            activeOpacity={0.7}
                            testID={`${testID}-hotel-${hotel.id}`}
                          >
                            <View style={[styles.checkboxIcon, { backgroundColor: tone.iconBg }]}>
                              <Ionicons
                                name={isChecked ? "checkbox" : "square-outline"}
                                size={24}
                                color={isChecked ? tones.green.accent : colors.textTertiary}
                              />
                            </View>
                            <View style={styles.assetInfo}>
                              <Text style={styles.assetName}>{hotel.name}</Text>
                              <Text style={styles.assetDetail}>
                                ₹{hotel.ratePerCan}/can
                                {hotel.location ? ` • ${hotel.location}` : ""}
                              </Text>
                              {hotel.outstandingCans ? (
                                <Text style={styles.outstandingBadge}>
                                  {hotel.outstandingCans} outstanding cans
                                </Text>
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </ScrollView>

            {/* Save button for hotel multi-select mode */}
            {!isVehicle && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    saving && styles.saveButtonDisabled,
                  ]}
                  onPress={handleBatchSave}
                  disabled={saving}
                  activeOpacity={0.8}
                  testID={`${testID}-save-btn`}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
                      <Text style={styles.saveButtonText}>
                        Save Assignments ({selectedHotelIds.size} hotels)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
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
    maxHeight: SCREEN_HEIGHT * 0.75,
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
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  // Vehicle card (single-select)
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
  // Hotel checkbox card (multi-select)
  checkboxCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxCardChecked: {
    borderColor: tones.green.accent,
    backgroundColor: tones.green.cardBg,
  },
  checkboxIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  outstandingBadge: {
    fontSize: fontSize.xs,
    color: tones.orange.accent,
    fontWeight: "500",
    marginTop: 2,
  },
  // Select All row
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  selectAllText: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  selectAllCount: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  // Footer save button
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.surface,
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