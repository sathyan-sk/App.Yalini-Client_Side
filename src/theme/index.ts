/**
 * Central design tokens for the app.
 * Source of truth: /app/design_guidelines.json
 */

export const colors = {
  // Surfaces
  surface: "#FFFFFF",
  surfaceSecondary: "#F7F8FA",
  surfaceTertiary: "#F3F4F6",

  // Text
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#9CA3AF",

  // Brand
  brand: "#4F46E5",
  brandSoft: "#EEF2FF",

  // Status
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#EA580C",
  warningSoft: "#FFEDD5",
  error: "#DC2626",
  info: "#2563EB",

  // Borders
  border: "#E5E7EB",
  borderLight: "#F0F1F4",
} as const;

/** Tinted palettes used by stat cards, business icons and tag chips. */
export const tones = {
  purple: { cardBg: "#F5F3FF", iconBg: "#EDE9FE", accent: "#7C3AED" },
  green: { cardBg: "#ECFDF5", iconBg: "#D1FAE5", accent: "#059669" },
  orange: { cardBg: "#FFF7ED", iconBg: "#FFEDD5", accent: "#EA580C" },
  blue: { cardBg: "#EFF6FF", iconBg: "#DBEAFE", accent: "#2563EB" },
  teal: { cardBg: "#F0FDFA", iconBg: "#CCFBF1", accent: "#0D9488" },
  red: { cardBg: "#FEF2F2", iconBg: "#FEE2E2", accent: "#DC2626" },  
} as const;

export type ToneKey = keyof typeof tones;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Tier-1 soft shadow used on white cards. */
export const cardShadow = {
  shadowColor: "#101828",
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
