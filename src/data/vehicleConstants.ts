import type { Ionicons } from "@expo/vector-icons";
import type { ToneKey } from "../theme";
import type { VehicleStatusId } from "../types/vehicle";

/**
 * Static metadata that drives the Vehicle form and list displays.
 */

export interface VehicleStatusOption {
  id: VehicleStatusId;
  label: string;
  description: string;
  tone: ToneKey;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const VEHICLE_STATUS_OPTIONS: VehicleStatusOption[] = [
  {
    id: "enabled",
    label: "enabled",
    description: "Vehicle is enabled and available for service",
    tone: "green",
    iconName: "car-sport",
  },
  {
    id: "disabled",
    label: "disabled",
    description: "Vehicle is disabled and not available for service",
    tone: "red",
    iconName: "car-sport",
  },
];

export const VEHICLE_STATUS_MAP: Record<VehicleStatusId, VehicleStatusOption> =
  VEHICLE_STATUS_OPTIONS.reduce(
    (acc, option) => {
      acc[option.id] = option;
      return acc;
    },
    {} as Record<VehicleStatusId, VehicleStatusOption>,
  );

/** Deep navy used by the form-screen sticky headers (Add / Edit). Matches design ref. */
export const FORM_HEADER_BG = "#0F1F4D";

/** AsyncStorage key for the persisted vehicle list (versioned for safe migrations). */
export const VEHICLE_STORAGE_KEY = "@yalini/vehicles/v1";
