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
  onPaymentModeChange: (mode: PaymentMode) => void;
  onSaveTrip: () => void;
  isSubmitting: boolean;
}

export function TripDetailsForm({
  formData,
  onFromChange,
  onToChange,
  onAmountChange,
  onPaymentModeChange,
  onSaveTrip,
  isSubmitting,
}: TripDetailsFormProps) {
  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>Trip Details</Text>

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

      {/* Payment Mode */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Payment Mode</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <View style={styles.paymentModeContainer}>
          {/* Cash Button */}
          <TouchableOpacity
            style={[
              styles.paymentButton,
              formData.paymentMode === "cash" && styles.paymentButtonActive,
            ]}
            onPress={() => onPaymentModeChange("cash")}
            activeOpacity={0.7}
          >
            <View style={styles.paymentIconContainer}>
              <FontAwesome5
                name="money-bill-wave"
                size={16}
                color={formData.paymentMode === "cash" ? colors.primaryBlue : colors.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.paymentButtonText,
                formData.paymentMode === "cash" && styles.paymentButtonTextActive,
              ]}
            >
              Cash
            </Text>
          </TouchableOpacity>

          {/* Online Button */}
          <TouchableOpacity
            style={[
              styles.paymentButton,
              formData.paymentMode === "online" && styles.paymentButtonActive,
            ]}
            onPress={() => onPaymentModeChange("online")}
            activeOpacity={0.7}
          >
            <View style={styles.paymentIconContainer}>
              <Feather
                name="smartphone"
                size={18}
                color={formData.paymentMode === "online" ? colors.primaryBlue : colors.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.paymentButtonText,
                formData.paymentMode === "online" && styles.paymentButtonTextActive,
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>
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
});
