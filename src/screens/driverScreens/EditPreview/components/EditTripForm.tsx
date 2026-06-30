/**
 * EditTripForm - Form to edit trip details
 */

import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow } from '../../../../theme';
import type { EditTripFormData, TripType } from '../../../../types/driver';

interface EditTripFormProps {
  formData: EditTripFormData;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onTripTypeChange: (type: TripType) => void;
  onClearFrom: () => void;
  onClearTo: () => void;
  onClearAmount: () => void;
}

export function EditTripForm({
  formData,
  onFromChange,
  onToChange,
  onAmountChange,
  onTripTypeChange,
  onClearFrom,
  onClearTo,
  onClearAmount,
}: EditTripFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Edit Trip</Text>

      {/* Trip Type Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Trip Type</Text>
        <View style={styles.tripTypeContainer}>
          {/* Vendor Option */}
          <TouchableOpacity
            style={[
              styles.tripTypeOption,
              formData.tripType === 'vendor' && styles.tripTypeOptionActive,
            ]}
            onPress={() => onTripTypeChange('vendor')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="business"
              size={20}
              color={formData.tripType === 'vendor' ? '#1565C0' : colors.textSecondary}
            />
            <Text
              style={[
                styles.tripTypeOptionText,
                formData.tripType === 'vendor' && styles.tripTypeOptionTextActive,
              ]}
            >
              Vendor
            </Text>
            {formData.tripType === 'vendor' && (
              <View style={styles.tripTypeCheckmarkWrapper}>
                <Feather name="check" size={14} color={colors.surface} />
              </View>
            )}
          </TouchableOpacity>

          {/* Private Option */}
          <TouchableOpacity
            style={[
              styles.tripTypeOption,
              formData.tripType === 'private' && styles.tripTypeOptionActivePrivate,
            ]}
            onPress={() => onTripTypeChange('private')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="person"
              size={20}
              color={formData.tripType === 'private' ? '#6A1B9A' : colors.textSecondary}
            />
            <Text
              style={[
                styles.tripTypeOptionText,
                formData.tripType === 'private' && styles.tripTypeOptionTextActivePrivate,
              ]}
            >
              Private
            </Text>
            {formData.tripType === 'private' && (
              <View style={styles.tripTypeCheckmarkWrapperPrivate}>
                <Feather name="check" size={14} color={colors.surface} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* From Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>From</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.iconWrapper}>
            <Feather name="map-pin" size={18} color="#4CAF50" />
          </View>
          <TextInput
            style={styles.input}
            value={formData.from}
            onChangeText={onFromChange}
            placeholder="Enter pickup location"
            placeholderTextColor={colors.textTertiary}
          />
          {formData.from.length > 0 && (
            <TouchableOpacity onPress={onClearFrom} style={styles.clearButton}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* To Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>To</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.iconWrapper}>
            <Feather name="map-pin" size={18} color="#4CAF50" />
          </View>
          <TextInput
            style={styles.input}
            value={formData.to}
            onChangeText={onToChange}
            placeholder="Enter drop location"
            placeholderTextColor={colors.textTertiary}
          />
          {formData.to.length > 0 && (
            <TouchableOpacity onPress={onClearTo} style={styles.clearButton}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Amount (₹)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.amountInput]}
            value={formData.amount}
            onChangeText={onAmountChange}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
          />
          {formData.amount.length > 0 && (
            <TouchableOpacity onPress={onClearAmount} style={styles.clearButton}>
              <Feather name="x-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapper: {
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  amountInput: {
    paddingLeft: spacing.lg,
  },
  clearButton: {
    padding: spacing.md,
  },
  paymentModeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  paymentOptionActive: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50',
  },
  paymentOptionText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  paymentOptionTextActive: {
    color: '#1B5E20',
    fontWeight: '600',
  },
  checkmarkWrapper: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
    // Trip Type Styles
  tripTypeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
    tripTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tripTypeOptionActive: {
    backgroundColor: '#BBDEFB',
    borderColor: '#1976D2',
  },
  tripTypeOptionActivePrivate: {
    backgroundColor: '#E1BEE7',
    borderColor: '#7B1FA2',
  },
  tripTypeOptionText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  tripTypeOptionTextActive: {
    color: '#1565C0',
    fontWeight: '600',
  },
  tripTypeOptionTextActivePrivate: {
    color: '#6A1B9A',
    fontWeight: '600',
  },
  tripTypeCheckmarkWrapper: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  tripTypeCheckmarkWrapperPrivate: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: '#7B1FA2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
