import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Svg, { Ellipse, Circle, Path, G } from "react-native-svg";
import { radius, spacing, typography, shadows } from "../../theme";
import { FacialZoneIssue } from "../../api/youcam/types";
import { SparklesIcon, ChevronRightIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface ZoneHeatmapProps {
  zones: FacialZoneIssue[];
  selectedZone: FacialZoneIssue | null;
  onSelectZone: (zone: FacialZoneIssue) => void;
  shadeHex?: string;
  onNavigateToClash?: () => void;
}

export const ZoneHeatmap: React.FC<ZoneHeatmapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  shadeHex = "#A26E4F",
  onNavigateToClash,
}) => {
  const { capturedFaceImage, themeColors, scanResult } = useApp();
  const [renderMode, setRenderMode] = useState<"photo" | "masks" | "mesh">("photo");
  const [selectedMask, setSelectedMask] = useState<
    "acne" | "redness" | "texture" | "pore" | "age_spot" | "wrinkle" | "moisture"
  >("redness");
  const [isMaskEnabled, setIsMaskEnabled] = useState(true);

  const width = 290;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2;

  const maskUrls = scanResult.maskOverlayUrls;
  const activeMaskUrl = maskUrls ? maskUrls[selectedMask] : undefined;

  const maskOptions: {
    key: "acne" | "redness" | "texture" | "pore" | "age_spot" | "wrinkle" | "moisture";
    label: string;
    score: number;
    color: string;
  }[] = [
    { key: "redness", label: "Redness", score: scanResult.parameters.redness.score, color: themeColors.rose },
    { key: "acne", label: "Acne", score: 91, color: themeColors.rose },
    { key: "age_spot", label: "PIH Spots", score: scanResult.parameters.spots.score, color: themeColors.gold },
    { key: "texture", label: "Texture", score: scanResult.parameters.texture.score, color: themeColors.cyan },
    { key: "pore", label: "Pores", score: scanResult.parameters.pores.score, color: themeColors.cyan },
    { key: "wrinkle", label: "Lines", score: scanResult.parameters.wrinkles.score, color: themeColors.gold },
    { key: "moisture", label: "Moisture", score: scanResult.parameters.moisture.score, color: themeColors.emerald },
  ];

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 70) return themeColors.rose;
    if (intensity >= 45) return themeColors.gold;
    return themeColors.emerald;
  };

  return (
    <View style={styles.container}>
      {/* 3-Way Mode Switcher: Photo Overlay vs YouCam Masks vs Anatomical Mesh */}
      <View
        style={[
          styles.modeToggle,
          {
            backgroundColor: themeColors.bgCardSubtle,
            borderColor: themeColors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setRenderMode("photo")}
          style={[
            styles.modeBtn,
            renderMode === "photo" && {
              backgroundColor: themeColors.bgElevated,
              ...shadows.card,
            },
          ]}
        >
          <Text
            style={[
              styles.modeBtnText,
              {
                color:
                  renderMode === "photo"
                    ? themeColors.textPrimary
                    : themeColors.textMuted,
              },
            ]}
          >
            📸 Face Pins
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setRenderMode("masks")}
          style={[
            styles.modeBtn,
            renderMode === "masks" && {
              backgroundColor: themeColors.bgElevated,
              ...shadows.card,
            },
          ]}
        >
          <Text
            style={[
              styles.modeBtnText,
              {
                color:
                  renderMode === "masks"
                    ? themeColors.emerald
                    : themeColors.textMuted,
              },
            ]}
          >
            🎭 Dermal Mask
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setRenderMode("mesh")}
          style={[
            styles.modeBtn,
            renderMode === "mesh" && {
              backgroundColor: themeColors.bgElevated,
              ...shadows.card,
            },
          ]}
        >
          <Text
            style={[
              styles.modeBtnText,
              {
                color:
                  renderMode === "mesh"
                    ? themeColors.textPrimary
                    : themeColors.textMuted,
              },
            ]}
          >
            📐 Mesh
          </Text>
        </TouchableOpacity>
      </View>

      {/* When in YouCam Mask Mode: Selector Strip + Mask Toggle */}
      {renderMode === "masks" && (
        <View
          style={[
            styles.maskControlCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderEmerald,
            },
          ]}
        >
          <View style={styles.maskControlHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <SparklesIcon size={14} color={themeColors.emerald} />
              <Text style={[styles.maskControlTitle, { color: themeColors.emerald }]}>
                NEURAL MASK PREVIEW
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsMaskEnabled(!isMaskEnabled)}
              style={[
                styles.maskToggleBtn,
                {
                  backgroundColor: isMaskEnabled
                    ? themeColors.emerald
                    : themeColors.bgCardSubtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.maskToggleText,
                  { color: isMaskEnabled ? "#FFFFFF" : themeColors.textMuted },
                ]}
              >
                {isMaskEnabled ? "Mask ON" : "Mask OFF"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.maskPillsRow}>
            {maskOptions.map(opt => {
              const isSelected = selectedMask === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  activeOpacity={0.8}
                  onPress={() => setSelectedMask(opt.key)}
                  style={[
                    styles.maskPill,
                    {
                      backgroundColor: isSelected
                        ? themeColors.bgElevated
                        : themeColors.bgCardSubtle,
                      borderColor: isSelected ? opt.color : themeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.maskPillText,
                      {
                        color: isSelected ? opt.color : themeColors.textSecondary,
                        fontWeight: isSelected ? "800" : "600",
                      },
                    ]}
                  >
                    {opt.label} ({opt.score})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Canvas Wrapper */}
      <View
        style={[
          styles.canvasWrapper,
          {
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
          },
        ]}
      >
        {/* Real Face Photo when in Photo or Masks Mode */}
        {renderMode !== "mesh" && (
          <Image
            source={capturedFaceImage}
            style={styles.facePhoto}
            resizeMode="cover"
          />
        )}

        {/* Real YouCam Neural Mask Overlay Image */}
        {renderMode === "masks" && isMaskEnabled && activeMaskUrl && (
          <Image
            source={{ uri: activeMaskUrl }}
            style={[styles.facePhoto, { opacity: 0.75 }]}
            resizeMode="cover"
          />
        )}

        {/* Semi-transparent tint overlay for contrast */}
        {renderMode === "photo" && <View style={styles.darkVignette} />}

        {/* SVG Pins / Anatomical Mesh Layer */}
        <Svg width={width} height={height}>
          {renderMode === "mesh" && (
            <>
              {/* Facial Tone Radial Aura */}
              <Ellipse
                cx={centerX}
                cy={centerY}
                rx={100}
                ry={135}
                fill={shadeHex}
                opacity={0.08}
              />

              {/* Primary Stylized Facial Oval Contour */}
              <Ellipse
                cx={centerX}
                cy={centerY}
                rx={92}
                ry={130}
                fill="none"
                stroke={themeColors.borderHighlight}
                strokeWidth={1.5}
                strokeDasharray="6,4"
              />

              {/* Eyebrow & Orbital Guides */}
              <Ellipse
                cx={centerX - 42}
                cy={centerY - 25}
                rx={20}
                ry={10}
                fill="none"
                stroke={themeColors.border}
                strokeWidth={1}
              />
              <Ellipse
                cx={centerX + 42}
                cy={centerY - 25}
                rx={20}
                ry={10}
                fill="none"
                stroke={themeColors.border}
                strokeWidth={1}
              />

              {/* Nose Bridge Guide */}
              <Path
                d={`M ${centerX} ${centerY - 20} L ${centerX - 6} ${centerY + 18} L ${centerX + 6} ${centerY + 18}`}
                fill="none"
                stroke={themeColors.border}
                strokeWidth={1.2}
              />

              {/* Lips Contour Guide */}
              <Ellipse
                cx={centerX}
                cy={centerY + 55}
                rx={24}
                ry={9}
                fill="none"
                stroke={themeColors.border}
                strokeWidth={1}
              />
            </>
          )}

          {/* Interactive Diagnostic Zone Hotspots (in Photo & Mesh modes) */}
          {renderMode !== "masks" &&
            zones.map((zone, idx) => {
              const posX = zone.coordinates.x * width;
              const posY = zone.coordinates.y * height;
              const isSelected = selectedZone?.zone === zone.zone;
              const color = getIntensityColor(zone.intensity);

              return (
                <G key={`zone-node-${idx}`}>
                  {/* Outer pulse aura */}
                  <Circle
                    cx={posX}
                    cy={posY}
                    r={isSelected ? 22 : 14}
                    fill={color}
                    opacity={isSelected ? 0.35 : 0.18}
                  />

                  {/* Node core */}
                  <Circle
                    cx={posX}
                    cy={posY}
                    r={isSelected ? 8 : 6}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                </G>
              );
            })}
        </Svg>

        {/* Touchable Overlay for Zone Hotspots */}
        {renderMode !== "masks" &&
          zones.map((zone, idx) => {
            const posX = zone.coordinates.x * width;
            const posY = zone.coordinates.y * height;

            return (
              <TouchableOpacity
                key={`touch-${idx}`}
                activeOpacity={0.7}
                onPress={() => onSelectZone(zone)}
                style={[
                  styles.touchTarget,
                  {
                    left: posX - 22,
                    top: posY - 22,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${zone.zone}: ${zone.dominantIssue}`}
              />
            );
          })}
      </View>

      {/* Selected Zone Deep Dive Card */}
      {selectedZone ? (
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: getIntensityColor(selectedZone.intensity),
            },
          ]}
        >
          <View style={styles.detailHeader}>
            <View>
              <Text style={[styles.detailZone, { color: themeColors.textPrimary }]}>
                {selectedZone.zone}
              </Text>
              <Text style={[styles.detailIssue, { color: themeColors.textSecondary }]}>
                Primary Etiology: {selectedZone.dominantIssue}
              </Text>
            </View>

            <View
              style={[
                styles.severityBadge,
                {
                  backgroundColor: `${getIntensityColor(selectedZone.intensity)}1F`,
                  borderColor: getIntensityColor(selectedZone.intensity),
                },
              ]}
            >
              <Text
                style={[
                  styles.severityScore,
                  { color: getIntensityColor(selectedZone.intensity) },
                ]}
              >
                {selectedZone.intensity}% Reactive
              </Text>
            </View>
          </View>

          {selectedZone.targetedActiveSuggestion && (
            <View
              style={[
                styles.suggestionRow,
                { borderTopColor: themeColors.border },
              ]}
            >
              <SparklesIcon size={14} color={themeColors.emerald} />
              <Text style={[styles.suggestionText, { color: themeColors.textPrimary }]}>
                Prescribed Countermeasure:{" "}
                <Text style={[styles.suggestionActive, { color: themeColors.emerald }]}>
                  {selectedZone.targetedActiveSuggestion}
                </Text>
              </Text>
            </View>
          )}

          {onNavigateToClash && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToClash}
              style={[
                styles.clashLinkBtn,
                {
                  backgroundColor: themeColors.bgElevated,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Text style={[styles.clashLinkText, { color: themeColors.emerald }]}>
                Check Active Contraindications in Clash Copilot
              </Text>
              <ChevronRightIcon size={14} color={themeColors.emerald} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={[styles.hintCaption, { color: themeColors.textMuted }]}>
          {renderMode === "masks"
            ? "Toggle concerns above to inspect hyperspectral overlay masks."
            : "Tap any facial coordinate node to inspect localized clinical etiology."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: spacing.xs,
  },
  modeToggle: {
    flexDirection: "row",
    borderRadius: radius.full,
    padding: 3,
    marginBottom: spacing.xs,
    borderWidth: 1,
    width: "100%",
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: radius.full,
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  maskControlCard: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    marginBottom: spacing.xs,
    ...shadows.card,
  },
  maskControlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  maskControlTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  maskToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  maskToggleText: {
    fontSize: 10,
    fontWeight: "800",
  },
  maskPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  maskPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  maskPillText: {
    fontSize: 10,
  },
  canvasWrapper: {
    width: 290,
    height: 320,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  facePhoto: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  darkVignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(7, 10, 16, 0.2)",
  },
  touchTarget: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  detailCard: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    ...shadows.card,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 8,
  },
  detailZone: {
    fontSize: 14,
    fontWeight: "800",
  },
  detailIssue: {
    fontSize: 12,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  severityScore: {
    fontSize: 10,
    fontWeight: "800",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
  },
  suggestionText: {
    fontSize: 12,
    flex: 1,
  },
  suggestionActive: {
    fontWeight: "800",
  },
  clashLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  clashLinkText: {
    fontSize: 11,
    fontWeight: "700",
  },
  hintCaption: {
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },
});
