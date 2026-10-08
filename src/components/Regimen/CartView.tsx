import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { colors, radius, spacing, typography, shadows } from "../../theme";
import { useApp, PaymentMethodType } from "../../context/AppContext";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CartBagIcon,
  CheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "../common/Icons";

export const CartView: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    discountAmount,
    cartTotal,
    promoCode,
    promoDiscountPercentage,
    applyPromoCode,
    setActiveTab,
    checkoutSuccessModal,
    setCheckoutSuccessModal,
    scanResult,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    themeColors,
  } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState("user@okhdfcbank");
  const [cardNumberInput, setCardNumberInput] = useState("•••• •••• •••• 4242");

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const success = applyPromoCode(couponInput);
    if (success) {
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid code. Try DERMIS25 for 25% off!");
    }
  };

  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    await new Promise<void>(r => setTimeout(() => r(), 900));
    setIsProcessingPayment(false);
    setCheckoutSuccessModal(true);
  };

  const handleFinishCheckout = () => {
    setCheckoutSuccessModal(false);
    clearCart();
    setActiveTab("home");
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyIconCircle,
            {
              backgroundColor: themeColors.bgCardSubtle,
              borderColor: themeColors.border,
            },
          ]}
        >
          <CartBagIcon size={34} color={themeColors.textMuted} />
        </View>
        <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
          Your Basket is Empty
        </Text>
        <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
          Explore tone-matched SPFs and barrier recovery formulas clinically tested against your dermal diagnostics.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab("regimen")}
          style={[styles.browseBtn, { backgroundColor: themeColors.emerald }]}
        >
          <Text style={styles.browseBtnText}>Explore Curated Store →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cartHeader}>
        <Text style={[typography.h2, { color: themeColors.textPrimary }]}>
          Your Curated Basket
        </Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={[styles.clearAllText, { color: themeColors.rose }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items List */}
      <View style={styles.itemsList}>
        {cartItems.map(item => (
          <View
            key={item.product.id}
            style={[
              styles.itemRow,
              {
                backgroundColor: themeColors.bgCard,
                borderColor: themeColors.borderLight,
              },
            ]}
          >
            {/* Thumbnail */}
            {item.product.image && (
              <View
                style={[
                  styles.itemThumbnailContainer,
                  {
                    backgroundColor: "#FFFFFF",
                    borderColor: themeColors.borderLight,
                  },
                ]}
              >
                <Image
                  source={item.product.image}
                  style={styles.itemThumbnail}
                  resizeMode="contain"
                />
              </View>
            )}

            <View style={styles.itemInfo}>
              <Text style={[styles.itemBrand, { color: themeColors.emerald }]}>
                {item.product.brand}
              </Text>
              <Text
                style={[styles.itemName, { color: themeColors.textPrimary }]}
                numberOfLines={1}
              >
                {item.product.name}
              </Text>
              <Text style={[styles.itemPrice, { color: themeColors.textPrimary }]}>
                ${item.product.price.toFixed(2)}
              </Text>
            </View>

            {/* Quantity Controls & Delete */}
            <View style={styles.quantityControls}>
              <View
                style={[
                  styles.counterBox,
                  {
                    backgroundColor: themeColors.bgCardSubtle,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateCartQuantity(item.product.id, -1)}
                  style={styles.counterBtn}
                >
                  <MinusIcon size={11} color={themeColors.textPrimary} />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.counterValue,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateCartQuantity(item.product.id, 1)}
                  style={styles.counterBtn}
                >
                  <PlusIcon size={11} color={themeColors.textPrimary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => removeFromCart(item.product.id)}
                style={styles.trashBtn}
                accessibilityLabel="Remove item"
              >
                <TrashIcon size={15} color={themeColors.rose} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Promo Code Input Box */}
      <View style={styles.promoSection}>
        <View style={styles.promoInputRow}>
          <TextInput
            value={couponInput}
            onChangeText={t => {
              setCouponInput(t);
              setCouponError("");
            }}
            placeholder="Promo Code (e.g. DERMIS25)"
            placeholderTextColor={themeColors.textMuted}
            style={[
              styles.promoInput,
              {
                backgroundColor: themeColors.bgCard,
                borderColor: themeColors.border,
                color: themeColors.textPrimary,
              },
            ]}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleApplyCoupon}
            style={[
              styles.applyBtn,
              {
                backgroundColor: themeColors.bgElevated,
                borderColor: themeColors.borderLight,
              },
            ]}
          >
            <Text style={[styles.applyBtnText, { color: themeColors.textPrimary }]}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>

        {promoCode ? (
          <View style={styles.appliedCodeRow}>
            <CheckIcon size={13} color={themeColors.emerald} />
            <Text style={[styles.appliedCodeText, { color: themeColors.emerald }]}>
              Promo {promoCode} active ({promoDiscountPercentage}% DISCOUNT)
            </Text>
          </View>
        ) : null}

        {couponError ? (
          <Text style={[styles.couponErrorText, { color: themeColors.rose }]}>
            {couponError}
          </Text>
        ) : null}
      </View>

      {/* Multi-Payment Alternative Selection */}
      <View
        style={[
          styles.paymentSection,
          {
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
          },
        ]}
      >
        <Text style={[styles.paymentHeaderTitle, { color: themeColors.textMuted }]}>
          SELECT PAYMENT ALTERNATIVE:
        </Text>

        <View style={styles.paymentOptionsGrid}>
          {/* Apple / Google Pay */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedPaymentMethod("apple_pay")}
            style={[
              styles.paymentOptionCard,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor:
                  selectedPaymentMethod === "apple_pay"
                    ? themeColors.emerald
                    : themeColors.border,
              },
              selectedPaymentMethod === "apple_pay" && {
                backgroundColor: themeColors.bgElevated,
              },
            ]}
          >
            <View style={styles.paymentRadioRow}>
              <View
                style={[
                  styles.radioDot, { borderColor: themeColors.borderLight },
                  selectedPaymentMethod === "apple_pay" && {
                    borderColor: themeColors.emerald,
                  },
                ]}
              >
                {selectedPaymentMethod === "apple_pay" && (
                  <View
                    style={[
                      styles.radioDotInner,
                      { backgroundColor: themeColors.emerald },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.paymentTitle,
                  { color: themeColors.textPrimary },
                ]}
              >
                 Apple Pay / Google Pay
              </Text>
            </View>
            <Text style={[styles.paymentSub, { color: themeColors.textMuted }]}>
              Instant 1-touch biometric checkout
            </Text>
          </TouchableOpacity>

          {/* Credit / Debit Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedPaymentMethod("card")}
            style={[
              styles.paymentOptionCard,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor:
                  selectedPaymentMethod === "card"
                    ? themeColors.emerald
                    : themeColors.border,
              },
              selectedPaymentMethod === "card" && {
                backgroundColor: themeColors.bgElevated,
              },
            ]}
          >
            <View style={styles.paymentRadioRow}>
              <View
                style={[
                  styles.radioDot, { borderColor: themeColors.borderLight },
                  selectedPaymentMethod === "card" && {
                    borderColor: themeColors.emerald,
                  },
                ]}
              >
                {selectedPaymentMethod === "card" && (
                  <View
                    style={[
                      styles.radioDotInner,
                      { backgroundColor: themeColors.emerald },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.paymentTitle,
                  { color: themeColors.textPrimary },
                ]}
              >
                💳 Credit / Debit Card (Visa, MC, Amex)
              </Text>
            </View>
            {selectedPaymentMethod === "card" && (
              <TextInput
                value={cardNumberInput}
                onChangeText={setCardNumberInput}
                style={[
                  styles.cardInputSmall,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
              />
            )}
          </TouchableOpacity>

          {/* UPI & Net Banking (India & Global eCommerce) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedPaymentMethod("upi")}
            style={[
              styles.paymentOptionCard,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor:
                  selectedPaymentMethod === "upi"
                    ? themeColors.emerald
                    : themeColors.border,
              },
              selectedPaymentMethod === "upi" && {
                backgroundColor: themeColors.bgElevated,
              },
            ]}
          >
            <View style={styles.paymentRadioRow}>
              <View
                style={[
                  styles.radioDot, { borderColor: themeColors.borderLight },
                  selectedPaymentMethod === "upi" && {
                    borderColor: themeColors.emerald,
                  },
                ]}
              >
                {selectedPaymentMethod === "upi" && (
                  <View
                    style={[
                      styles.radioDotInner,
                      { backgroundColor: themeColors.emerald },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.paymentTitle,
                  { color: themeColors.textPrimary },
                ]}
              >
                🇮🇳 UPI &amp; Instant Banking (GPay, PhonePe, Paytm)
              </Text>
            </View>
            {selectedPaymentMethod === "upi" && (
              <TextInput
                value={upiIdInput}
                onChangeText={setUpiIdInput}
                placeholder="Enter UPI ID (e.g. mobile@upi)"
                placeholderTextColor={themeColors.textMuted}
                style={[
                  styles.cardInputSmall,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
              />
            )}
          </TouchableOpacity>

          {/* Buy Now Pay Later */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedPaymentMethod("bnpl")}
            style={[
              styles.paymentOptionCard,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor:
                  selectedPaymentMethod === "bnpl"
                    ? themeColors.emerald
                    : themeColors.border,
              },
              selectedPaymentMethod === "bnpl" && {
                backgroundColor: themeColors.bgElevated,
              },
            ]}
          >
            <View style={styles.paymentRadioRow}>
              <View
                style={[
                  styles.radioDot, { borderColor: themeColors.borderLight },
                  selectedPaymentMethod === "bnpl" && {
                    borderColor: themeColors.emerald,
                  },
                ]}
              >
                {selectedPaymentMethod === "bnpl" && (
                  <View
                    style={[
                      styles.radioDotInner,
                      { backgroundColor: themeColors.emerald },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.paymentTitle,
                  { color: themeColors.textPrimary },
                ]}
              >
                🛍️ Buy Now Pay Later (Klarna / Afterpay)
              </Text>
            </View>
            <Text style={[styles.paymentSub, { color: themeColors.emerald }]}>
              4 interest-free bi-weekly payments of ${(cartTotal / 4).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary Box */}
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: themeColors.bgCard,
            borderColor: themeColors.borderLight,
          },
        ]}
      >
        <Text style={[styles.summaryTitle, { color: themeColors.textMuted }]}>
          ORDER BREAKDOWN
        </Text>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>
            Subtotal ({cartItems.length} items)
          </Text>
          <Text style={[styles.summaryValue, { color: themeColors.textPrimary }]}>
            ${cartSubtotal.toFixed(2)}
          </Text>
        </View>

        {discountAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.emerald }]}>
              Bundle / Promo Discount
            </Text>
            <Text style={[styles.summaryValue, { color: themeColors.emerald }]}>
              -${discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>
            Melanin Tone Guarantee
          </Text>
          <Text style={[styles.summaryValue, { color: themeColors.cyan }]}>
            FREE ($0.00)
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>
            Climate-Neutral Fast Delivery
          </Text>
          <Text style={[styles.summaryValue, { color: themeColors.cyan }]}>
            FREE ($0.00)
          </Text>
        </View>

        <View
          style={[styles.divider, { backgroundColor: themeColors.border }]}
        />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: themeColors.textPrimary }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: themeColors.emerald }]}>
            ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleExecutePayment}
          disabled={isProcessingPayment}
          style={[
            styles.checkoutBtn,
            { backgroundColor: themeColors.emerald },
            isProcessingPayment && { opacity: 0.6 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Proceed to Checkout"
        >
          {isProcessingPayment ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.checkoutBtnText}>
              Pay ${cartTotal.toFixed(2)} with {selectedPaymentMethod.toUpperCase().replace("_", " ")}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Checkout Success Modal */}
      <Modal
        visible={checkoutSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCheckoutSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: themeColors.bgCard,
                borderColor: themeColors.emerald,
              },
            ]}
          >
            <View
              style={[
                styles.modalIconCircle,
                { backgroundColor: themeColors.emeraldMuted },
              ]}
            >
              <ShieldCheckIcon size={38} color={themeColors.emerald} />
            </View>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
              Payment Successful!
            </Text>
            <Text style={[styles.modalSubtitle, { color: themeColors.textSecondary }]}>
              Your barrier-tested skincare regimen has been authorized and dispatched.
            </Text>

            <View
              style={[
                styles.modalDetailBox,
                { backgroundColor: themeColors.bgCardSubtle },
              ]}
            >
              <Text style={[styles.modalDetailItem, { color: themeColors.textSecondary }]}>
                • Order Ref: <Text style={{ color: themeColors.textPrimary, fontWeight: "700" }}>DIQ-{(Date.now() % 1000000)}</Text>
              </Text>
              <Text style={[styles.modalDetailItem, { color: themeColors.textSecondary }]}>
                • Phototype: <Text style={{ color: themeColors.textPrimary, fontWeight: "700" }}>{scanResult.fitzpatrickType} ({scanResult.shadeHex})</Text>
              </Text>
              <Text style={[styles.modalDetailItem, { color: themeColors.textSecondary }]}>
                • Total Paid: <Text style={{ color: themeColors.emerald, fontWeight: "800" }}>${cartTotal.toFixed(2)}</Text>
              </Text>
              <Text style={[styles.modalDetailItem, { color: themeColors.textSecondary }]}>
                • Payment Channel: <Text style={{ color: themeColors.textPrimary, fontWeight: "700" }}>{selectedPaymentMethod.toUpperCase()}</Text>
              </Text>
              <Text style={[styles.modalDetailItem, { color: themeColors.textSecondary }]}>
                • Return Rate Risk: <Text style={{ color: themeColors.emerald, fontWeight: "800" }}>&lt; 2% (Tone Calibrated)</Text>
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleFinishCheckout}
              style={[
                styles.modalDismissBtn,
                { backgroundColor: themeColors.emerald },
              ]}
            >
              <Text style={styles.modalDismissText}>Back to Skin Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "700",
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.card,
  },
  itemThumbnailContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 2,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemThumbnail: {
    width: "100%",
    height: "100%",
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemBrand: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
  },
  quantityControls: {
    alignItems: "flex-end",
    gap: 6,
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  counterBtn: {
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  counterValue: {
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 4,
  },
  trashBtn: {
    padding: 3,
  },
  promoSection: {
    marginVertical: spacing.sm,
  },
  promoInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    fontWeight: "700",
  },
  applyBtn: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: "800",
  },
  appliedCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  appliedCodeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  couponErrorText: {
    fontSize: 11,
    marginTop: 4,
  },
  paymentSection: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  paymentHeaderTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  paymentOptionsGrid: {
    gap: 6,
  },
  paymentOptionCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  paymentRadioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  paymentSub: {
    fontSize: 10,
    marginTop: 3,
    marginLeft: 24,
  },
  cardInputSmall: {
    marginTop: 6,
    marginLeft: 24,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 11,
    fontFamily: "monospace",
  },
  summaryCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.xs,
    ...shadows.card,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  checkoutBtn: {
    paddingVertical: 13,
    borderRadius: radius.lg,
    alignItems: "center",
    ...shadows.glowEmerald,
  },
  checkoutBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: spacing.md,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 18,
    maxWidth: 270,
  },
  browseBtn: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  modalContent: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 1.5,
    width: "100%",
    maxWidth: 340,
    ...shadows.glowEmerald,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalSubtitle: {
    fontSize: 11,
    textAlign: "center",
    marginVertical: 6,
    lineHeight: 16,
  },
  modalDetailBox: {
    borderRadius: radius.md,
    padding: spacing.sm,
    width: "100%",
    marginVertical: 10,
    gap: 3,
  },
  modalDetailItem: {
    fontSize: 11,
  },
  modalDismissBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    width: "100%",
    alignItems: "center",
    marginTop: 6,
  },
  modalDismissText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
});
