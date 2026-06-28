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
import { Ionicons, Feather } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing, cardShadow } from "../../../theme";
import { useHotels } from "../../../hooks/useHotels";
import type { HotelFormValues, HotelStatusId } from "./types";

import { FormHeader } from "./components/FormHeader";
import { FormToast } from "./components/FormToast";
import { StatusSelector } from "./components/StatusSelector";

type HotelsStackParamList = {
  AllHotels: undefined;
  AddHotel: undefined;
  EditHotel: { hotelId: string };
};

type Nav = NativeStackNavigationProp<HotelsStackParamList, "AddHotel">;

interface FormErrors {
  name?: string;
  ratePerCan?: string;
}

const INITIAL_VALUES: HotelFormValues = {
  name: "",
  ratePerCan: 0,
  status: "enabled",
  location: "",
  address: "",
};

/**
 * Add Hotel Screen
 *
 * Form to add a new hotel with:
 *   - Hotel Information section (Name, Rate per Can)
 *   - Save Hotel button
 */
export default function AddHotelScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { addHotel } = useHotels();

  const [values, setValues] = useState<HotelFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const setName = (next: string) => {
    setValues((v) => ({ ...v, name: next }));
    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
  };

  const setLocation = (next: string) => {
    setValues((v) => ({ ...v, location: next }));
  };

  const setAddress = (next: string) => {
    setValues((v) => ({ ...v, address: next }));
  };

  const setRatePerCan = (next: string) => {
    const numValue = parseInt(next.replace(/[^0-9]/g, ""), 10) || 0;
    setValues((v) => ({ ...v, ratePerCan: numValue }));
    if (errors.ratePerCan) setErrors((e) => ({ ...e, ratePerCan: undefined }));
  };

  const setStatus = (next: HotelStatusId) =>
    setValues((v) => ({ ...v, status: next }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Hotel name is required.";
    else if (values.name.trim().length < 2)
      next.name = "Hotel name must be at least 2 characters.";

    if (values.ratePerCan <= 0) next.ratePerCan = "Rate per can is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addHotel({
        name: values.name.trim(),
        ratePerCan: values.ratePerCan,
        status: values.status,
        location: values.location?.trim() || undefined,
        address: values.address?.trim() || undefined,
      });
      setToastVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 400);
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addHotel, navigation, values]);

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container} testID="add-hotel-screen">
      <FormHeader
        title="Add Hotel"
        subtitle="Add a new hotel to manage"
        onBack={handleCancel}
        topInset={insets.top}
        testID="add-hotel-header"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kbWrap}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          testID="add-hotel-scroll"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.xl + 80,
          }}
        >
          {/* Hotel Information Section */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="business" size={24} color={colors.brand} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Hotel Information</Text>
                <Text style={styles.sectionSubtitle}>
                  Enter basic details of the hotel
                </Text>
              </View>
            </View>

            {/* Hotel Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Hotel Name <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.name && styles.inputError,
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={colors.textTertiary}
                />
                <TextInput
                  testID="add-hotel-name-input"
                  value={values.name}
                  onChangeText={setName}
                  placeholder="Enter hotel name"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={50}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText} testID="add-hotel-name-error">
                  {errors.name}
                </Text>
              ) : null}
            </View>

            {/* Hotel Location */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Hotel Location
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.textTertiary}
                />
                <TextInput
                  testID="add-hotel-location-input"
                  value={values.location || ""}
                  onChangeText={setLocation}
                  placeholder="Enter hotel location (e.g., Chennai, Tamil Nadu)"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={100}
                />
              </View>
            </View>

            {/* Hotel Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Hotel Address
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="map-outline"
                  size={20}
                  color={colors.textTertiary}
                />
                <TextInput
                  testID="add-hotel-address-input"
                  value={values.address || ""}
                  onChangeText={setAddress}
                  placeholder="Enter full address for delivery"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={200}
                />
              </View>
            </View>
            
            {/* Rate per Can */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Rate per Can (₹) <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.ratePerCan && styles.inputError,
                ]}
              >
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  testID="add-hotel-rate-input"
                  value={values.ratePerCan > 0 ? values.ratePerCan.toString() : ""}
                  onChangeText={setRatePerCan}
                  placeholder="Enter rate per can"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={6}
                />
              </View>
              {errors.ratePerCan ? (
                <Text style={styles.errorText} testID="add-hotel-rate-error">
                  {errors.ratePerCan}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Hotel Status Section */}
          <View style={styles.formCard}>
            <StatusSelector
              value={values.status}
              onChange={setStatus}
              testID="add-hotel-status"
            />
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <Pressable
              testID="add-hotel-submit"
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
                {submitting ? "Saving..." : "Save Hotel"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FormToast
        visible={toastVisible}
        message="Hotel saved successfully"
        onHide={() => setToastVisible(false)}
        testID="add-hotel-toast"
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
  rupeeSymbol: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textTertiary,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
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
