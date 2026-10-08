import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors, radius, spacing, typography, shadows } from "../../theme";
import { useApp } from "../../context/AppContext";
import { PRODUCT_CATALOG } from "../../api/clashEngine/recommendations";
import { SparklesIcon, CheckIcon, CartBagIcon } from "../common/Icons";

export const ShadeMatcherVTO: React.FC = () => {
  const { scanResult, addToCart, cart, themeColors } = useApp();

  const vtoProduct = PRODUCT_CATALOG[4]; // ChromaShield Melanin Adaptive Tinted SPF 50
  const isAdded = cart.some(p => p.id === vtoProduct.id);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.bgCard,
          borderColor: themeColors.borderEmerald,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.aiBadge,
            {
              backgroundColor: themeColors.emeraldMuted,
              borderColor: themeColors.borderEmerald,
            },
          ]}
        >
          <SparklesIcon size={12} color={themeColors.emerald} />
          <Text style={[styles.aiBadgeText, { color: themeColors.emerald }]}>
            SPECTRAL SHADE MATCHING
          </Text>
        </View>

        <View
          style={[
            styles.returnBadge,
            {
              backgroundColor: themeColors.bgCardSubtle,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Text style={[styles.returnBadgeText, { color: themeColors.textSecondary }]}>
            &lt; 2% Return Risk
          </Text>
        </View>
      </View>

      {/* Main product row: Product image + Description */}
      <View style={styles.mainRow}>
        <View
          style={[
            styles.imgContainer,
            {
              backgroundColor: "#FFFFFF",
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Image
            source={vtoProduct.image}
            style={styles.spfImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            ChromaShield Adaptive SPF 50+
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            100% mineral zinc photoprotection calibrated to your melanin phototype ({scanResult.fitzpatrickType}).
          </Text>
        </View>
      </View>

      {/* Visual Tone Match Visualizer */}
      <View
        style={[
          styles.swatchSection,
          {
            backgroundColor: themeColors.bgCardSubtle,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.swatchCard}>
          <View
            style={[
              styles.swatchCircle,
              { backgroundColor: scanResult.shadeHex },
            ]}
          />
          <View style={styles.swatchInfo}>
            <Text style={[styles.swatchLabel, { color: themeColors.textMuted }]}>
              DETECTED MELANIN TONE
            </Text>
            <Text
              style={[styles.swatchValue, { color: themeColors.textPrimary }]}
              numberOfLines={1}
            >
              {scanResult.undertone} ({scanResult.shadeHex})
            </Text>
          </View>
        </View>

        <View style={styles.matchConnector}>
          <Text style={[styles.matchEq, { color: themeColors.emerald }]}>≈</Text>
        </View>

        <View style={styles.swatchCard}>
          <View
            style={[
              styles.swatchCircle,
              { backgroundColor: vtoProduct.shadeHex || scanResult.shadeHex },
            ]}
          />
          <View style={styles.swatchInfo}>
            <Text style={[styles.swatchLabel, { color: themeColors.textMuted }]}>
              MATCHED MINERAL TINT
            </Text>
            <Text
              style={[styles.swatchValue, { color: themeColors.textPrimary }]}
              numberOfLines={1}
            >
              Golden Sand (#A26E4F)
            </Text>
          </View>
        </View>
      </View>

      {/* Retail Impact Guarantee */}
      <View
        style={[
          styles.guaranteeBox,
          {
            backgroundColor: themeColors.cyanMuted,
            borderColor: themeColors.cyan,
          },
        ]}
      >
        <Text style={[styles.guaranteeText, { color: themeColors.cyan }]}>
          🛡️ <Text style={{ fontWeight: "800" }}>Zero Return Guarantee:</Text> Cuts
          standard 35% beauty return rates by matching 16-bit skin tone values before checkout.
        </Text>
      </View>

      {/* Footer & CTA */}
      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.price, { color: themeColors.textPrimary }]}>
            ${vtoProduct.price.toFixed(2)}
          </Text>
          <Text style={[styles.reviewText, { color: themeColors.textMuted }]}>
            ★ 4.9 (2,100 Verified Shades)
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => addToCart(vtoProduct)}
          style={[
            styles.addBtn,
            { backgroundColor: themeColors.emerald },
            isAdded && {
              backgroundColor: themeColors.emeraldMuted,
              borderWidth: 1,
              borderColor: themeColors.emerald,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Add tone matched SPF to cart"
        >
          {isAdded ? (
            <View style={styles.btnRow}>
              <CheckIcon size={13} color={themeColors.emerald} />
              <Text style={[styles.btnTextAdded, { color: themeColors.emerald }]}>
                In Basket
              </Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <CartBagIcon size={13} color="#FFFFFF" />
              <Text style={styles.btnText}>Add Shade SPF</Text>
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
    borderWidth: 1.5,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  returnBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  returnBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  imgContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  spfImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  swatchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginVertical: 8,
    borderWidth: 1,
  },
  swatchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },
  swatchCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  swatchInfo: {
    flex: 1,
  },
  swatchLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  swatchValue: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 1,
  },
  matchConnector: {
    paddingHorizontal: 4,
  },
  matchEq: {
    fontSize: 16,
    fontWeight: "900",
  },
  guaranteeBox: {
    padding: 7,
    borderRadius: radius.md,
    borderWidth: 0.5,
  },
  guaranteeText: {
    fontSize: 10,
    lineHeight: 14,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
  },
  reviewText: {
    fontSize: 10,
    fontWeight: "600",
  },
  addBtn: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radius.md,
    ...shadows.glowEmerald,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  btnTextAdded: {
    fontWeight: "800",
    fontSize: 12,
  },
});
