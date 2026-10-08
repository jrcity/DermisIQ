import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { radius, spacing, typography, shadows } from "../../theme";
import { RegimenSafetyEvaluation } from "../../api/clashEngine/engine";
import { ShieldCheckIcon, ShieldAlertIcon, SparklesIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface ClashAlertBannerProps {
  evaluation: RegimenSafetyEvaluation;
}

export const ClashAlertBanner: React.FC<ClashAlertBannerProps> = ({ evaluation }) => {
  const { themeColors } = useApp();
  const isSafe = evaluation.isSafeToApply;
  const score = evaluation.overallSafetyScore;

  const scoreColor =
    score >= 80 ? themeColors.emerald : score >= 60 ? themeColors.gold : themeColors.rose;

  const scoreBadgeBg =
    score >= 80 ? themeColors.emeraldMuted : score >= 60 ? themeColors.goldMuted : themeColors.roseMuted;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.bgCard,
          borderColor: isSafe ? themeColors.borderEmerald : themeColors.borderRose,
        },
      ]}
    >
      {/* Top Header Row with Score & Safety Status */}
      <View style={styles.topRow}>
        <View style={styles.scoreBlock}>
          <Text style={[styles.scoreLabel, { color: themeColors.textSecondary }]}>
            REGIMEN MOLECULAR SAFETY
          </Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
            <Text style={[styles.scoreMax, { color: themeColors.textMuted }]}>/100</Text>
          </View>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: scoreBadgeBg, borderColor: scoreColor },
          ]}
        >
          {isSafe ? (
            <ShieldCheckIcon size={14} color={scoreColor} />
          ) : (
            <ShieldAlertIcon size={14} color={scoreColor} />
          )}
          <Text style={[styles.badgeText, { color: scoreColor }]}>
            {isSafe ? "BARRIER SAFE" : "HAZARDOUS CLASH"}
          </Text>
        </View>
      </View>

      {/* Barrier Readiness Explanation */}
      <View
        style={[
          styles.summaryBox,
          {
            backgroundColor: themeColors.bgCardSubtle,
            borderColor: themeColors.borderLight,
          },
        ]}
      >
        <Text style={[styles.summaryText, { color: themeColors.textSecondary }]}>
          {evaluation.barrierReadinessSummary}
        </Text>
      </View>

      {/* Alerts Breakdown */}
      {evaluation.alerts.map(alert => {
        const alertColor =
          alert.severity === "CRITICAL"
            ? themeColors.rose
            : alert.severity === "WARNING"
            ? themeColors.gold
            : themeColors.emerald;

        const alertBg =
          alert.severity === "CRITICAL"
            ? themeColors.roseMuted
            : alert.severity === "WARNING"
            ? themeColors.goldMuted
            : themeColors.emeraldMuted;

        return (
          <View
            key={alert.id}
            style={[
              styles.alertCard,
              { backgroundColor: alertBg, borderColor: alertColor },
            ]}
          >
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleRow}>
                {alert.severity === "SAFE" ? (
                  <ShieldCheckIcon size={16} color={alertColor} />
                ) : (
                  <ShieldAlertIcon size={16} color={alertColor} />
                )}
                <Text style={[styles.alertTitle, { color: alertColor }]} numberOfLines={1}>
                  {alert.title}
                </Text>
              </View>
              <View style={[styles.severityPill, { borderColor: alertColor }]}>
                <Text style={[styles.severityPillText, { color: alertColor }]}>
                  {alert.severity}
                </Text>
              </View>
            </View>

            <Text style={[styles.alertDetail, { color: themeColors.textPrimary }]}>
              {alert.detail}
            </Text>

            {alert.molecularReason && (
              <View
                style={[
                  styles.molecularBox,
                  { backgroundColor: themeColors.bgCardSubtle },
                ]}
              >
                <Text style={[styles.molecularLabel, { color: themeColors.textMuted }]}>
                  MOLECULAR MECHANISM:
                </Text>
                <Text style={[styles.molecularText, { color: themeColors.textSecondary }]}>
                  {alert.molecularReason}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.protocolBox,
                { backgroundColor: themeColors.cyanMuted },
              ]}
            >
              <Text style={[styles.protocolText, { color: themeColors.cyan }]}>
                💡 <Text style={styles.protocolBold}>Clinical Remedy:</Text> {alert.remedyAction}
              </Text>
            </View>

            {alert.saferAlternative && (
              <View
                style={[
                  styles.swapBox,
                  { backgroundColor: themeColors.emeraldMuted },
                ]}
              >
                <SparklesIcon size={14} color={themeColors.emerald} />
                <Text style={[styles.swapText, { color: themeColors.emerald }]}>
                  Melanin-Safe Alternative: <Text style={styles.swapBold}>{alert.saferAlternative}</Text>
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    borderWidth: 1.5,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  scoreBlock: {
    justifyContent: "center",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "900",
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 3,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1.5,
    gap: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  summaryBox: {
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  alertCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm + 4,
    marginTop: spacing.sm,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "800",
    flexShrink: 1,
  },
  severityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  severityPillText: {
    fontSize: 9,
    fontWeight: "900",
  },
  alertDetail: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
  },
  molecularBox: {
    padding: 6,
    borderRadius: radius.sm,
    marginTop: 6,
  },
  molecularLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  molecularText: {
    fontSize: 11,
    lineHeight: 15,
  },
  protocolBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: radius.sm,
  },
  protocolText: {
    fontSize: 11,
    lineHeight: 16,
  },
  protocolBold: {
    fontWeight: "800",
  },
  swapBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    padding: 8,
    borderRadius: radius.sm,
  },
  swapText: {
    fontSize: 11,
    flexShrink: 1,
  },
  swapBold: {
    fontWeight: "800",
  },
});
