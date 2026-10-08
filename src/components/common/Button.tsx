import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { radius, typography, shadows } from "../../theme";
import { useApp } from "../../context/AppContext";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
  fullWidth = false,
}) => {
  const { themeColors } = useApp();

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          btn: {
            backgroundColor: themeColors.bgElevated,
            borderColor: themeColors.borderLight,
            borderWidth: 1,
          },
          text: { color: themeColors.textPrimary },
          loaderColor: themeColors.textPrimary,
        };
      case "danger":
        return {
          btn: {
            backgroundColor: themeColors.rose,
            borderColor: themeColors.rose,
            borderWidth: 1,
          },
          text: { color: "#FFFFFF" },
          loaderColor: "#FFFFFF",
        };
      case "outline":
        return {
          btn: {
            backgroundColor: "transparent",
            borderColor: themeColors.emerald,
            borderWidth: 1.5,
          },
          text: { color: themeColors.emerald },
          loaderColor: themeColors.emerald,
        };
      case "ghost":
        return {
          btn: { backgroundColor: "transparent", borderWidth: 0 },
          text: { color: themeColors.cyan },
          loaderColor: themeColors.cyan,
        };
      case "gold":
        return {
          btn: {
            backgroundColor: themeColors.gold,
            borderColor: themeColors.gold,
            borderWidth: 1,
          },
          text: { color: "#000000", fontWeight: "800" as const },
          loaderColor: "#000000",
        };
      case "primary":
      default:
        return {
          btn: {
            backgroundColor: themeColors.emerald,
            borderColor: themeColors.emerald,
            borderWidth: 1,
          },
          text: { color: "#FFFFFF", fontWeight: "800" as const },
          loaderColor: "#FFFFFF",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingVertical: 7,
          paddingHorizontal: 12,
          fontSize: 12,
          borderRadius: radius.sm,
        };
      case "lg":
        return {
          paddingVertical: 15,
          paddingHorizontal: 22,
          fontSize: 16,
          borderRadius: radius.lg,
        };
      case "md":
      default:
        return {
          paddingVertical: 11,
          paddingHorizontal: 16,
          fontSize: 14,
          borderRadius: radius.md,
        };
    }
  };

  const vStyle = getVariantStyles();
  const sStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        vStyle.btn,
        {
          paddingVertical: sStyle.paddingVertical,
          paddingHorizontal: sStyle.paddingHorizontal,
          borderRadius: sStyle.borderRadius,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vStyle.loaderColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              vStyle.text,
              { fontSize: sStyle.fontSize },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  disabled: {
    opacity: 0.45,
  },
});
