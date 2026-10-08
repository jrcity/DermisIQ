import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { radius, spacing, shadows } from '../theme';
import { useApp } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { PRODUCT_CATALOG, CURATED_BUNDLES } from '../api/clashEngine/recommendations';
import { RoutineCard } from '../components/Regimen/RoutineCard';
import { BundleCard } from '../components/Regimen/BundleCard';
import { ShadeMatcherVTO } from '../components/Regimen/ShadeMatcherVTO';
import { CartView } from '../components/Regimen/CartView';
import { SunIcon, MoonIcon } from '../components/common/Icons';

export const RoutineScreen: React.FC = () => {
  const {
    cart,
    addToCart,
    addBundleToCart,
    cartItemCount,
    themeColors,
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'routine' | 'bundles' | 'cart'>('routine');

  // Morning and Evening filtered products
  const morningProducts = PRODUCT_CATALOG.filter(
    p => p.usageTime === 'AM' || p.usageTime === 'AM/PM'
  );
  const eveningProducts = PRODUCT_CATALOG.filter(
    p => p.usageTime === 'PM' || p.usageTime === 'AM/PM'
  );

  return (
    <View style={[styles.screenWrapper, { backgroundColor: themeColors.bgPrimary }]}>
      <Header title="Clinical Store" subtitle="Tone-Matched & Barrier Safe" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Sub-navigation Tabs: Routine vs Bundles vs Cart */}
        <View
          style={[
            styles.segmentNav,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('routine')}
            style={[
              styles.segmentBtn,
              activeSegment === 'routine' && {
                backgroundColor: themeColors.bgElevated,
                ...shadows.card,
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    activeSegment === 'routine'
                      ? themeColors.textPrimary
                      : themeColors.textMuted,
                },
                activeSegment === 'routine' && styles.segmentTextActive,
              ]}
            >
              Daily Regimen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('bundles')}
            style={[
              styles.segmentBtn,
              activeSegment === 'bundles' && {
                backgroundColor: themeColors.bgElevated,
                ...shadows.card,
              },
            ]}
          >
            <View style={styles.bundleTabRow}>
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      activeSegment === 'bundles'
                        ? themeColors.textPrimary
                        : themeColors.textMuted,
                  },
                  activeSegment === 'bundles' && styles.segmentTextActive,
                ]}
              >
                Bundles
              </Text>
              <View style={[styles.discountBadge, { backgroundColor: themeColors.emerald }]}>
                <Text style={styles.discountBadgeText}>-25%</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('cart')}
            style={[
              styles.segmentBtn,
              activeSegment === 'cart' && {
                backgroundColor: themeColors.bgElevated,
                ...shadows.card,
              },
            ]}
          >
            <View style={styles.cartTabRow}>
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      activeSegment === 'cart'
                        ? themeColors.textPrimary
                        : themeColors.textMuted,
                  },
                  activeSegment === 'cart' && styles.segmentTextActive,
                ]}
              >
                Basket
              </Text>
              {cartItemCount > 0 && (
                <View style={[styles.cartCountPill, { backgroundColor: themeColors.emerald }]}>
                  <Text style={styles.cartCountPillText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* View 1: Step-by-Step AM/PM Routine + VTO */}
        {activeSegment === 'routine' && (
          <View>
            {/* Tone-Matched SPF Hero VTO Card */}
            <ShadeMatcherVTO />

            {/* Morning Section */}
            <View style={styles.timelineHeader}>
              <SunIcon size={16} color={themeColors.gold} />
              <Text style={[styles.timelineTitle, { color: themeColors.textSecondary }]}>
                MORNING DEFENSE (AM)
              </Text>
            </View>

            {morningProducts.map((p, index) => (
              <RoutineCard
                key={`am-${p.id}`}
                product={p}
                stepNumber={index + 1}
                timeOfDay="AM"
                onAddToCart={addToCart}
                isInCart={cart.some(item => item.id === p.id)}
              />
            ))}

            {/* Evening Section */}
            <View style={[styles.timelineHeader, { marginTop: spacing.md }]}>
              <MoonIcon size={16} color={themeColors.cyan} />
              <Text style={[styles.timelineTitle, { color: themeColors.textSecondary }]}>
                EVENING BARRIER REPAIR (PM)
              </Text>
            </View>

            {eveningProducts.map((p, index) => (
              <RoutineCard
                key={`pm-${p.id}`}
                product={p}
                stepNumber={index + 1}
                timeOfDay="PM"
                onAddToCart={addToCart}
                isInCart={cart.some(item => item.id === p.id)}
              />
            ))}
          </View>
        )}

        {/* View 2: Curated Clinical Bundles */}
        {activeSegment === 'bundles' && (
          <View>
            <View
              style={[
                styles.bundlesIntro,
                {
                  backgroundColor: themeColors.bgCard,
                  borderColor: themeColors.borderLight,
                },
              ]}
            >
              <Text style={[styles.bundlesIntroTitle, { color: themeColors.textPrimary }]}>
                Curated Clinical Regimens
              </Text>
              <Text style={[styles.bundlesIntroDesc, { color: themeColors.textSecondary }]}>
                Pre-harmonized AM/PM regimens formulated to prevent chemical clashes, restore barrier function, and save 25% on bundled checkout.
              </Text>
            </View>

            {CURATED_BUNDLES.map(bundle => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                onAddBundle={addBundleToCart}
                isAdded={bundle.products.every(p => cart.some(item => item.id === p.id))}
              />
            ))}
          </View>
        )}

        {/* View 3: Complete Shopping Basket with Multi-Payment Checkout */}
        {activeSegment === 'cart' && <CartView />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 130, // Clearance for floating bottom nav
  },
  segmentNav: {
    flexDirection: 'row',
    borderRadius: radius.full,
    padding: 3,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
  },
  segmentTextActive: {
    fontWeight: '800',
  },
  bundleTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  cartTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cartCountPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  cartCountPillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 6,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  bundlesIntro: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
    ...shadows.card,
  },
  bundlesIntroTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  bundlesIntroDesc: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
});
