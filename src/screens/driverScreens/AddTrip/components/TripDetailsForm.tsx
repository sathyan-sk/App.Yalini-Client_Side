/**
 * TripDetailsForm - Form component for entering trip details
 * Contains From, To, Amount inputs and Payment Mode selector
 */

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import { colors, spacing, fontSize, radius, cardShadow } from "../../../../theme";
import type { TripFormData, PaymentMode, TripType } from "../../../../types/driver";

interface TripDetailsFormProps {
  formData: TripFormData;
  onTripTypeChange: (type: TripType) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSaveTrip: () => void;
  isSubmitting: boolean;
}

export function TripDetailsForm({
  formData,
  onTripTypeChange,
  onFromChange,
  onToChange,
  onAmountChange,
  onSaveTrip,
  isSubmitting,
}: TripDetailsFormProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Trip Details</Text>
      
      {/* Trip Type Radio Buttons */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Trip Type</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={styles.tripTypeContainer}>
          {/* Vendor Button */}
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              formData.tripType === "vendor" && styles.tripTypeButtonActive,
            ]}
            onPress={() => onTripTypeChange("vendor")}
            activeOpacity={0.7}
          >
            <View style={[
              styles.radioOuter,
              formData.tripType === "vendor" && styles.radioOuterActive,
            ]}>
              {formData.tripType === "vendor" && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[
                styles.tripTypeButtonText,
                formData.tripType === "vendor" && styles.tripTypeButtonTextActive,
              ]}
            >
              Vendor
            </Text>
          </TouchableOpacity>

          {/* Private Button */}
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              formData.tripType === "private" && styles.tripTypeButtonActive,
            ]}
            onPress={() => onTripTypeChange("private")}
            activeOpacity={0.7}
          >
            <View style={[
              styles.radioOuter,
              formData.tripType === "private" && styles.radioOuterActive,
            ]}>
              {formData.tripType === "private" && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[
                styles.tripTypeButtonText,
                formData.tripType === "private" && styles.tripTypeButtonTextActive,
              ]}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* From Input */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <MaterialIcons name="location-on" size={20} color={colors.textTertiary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter pickup location"
            placeholderTextColor={colors.textTertiary}
            value={formData.from}
            onChangeText={onFromChange}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* To Input */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <MaterialIcons name="location-on" size={20} color={colors.textTertiary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter drop location"
            placeholderTextColor={colors.textTertiary}
            value={formData.to}
            onChangeText={onToChange}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Amount (₹)</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.rupeeIcon}>
            <Text style={styles.rupeeText}>₹</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor={colors.textTertiary}
            value={formData.amount}
            onChangeText={onAmountChange}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
        onPress={onSaveTrip}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={colors.surface} />
        ) : (
          <>
            <Feather name="save" size={20} color={colors.surface} />
            <Text style={styles.saveButtonText}>Save Trip</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  required: {
    fontSize: fontSize.base,
    color: colors.error,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  inputIcon: {
    width: 44,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  rupeeIcon: {
    width: 44,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderTopLeftRadius: radius.md - 1,
    borderBottomLeftRadius: radius.md - 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  rupeeText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingRight: spacing.md,
  },
  paymentModeContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  paymentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  paymentButtonActive: {
    borderColor: colors.primaryBlue,
    backgroundColor: "#E3F2FD",
  },
  paymentIconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  paymentButtonTextActive: {
    color: colors.primaryBlue,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    backgroundColor: colors.primaryBlue,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.surface,
  },
   tripTypeContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  tripTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  tripTypeButtonActive: {
    borderColor: "#FF9800",
    backgroundColor: "#FFF3E0",
  },
  tripTypeButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tripTypeButtonTextActive: {
    color: "#E65100",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterActive: {
    borderColor: "#FF9800",
  },
    radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF9800",
  },
  settlementRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  settlementField: {
    flex: 1,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});
