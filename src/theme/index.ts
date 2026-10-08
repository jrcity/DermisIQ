import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export type ThemeMode = "dark" | "light" | "system";

export const darkColors = {
  // Deep Luxury Clinical Palette
  bgPrimary: "#070A10",      // Obsidian Black
  bgCard: "#0E1420",         // Deep Midnight Slate
  bgCardSubtle: "#141D2E",   // Clinical Navy Surface
  bgElevated: "#1B273D",     // High Elevation Card
  bgGlass: "rgba(14, 20, 32, 0.88)",
  inputBg: "#111827",

  textPrimary: "#FFFFFF",
  textSecondary: "#9EABC0",
  textMuted: "#62738D",
  textInverse: "#070A10",

  // Clinical Semantic & Brand Colors
  emerald: "#10B981",
  emeraldLight: "#34D399",
  emeraldMuted: "rgba(16, 185, 129, 0.15)",
  emeraldGlow: "rgba(16, 185, 129, 0.35)",

  gold: "#F59E0B",
  goldLight: "#FBBF24",
  goldMuted: "rgba(245, 158, 11, 0.15)",

  cyan: "#06B6D4",
  cyanLight: "#22D3EE",
  cyanMuted: "rgba(6, 182, 212, 0.15)",

  rose: "#EF4444",
  roseLight: "#F87171",
  roseMuted: "rgba(239, 68, 68, 0.15)",

  violet: "#8B5CF6",
  violetMuted: "rgba(139, 92, 246, 0.15)",

  // Clinical Barrier Threshold Semantics
  barrierOptimal: "#10B981",
  barrierModerate: "#F59E0B",
  barrierCompromised: "#EF4444",

  // Borders & Accents
  border: "#1E2A3E",
  borderLight: "#2A3A54",
  borderHighlight: "#3B4E70",
  borderEmerald: "rgba(16, 185, 129, 0.4)",
  borderGold: "rgba(245, 158, 11, 0.4)",
  borderRose: "rgba(239, 68, 68, 0.4)",

  // Fitzpatrick Phototype Skin Tones
  fitzpatrick: {
    type1: "#FCE4D6", // Very Fair
    type2: "#F3C5A8", // Fair
    type3: "#D7A276", // Medium
    type4: "#A26E4F", // Olive / South Asian
    type5: "#7A492C", // Brown / Dark Brown
    type6: "#4A2B19", // Deep Melanin
  },

  transparent: "transparent",
};

export const lightColors = {
  // Pure Clean Medical Clinical Palette
  bgPrimary: "#F4F6F9",      // Clean Soft White
  bgCard: "#FFFFFF",         // Crisp Pure White
  bgCardSubtle: "#EAEFF5",   // Soft Cool Gray
  bgElevated: "#FFFFFF",     // Elevated Card
  bgGlass: "rgba(255, 255, 255, 0.92)",
  inputBg: "#F1F5F9",

  textPrimary: "#0F172A",    // Deep Slate
  textSecondary: "#475569",  // Muted Slate
  textMuted: "#64748B",      // Subtle Gray
  textInverse: "#FFFFFF",

  // Clinical Semantic & Brand Colors
  emerald: "#059669",
  emeraldLight: "#10B981",
  emeraldMuted: "rgba(5, 150, 105, 0.12)",
  emeraldGlow: "rgba(5, 150, 105, 0.25)",

  gold: "#D97706",
  goldLight: "#F59E0B",
  goldMuted: "rgba(217, 119, 6, 0.12)",

  cyan: "#0891B2",
  cyanLight: "#06B6D4",
  cyanMuted: "rgba(8, 145, 178, 0.12)",

  rose: "#DC2626",
  roseLight: "#EF4444",
  roseMuted: "rgba(220, 38, 38, 0.12)",

  violet: "#7C3AED",
  violetMuted: "rgba(124, 58, 237, 0.12)",

  // Clinical Barrier Threshold Semantics
  barrierOptimal: "#059669",
  barrierModerate: "#D97706",
  barrierCompromised: "#DC2626",

  // Borders & Accents
  border: "#CBD5E1",
  borderLight: "#E2E8F0",
  borderHighlight: "#94A3B8",
  borderEmerald: "rgba(5, 150, 105, 0.4)",
  borderGold: "rgba(217, 119, 6, 0.4)",
  borderRose: "rgba(220, 38, 38, 0.4)",

  // Fitzpatrick Phototype Skin Tones
  fitzpatrick: {
    type1: "#FCE4D6",
    type2: "#F3C5A8",
    type3: "#D7A276",
    type4: "#A26E4F",
    type5: "#7A492C",
    type6: "#4A2B19",
  },

  transparent: "transparent",
};

// Default backwards-compatible colors object (dark)
export const colors = darkColors;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 19,
    fontWeight: "700" as const,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 13,
    fontWeight: "400" as const,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  bodyBold: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  caption: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  tag: {
    fontSize: 10,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
};

export const shadows = {
  glowEmerald: {
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  glowCyan: {
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  glowGold: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const layout = {
  windowWidth: width,
  windowHeight: height,
  isSmallDevice: width < 375,
};
