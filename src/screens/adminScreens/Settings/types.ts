import type { Ionicons } from "@expo/vector-icons";

import type { ToneKey } from "../../../theme";
import type { MoreStackParamList } from "../../../navigation/types";

/** Icon descriptor for a settings row. Currently scoped to Ionicons for visual consistency. */
export interface SettingsRowIcon {
  name: keyof typeof Ionicons.glyphMap;
  /** Background tile + icon accent tone (matches src/theme tones). */
  tone: ToneKey;
}

/**
 * Single tappable row in the Settings screen.
 * Each row navigates to a sibling screen inside the More stack.
 */
export interface SettingsRow {
  key: string;
  title: string;
  subtitle: string;
  icon: SettingsRowIcon;
  /** Target screen registered on MoreStackParamList — keeps placeholders type-safe. */
  destination: Exclude<keyof MoreStackParamList, "Settings">;
}

/**
 * Logical grouping used to render the labelled section dividers (\"Business Setup\", \"Account\").
 * Each section owns a coloured accent bar drawn next to the label.
 */
export interface SettingsSection {
  key: string;
  label: string;
  /** Accent bar colour drawn left of the label (e.g. brand blue for setup, red for account). */
  accentColor: string;
  rows: SettingsRow[];
}