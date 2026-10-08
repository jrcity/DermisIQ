import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { radius, spacing, typography, shadows } from "../../theme";
import { INGREDIENT_DATABASE, IngredientDefinition } from "../../api/clashEngine/ingredientDb";
import { ROUTINE_PRESETS, RoutinePreset } from "../../api/clashEngine/engine";
import { SearchIcon, CheckIcon, SparklesIcon, TrashIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface IngredientCheckerProps {
  selectedActives: string[];
  onToggleActive: (id: string) => void;
  barrierScore: number;
  onLoadPreset?: (preset: RoutinePreset) => void;
  onClearAll?: () => void;
}

export const IngredientChecker: React.FC<IngredientCheckerProps> = ({
  selectedActives,
  onToggleActive,
  barrierScore,
  onLoadPreset,
  onClearAll,
}) => {
  const { themeColors } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allActives = Object.values(INGREDIENT_DATABASE);

  const categories = [
    "All",
    "Retinoid",
    "AHA",
    "BHA",
    "Depigmenting",
    "Barrier Lipid",
    "Soothing",
    "Peptide",
  ];

  const filteredActives = allActives.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.h3, { color: themeColors.textPrimary }]}>
            Active Skincare Copilot
          </Text>
          <Text style={[styles.subText, { color: themeColors.textSecondary }]}>
            Selected: <Text style={[styles.highlightText, { color: themeColors.emerald }]}>{selectedActives.length} active(s)</Text> • Barrier: {barrierScore}/100
          </Text>
        </View>

        {onClearAll && selectedActives.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClearAll}
            style={[styles.clearBtn, { borderColor: themeColors.rose }]}
          >
            <TrashIcon size={13} color={themeColors.rose} />
            <Text style={[styles.clearBtnText, { color: themeColors.rose }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Routine Simulation Presets */}
      {onLoadPreset && (
        <View style={styles.presetsSection}>
          <Text style={[styles.presetsLabel, { color: themeColors.gold }]}>
            QUICK DEMO ROUTINE PRESETS:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetScroll}
          >
            {ROUTINE_PRESETS.map(preset => (
              <TouchableOpacity
                key={preset.id}
                activeOpacity={0.8}
                onPress={() => onLoadPreset(preset)}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: themeColors.bgCardSubtle,
                    borderColor: themeColors.borderLight,
                  },
                ]}
              >
                <View style={styles.presetTop}>
                  <SparklesIcon size={12} color={themeColors.gold} />
                  <Text style={[styles.presetName, { color: themeColors.textPrimary }]}>
                    {preset.name}
                  </Text>
                </View>
                <Text
                  style={[styles.presetDesc, { color: themeColors.textSecondary }]}
                  numberOfLines={2}
                >
                  {preset.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search & Category Filter */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: themeColors.bgCardSubtle,
            borderColor: themeColors.border,
          },
        ]}
      >
        <SearchIcon size={16} color={themeColors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search actives (e.g. Salicylic, Retinol)..."
          placeholderTextColor={themeColors.textMuted}
          style={[styles.searchInput, { color: themeColors.textPrimary }]}
        />
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
      >
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.catPill,
                {
                  backgroundColor: isSelected
                    ? themeColors.emerald
                    : themeColors.bgCardSubtle,
                  borderColor: isSelected
                    ? themeColors.emerald
                    : themeColors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  {
                    color: isSelected
                      ? "#FFFFFF"
                      : themeColors.textSecondary,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Actives List */}
      <View style={styles.activesGrid}>
        {filteredActives.map(item => {
          const isSelected = selectedActives.includes(item.id);
          const isBarrierSafe = barrierScore >= item.minBarrierScore;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onToggleActive(item.id)}
              style={[
                styles.activeCard,
                {
                  backgroundColor: isSelected
                    ? themeColors.bgElevated
                    : themeColors.bgCardSubtle,
                  borderColor: isSelected
                    ? themeColors.emerald
                    : themeColors.border,
                },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <View style={styles.activeTop}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected
                        ? themeColors.emerald
                        : themeColors.borderLight,
                      backgroundColor: isSelected
                        ? themeColors.emerald
                        : "transparent",
                    },
                  ]}
                >
                  {isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                </View>

                <View style={styles.activeTitleCol}>
                  <Text style={[styles.activeName, { color: themeColors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.activeCategory, { color: themeColors.textMuted }]}>
                    {item.category} • {item.defaultStrength}
                  </Text>
                </View>

                {/* Safety Badge */}
                <View
                  style={[
                    styles.safetyTag,
                    {
                      backgroundColor: isBarrierSafe
                        ? themeColors.emeraldMuted
                        : themeColors.roseMuted,
                      borderColor: isBarrierSafe
                        ? themeColors.borderEmerald
                        : themeColors.borderRose,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.safetyTagText,
                      { color: isBarrierSafe ? themeColors.emerald : themeColors.rose },
                    ]}
                  >
                    Min BHI: {item.minBarrierScore}
                  </Text>
                </View>
              </View>

              <Text
                style={[styles.activeDesc, { color: themeColors.textSecondary }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  subText: {
    fontSize: 11,
    marginTop: 2,
  },
  highlightText: {
    fontWeight: "800",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 10,
    fontWeight: "700",
  },
  presetsSection: {
    marginVertical: spacing.xs,
  },
  presetsLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  presetScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  presetCard: {
    width: 190,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  presetTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  presetName: {
    fontSize: 12,
    fontWeight: "800",
  },
  presetDesc: {
    fontSize: 10,
    lineHeight: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginVertical: spacing.xs,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  catScroll: {
    gap: 6,
    paddingVertical: 4,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  catText: {
    fontSize: 10,
    fontWeight: "700",
  },
  activesGrid: {
    marginTop: spacing.xs,
    gap: 6,
  },
  activeCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  activeTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTitleCol: {
    flex: 1,
  },
  activeName: {
    fontSize: 13,
    fontWeight: "700",
  },
  activeCategory: {
    fontSize: 10,
    marginTop: 1,
  },
  safetyTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  safetyTagText: {
    fontSize: 9,
    fontWeight: "800",
  },
  activeDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
});
