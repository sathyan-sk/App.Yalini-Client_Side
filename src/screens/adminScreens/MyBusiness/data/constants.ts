import type { Ionicons } from "@expo/vector-icons";

import type { ToneKey } from "../../../../theme";
import type {
  BusinessModeId,
  BusinessTypeId,
} from "../types";

/**
 * Static metadata that drives the MyBusiness form selectors.
 *
 * Each entry mirrors the visual language defined in the reference design:
 *  - `tone`     → drives icon-tile background + accent (see theme.tones).
 *  - `iconName` → Ionicon rendered inside the tinted tile.
 *  - `label`    → human readable name used on cards + chips.
 *  - `tagLabel` → trailing "<Type> Business" badge on list cards.
 *
 * Pre-defined business catalogue is INTENTIONALLY closed (Taxi + Water Delivery).
 */
export interface BusinessTypeOption {
  id: BusinessTypeId;
  label: string;
  tagLabel: string;
  tone: ToneKey;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  {
    id: "taxi",
    label: "Taxi",
    tagLabel: "Taxi Business",
    tone: "orange",
    iconName: "car-sport",
  },
  {
    id: "water_delivery",
    label: "Water Delivery",
    tagLabel: "Delivery Business",
    tone: "blue",
    iconName: "water",
  },
];

export const BUSINESS_TYPE_MAP: Record<BusinessTypeId, BusinessTypeOption> =
  BUSINESS_TYPE_OPTIONS.reduce(
    (acc, option) => {
      acc[option.id] = option;
      return acc;
    },
    {} as Record<BusinessTypeId, BusinessTypeOption>,
  );

export interface BusinessModeOption {
  id: BusinessModeId;
  title: string;
  description: string;
  tone: ToneKey;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const BUSINESS_MODE_OPTIONS: BusinessModeOption[] = [
  {
    id: "auto",
    title: "Auto (Employee Choice)",
    description:
      "Employees can select their own business assets (Vehicle/Hotel) from available options.",
    tone: "green",
    iconName: "person-circle-outline",
  },
  {
    id: "manual",
    title: "Manual (Admin Assignment)",
    description:
      "Admin will assign business assets (Vehicle/Hotel) to employees by default.",
    tone: "blue",
    iconName: "person-add-outline",
  },
];

/** Deep navy used by the form-screen sticky headers (Add / Edit). Matches design ref. */
export const FORM_HEADER_BG = "#0F1F4D";

/** 
 * Key identifier for the business data (kept for potential future persistence).
 * Note: The app now uses the Mock Service Layer for data management.
 */
export const BUSINESS_STORAGE_KEY = "@yalini/businesses/v1";