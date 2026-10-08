import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { radius, spacing, typography, shadows } from '../theme';
import { useApp } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { ClashAlertBanner } from '../components/IngredientClash/ClashAlertBanner';
import { IngredientChecker } from '../components/IngredientClash/IngredientChecker';
import { Button } from '../components/common/Button';
import { SunIcon, MoonIcon, SparklesIcon } from '../components/common/Icons';

export const ClashCheckScreen: React.FC = () => {
  const {
    activeActives,
    toggleActiveIngredient,
    evaluation,
    scanResult,
    setActiveTab,
    loadRoutinePreset,
    clearActiveIngredients,
    themeColors,
  } = useApp();

  return (
    <View style={[styles.screenWrapper, { backgroundColor: themeColors.bgPrimary }]}>
      <Header title="Clash Copilot" subtitle="Molecular Compatibility AI" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Intro Header */}
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Text style={[styles.introCaption, { color: themeColors.emerald }]}>
            DERMATOLOGICAL CONTRAINDICATION ENGINE
          </Text>
          <Text style={[styles.introTitle, { color: themeColors.textPrimary }]}>
            Molecular Clash Intelligence
          </Text>
          <Text style={[styles.introDesc, { color: themeColors.textSecondary }]}>
            Cross-examines active ingredients against your clinical barrier score ({scanResult.barrierHealthScore}/100) and melanin phototype ({scanResult.fitzpatrickType}).
          </Text>
        </View>

        {/* Primary Live Evaluation Banner */}
        <ClashAlertBanner evaluation={evaluation} />

        {/* AM vs PM Safe Regimen Distribution */}
        <View
          style={[
            styles.scheduleCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <View style={styles.scheduleHeader}>
            <SparklesIcon size={14} color={themeColors.gold} />
            <Text style={[styles.scheduleTitle, { color: themeColors.gold }]}>
              DERMATOLOGICALLY SAFE AM/PM TIMELINE
            </Text>
          </View>

          <View style={styles.scheduleRow}>
            {/* Morning Column */}
            <View style={styles.scheduleCol}>
              <View style={styles.colHeaderRow}>
                <SunIcon size={14} color={themeColors.gold} />
                <Text style={[styles.colHeader, { color: themeColors.textPrimary }]}>
                  Morning (AM)
                </Text>
              </View>
              {evaluation.recommendedSchedule.morningActives.length > 0 ? (
                evaluation.recommendedSchedule.morningActives.map((act, i) => (
                  <View key={`am-${i}`} style={styles.activeItem}>
                    <View style={[styles.bullet, { backgroundColor: themeColors.gold }]} />
                    <Text style={[styles.activeText, { color: themeColors.textPrimary }]}>
                      {act}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                  Gentle Cleanser + SPF Only
                </Text>
              )}
            </View>

            <View style={[styles.colDivider, { backgroundColor: themeColors.border }]} />

            {/* Night Column */}
            <View style={styles.scheduleCol}>
              <View style={styles.colHeaderRow}>
                <MoonIcon size={14} color={themeColors.cyan} />
                <Text style={[styles.colHeader, { color: themeColors.textPrimary }]}>
                  Evening (PM)
                </Text>
              </View>
              {evaluation.recommendedSchedule.eveningActives.length > 0 ? (
                evaluation.recommendedSchedule.eveningActives.map((act, i) => (
                  <View key={`pm-${i}`} style={styles.activeItem}>
                    <View style={[styles.bullet, { backgroundColor: themeColors.cyan }]} />
                    <Text style={[styles.activeText, { color: themeColors.textPrimary }]}>
                      {act}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                  Ceramide Barrier Slugging
                </Text>
              )}
            </View>
          </View>

          {/* Paused Actives Warning */}
          {evaluation.recommendedSchedule.pausedActives.length > 0 && (
            <View style={[styles.pausedBox, { borderTopColor: themeColors.border }]}>
              <Text style={[styles.pausedLabel, { color: themeColors.rose }]}>
                ⏸️ RESTRICTED UNTIL BARRIER REACHES THRESHOLD:
              </Text>
              <Text style={[styles.pausedText, { color: themeColors.textPrimary }]}>
                {evaluation.recommendedSchedule.pausedActives.join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Interactive Active Ingredient Selector */}
        <IngredientChecker
          selectedActives={activeActives}
          onToggleActive={toggleActiveIngredient}
          barrierScore={scanResult.barrierHealthScore}
          onLoadPreset={loadRoutinePreset}
          onClearAll={clearActiveIngredients}
        />

        {/* Footer CTA to Regimen Store */}
        <View
          style={[
            styles.footerCTA,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Text style={[typography.h3, { color: themeColors.textPrimary }]}>
            Ready for a clinically verified routine?
          </Text>
          <Text style={[styles.footerDesc, { color: themeColors.textSecondary }]}>
            Eliminate guesswork, skin barrier damage, and product returns with curated regimens matching your exact skin state.
          </Text>
          <Button
            title="Browse Barrier-Safe Regimens & Bundles →"
            onPress={() => setActiveTab('regimen')}
            style={{ marginTop: 8 }}
          />
        </View>
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
  introCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
    ...shadows.card,
  },
  introCaption: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  introDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  scheduleCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scheduleCol: {
    flex: 1,
  },
  colHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  colHeader: {
    fontSize: 12,
    fontWeight: '800',
  },
  activeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  emptyText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  colDivider: {
    width: 1,
    marginHorizontal: 10,
  },
  pausedBox: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  pausedLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  pausedText: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  footerCTA: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.sm,
    ...shadows.card,
  },
  footerDesc: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 17,
  },
});
