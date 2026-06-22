/**
 * AddTripScreen - Screen to add a new trip in Driver module
 * Allows driver to enter trip details: From, To, Amount, Payment Mode
 * Follows the design specifications with pixel-perfect implementation
 * Now connected to tripStore for real data management
 */

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors, spacing } from "../../../theme";
import {
  AddTripHeader,
  ServiceInfoCard,
  TripDetailsForm,
  InfoNote,
} from "../AddTrip/components";
import { useTripStore } from "../../../store/tripStore";
import type { TripFormData, PaymentMode, TripType } from "../../../types/driver";
import type { DriverTabParamList, AllTripsStackParamList } from "../../../types/navigation";

const BACKGROUND_COLOR = colors.surfaceSecondary;

// Navigation type for AddTrip screen
type AddTripNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<DriverTabParamList, 'AddTrip'>,
  NativeStackNavigationProp<AllTripsStackParamList>
>;

export default function AddTripScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AddTripNavigationProp>();

  // Get session and addTrip action from store
  const { session, addTrip } = useTripStore();

  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    tripType: "vendor",
    from: "",
    to: "",
    amount: "",
    paymentMode: "cash",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handlers
    const handleTripTypeChange = useCallback((type: TripType) => {
    setFormData((prev) => ({ ...prev, tripType: type }));
  }, []);

  const handleFromChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, from: value }));
  }, []);

  const handleToChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, to: value }));
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({ ...prev, amount: sanitized }));
  }, []);

  const handlePaymentModeChange = useCallback((mode: PaymentMode) => {
    setFormData((prev) => ({ ...prev, paymentMode: mode }));
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleHelpPress = useCallback(() => {
    Alert.alert(
      "Help",
      "Enter your trip details including pickup location, drop location, fare amount, and payment method. Click Save Trip to record your trip."
    );
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      tripType: "vendor",
      from: "",
      to: "",
      amount: "",
      paymentMode: "cash",
    });
  }, []);

  const handleSaveTrip = useCallback(async () => {
    // Validation
    if (!formData.from.trim()) {
      Alert.alert("Error", "Please enter pickup location");
      return;
    }
    if (!formData.to.trim()) {
      Alert.alert("Error", "Please enter drop location");
      return;
    }
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save trip to store and get the new trip ID
      const newTripId = addTrip({
        tripType: formData.tripType,
        from: formData.from.trim(),
        to: formData.to.trim(),
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
      });

      // Reset form
      resetForm();

      // Show success with options
      Alert.alert(
        "Trip Saved!",
        "Would you like to add expenses for this trip or continue?",
        [
          {
            text: "Add Expense",
            onPress: () => {
              // Navigate to AllTripsStack and then to AddExpenseForTrip
              navigation.navigate("AllTripsStack", {
                screen: "AddExpenseForTrip",
                params: { tripId: newTripId, mode: "add" },
              } as any);
            },
          },
          {
            text: "View All Trips",
            onPress: () => {
              navigation.navigate("AllTripsStack");
            },
          },
          {
            text: "Add Another Trip",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, addTrip, navigation, resetForm]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <AddTripHeader
          onBackPress={handleBackPress}
          onHelpPress={handleHelpPress}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 }, // Extra padding for tab bar
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Service Info Card - Use session data from store */}
          <ServiceInfoCard
            serviceName={session.serviceName}
            driverName={session.driverName}
            vehicleNumber={session.vehicleNumber}
            sessionStatus={session.sessionStatus}
            sessionDate={session.sessionDate}
            sessionTime={session.sessionTime}
          />

          {/* Trip Details Form */}
          <TripDetailsForm
            formData={formData}
            onTripTypeChange={handleTripTypeChange}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
            onAmountChange={handleAmountChange}
            onPaymentModeChange={handlePaymentModeChange}
            onSaveTrip={handleSaveTrip}
            isSubmitting={isSubmitting}
          />

          {/* Info Note */}
          <InfoNote />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
