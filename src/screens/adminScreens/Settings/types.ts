import type { Ionicons } from "@expo/vector-icons";

import type { ToneKey } from "../../../theme";

/** Icon descriptor for a settings row. Currently scoped to Ionicons for visual consistency. */
export interface SettingsRowIcon {
  name: keyof typeof Ionicons.glyphMap;
  /** Background tile + icon accent tone (matches src/theme tones). */
  tone: ToneKey;
}

/**
 * Tappable Settings destinations.
 * `Employees` jumps to the Employees bottom tab.
 */
export type SettingsRowDestination = "MyBusiness" | "Vehicles" | "Employees" | "Hotels";
/**
 * Single tappable row in the Settings screen.
 */
export interface SettingsRow {
  key: string;
  title: string;
  subtitle: string;
  icon: SettingsRowIcon;
  /** Target shipped screen — all rows resolve to real destinations. */
  destination: SettingsRowDestination;
}

/**
 * Logical grouping used to render the labelled section dividers ("Business Setup", "Account").
 * Each section owns a coloured accent bar drawn next to the label.
 */
export interface SettingsSection {
  key: string;
  label: string;
  /** Accent bar colour drawn left of the label (e.g. brand blue for setup, red for account). */
  accentColor: string;
  rows: SettingsRow[];
}
