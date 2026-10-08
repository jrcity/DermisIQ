import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Header } from "../components/common/Header";
import { useApp } from "../context/AppContext";
import { radius, spacing, shadows } from "../theme";
import {
  SparklesIcon,
  ShieldCheckIcon,
  CheckIcon,
  CameraIcon,
} from "../components/common/Icons";

export const ProfileScreen: React.FC = () => {
  const {
    themeColors,
    themeMode,
    setThemeMode,
    activeTheme,
    userFitzpatrick,
    scanResult,
    setIsLiveScanModalOpen,
    resetOnboarding,
  } = useApp();

  const [strictMelaninProtection, setStrictMelaninProtection] = useState<boolean>(true);
  const [acidBufferingAlerts, setAcidBufferingAlerts] = useState<boolean>(true);

  const handleRecalibrate = () => {
    setIsLiveScanModalOpen(true);
  };

  const handleResetWalkthrough = () => {
    Alert.alert(
      "Reset Onboarding",
      "Do you want to re-launch the initial facial calibration onboarding walkthrough?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetOnboarding();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.screenWrapper, { backgroundColor: themeColors.bgPrimary }]}>
      <Header title="Profile" subtitle="Clinical Identity & Settings" showCart={false} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calibrated Dermal Identity Card */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderEmerald,
            },
          ]}
        >
          <View style={styles.headerBadgeRow}>
            <View style={[styles.statusDot, { backgroundColor: themeColors.emerald }]} />
            <Text style={[styles.caption, { color: themeColors.emerald }]}>
              CALIBRATED BIOMETRIC RECORD
            </Text>
          </View>

          <View style={styles.inferredProfileCard}>
            <View style={styles.inferredProfileTop}>
              <View
                style={[
                  styles.swatchCircleLarge,
                  { backgroundColor: scanResult.shadeHex || "#A26E4F" },
                ]}
              />
              <View style={{ flex: 1 }}>
                <View style={styles.tagConfidenceRow}>
                  <Text style={[styles.inferredTypeBadge, { color: themeColors.textPrimary }]}>
                    {userFitzpatrick} Phototype
                  </Text>
                  <View style={[styles.confidencePill, { backgroundColor: themeColors.emeraldMuted }]}>
                    <Text style={[styles.confidenceBadge, { color: themeColors.emerald }]}>
                      Verified
                    </Text>
                  </View>
                </View>

                <Text style={[styles.inferredUndertoneText, { color: themeColors.emerald }]}>
                  {scanResult.undertone} • Hex {scanResult.shadeHex}
                </Text>
                <Text style={[styles.inferredMelaninIndex, { color: themeColors.textSecondary }]}>
                  Melanin Index: {scanResult.melaninIndex}/100 • Bio Age: {scanResult.skinAge} Yrs
                </Text>
              </View>
            </View>

            {/* Quick Metrics Bar */}
            <View style={[styles.metricsSummaryRow, { backgroundColor: themeColors.bgCardSubtle }]}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>BARRIER (BHI)</Text>
                <Text style={[styles.metricVal, { color: themeColors.emerald }]}>
                  {scanResult.barrierHealthScore}/100
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>FACE SHAPE</Text>
                <Text style={[styles.metricVal, { color: themeColors.textPrimary }]}>
                  {scanResult.faceAttributes?.faceShape || "Balanced"}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: themeColors.textMuted }]}>ERYTHEMA</Text>
                <Text style={[styles.metricVal, { color: themeColors.gold }]}>
                  {scanResult.parameters.redness.score}/100
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRecalibrate}
              style={[
                styles.recalibrateBtn,
                { backgroundColor: themeColors.emerald },
              ]}
            >
              <CameraIcon size={16} color="#FFFFFF" />
              <Text style={styles.recalibrateBtnText}>
                Recalibrate Facial Diagnostics
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Clinical Safety Controls */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.border,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text style={[styles.caption, { color: themeColors.cyan }]}>
            DERMAL SAFETY GATES
          </Text>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Clash Interception Rules
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStrictMelaninProtection(!strictMelaninProtection)}
            style={styles.toggleRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: strictMelaninProtection
                    ? themeColors.emerald
                    : themeColors.bgCardSubtle,
                  borderColor: strictMelaninProtection
                    ? themeColors.emerald
                    : themeColors.borderLight,
                },
              ]}
            >
              {strictMelaninProtection && <CheckIcon size={13} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: themeColors.textPrimary }]}>
                Strict Melanin Protection
              </Text>
              <Text style={[styles.toggleDesc, { color: themeColors.textMuted }]}>
                Automatically block small-molecule chemical peels (e.g. 10% Glycolic) that risk rebound hyperpigmentation.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAcidBufferingAlerts(!acidBufferingAlerts)}
            style={styles.toggleRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: acidBufferingAlerts
                    ? themeColors.emerald
                    : themeColors.bgCardSubtle,
                  borderColor: acidBufferingAlerts
                    ? themeColors.emerald
                    : themeColors.borderLight,
                },
              ]}
            >
              {acidBufferingAlerts && <CheckIcon size={13} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: themeColors.textPrimary }]}>
                Acid Buffering Advisories
              </Text>
              <Text style={[styles.toggleDesc, { color: themeColors.textMuted }]}>
                Mandate physiological ceramide moisture sandwiching whenever active retinoids are introduced.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Theme Appearance Mode */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.border,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text style={[styles.caption, { color: themeColors.textMuted }]}>
            DISPLAY PREFERENCES
          </Text>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Interface Theme
          </Text>
          <Text style={[styles.sectionDesc, { color: themeColors.textSecondary }]}>
            Curated color schemes optimized for clinical clarity and contrast.
          </Text>

          <View style={styles.themeRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setThemeMode("dark")}
              style={[
                styles.themeBtn,
                {
                  backgroundColor: themeColors.bgCardSubtle,
                  borderColor:
                    themeMode === "dark"
                      ? themeColors.emerald
                      : themeColors.borderLight,
                },
              ]}
            >
              <Text style={styles.themeIcon}>🌙</Text>
              <Text style={[styles.themeLabel, { color: themeColors.textPrimary }]}>
                Dark
              </Text>
              <Text style={[styles.themeSub, { color: themeColors.textMuted }]}>
                OLED Clinical
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setThemeMode("light")}
              style={[
                styles.themeBtn,
                {
                  backgroundColor: themeColors.bgCardSubtle,
                  borderColor:
                    themeMode === "light"
                      ? themeColors.emerald
                      : themeColors.borderLight,
                },
              ]}
            >
              <Text style={styles.themeIcon}>☀️</Text>
              <Text style={[styles.themeLabel, { color: themeColors.textPrimary }]}>
                Light
              </Text>
              <Text style={[styles.themeSub, { color: themeColors.textMuted }]}>
                Studio High-Key
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setThemeMode("system")}
              style={[
                styles.themeBtn,
                {
                  backgroundColor: themeColors.bgCardSubtle,
                  borderColor:
                    themeMode === "system"
                      ? themeColors.emerald
                      : themeColors.borderLight,
                },
              ]}
            >
              <Text style={styles.themeIcon}>⚙️</Text>
              <Text style={[styles.themeLabel, { color: themeColors.textPrimary }]}>
                System
              </Text>
              <Text style={[styles.themeSub, { color: themeColors.textMuted }]}>
                Auto {activeTheme}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Confidentiality */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: themeColors.bgCardSubtle,
              borderColor: themeColors.borderLight,
              marginTop: spacing.md,
            },
          ]}
        >
          <View style={styles.securityHeaderRow}>
            <ShieldCheckIcon size={16} color={themeColors.emerald} />
            <Text style={[styles.securityTitle, { color: themeColors.textPrimary }]}>
              Biometric Confidentiality & Protection
            </Text>
          </View>
          <Text style={[styles.securityBody, { color: themeColors.textSecondary }]}>
            All facial diagnostic tensors, melanin indices, and skin topography models are processed with zero persistent facial geometry storage. Calibration records remain encrypted on your device.
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleResetWalkthrough}
            style={[styles.resetBtn, { borderColor: themeColors.border }]}
          >
            <Text style={[styles.resetBtnText, { color: themeColors.textMuted }]}>
              Reset Diagnostic Walkthrough
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 130,
  },
  cardSection: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    ...shadows.card,
  },
  headerBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  caption: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  sectionDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  inferredProfileCard: {
    marginTop: 4,
  },
  inferredProfileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  swatchCircleLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  tagConfidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inferredTypeBadge: {
    fontSize: 15,
    fontWeight: "900",
  },
  confidencePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  confidenceBadge: {
    fontSize: 10,
    fontWeight: "800",
  },
  inferredUndertoneText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  inferredMelaninIndex: {
    fontSize: 11,
    marginTop: 2,
  },
  metricsSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: 12,
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },
  recalibrateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.lg,
    marginTop: 14,
    ...shadows.glowEmerald,
  },
  recalibrateBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  toggleDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  themeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  themeIcon: {
    fontSize: 18,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  themeSub: {
    fontSize: 9,
    fontWeight: "600",
  },
  securityHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  securityBody: {
    fontSize: 11,
    lineHeight: 16,
  },
  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
