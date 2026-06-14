import type { SettingsSection } from "../types";

/**
 * Static blueprint of the Settings screen.
 *
 * Source of truth for what each row looks like + where it navigates to.
 * Keeping it as data (not JSX) lets the screen stay declarative and makes
 * future locale/feature-flag wiring trivial.
 *
 * Colours follow the design tones registered in `src/theme/index.ts`.
 */
export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    key: "business-setup",
    label: "BUSINESS SETUP",
    accentColor: "#2563EB",
    rows: [
      {
        key: "my-business",
        title: "My Business",
        subtitle: "View and manage business details",
        icon: { name: "storefront-outline", tone: "blue" },
        destination: "MyBusiness",
      },
      {
        key: "employees",
        title: "Employees",
        subtitle: "Add, view and manage employees",
        icon: { name: "people-outline", tone: "green" },
        destination: "EmployeesAdmin",
      },
      {
        key: "vehicles",
        title: "Vehicles",
        subtitle: "Add, view and manage vehicles",
        icon: { name: "car-outline", tone: "purple" },
        destination: "Vehicles",
      },
      {
        key: "hotels",
        title: "Hotels",
        subtitle: "Add, view and manage hotels",
        icon: { name: "business-outline", tone: "orange" },
        destination: "Hotels",
      },
      {
        key: "assign-assets",
        title: "Assign Assets",
        subtitle: "Assign vehicles to drivers and hotels to staff",
        icon: { name: "swap-horizontal-outline", tone: "teal" },
        destination: "AssignAssets",
      },
    ],
  },
];

/** Account section is rendered separately because Logout has bespoke styling + a confirm flow. */
export const ACCOUNT_SECTION = {
  key: "account",
  label: "ACCOUNT",
  accentColor: "#DC2626",
} as const;
