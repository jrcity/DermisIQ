import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { ProductItem } from "../../api/clashEngine/recommendations";
import { SunIcon, MoonIcon, CheckIcon, PlusIcon, SparklesIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

interface RoutineCardProps {
  product: ProductItem;
  stepNumber: number;
  timeOfDay: "AM" | "PM" | "AM/PM";
  onAddToCart: (product: ProductItem) => void;
  isInCart?: boolean;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  product,
  stepNumber,
  timeOfDay,
  onAddToCart,
  isInCart = false,
}) => {
  const { themeColors } = useApp();
  const isAM = timeOfDay === "AM" || timeOfDay === "AM/PM";

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
      {/* Top Meta Bar */}
      <View style={styles.topRow}>
        <View style={styles.topRowLeft}>
          <View
            style={[
              styles.stepBadge,
              {
                backgroundColor: themeColors.bgElevated,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.stepText, { color: themeColors.textSecondary }]}>
              STEP {stepNumber}
            </Text>
          </View>

          <View
            style={[
              styles.timeOfDayBadge,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor: themeColors.border,
              },
            ]}
          >
            {isAM ? (
              <SunIcon size={12} color={themeColors.gold} />
            ) : (
              <MoonIcon size={12} color={themeColors.cyan} />
            )}
            <Text
              style={[
                styles.timeOfDayText,
                { color: isAM ? themeColors.gold : themeColors.cyan },
              ]}
            >
              {timeOfDay}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.riskBadge,
            { backgroundColor: themeColors.emeraldMuted },
          ]}
        >
          <Text style={[styles.riskText, { color: themeColors.emerald }]}>
            {product.returnRateRisk}
          </Text>
        </View>
      </View>

      {/* Main Body: Product Image + Brand & Details */}
      <View style={styles.bodyRow}>
        {product.image && (
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: "#FFFFFF",
                borderColor: themeColors.borderLight,
              },
            ]}
          >
            <Image
              source={product.image}
              style={styles.productImg}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.titleSection}>
          <Text style={[styles.brand, { color: themeColors.emerald }]}>
            {product.brand}
          </Text>
          <Text
            style={[styles.name, { color: themeColors.textPrimary }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text
            style={[styles.heroBenefit, { color: themeColors.textSecondary }]}
            numberOfLines={2}
          >
            {product.heroBenefit}
          </Text>
        </View>
      </View>

      {/* YouCam API Provenance Card */}
      {product.youcamReason && (
        <View
          style={[
            styles.youcamBox,
            {
              backgroundColor: themeColors.bgCardSubtle,
              borderColor: themeColors.borderEmerald,
            },
          ]}
        >
          <SparklesIcon size={13} color={themeColors.emerald} />
          <Text style={[styles.youcamText, { color: themeColors.textPrimary }]}>
            <Text style={{ fontWeight: "800", color: themeColors.emerald }}>
              Clinical AI Match:
            </Text>{" "}
            {product.youcamReason}
          </Text>
        </View>
      )}

      {/* Actives & Shade info */}
      <View
        style={[
          styles.metaRow,
          { borderTopColor: themeColors.border },
        ]}
      >
        <View style={styles.activesList}>
          {product.actives.map(activeKey => (
            <View
              key={activeKey}
              style={[
                styles.activePill,
                {
                  backgroundColor: themeColors.bgCardSubtle,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.activePillText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {activeKey.replace("_", " ")}
              </Text>
            </View>
          ))}
        </View>

        {product.shadeHex && (
          <View
            style={[
              styles.shadeBadge,
              { backgroundColor: themeColors.bgCardSubtle },
            ]}
          >
            <View style={[styles.shadeDot, { backgroundColor: product.shadeHex }]} />
            <Text style={[styles.shadeText, { color: themeColors.textSecondary }]}>
              Exact Tone
            </Text>
          </View>
        )}
      </View>

      {/* Footer Price & Add to Cart */}
      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: themeColors.textPrimary }]}>
            {product.currency}
            {product.price.toFixed(2)}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={[styles.starText, { color: themeColors.gold }]}>★</Text>
            <Text style={[styles.ratingText, { color: themeColors.textMuted }]}>
              {product.rating} ({product.reviewCount})
            </Text>
          </View>
        </View>

        {/* Clean, Non-Gradient In-Cart Button State */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onAddToCart(product)}
          style={[
            styles.addBtn,
            isInCart
              ? [
                  styles.addBtnInCart,
                  {
                    backgroundColor: themeColors.bgElevated,
                    borderColor: themeColors.emerald,
                  },
                ]
              : [
                  styles.addBtnDefault,
                  { backgroundColor: themeColors.emerald },
                ],
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to cart`}
        >
          {isInCart ? (
            <View style={styles.btnContentRow}>
              <CheckIcon size={14} color={themeColors.emerald} />
              <Text style={[styles.btnTextInCart, { color: themeColors.emerald }]}>
                In Basket
              </Text>
            </View>
          ) : (
            <View style={styles.btnContentRow}>
              <PlusIcon size={14} color="#FFFFFF" />
              <Text style={styles.btnText}>Add to Cart</Text>
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
    marginVertical: spacing.xs + 2,
    ...shadows.card,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs + 2,
  },
  topRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  stepText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  timeOfDayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  timeOfDayText: {
    fontSize: 10,
    fontWeight: "800",
  },
  riskBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  riskText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  bodyRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImg: {
    width: "100%",
    height: "100%",
  },
  titleSection: {
    flex: 1,
  },
  brand: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
  heroBenefit: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },
  youcamBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: 10,
  },
  youcamText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    flexWrap: "wrap",
    gap: 6,
  },
  activesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    flex: 1,
  },
  activePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  shadeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  shadeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  shadeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  starText: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnDefault: {
    borderWidth: 0,
  },
  addBtnInCart: {
    borderWidth: 1.5,
  },
  btnContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  btnTextInCart: {
    fontSize: 12,
    fontWeight: "800",
  },
});
