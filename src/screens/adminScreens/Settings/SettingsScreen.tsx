import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../../../theme";
import type { SettingsStackParamList } from "../../../types/navigation";

import { SettingsHeader } from "./components/SettingsHeader";
import { SettingsSectionLabel } from "./components/SettingsSectionLabel";
import { SettingsRowCard } from "./components/SettingsRowCard";
import { LogoutConfirmSheet } from "./components/LogoutConfirmSheet";
import { ACCOUNT_SECTION, SETTINGS_SECTIONS } from "./data/settingsItems";
import { SettingsRow } from "./types";

/** Reserve room for the floating bottom tab bar (matches DashboardScreen). */
const TAB_BAR_CLEARANCE = 72;

type SettingsNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "SettingsHome"
>;

/**
 * Admin → Settings tab.
 *
 * Renders the page header, the "Business Setup" section of navigable cards
 * and the "Account" section containing the Logout entry (which opens a
 * confirmation bottom sheet before resolving).
 *
 * Every row routes to a shipped screen: My Business and Vehicles open inside
 * the Settings stack, while Employees jumps to the Employees bottom tab
 * (resolved up the navigator tree).
 */
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsNavigationProp>();
  const [logoutSheetVisible, setLogoutSheetVisible] = useState(false);

  const handleRowPress = useCallback(
    (destination: SettingsRow["destination"]) => {
      // `Employees` is a sibling bottom tab, not part of this stack — React
      // Navigation resolves it up the navigator tree, so the cast is safe.
      navigation.navigate(destination as never);
    },
    [navigation],
  );

  const handleLogoutPress = useCallback(() => {
    setLogoutSheetVisible(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutSheetVisible(false);
    // Real sign-out is owned by the auth slice — left as a placeholder
    // for the UI-only milestone, intentionally kept as a console log so
    // the dev wiring is discoverable in the next pass.
    // eslint-disable-next-line no-console
    console.log("[settings] logout confirmed");
  }, []);

  const handleLogoutCancel = useCallback(() => {
    setLogoutSheetVisible(false);
  }, []);

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      testID="settings-screen"
    >
      <ScrollView
        testID="settings-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + spacing.lg,
        }}
      >
        <SettingsHeader
          title="Settings"
          subtitle="Admin Panel"
          description="Manage your business, team, assets and assignments from one place."
          testID="settings-header"
        />

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.key} testID={`settings-section-${section.key}`}>
            <SettingsSectionLabel
              label={section.label}
              accentColor={section.accentColor}
              testID={`settings-section-label-${section.key}`}
            />
            {section.rows.map((row) => (
              <SettingsRowCard
                key={row.key}
                title={row.title}
                subtitle={row.subtitle}
                icon={row.icon}
                onPress={() => handleRowPress(row.destination)}
                testID={`settings-row-${row.key}`}
              />
            ))}
          </View>
        ))}

        <SettingsSectionLabel
          label={ACCOUNT_SECTION.label}
          accentColor={ACCOUNT_SECTION.accentColor}
          testID={`settings-section-label-${ACCOUNT_SECTION.key}`}
        />
        <SettingsRowCard
          title="Logout"
          subtitle="Sign out from this account"
          icon={{ name: "log-out-outline", tone: "red" }}
          destructive
          onPress={handleLogoutPress}
          testID="settings-row-logout"
        />
      </ScrollView>

      <LogoutConfirmSheet
        visible={logoutSheetVisible}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
});
