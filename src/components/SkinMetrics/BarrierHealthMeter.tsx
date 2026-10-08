import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { ShieldCheckIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface BarrierHealthMeterProps {
  score: number; // 0 - 100
  skinAge?: number;
  fitzpatrick?: string;
  undertone?: string;
}

export const BarrierHealthMeter: React.FC<BarrierHealthMeterProps> = ({
  score,
  skinAge = 25,
  fitzpatrick = "Type IV",
  undertone = "Warm Golden",
}) => {
  const { themeColors } = useApp();
  const [showFormula, setShowFormula] = useState(false);

  const isOptimal = score >= 75;
  const isModerate = score >= 60 && score < 75;
  const isVulnerable = score < 60;

  const barColor = isOptimal ? themeColors.emerald : isModerate ? themeColors.gold : themeColors.rose;
  const statusLabel = isOptimal
    ? "Resilient & Fortified"
    : isModerate
    ? "Moderate Resilience"
    : "Compromised / Reactive";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.bgCard,
          borderColor: themeColors.borderLight,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.scoreBlock}>
          <View style={styles.titleRow}>
            <ShieldCheckIcon size={16} color={themeColors.textSecondary} />
            <Text style={[styles.labelText, { color: themeColors.textSecondary }]}>
              STRATUM CORNEUM BARRIER INDEX
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: barColor }]}>{score}</Text>
            <Text style={[styles.scoreMax, { color: themeColors.textMuted }]}>/100</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${barColor}1F`, borderColor: barColor },
            ]}
          >
            <View style={[styles.pulseDot, { backgroundColor: barColor }]} />
            <Text style={[styles.statusText, { color: barColor }]}>
              {statusLabel}
            </Text>
          </View>
          <Text style={[styles.skinAgeText, { color: themeColors.textMuted }]}>
            Biological Skin Age: <Text style={[styles.skinAgeHighlight, { color: themeColors.textPrimary }]}>{skinAge} yrs</Text>
          </Text>
        </View>
      </View>

      {/* Progress Bar Gauge */}
      <View style={[styles.barTrack, { backgroundColor: themeColors.bgCardSubtle }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(100, Math.max(6, score))}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      {/* Interactive Formula Toggle Link */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowFormula(prev => !prev)}
        style={styles.formulaToggle}
      >
        <Text style={[styles.formulaToggleText, { color: themeColors.cyan }]}>
          {showFormula ? "▲ Hide Clinical Formula" : "ℹ️ How BHI is computed (Harmonic Integration)"}
        </Text>
      </TouchableOpacity>

      {showFormula && (
        <View
          style={[
            styles.formulaBox,
            {
              backgroundColor: themeColors.bgCardSubtle,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Text style={[styles.formulaTitle, { color: themeColors.cyan }]}>
            Clinical Formula: Harmonic Integration
          </Text>
          <Text style={[styles.formulaCode, { color: themeColors.textPrimary }]}>
            BHI = (Erythema Redness Score × 0.60) + (Stratum Hydration × 0.40)
          </Text>
          <Text style={[styles.formulaDetail, { color: themeColors.textSecondary }]}>
            When BHI &lt; 60, small-molecule acids (Glycolic) & pure Retinoids trigger microvascular flare-ups and rebound PIH on melanin-rich skin.
          </Text>
        </View>
      )}

      {/* Diagnostic Metadata Footer */}
      <View
        style={[
          styles.footerRow,
          {
            backgroundColor: themeColors.bgCardSubtle,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: themeColors.textMuted }]}>Melanin Scale</Text>
          <Text style={[styles.metaValue, { color: themeColors.textPrimary }]}>{fitzpatrick}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: themeColors.textMuted }]}>Tone Profile</Text>
          <Text style={[styles.metaValue, { color: themeColors.textPrimary }]}>{undertone}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: themeColors.textMuted }]}>Active Tolerance</Text>
          <Text style={[styles.metaValue, { color: barColor }]}>
            {isVulnerable ? "Restricted" : isModerate ? "Buffered" : "Full"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 8,
  },
  scoreBlock: {
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  skinAgeText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "right",
  },
  skinAgeHighlight: {
    fontWeight: "700",
  },
  barTrack: {
    height: 9,
    borderRadius: radius.full,
    overflow: "hidden",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  barFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  formulaToggle: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    marginBottom: 6,
  },
  formulaToggleText: {
    fontSize: 11,
    fontWeight: "600",
  },
  formulaBox: {
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  formulaTitle: {
    fontSize: 11,
    fontWeight: "700",
  },
  formulaCode: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
    marginVertical: 4,
  },
  formulaDetail: {
    fontSize: 11,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
  },
  metaItem: {
    alignItems: "center",
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    marginBottom: 3,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  metaValue: {
    fontSize: 11,
    fontWeight: "800",
  },
  divider: {
    width: 1,
    height: 20,
  },
});
