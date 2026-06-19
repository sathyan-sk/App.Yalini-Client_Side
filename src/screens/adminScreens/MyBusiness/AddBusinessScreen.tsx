import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../../../theme";
import type { SettingsStackParamList } from "../../../types/navigation";
import { useBusinesses } from "../../../hooks/useBusinesses";

import { FormHeader } from "./components/FormHeader";
import { FormToast } from "./components/FormToast";
import { InfoBanner } from "./components/InfoBanner";
import { ModeOptionCard } from "./components/ModeOptionCard";
import { StatusSwitchRow } from "./components/StatusSwitchRow";
import { TypeSelectorCard } from "./components/TypeSelectorCard";
import { BUSINESS_MODE_OPTIONS, BUSINESS_TYPE_OPTIONS } from "./data/constants";
import type {
  BusinessFormValues,
  BusinessModeId,
  BusinessStatusId,
  BusinessTypeId,
} from "./types";

type Nav = NativeStackNavigationProp<SettingsStackParamList, "AddBusiness">;

interface FormErrors {
  name?: string;
  type?: string;
  mode?: string;
}

/** Initial state of the Add Business form — kept hoisted so we can reset cleanly. */
const INITIAL_VALUES: BusinessFormValues = {
  name: "",
  type: "taxi",
  mode: "auto",
  status: "enabled",
};

/**
 * Settings → My Business → Add Business.
 *
 * Top hero is a sticky deep-navy `FormHeader`. The form body sits in a
 * white rounded card that overlaps the header (-16dp pull-up) to mirror
 * the reference design.
 *
 * Removed (per product spec): Description field.
 * Added  (per product spec): Status toggle (Enabled / Disabled).
 */
export default function AddBusinessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { addBusiness } = useBusinesses();

  const [values, setValues] = useState<BusinessFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const setName = (next: string) => {
    setValues((v) => ({ ...v, name: next }));
    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
  };
  const setType = (next: BusinessTypeId) =>
    setValues((v) => ({ ...v, type: next }));
  const setMode = (next: BusinessModeId) =>
    setValues((v) => ({ ...v, mode: next }));
  const setStatus = (next: BusinessStatusId) =>
    setValues((v) => ({ ...v, status: next }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Business name is required.";
    else if (values.name.trim().length < 2)
      next.name = "Business name must be at least 2 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addBusiness({
        name: values.name.trim(),
        type: values.type,
        mode: values.mode,
        status: values.status,
      });
      setToastVisible(true);
      // Brief delay so the toast appears before navigation.
      setTimeout(() => {
        navigation.goBack();
      }, 400);
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBusiness, navigation, values]);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container} testID="add-business-screen">
      <FormHeader
        title="Add Business"
        subtitle="Create a new business and configure settings"
        onBack={handleCancel}
        topInset={insets.top}
        testID="add-business-header"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          testID="add-business-scroll"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.xl + 80,
          }}
        >
          <View style={styles.formCard}>
            {/* Business name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Business Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                testID="add-business-name-input"
                value={values.name}
                onChangeText={setName}
                placeholder="Enter business name"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.input,
                  errors.name && styles.inputError,
                ]}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                maxLength={60}
              />
              {errors.name ? (
                <Text style={styles.errorText} testID="add-business-name-error">
                  {errors.name}
                </Text>
              ) : null}
            </View>

            {/* Business type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Business Type <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.fieldHelper}>Select the type of business</Text>
              <View style={styles.typeRow}>
                {BUSINESS_TYPE_OPTIONS.map((option) => (
                  <TypeSelectorCard
                    key={option.id}
                    typeId={option.id}
                    selected={values.type === option.id}
                    onSelect={() => setType(option.id)}
                    testID={`add-business-type-${option.id}`}
                  />
                ))}
              </View>
            </View>

            {/* Business mode */}
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
                  testID={`add-business-mode-${option.id}`}
                />
              ))}
              <InfoBanner
                title="How it works?"
                body="You can change this mode anytime from business settings after creating the business."
                testID="add-business-mode-info"
              />
            </View>

            {/* Status toggle (per spec) */}
            <View style={styles.fieldGroup}>
              <StatusSwitchRow
                value={values.status}
                onChange={setStatus}
                testID="add-business-status"
              />
            </View>

            {/* Submit + Cancel */}
            <Pressable
              testID="add-business-submit"
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.primaryButton,
                submitting && styles.primaryButtonDisabled,
                pressed && !submitting && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Saving..." : "Save Business"}
              </Text>
            </Pressable>

            <Pressable
              testID="add-business-cancel"
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
        message="Business saved successfully"
        onHide={() => setToastVisible(false)}
        testID="add-business-toast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
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
    marginBottom: spacing.xs,
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
  typeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
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
