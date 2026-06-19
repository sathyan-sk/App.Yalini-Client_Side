/**
 * Login Screen — entry point for all roles (Admin / Driver / Staff).
 *
 * Composition (top → bottom):
 *   1. `LoginHero`             — brand, car illustration and tagline (white).
 *   2. Curved cream container  — \"Welcome!\" + form card with mobile + PIN + CTA.
 *   3. `TricolourStrip`        — saffron / white / green accent line.
 *
 * Behaviour:
 *   - Validates inputs locally (10 digit mobile, 4 digit PIN).
 *   - Calls `useAuthStore.signIn` which hits the mock service.
 *   - On ADMIN  → router routes to AdminNavigator automatically via authStore.
 *   - On DRIVER → blocked here with a toast (module not built yet).
 *   - On STAFF  → blocked here with a toast (module not built yet).
 *
 *   The blocking decision lives next to the screen because RootNavigator
 *   currently has no STAFF/DRIVER navigator wired and we don't want to
 *   leave the user on a blank screen after a successful sign-in.
 */
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "../../../store/authStore";
import { authColors } from "../theme";
import { LoginHero } from "./components/LoginHero";
import { MobileField } from "./components/MobileField";
import { PinField } from "./components/PinField";
import { LoginButton } from "./components/LoginButton";
import { TricolourStrip } from "./components/TricolourStrip";
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

  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);

  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "error") => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  const handleLogin = useCallback(async () => {
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

    // Authenticated. Gate non-Admin roles until their modules ship.
    if (result.role === "DRIVER") {
      // Roll the session back so RootNavigator stays on LoginScreen.
      await signOut();
      showToast("Driver module coming soon", "info");
      return;
    }
    if (result.role === "STAFF") {
      await signOut();
      showToast("Staff module coming soon", "info");
      return;
    }
  }, [mobile, pin, signIn, signOut, showToast]);

  const canSubmit = mobile.length === 10 && pin.length === 4 && !isSubmitting;

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 8 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Brand hero on white */}
          <LoginHero />

          {/* Curved cream container holding welcome + form */}
          <View style={styles.creamShell}>
            <Text style={styles.welcome} testID="login-welcome">
              Welcome!
            </Text>
            <Text style={styles.welcomeSub}>Login to continue to your app</Text>

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

              <View style={styles.hintRow}>
                <Pressable
                  testID="login-fill-admin"
                  onPress={() => {
                    setMobile("7598326133");
                    setPin("0000");
                  }}
                  hitSlop={8}
                  style={styles.hintChip}
                >
                  <Text style={styles.hintText}>Demo Admin</Text>
                </Pressable>
                <Pressable
                  testID="login-fill-driver"
                  onPress={() => {
                    setMobile("9988776655");
                    setPin("1111");
                  }}
                  hitSlop={8}
                  style={styles.hintChip}
                >
                  <Text style={styles.hintText}>Demo Driver</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        <TricolourStrip />
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
    paddingBottom: 24,
  },

  // Cream curved area below hero
  creamShell: {
    backgroundColor: authColors.cream,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -18,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
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
    shadowColor: "#101828",
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

  hintRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
  },
  hintChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: authColors.yellowSoft,
  },
  hintText: {
    fontSize: 12,
    fontWeight: "700",
    color: authColors.heading,
    letterSpacing: 0.2,
  },
});
