import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { useApp } from "../../context/AppContext";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "subtle" | "accentBorder" | "glass";
  accentColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  accentColor,
}) => {
  const { themeColors, activeTheme } = useApp();
  const effectiveAccent = accentColor || themeColors.emerald;

  const getCardStyle = () => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: themeColors.bgElevated,
          borderColor: themeColors.borderLight,
          borderWidth: 1,
          ...shadows.card,
        };
      case "subtle":
        return {
          backgroundColor: themeColors.bgCardSubtle,
          borderColor: themeColors.border,
          borderWidth: 1,
        };
      case "glass":
        return {
          backgroundColor:
            activeTheme === "dark"
              ? "rgba(14, 20, 32, 0.88)"
              : "rgba(255, 255, 255, 0.92)",
          borderColor: themeColors.borderLight,
          borderWidth: 1,
          ...shadows.card,
        };
      case "accentBorder":
        return {
          backgroundColor: themeColors.bgCard,
          borderColor: effectiveAccent,
          borderWidth: 1.5,
          ...shadows.card,
        };
      case "default":
      default:
        return {
          backgroundColor: themeColors.bgCard,
          borderColor: themeColors.border,
          borderWidth: 1,
          ...shadows.card,
        };
    }
  };

  const cStyle = getCardStyle();

  return <View style={[styles.card, cStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
});
