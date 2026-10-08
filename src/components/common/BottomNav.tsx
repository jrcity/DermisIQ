import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { useApp } from "../../context/AppContext";
import {
  HomeIcon,
  ScanIcon,
  MolecularIcon,
  CartBagIcon,
  ProfileIcon,
} from "./Icons";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartItemCount, evaluation, themeColors, activeTheme } = useApp();

  const hasCriticalClash = evaluation.alerts.some(a => a.severity === "CRITICAL");

  const TABS = [
    { id: "home" as const, label: "Home", Icon: HomeIcon },
    { id: "scan" as const, label: "Diagnostics", Icon: ScanIcon },
    {
      id: "clash" as const,
      label: "Clash AI",
      Icon: MolecularIcon,
      badge: hasCriticalClash ? "!" : undefined,
      badgeColor: themeColors.rose,
    },
    {
      id: "regimen" as const,
      label: "Store",
      Icon: CartBagIcon,
      badge: cartItemCount > 0 ? String(cartItemCount) : undefined,
      badgeColor: themeColors.emerald,
    },
    { id: "profile" as const, label: "Profile", Icon: ProfileIcon },
  ];

  const isDark = activeTheme === "dark";
  const navBg = isDark ? "rgba(14, 20, 32, 0.96)" : "rgba(255, 255, 255, 0.96)";

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: navBg,
            borderColor: themeColors.border,
          },
        ]}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const { Icon } = tab;

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.iconContainer}>
                <Icon
                  size={20}
                  color={isActive ? themeColors.emerald : themeColors.textMuted}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.badge && (
                  <View
                    style={[
                      styles.tabBadge,
                      { backgroundColor: tab.badgeColor || themeColors.emerald },
                    ]}
                  >
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isActive ? themeColors.emerald : themeColors.textMuted },
                  isActive && styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: themeColors.emerald },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: Platform.OS === "ios" ? 18 : 10,
    zIndex: 999,
  },
  navBar: {
    flexDirection: "row",
    borderRadius: radius.xl,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
    ...shadows.card,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 2,
    position: "relative",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelActive: {
    fontWeight: "800",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});
