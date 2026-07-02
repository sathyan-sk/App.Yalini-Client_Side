/**
 * Login Screen — entry point for all roles (Admin / Driver / Staff).
 *
 * Composition (top → bottom):
 *   1. `LoginHero`             — brand, car illustration and tagline (white).
 *   2. Curved cream container  — "Welcome!" + form card with mobile + PIN + CTA.
 *   3. `TricolourStrip`        — saffron / white / green accent line.
 *
 * Behaviour:
 *   - Validates inputs locally (10 digit mobile, 4 digit PIN).
 *   - Calls `useAuthStore.signIn` which hits the mock service.
 *   - On ADMIN  → router routes to AdminNavigator automatically via authStore.
 *   - On DRIVER → router routes to DriverNavigator automatically via authStore.
 *   - On STAFF  → router routes to StaffNavigator automatically via authStore.
 */
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "../../../store/authStore";
import { authColors } from "../theme";
import { LoginHero } from "./components/LoginHero";
import { MobileField } from "./components/MobileField";
import { PinField } from "./components/PinField";
import { LoginButton } from "./components/LoginButton";
import { LoginToast } from "./components/LoginToast";

type ToastTone = "error" | "info" | "success";

interface ToastState {
  message: string;
  tone: ToastTone;
  // Bumped on every show so the same message can re-trigger the animation.
  key: number;
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const signIn = useAuthStore((s) => s.signIn);

  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "error") => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  const handleLogin = useCallback(async () => {
        // Dismiss keyboard before validation
    Keyboard.dismiss();
    // Local validation
    if (mobile.length !== 10) {
      showToast("Enter a valid 10-digit mobile number", "error");
      return;
    }
    if (pin.length !== 4) {
      showToast("Enter your 4-digit passcode", "error");
      return;
    }

    const result = await signIn({ mobile, pin });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    // All roles (ADMIN, DRIVER, STAFF) are now supported
    // RootNavigator will automatically route to the correct module based on role
  }, [mobile, pin, signIn, showToast]);

  const canSubmit = mobile.length === 10 && pin.length === 4 && !isSubmitting;

    // Calculate minimum content height to ensure scrolling works properly
  const minContentHeight = screenHeight - insets.top - insets.bottom;

  return (
    <View style={styles.root} testID="login-screen">
      <StatusBar style="dark" />

      {toast && (
        <LoginToast
          key={toast.key}
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            {/* Brand hero on white - static, not scrollable */}
            <LoginHero />

            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                {
                  minHeight: minContentHeight - 300,
                },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              alwaysBounceVertical={true}
              contentInsetAdjustmentBehavior="automatic"
            >
              {/* Curved cream container holding welcome + form */}
              <View style={styles.creamShell}>
                <Text style={styles.welcome} testID="login-welcome">
                  Welcome!
                </Text>
                <Text style={styles.welcomeSub}>Login to the app</Text>

                <View style={styles.formCard} testID="login-form-card">
                  <MobileField
                    value={mobile}
                    onChangeText={setMobile}
                    editable={!isSubmitting}
                  />

                  <View style={styles.fieldGap} />

                  <PinField
                    value={pin}
                    onChangeText={setPin}
                    editable={!isSubmitting}
                    onSubmitEditing={canSubmit ? handleLogin : undefined}
                  />

                  <View style={styles.ctaWrap}>
                    <LoginButton
                      onPress={handleLogin}
                      loading={isSubmitting}
                      disabled={!canSubmit && !isSubmitting}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: authColors.heroBg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Cream curved area below hero
  creamShell: {
    backgroundColor: authColors.cream,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    paddingTop: 8,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
  },
  welcome: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
    color: authColors.heading,
    letterSpacing: 0.2,
  },
  welcomeSub: {
    textAlign: "center",
    fontSize: 14,
    color: authColors.body,
    marginTop: 6,
    marginBottom: 18,
  },

  // White form card inside cream area
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    shadowColor: "#262810",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  fieldGap: {
    height: 18,
  },
  ctaWrap: {
    marginTop: 22,
  },

});
