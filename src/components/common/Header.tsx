import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, radius, spacing, typography, shadows } from "../../theme";
import { useApp } from "../../context/AppContext";
import {
  CartBagIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
} from "./Icons";


interface HeaderProps {
  title?: string;
  subtitle?: string;
  showCart?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showCart = true }) => {
  const {
    scanResult,
    cartItemCount,
    setActiveTab,
    themeMode,
    setThemeMode,
    activeTheme,
    themeColors,
    isApiConsoleOpen,
    setIsApiConsoleOpen,
  } = useApp();

  const barrierScore = scanResult.barrierHealthScore;
  const isOptimal = barrierScore >= 75;
  const isModerate = barrierScore >= 60 && barrierScore < 75;
  const barrierColor = isOptimal
    ? themeColors.emerald
    : isModerate
    ? themeColors.gold
    : themeColors.rose;

  const toggleTheme = () => {
    if (themeMode === "dark") {
      setThemeMode("light");
    } else if (themeMode === "light") {
      setThemeMode("system");
    } else {
      setThemeMode("dark");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.bgPrimary,
          borderBottomColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Left: Brand Monogram & Title */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab("home")}
          style={styles.brandRow}
        >
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor: themeColors.emerald,
              },
            ]}
          >
            <Text style={[styles.logoLetter, { color: themeColors.textPrimary }]}>D</Text>
            <View style={[styles.logoDot, { backgroundColor: themeColors.emerald }]} />
            <Text style={[styles.logoSub, { color: themeColors.emerald }]}>IQ</Text>
          </View>

          <View style={styles.titleColumn}>
            <Text
              style={[
                typography.h2,
                { color: themeColors.textPrimary, fontSize: 17 },
              ]}
              numberOfLines={1}
            >
              {title || "DermisIQ"}
            </Text>
            <Text
              style={[styles.subtitleText, { color: themeColors.emerald }]}
              numberOfLines={1}
            >
              {subtitle || "Clinical Skin Diagnostics"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Right Action Icons: API Telemetry, Theme Toggle, Barrier Pill, Cart */}
        <View style={styles.rightActions}>
          

          {/* Theme Mode Toggle */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleTheme}
            style={[
              styles.actionIconBtn,
              {
                backgroundColor: themeColors.bgCard,
                borderColor: themeColors.border,
              },
            ]}
            accessibilityLabel="Toggle Theme Mode"
          >
            {activeTheme === "dark" ? (
              <SunIcon size={16} color={themeColors.gold} />
            ) : (
              <MoonIcon size={16} color={themeColors.cyan} />
            )}
          </TouchableOpacity>

          {/* Barrier BHI Pill */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("scan")}
            style={[
              styles.barrierBadge,
              {
                backgroundColor: themeColors.bgCard,
                borderColor: barrierColor,
              },
            ]}
          >
            <View style={[styles.pulseDot, { backgroundColor: barrierColor }]} />
            <Text style={[styles.barrierText, { color: barrierColor }]}>
              {barrierScore}
            </Text>
          </TouchableOpacity>

          {/* Cart Icon with Count Badge */}
          {showCart && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab("regimen")}
              style={[
                styles.cartButton,
                {
                  backgroundColor: themeColors.bgCard,
                  borderColor: themeColors.border,
                },
              ]}
              accessibilityLabel="Shopping Cart"
            >
              <CartBagIcon size={17} color={themeColors.textPrimary} />
              {cartItemCount > 0 && (
                <View
                  style={[
                    styles.badgeCount,
                    { backgroundColor: themeColors.emerald },
                  ]}
                >
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 6,
  },
  logoBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  logoLetter: {
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: -0.5,
  },
  logoDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
  logoSub: {
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  titleColumn: {
    flex: 1,
    justifyContent: "center",
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pulseLiveDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  barrierBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1.5,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  barrierText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  cartButton: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeCount: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
});
