import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { SkinParameterMetric } from "../../api/youcam/types";
import { ChevronRightIcon, SparklesIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface MetricPillProps {
  metric: SkinParameterMetric;
}

export const MetricPill: React.FC<MetricPillProps> = ({ metric }) => {
  const { themeColors } = useApp();
  const [expanded, setExpanded] = useState(false);

  const getColor = (score: number) => {
    if (score < 55) return themeColors.rose;
    if (score < 75) return themeColors.gold;
    return themeColors.emerald;
  };

  const color = getColor(metric.score);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "barrier": return "Barrier Health";
      case "pigmentation": return "Pigmentation";
      case "texture": return "Surface Texture";
      case "aging": return "Dermal Elasticity";
      default: return category;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setExpanded(prev => !prev)}
      style={[
        styles.card,
        {
          backgroundColor: expanded ? themeColors.bgCardSubtle : themeColors.bgCard,
          borderColor: expanded ? color : themeColors.borderLight,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${metric.name}, score ${metric.score} out of 100`}
    >
      <View style={styles.headerRow}>
        <View style={styles.leftCol}>
          <View style={styles.nameRow}>
            <View style={[styles.indicatorDot, { backgroundColor: color }]} />
            <Text style={[styles.name, { color: themeColors.textPrimary }]}>{metric.name}</Text>
          </View>
          <View style={styles.tagRow}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: themeColors.bgElevated,
                  borderColor: themeColors.borderLight,
                },
              ]}
            >
              <Text style={[styles.categoryText, { color: themeColors.textSecondary }]}>
                {getCategoryLabel(metric.category)}
              </Text>
            </View>
            <Text style={[styles.severityText, { color }]}>
              {metric.severity.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreValue, { color }]}>{metric.score}</Text>
            <Text style={[styles.scoreScale, { color: themeColors.textMuted }]}>/100</Text>
          </View>
          <View style={[styles.chevronWrapper, expanded && styles.chevronRotated]}>
            <ChevronRightIcon size={16} color={themeColors.textMuted} />
          </View>
        </View>
      </View>

      {/* Progress Track */}
      <View style={[styles.track, { backgroundColor: themeColors.bgCardSubtle }]}>
        <View style={[styles.fill, { width: `${metric.score}%`, backgroundColor: color }]} />
      </View>

      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: themeColors.borderLight }]}>
          <Text style={[styles.descriptionText, { color: themeColors.textSecondary }]}>
            {metric.description}
          </Text>
          <View
            style={[
              styles.hintCard,
              {
                backgroundColor: themeColors.emeraldMuted,
                borderColor: themeColors.borderEmerald,
              },
            ]}
          >
            <View style={styles.hintHeader}>
              <SparklesIcon size={15} color={themeColors.emerald} />
              <Text style={[styles.hintTitle, { color: themeColors.emerald }]}>
                CLINICAL PROTOCOL RECOMMENDATION
              </Text>
            </View>
            <Text style={[styles.hintBody, { color: themeColors.textPrimary }]}>
              {metric.recommendationHint}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm + 4,
    marginVertical: 5,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftCol: {
    flex: 1,
    marginRight: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  severityText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  rightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  scoreScale: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 2,
  },
  chevronWrapper: {
    padding: 2,
  },
  chevronRotated: {
    transform: [{ rotate: "90deg" }],
  },
  track: {
    height: 5,
    borderRadius: radius.full,
    marginTop: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.full,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 18,
  },
  hintCard: {
    marginTop: 10,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
  },
  hintHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  hintTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  hintBody: {
    fontSize: 12,
    lineHeight: 17,
  },
});
