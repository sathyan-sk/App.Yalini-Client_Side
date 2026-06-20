/**
 * Central design tokens for the app - Extended for Daily Records screens.
 * Colors aligned with the design specifications.
 */

export const colors = {
  // Surfaces
  surface: "#FFFFFF",
  surfaceSecondary: "#F7F8FA",
  surfaceTertiary: "#F3F4F6",

  // Text
  textPrimary: "#212121",
  textSecondary: "#757575",
  textTertiary: "#9CA3AF",

  // Brand - Deep Purple as primary
  brand: "#4527A0",
  brandSoft: "#EEF2FF",
  brandLight: "#F5F3FF",

  // Primary Blue
  primaryBlue: "#1E88E5",
  primaryBlueSoft: "#E3F2FD",

  // Header Dark Navy
  headerDark: "#1A237E",

  // Status
  success: "#00C853",
  successDark: "#2E7D32",
  successSoft: "#DCFCE7",
  warning: "#FFAB00",
  warningSoft: "#FFF8E1",
  error: "#C62828",
  errorSoft: "#FFEBEE",
  info: "#1E88E5",
  infoSoft: "#E3F2FD",
    
  // Vehicle Status Colors
  running: "#22C55E",
  runningSoft: "#DCFCE7",
  maintenance: "#F59E0B",
  maintenanceSoft: "#FEF3C7",

  // Tab colors
  tabActive: "#4527A0",
  tabInactive: "#F5F5F5",
  tabTextActive: "#FFFFFF",
  tabTextInactive: "#757575",

  // Borders
  border: "#E5E7EB",
  borderLight: "#F0F1F4",

  // Avatar colors
  avatarBlue: "#1E88E5",
  avatarPurple: "#673AB7",
  avatarGreen: "#00C853",
  avatarOrange: "#F57C00",
  avatarVividPurple: "#6200EA",
  avatarTeal: "#00897B",
  avatarCyan: "#00ACC1",
} as const;

/** Tinted palettes used by stat cards, business icons and tag chips. */
export const tones = {
  purple: { cardBg: "#F5F3FF", iconBg: "#EDE9FE", accent: "#7C3AED" },
  green: { cardBg: "#ECFDF5", iconBg: "#D1FAE5", accent: "#059669" },
  orange: { cardBg: "#FFF7ED", iconBg: "#FFEDD5", accent: "#EA580C" },
  blue: { cardBg: "#EFF6FF", iconBg: "#DBEAFE", accent: "#2563EB" },
  teal: { cardBg: "#F0FDFA", iconBg: "#CCFBF1", accent: "#0D9488" },
  red: { cardBg: "#FEF2F2", iconBg: "#FEE2E2", accent: "#DC2626" },
  cyan: { cardBg: "#ECFEFF", iconBg: "#CFFAFE", accent: "#0891B2" },
} as const;

export type ToneKey = keyof typeof tones;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
} as const;

/** Tier-1 soft shadow used on white cards. */
export const cardShadow = {
  shadowColor: "#101828",
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

/** Lighter shadow for inner cards */
export const lightShadow = {
  shadowColor: "#000000",
  shadowOpacity: 0.03,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;
