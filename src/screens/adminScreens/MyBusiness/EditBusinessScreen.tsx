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

import { colors, fontSize, radius, spacing } from "../../../theme";
import type { MoreStackParamList } from "../../../navigation/types";
import { useBusinesses } from "../../../hooks/useBusinesses";

import { FormHeader } from "./components/FormHeader";
import { FormToast } from "./components/FormToast";
import { ModeOptionCard } from "./components/ModeOptionCard";
import { StatusSwitchRow } from "./components/StatusSwitchRow";
import { TypeDisplayCard } from "./components/TypeDisplayCard";
import { BUSINESS_MODE_OPTIONS } from "./data/constants";
import type {
  BusinessFormValues,
  BusinessModeId,
  BusinessStatusId,
} from "./types";

type Nav = NativeStackNavigationProp<MoreStackParamList, "EditBusiness">;
type Rt = RouteProp<MoreStackParamList, "EditBusiness">;

interface FormErrors {
  name?: string;
}

/**
 * Settings → My Business → Edit Business.
 *
 * Mirrors AddBusinessScreen but pre-fills from the existing record and
 * locks the Business Type (changing type would invalidate downstream
 * vehicle / hotel assignments).
 *
 * Status toggle remains editable here so admins can quickly disable or
 * re-enable a business without removing it.
 */
export default function EditBusinessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { businesses, editBusiness, loading } = useBusinesses();

  const businessId = route.params.businessId;
  const existing = useMemo(
    () => businesses.find((b) => b.id === businessId),
    [businesses, businessId],
  );

  const [values, setValues] = useState<BusinessFormValues | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Hydrate the form when the underlying record is loaded.
  useEffect(() => {
    if (existing && !values) {
      setValues({
        name: existing.name,
        type: existing.type,
        mode: existing.mode,
        status: existing.status,
      });
    }
  }, [existing, values]);

  const setName = (next: string) => {
    setValues((v) => (v ? { ...v, name: next } : v));
    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
  };
  const setMode = (next: BusinessModeId) =>
    setValues((v) => (v ? { ...v, mode: next } : v));
  const setStatus = (next: BusinessStatusId) =>
    setValues((v) => (v ? { ...v, status: next } : v));

  const validate = (v: BusinessFormValues): boolean => {
    const next: FormErrors = {};
    if (!v.name.trim()) next.name = "Business name is required.";
    else if (v.name.trim().length < 2)
      next.name = "Business name must be at least 2 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!values || !existing) return;
    if (!validate(values)) return;
    setSubmitting(true);
    try {
      await editBusiness(businessId, {
        name: values.name.trim(),
        type: existing.type, // type is locked on edit
        mode: values.mode,
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
  }, [businessId, editBusiness, existing, navigation, values]);

  const handleCancel = () => {
    navigation.goBack();
  };

  if (loading || !values || !existing) {
    return (
      <View
        style={[
          styles.container,
          styles.centerState,
          { paddingTop: insets.top + spacing.xxl },
        ]}
        testID="edit-business-loading"
      >
        <FormHeader
          title="Edit Business"
          subtitle="Update your business configuration"
          onBack={handleCancel}
          topInset={insets.top}
          testID="edit-business-header"
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
    <View style={styles.container} testID="edit-business-screen">
      <FormHeader
        title="Edit Business"
        subtitle="Update your business configuration"
        onBack={handleCancel}
        topInset={insets.top}
        testID="edit-business-header"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          testID="edit-business-scroll"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.xl + 80,
          }}
        >
          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Business Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                testID="edit-business-name-input"
                value={values.name}
                onChangeText={setName}
                placeholder="Enter business name"
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, errors.name && styles.inputError]}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                maxLength={60}
              />
              {errors.name ? (
                <Text style={styles.errorText} testID="edit-business-name-error">
                  {errors.name}
                </Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Business Type</Text>
              <TypeDisplayCard
                typeId={existing.type}
                testID="edit-business-type-display"
              />
              <Text style={styles.fieldHelper}>
                Type is locked once the business is created.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Business Mode <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.fieldHelper}>
                Choose how employees will select their business assets
              </Text>
              {BUSINESS_MODE_OPTIONS.map((option) => (
                <ModeOptionCard
                  key={option.id}
                  option={option}
                  selected={values.mode === option.id}
                  onSelect={() => setMode(option.id)}
                  testID={`edit-business-mode-${option.id}`}
                />
              ))}
            </View>

            <View style={styles.fieldGroup}>
              <StatusSwitchRow
                value={values.status}
                onChange={setStatus}
                testID="edit-business-status"
              />
            </View>

            <Pressable
              testID="edit-business-submit"
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.primaryButton,
                submitting && styles.primaryButtonDisabled,
                pressed && !submitting && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Saving..." : "Save Changes"}
              </Text>
            </Pressable>

            <Pressable
              testID="edit-business-cancel"
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.ghostButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.ghostButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FormToast
        visible={toastVisible}
        message="Changes saved"
        onHide={() => setToastVisible(false)}
        testID="edit-business-toast"
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
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fieldGroup: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#0B1F3F",
  },
  required: {
    color: colors.error,
  },
  fieldHelper: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  ghostButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  ghostButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
