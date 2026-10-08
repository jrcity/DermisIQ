import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText, G, Rect } from "react-native-svg";
import { radius, spacing, shadows } from "../../theme";
import { SkinParameterMetric } from "../../api/youcam/types";
import { useApp } from "../../context/AppContext";

interface FaceRadarVisualizerProps {
  parameters: {
    redness: SkinParameterMetric;
    moisture: SkinParameterMetric;
    spots: SkinParameterMetric;
    texture: SkinParameterMetric;
    pores: SkinParameterMetric;
    radiance: SkinParameterMetric;
  };
  size?: number;
}

export const FaceRadarVisualizer: React.FC<FaceRadarVisualizerProps> = ({
  parameters,
  size = Math.min(340, Dimensions.get("window").width - 48),
}) => {
  const { themeColors } = useApp();
  const [selectedAxisIndex, setSelectedAxisIndex] = useState<number | null>(null);

  const center = size / 2;
  const maxRadius = size / 2 - 42;

  const axes = [
    { label: "Redness", value: parameters.redness.score, metric: parameters.redness },
    { label: "Hydration", value: parameters.moisture.score, metric: parameters.moisture },
    { label: "Spot Clear", value: parameters.spots.score, metric: parameters.spots },
    { label: "Texture", value: parameters.texture.score, metric: parameters.texture },
    { label: "Pore Tight", value: parameters.pores.score, metric: parameters.pores },
    { label: "Radiance", value: parameters.radiance.score, metric: parameters.radiance },
  ];

  const totalAxes = axes.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Calculate coordinates for polygon
  const userPoints = axes
    .map((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (axis.value / 100) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Grid concentric rings at 25%, 50%, 75%, 100%
  const gridRings = [0.25, 0.5, 0.75, 1.0];

  const selectedAxis = selectedAxisIndex !== null ? axes[selectedAxisIndex] : null;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.canvasWrapper,
          {
            width: size,
            height: size,
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
          },
        ]}
      >
        <Svg width={size} height={size}>
          {/* Concentric Capacity Rings */}
          {gridRings.map((scale, idx) => (
            <Circle
              key={`ring-${idx}`}
              cx={center}
              cy={center}
              r={maxRadius * scale}
              fill="none"
              stroke={idx === 3 ? themeColors.borderHighlight : themeColors.border}
              strokeDasharray={idx < 3 ? "4,4" : undefined}
              strokeWidth={idx === 3 ? 1.5 : 1}
            />
          ))}

          {/* Web Axes Lines & Category Labels */}
          {axes.map((axis, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const endX = center + maxRadius * Math.cos(angle);
            const endY = center + maxRadius * Math.sin(angle);
            const labelDist = maxRadius + 24;
            const labelX = center + labelDist * Math.cos(angle);
            const labelY = center + labelDist * Math.sin(angle) + 4;
            const isSelected = selectedAxisIndex === i;

            return (
              <G key={`axis-${i}`}>
                <Line
                  x1={center}
                  y1={center}
                  x2={endX}
                  y2={endY}
                  stroke={isSelected ? themeColors.emerald : themeColors.border}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <SvgText
                  x={labelX}
                  y={labelY - 5}
                  fill={isSelected ? themeColors.emerald : themeColors.textSecondary}
                  fontSize={9.5}
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {axis.label}
                </SvgText>
                <SvgText
                  x={labelX}
                  y={labelY + 8}
                  fill={isSelected ? themeColors.emerald : themeColors.emerald}
                  fontSize={9.5}
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {axis.value} pts
                </SvgText>
              </G>
            );
          })}

          {/* User Diagnostic Metric Polygon */}
          <Polygon
            points={userPoints}
            fill="rgba(16, 185, 129, 0.28)"
            stroke={themeColors.emerald}
            strokeWidth={2.5}
          />

          {/* Interactive Data Point Markers */}
          {axes.map((axis, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = (axis.value / 100) * maxRadius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            const isSelected = selectedAxisIndex === i;
            const ptColor =
              axis.value < 55
                ? themeColors.rose
                : axis.value < 75
                  ? themeColors.gold
                  : themeColors.emerald;

            const valTagY = y - (r > maxRadius * 0.75 ? 18 : 16);
            return (
              <G key={`pt-${i}`}>
                {isSelected && (
                  <Circle
                    cx={x}
                    cy={y}
                    r={11}
                    fill={ptColor}
                    opacity={0.25}
                  />
                )}
                <Circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6.5 : 5}
                  fill={ptColor}
                  stroke={themeColors.bgPrimary}
                  strokeWidth={2}
                />
                {/* 6-Axis Data Point Value Badge */}
                <G>
                  <Rect
                    x={x - 11}
                    y={valTagY - 10}
                    width={22}
                    height={14}
                    rx={7}
                    fill={themeColors.bgCardSubtle}
                    stroke={ptColor}
                    strokeWidth={1}
                  />
                  <SvgText
                    x={x}
                    y={valTagY}
                    fill={ptColor}
                    fontSize={8.5}
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {axis.value}
                  </SvgText>
                </G>
              </G>
            );
          })}
        </Svg>

        {/* Transparent Touchable Overlay for Axis Interaction */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = (axis.value / 100) * maxRadius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);

          return (
            <TouchableOpacity
              key={`touch-radar-${i}`}
              activeOpacity={0.7}
              onPress={() => setSelectedAxisIndex(i === selectedAxisIndex ? null : i)}
              style={[
                styles.radarTouch,
                {
                  left: x - 20,
                  top: y - 20,
                },
              ]}
              accessibilityLabel={`${axis.label}: ${axis.value}/100`}
            />
          );
        })}
      </View>

      {/* Interactive Tooltip Card */}
      {selectedAxis ? (
        <View
          style={[
            styles.tooltipBox,
            {
              backgroundColor: themeColors.bgCardSubtle,
              borderColor: themeColors.borderEmerald,
            },
          ]}
        >
          <View style={styles.tooltipHeader}>
            <Text style={[styles.tooltipTitle, { color: themeColors.textPrimary }]}>
              {selectedAxis.metric.name}
            </Text>
            <View
              style={[
                styles.tooltipScoreBadge,
                { backgroundColor: themeColors.emeraldMuted },
              ]}
            >
              <Text style={[styles.tooltipScore, { color: themeColors.emerald }]}>
                {selectedAxis.value}/100
              </Text>
            </View>
          </View>
          <Text style={[styles.tooltipDesc, { color: themeColors.textSecondary }]}>
            {selectedAxis.metric.description}
          </Text>
          <Text style={[styles.tooltipHint, { color: themeColors.emerald }]}>
            💡 {selectedAxis.metric.recommendationHint}
          </Text>
        </View>
      ) : (
        <Text style={[styles.captionHint, { color: themeColors.textMuted }]}>
          Tap any data node to inspect individual clinical axis metrics.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  canvasWrapper: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
    position: "relative",
    ...shadows.card,
  },
  radarTouch: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tooltipBox: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tooltipTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  tooltipScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  tooltipScore: {
    fontSize: 12,
    fontWeight: "900",
  },
  tooltipDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  tooltipHint: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },
  captionHint: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },
});
