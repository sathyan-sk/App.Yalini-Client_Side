/**
 * Theme tokens specific to the Login / Auth surface.
 *
 * The shipped admin theme (`src/theme/index.ts`) is purple-led. The brand
 * login surface follows the marketing palette in the design spec —
 * amber/yellow CTA + navy headings on a soft cream curve. Keeping these
 * tokens isolated avoids polluting the in-app theme that the rest of the
 * app reads.
 */

export const authColors = {
  // Brand
  yellow: "#FFB400",
  yellowSoft: "#FFEDB3",
  yellowBorder: "#FCC419",
  yellowDeep: "#F5A700",

  // Curved cream area below the hero
  cream: "#FFF4D6",
  creamSoft: "#FFFBEC",

  // Hero backdrop
  heroBg: "#FFFFFF",
  cityTint: "#D9D2F9",

  // Text
  heading: "#0B1F3F",
  body: "#3F4A66",
  muted: "#8893A8",
  pinDash: "#6A7290",

  // Field
  fieldBg: "#FFFFFF",
  fieldBorder: "#FFC107",
  fieldBorderSoft: "#F1F2F6",
  fieldShadow: "#101828",

  // Login button
  ctaFrom: "#FFC44A",
  ctaTo: "#FFA722",
  ctaText: "#FFFFFF",

  // Tricolour strip
  saffron: "#FF9933",
  white: "#FFFFFF",
  green: "#138808",

  // Error
  error: "#C62828",
  errorSoft: "#FFEBEE",
} as const;