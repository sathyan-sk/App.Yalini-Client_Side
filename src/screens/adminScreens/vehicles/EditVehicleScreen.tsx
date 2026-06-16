import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../theme";
import { useVehicles } from "../../../hooks/useVehicles";
import type { VehicleFormValues, VehicleStatusId } from "../../../types/vehicle";

import { FormHeader } from "./components/FormHeader";
import { FormToast } from "./components/FormToast";
import { StatusSelector } from "./components/StatusSelector";

type VehiclesStackParamList = {
  AllVehicles: undefined;
  AddVehicle: undefined;
  EditVehicle: { vehicleId: string };
};

type Nav = NativeStackNavigationProp<VehiclesStackParamList, "EditVehicle">;
type RouteParams = RouteProp<VehiclesStackParamList, "EditVehicle">;

interface FormErrors {
  name?: string;
  number?: string;
}

/**
 * Edit Vehicle Screen
 *
 * Form to edit an existing vehicle with:
 *   - Vehicle Information section (Name, Number)
 *   - Vehicle Status selection (Enabled / Disabled)
 *   - Notes (Optional)
 *   - Save Changes button
 */
export default function EditVehicleScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteParams>();
  const { vehicleId } = route.params;

  const { vehicles, editVehicle, loading } = useVehicles();

  const [values, setValues] = useState<VehicleFormValues | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Load vehicle data
  useEffect(() => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setValues({
        name: vehicle.name,
        number: vehicle.number,
        status: vehicle.status,
        notes: vehicle.notes || "",
        assignedDriver: vehicle.assignedDriver,
      });
    }
  }, [vehicleId, vehicles]);

  const setName = (next: string) => {
    setValues((v) => (v ? { ...v, name: next } : null));
    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
  };

  const setNumber = (next: string) => {
    setValues((v) => (v ? { ...v, number: next.toUpperCase() } : null));
    if (errors.number) setErrors((e) => ({ ...e, number: undefined }));
  };

  const setStatus = (next: VehicleStatusId) =>
    setValues((v) => (v ? { ...v, status: next } : null));

  const setNotes = (next: string) =>
    setValues((v) => (v ? { ...v, notes: next } : null));

  const validate = (): boolean => {
    if (!values) return false;
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Vehicle name is required.";
    else if (values.name.trim().length < 2)
      next.name = "Vehicle name must be at least 2 characters.";

    if (!values.number.trim()) next.number = "Vehicle number is required.";
    else if (values.number.trim().length < 4)
      next.number = "Vehicle number must be at least 4 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!values || !validate()) return;
    setSubmitting(true);
    try {
      await editVehicle(vehicleId, {
        name: values.name.trim(),
        number: values.number.trim().toUpperCase(),
        status: values.status,
        notes: values.notes?.trim() || undefined,
        assignedDriver: values.assignedDriver,
      });
      setToastVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 400);
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVehicle, navigation, values, vehicleId]);

  const handleCancel = () => {
    navigation.goBack();
  };

  if (loading || !values) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <FormHeader
          title="Edit Vehicle"
          subtitle="Update vehicle details"
          onBack={handleCancel}
          topInset={insets.top}
          testID="edit-vehicle-header"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="edit-vehicle-screen">
      <FormHeader
        title="Edit Vehicle"
        subtitle="Update vehicle details"
        onBack={handleCancel}
        topInset={insets.top}
        testID="edit-vehicle-header"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          testID="edit-vehicle-scroll"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.xl + 80,
          }}
        >
          {/* Vehicle Information Section */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="car" size={24} color={colors.brand} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
                <Text style={styles.sectionSubtitle}>
                  Update basic details of the vehicle
                </Text>
              </View>
            </View>

            {/* Vehicle Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Vehicle Name <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.name && styles.inputError,
                ]}
              >
                <Ionicons
                  name="car-outline"
                  size={20}
                  color={colors.textTertiary}
                />
                <TextInput
                  testID="edit-vehicle-name-input"
                  value={values.name}
                  onChangeText={setName}
                  placeholder="Enter vehicle name"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={50}
                />
              </View>
              <Text style={styles.helperText}>e.g., Swift, Innova, Dzire</Text>
              {errors.name ? (
                <Text style={styles.errorText} testID="edit-vehicle-name-error">
                  {errors.name}
                </Text>
              ) : null}
            </View>

            {/* Vehicle Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Vehicle Number <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.number && styles.inputError,
                ]}
              >
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>123</Text>
                </View>
                <TextInput
                  testID="edit-vehicle-number-input"
                  value={values.number}
                  onChangeText={setNumber}
                  placeholder="Enter vehicle number"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={15}
                />
              </View>
              <Text style={styles.helperText}>e.g., MH12AB1234</Text>
              {errors.number ? (
                <Text
                  style={styles.errorText}
                  testID="edit-vehicle-number-error"
                >
                  {errors.number}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Vehicle Status Section */}
          <View style={styles.formCard}>
            <StatusSelector
              value={values.status}
              onChange={setStatus}
              testID="edit-vehicle-status"
            />  
          </View>

          {/* Notes Section */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBg}>
                <Feather name="file-text" size={22} color={colors.brand} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Notes (Optional)</Text>
                <Text style={styles.sectionSubtitle}>
                  Add any additional notes about the vehicle
                </Text>
              </View>
            </View>

            <View style={styles.notesInputContainer}>
              <Feather
                name="file-text"
                size={18}
                color={colors.textTertiary}
                style={styles.notesIcon}
              />
              <TextInput
                testID="edit-vehicle-notes-input"
                value={values.notes}
                onChangeText={setNotes}
                placeholder="Enter notes (if any)"
                placeholderTextColor={colors.textTertiary}
                style={styles.notesInput}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <Pressable
              testID="edit-vehicle-submit"
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.primaryButton,
                submitting && styles.primaryButtonDisabled,
                pressed && !submitting && styles.pressed,
              ]}
            >
              <Feather name="save" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                {submitting ? "Saving..." : "Save Changes"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FormToast
        visible={toastVisible}
        message="Vehicle updated successfully"
        onHide={() => setToastVisible(false)}
        testID="edit-vehicle-toast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  kbWrap: {
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  numberBadge: {
    backgroundColor: colors.surfaceTertiary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  numberBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },

  notesInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 100,
  },
  notesIcon: {
    marginTop: 2,
    marginRight: spacing.sm,
  },
  notesInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  submitContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.brand,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 56,
    borderRadius: radius.md,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
  },
});
