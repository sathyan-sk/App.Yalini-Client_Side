import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../theme";
import type { EmployeesStackParamList } from "../../../types/navigation";
import { useEmployees } from "../../../hooks/useEmployees";
import { useBusinesses } from "../../../hooks/useBusinesses";

import { EmployeeFormHeader } from "./components/EmployeeFormHeader";
import { FormToast } from "./components/FormToast";
import { BusinessSelectorCard } from "./components/BusinessSelectorCard";
import { PinInput } from "./components/PinInput";
import { EmployeeStatusSwitch } from "./components/EmployeeStatusSwitch";
import type { EmployeeFormValues } from "./types";

type Nav = NativeStackNavigationProp<EmployeesStackParamList, "EditEmployee">;
type Rt = RouteProp<EmployeesStackParamList, "EditEmployee">;

interface FormErrors {
  fullName?: string;
  mobile?: string;
  businessId?: string;
  pin?: string;
  confirmPin?: string;
}

/**
 * Edit Employee screen.
 *
 * Pre-fills data from existing employee record.
 * PIN fields are optional on edit (leave blank to keep existing).
 */
export default function EditEmployeeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { employees, editEmployee, loading } = useEmployees();
  const { businesses } = useBusinesses();

  const employeeId = route.params.employeeId;
  const existing = useMemo(
    () => employees.find((e) => e.id === employeeId),
    [employees, employeeId],
  );

  const activeBusinesses = businesses.filter((b) => b.status === "active");

  const [values, setValues] = useState<EmployeeFormValues | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Hydrate the form when the underlying record is loaded.
  useEffect(() => {
    if (existing && !values) {
      setValues({
        fullName: existing.fullName,
        mobile: existing.mobile,
        businessId: existing.businessId,
        pin: "",
        confirmPin: "",
        status: existing.status,
      });
    }
  }, [existing, values]);

  const setField = <K extends keyof EmployeeFormValues>(
    key: K,
    value: EmployeeFormValues[K]
  ) => {
    setValues((v) => (v ? { ...v, [key]: value } : v));
    if (errors[key as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const validate = (v: EmployeeFormValues): boolean => {
    const next: FormErrors = {};

    if (!v.fullName.trim()) {
      next.fullName = "Full name is required.";
    } else if (v.fullName.trim().length < 2) {
      next.fullName = "Name must be at least 2 characters.";
    }

    const cleanMobile = v.mobile.replace(/\D/g, "");
    if (!cleanMobile) {
      next.mobile = "Mobile number is required.";
    } else if (cleanMobile.length !== 10) {
      next.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!v.businessId) {
      next.businessId = "Please select a business.";
    }

    // PIN is optional on edit - only validate if provided
    if (v.pin || v.confirmPin) {
      if (v.pin && v.pin.length !== 4) {
        next.pin = "PIN must be exactly 4 digits.";
      }
      if (v.pin !== v.confirmPin) {
        next.confirmPin = "PINs do not match.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!values || !existing) return;
    if (!validate(values)) return;
    setSubmitting(true);
    try {
      await editEmployee(employeeId, {
        fullName: values.fullName.trim(),
        mobile: values.mobile.replace(/\D/g, ""),
        businessId: values.businessId,
        pin: values.pin || existing.pin, // Keep existing if not changed
        confirmPin: values.confirmPin,
        status: values.status,
      });
      setToastVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 400);
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editEmployee, employeeId, existing, navigation, values]);

  const handleCancel = () => {
    navigation.goBack();
  };

  if (loading || !values || !existing) {
    return (
      <View
        style={[styles.container, styles.centerState]}
        testID="edit-employee-loading"
      >
        <EmployeeFormHeader
          title="Edit Employee"
          subtitle="Update employee information"
          onBack={handleCancel}
          topInset={insets.top}
          testID="edit-employee-header"
        />
        <ActivityIndicator
          size="large"
          color={colors.brand}
          style={{ marginTop: spacing.xxl }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="edit-employee-screen">
      <EmployeeFormHeader
        title="Edit Employee"
        subtitle="Update employee information"
        onBack={handleCancel}
        onHelp={() => {}}
        topInset={insets.top}
        testID="edit-employee-header"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          testID="edit-employee-scroll"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.xl + 80,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
          }}
        >
          {/* Personal Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="person-outline" size={20} color={colors.brand} />
              </View>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={[styles.inputRow, errors.fullName && styles.inputRowError]}>
                <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
                <TextInput
                  testID="edit-employee-name-input"
                  value={values.fullName}
                  onChangeText={(text) => setField("fullName", text)}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <View style={[styles.inputRow, errors.mobile && styles.inputRowError]}>
                <Ionicons name="call-outline" size={20} color={colors.textTertiary} />
                <TextInput
                  testID="edit-employee-mobile-input"
                  value={values.mobile}
                  onChangeText={(text) => setField("mobile", text)}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
              {errors.mobile ? (
                <Text style={styles.errorText}>{errors.mobile}</Text>
              ) : null}
            </View>
          </View>

          {/* Business Assignment Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="briefcase-outline" size={20} color={colors.brand} />
              </View>
              <Text style={styles.sectionTitle}>Business Assignment</Text>
            </View>

            <Text style={styles.fieldLabel}>Select Business</Text>
            {errors.businessId ? (
              <Text style={styles.errorText}>{errors.businessId}</Text>
            ) : null}

            {activeBusinesses.map((business) => (
              <BusinessSelectorCard
                key={business.id}
                business={business}
                selected={values.businessId === business.id}
                onSelect={() => setField("businessId", business.id)}
                testID={`edit-employee-business-${business.id}`}
              />
            ))}
          </View>

          {/* Login & Security Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.brand} />
              </View>
              <Text style={styles.sectionTitle}>Login & Security</Text>
            </View>

            <Text style={styles.helperText}>
              Leave PIN fields empty to keep the existing PIN.
            </Text>

            <PinInput
              value={values.pin}
              onChange={(pin) => setField("pin", pin)}
              label="New 4-Digit PIN"
              placeholder="Enter new 4-digit PIN"
              error={errors.pin}
              testID="edit-employee-pin-input"
            />

            <PinInput
              value={values.confirmPin}
              onChange={(pin) => setField("confirmPin", pin)}
              label="Confirm New PIN"
              placeholder="Re-enter new 4-digit PIN"
              error={errors.confirmPin}
              testID="edit-employee-confirm-pin-input"
            />
          </View>

          {/* Access Status Section */}
          <EmployeeStatusSwitch
            value={values.status}
            onChange={(status) => setField("status", status)}
            testID="edit-employee-status"
          />

          {/* Submit Button */}
          <Pressable
            testID="edit-employee-submit"
            onPress={handleSubmit}
            disabled={submitting}
            style={({ pressed }) => [
              styles.primaryButton,
              submitting && styles.primaryButtonDisabled,
              pressed && !submitting && styles.pressed,
            ]}
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>
              {submitting ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <FormToast
        visible={toastVisible}
        message="Employee updated successfully"
        onHide={() => setToastVisible(false)}
        testID="edit-employee-toast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  centerState: {
    alignItems: "stretch",
  },
  kbWrap: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  helperText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "#4F46E5",
    minHeight: 56,
    borderRadius: radius.md,
    marginTop: spacing.md,
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
