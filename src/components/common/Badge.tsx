import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { radius, typography } from "../../theme";
import { useApp } from "../../context/AppContext";

interface BadgeProps {
  label: string;
  variant?: "emerald" | "cyan" | "amber" | "rose" | "violet" | "neutral" | "gold";
  size?: "sm" | "md";
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  size = "sm",
  showDot = false,
}) => {
  const { themeColors } = useApp();

  const getBadgeStyle = () => {
    switch (variant) {
      case "emerald":
        return { bg: themeColors.emeraldMuted, text: themeColors.emerald, border: themeColors.emerald };
      case "cyan":
        return { bg: themeColors.cyanMuted, text: themeColors.cyan, border: themeColors.cyan };
      case "amber":
      case "gold":
        return { bg: themeColors.goldMuted, text: themeColors.gold, border: themeColors.gold };
      case "rose":
        return { bg: themeColors.roseMuted, text: themeColors.rose, border: themeColors.rose };
      case "violet":
        return { bg: themeColors.violetMuted, text: themeColors.violet, border: themeColors.violet };
      default:
        return { bg: themeColors.bgElevated, text: themeColors.textSecondary, border: themeColors.borderLight };
    }
  };

  const style = getBadgeStyle();
  const isSm = size === "sm";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: style.bg,
          borderColor: style.border,
          paddingVertical: isSm ? 2.5 : 4.5,
          paddingHorizontal: isSm ? 7 : 10,
        },
      ]}
    >
      {showDot && (
        <View style={[styles.dot, { backgroundColor: style.text }]} />
      )}
      <Text
        style={[
          typography.caption,
          {
            color: style.text,
            fontWeight: "800",
            fontSize: isSm ? 10 : 11,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
  },
});
