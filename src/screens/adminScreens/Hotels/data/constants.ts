/**
 * Hotel module constants and configuration.
 */

export const HOTEL_STORAGE_KEY = "@yalini_hotels_v1";

/** Status options for the filter sheet. */
export const HOTEL_STATUS_OPTIONS: Array<{
  id: "all" | "enabled" | "disabled";
  label: string;
}> = [
  { id: "all", label: "All Status" },
  { id: "enabled", label: "Enabled" },
  { id: "disabled", label: "Disabled" },
];
