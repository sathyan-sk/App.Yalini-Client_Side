import type { BusinessTypeDefinition, BusinessTypeId } from "../types";

/**
 * Static catalogue of business types supported by the app.
 *
 * Only two are supported today: Taxi and Water. The selector on the
 * Add Business screen renders one card per entry in this list, so
 * adding a new business type is a single-line change here plus the
 * matching `BusinessTypeId` literal in `../types`.
 */
export const BUSINESS_TYPES: BusinessTypeDefinition[] = [
  {
    id: "taxi",
    label: "Taxi",
    assetNoun: "vehicles",
    icon: "car",
    iconBg: "#FFEAD5",
    iconColor: "#F59E0B",
    tagBg: "#FFEAD5",
  },
  {
    id: "water",
    label: "Water",
    assetNoun: "delivery routes",
    icon: "water",
    iconBg: "#E0E7FF",
    iconColor: "#4F46E5",
    tagBg: "#E0E7FF",
  },
];

/** Default selection when the form first opens — keeps the UI determinate. */
export const DEFAULT_BUSINESS_TYPE: BusinessTypeId = "taxi";

/** Lookup helper used by the list + edit screens to render the type's chrome. */
export function getBusinessType(id: BusinessTypeId): BusinessTypeDefinition {
  const found = BUSINESS_TYPES.find((entry) => entry.id === id);
  if (!found) {
    // Falls back to the first entry to keep the UI from blanking out if a
    // legacy record is loaded from storage with an unknown type.
    return BUSINESS_TYPES[0];
  }
  return found;
}