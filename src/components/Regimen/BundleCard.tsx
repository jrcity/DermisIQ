import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { CuratedBundle, ProductItem } from "../../api/clashEngine/recommendations";
import { CheckIcon, SparklesIcon, CartBagIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface BundleCardProps {
  bundle: CuratedBundle;
  onAddBundle: (bundle: CuratedBundle) => void;
  isAdded?: boolean;
}

export const BundleCard: React.FC<BundleCardProps> = ({
  bundle,
  onAddBundle,
  isAdded = false,
}) => {
  const { themeColors } = useApp();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.bgCard,
          borderColor: themeColors.borderLight,
        },
      ]}
    >
      {/* Top Banner: Bundle Title & Discount Pill */}
      <View style={styles.topRow}>
        <View style={styles.titleColumn}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            {bundle.title}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {bundle.subtitle}
          </Text>
        </View>

        <View
          style={[
            styles.discountBadge,
            { backgroundColor: themeColors.emerald },
          ]}
        >
          <Text style={styles.discountText}>SAVE 25%</Text>
        </View>
      </View>

      {/* Target Skin State & Synergy */}
      <View
        style={[
          styles.synergyBox,
          {
            backgroundColor: themeColors.bgCardSubtle,
            borderColor: themeColors.borderEmerald,
          },
        ]}
      >
        <SparklesIcon size={14} color={themeColors.emerald} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.targetLabel, { color: themeColors.emerald }]}>
            CLINICAL TARGET: {bundle.targetCondition.toUpperCase()}
          </Text>
          <Text style={[styles.synergyText, { color: themeColors.textSecondary }]}>
            {bundle.heroBadge} • Formulated to eliminate active ingredient clashes and fortify lipid barrier
          </Text>
        </View>
      </View>

      {/* Included Products List */}
      <View style={styles.productsSection}>
        <Text style={[styles.productsLabel, { color: themeColors.textMuted }]}>
          INCLUDED IN THIS HARMONIZED REGIMEN:
        </Text>
        <View style={styles.productsRow}>
          {bundle.products.map((product: ProductItem) => (
            <View
              key={product.id}
              style={[
                styles.productChip,
                {
                  backgroundColor: themeColors.bgElevated,
                  borderColor: themeColors.borderLight,
                },
              ]}
            >
              {product.image && (
                <View style={styles.chipThumbnail}>
                  <Image
                    source={product.image}
                    style={styles.chipImg}
                    resizeMode="contain"
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.chipUsage, { color: themeColors.emerald }]}>
                  {product.usageTime}
                </Text>
                <Text
                  style={[styles.chipName, { color: themeColors.textPrimary }]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Clinical Evidence Claim */}
      <View
        style={[
          styles.claimBox,
          { borderTopColor: themeColors.border },
        ]}
      >
        <Text style={[styles.claimText, { color: themeColors.textSecondary }]}>
          🔬 <Text style={{ fontWeight: "700" }}>Trial Outcome:</Text> {bundle.clinicalTrialClaim}
        </Text>
      </View>

      {/* Price Breakdown & Add to Basket */}
      <View style={styles.footerRow}>
        <View style={styles.priceCol}>
          <View style={styles.priceRow}>
            <Text style={[styles.bundledPrice, { color: themeColors.textPrimary }]}>
              ${bundle.bundlePrice.toFixed(2)}
            </Text>
            <Text style={[styles.originalPrice, { color: themeColors.textMuted }]}>
              ${bundle.originalPrice.toFixed(2)}
            </Text>
          </View>
          <Text style={[styles.savingsText, { color: themeColors.emerald }]}>
            Instant ${(bundle.originalPrice - bundle.bundlePrice).toFixed(2)} Savings
          </Text>
        </View>

        {/* Clean, Non-Gradient In-Cart Button State */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onAddBundle(bundle)}
          style={[
            styles.addBundleBtn,
            isAdded
              ? [
                  styles.addBundleBtnInCart,
                  {
                    backgroundColor: themeColors.bgElevated,
                    borderColor: themeColors.emerald,
                  },
                ]
              : [
                  styles.addBundleBtnDefault,
                  { backgroundColor: themeColors.emerald },
                ],
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Add ${bundle.title} to basket`}
        >
          {isAdded ? (
            <View style={styles.btnRow}>
              <CheckIcon size={14} color={themeColors.emerald} />
              <Text style={[styles.btnTextAdded, { color: themeColors.emerald }]}>
                In Basket
              </Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <CartBagIcon size={14} color="#FFFFFF" />
              <Text style={styles.btnText}>Add Bundle</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginVertical: spacing.sm,
    ...shadows.card,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  synergyBox: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    marginVertical: 10,
  },
  targetLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  synergyText: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  productsSection: {
    marginTop: 4,
  },
  productsLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  productsRow: {
    gap: 6,
  },
  productChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 6,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  chipThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chipImg: {
    width: "100%",
    height: "100%",
  },
  chipUsage: {
    fontSize: 9,
    fontWeight: "800",
  },
  chipName: {
    fontSize: 11,
    fontWeight: "600",
  },
  claimBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  claimText: {
    fontSize: 11,
    lineHeight: 15,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceCol: {
    justifyContent: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  bundledPrice: {
    fontSize: 20,
    fontWeight: "900",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    fontWeight: "600",
  },
  savingsText: {
    fontSize: 10,
    fontWeight: "800",
  },
  addBundleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  addBundleBtnDefault: {
    borderWidth: 0,
  },
  addBundleBtnInCart: {
    borderWidth: 1.5,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  btnTextAdded: {
    fontSize: 12,
    fontWeight: "800",
  },
});
