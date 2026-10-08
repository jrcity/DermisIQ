import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { radius, spacing, typography, shadows } from '../theme';
import { useApp } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { FaceRadarVisualizer } from '../components/FaceScanner/FaceRadarVisualizer';
import { ZoneHeatmap } from '../components/FaceScanner/ZoneHeatmap';
import { MetricPill } from '../components/SkinMetrics/MetricPill';
import { CameraIcon, SparklesIcon, ShieldCheckIcon } from '../components/common/Icons';

export const ScanScreen: React.FC = () => {
  const {
    scanResult,
    selectedZone,
    setSelectedZone,
    setActiveTab,
        setIsLiveScanModalOpen,
    themeColors,
    userFitzpatrick,
  } = useApp();

  const [activeView, setActiveView] = useState<'radar' | 'heatmap'>('radar');

  return (
    <View style={[styles.screenWrapper, { backgroundColor: themeColors.bgPrimary }]}>
      <Header title="Diagnostics" subtitle="Clinical Skin Analysis" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Control Bar: Inferred Phototype Display + Live Scan Trigger */}
        <View
          style={[
            styles.controlCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <View style={styles.controlHeader}>
            <View style={styles.phototypeBadgeRow}>
              <SparklesIcon size={12} color={themeColors.emerald} />
              <Text style={[styles.controlCaption, { color: themeColors.emerald }]}>
                INFERRED PHOTOTYPE: {userFitzpatrick}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsLiveScanModalOpen(true)}
              style={[
                styles.liveScanBtn,
                { backgroundColor: themeColors.emerald },
              ]}
            >
              <CameraIcon size={14} color="#FFFFFF" />
              <Text style={styles.liveScanBtnText}>Open Camera / Upload</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsSummaryRow}>
            <View style={[styles.miniMetricBox, { backgroundColor: themeColors.bgCardSubtle }]}>
              <Text style={[styles.miniMetricLabel, { color: themeColors.textMuted }]}>
                UNDERTONE
              </Text>
              <View style={styles.undertoneChipRow}>
                <View style={[styles.toneDot, { backgroundColor: scanResult.shadeHex }]} />
                <Text style={[styles.miniMetricVal, { color: themeColors.textPrimary }]}>
                  {scanResult.undertone}
                </Text>
              </View>
            </View>

            <View style={[styles.miniMetricBox, { backgroundColor: themeColors.bgCardSubtle }]}>
              <Text style={[styles.miniMetricLabel, { color: themeColors.textMuted }]}>
                MELANIN INDEX
              </Text>
              <Text style={[styles.miniMetricVal, { color: themeColors.gold }]}>
                {scanResult.melaninIndex}/100
              </Text>
            </View>

            <View style={[styles.miniMetricBox, { backgroundColor: themeColors.bgCardSubtle }]}>
              <Text style={[styles.miniMetricLabel, { color: themeColors.textMuted }]}>
                STRATUM BHI
              </Text>
              <Text style={[styles.miniMetricVal, { color: themeColors.emerald }]}>
                {scanResult.barrierHealthScore}/100
              </Text>
            </View>
          </View>
        </View>

        {/* Radar vs Heatmap Segment Switcher */}
        <View
          style={[
            styles.viewToggle,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveView('radar')}
            style={[
              styles.viewToggleBtn,
              activeView === 'radar' && {
                backgroundColor: themeColors.bgElevated,
                ...shadows.card,
              },
            ]}
          >
            <Text
              style={[
                styles.viewToggleText,
                {
                  color:
                    activeView === 'radar'
                      ? themeColors.textPrimary
                      : themeColors.textMuted,
                },
                activeView === 'radar' && styles.viewToggleTextActive,
              ]}
            >
              🕸️ 6-Axis Radar Visualizer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveView('heatmap')}
            style={[
              styles.viewToggleBtn,
              activeView === 'heatmap' && {
                backgroundColor: themeColors.bgElevated,
                ...shadows.card,
              },
            ]}
          >
            <Text
              style={[
                styles.viewToggleText,
                {
                  color:
                    activeView === 'heatmap'
                      ? themeColors.textPrimary
                      : themeColors.textMuted,
                },
                activeView === 'heatmap' && styles.viewToggleTextActive,
              ]}
            >
              🗺️ Zone Diagnostic Overlay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Primary Visualizer View */}
        {activeView === 'radar' ? (
          <FaceRadarVisualizer parameters={scanResult.parameters} />
        ) : (
          <ZoneHeatmap
            zones={scanResult.zones}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            shadeHex={scanResult.shadeHex}
            onNavigateToClash={() => setActiveTab('clash')}
          />
        )}

        {/* Detected Melanin Phototype Card */}
        <View
          style={[
            styles.melaninCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <View style={styles.melaninLeft}>
            <View
              style={[
                styles.shadeCircle,
                { backgroundColor: scanResult.shadeHex },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.melaninCaption, { color: themeColors.gold }]}>
                DETECTED FACIAL MELANIN
              </Text>
              <Text style={[styles.melaninTitle, { color: themeColors.textPrimary }]}>
                {scanResult.fitzpatrickType} • {scanResult.undertone}
              </Text>
              <Text style={[styles.melaninSub, { color: themeColors.textSecondary }]}>
                Melanin Index: {scanResult.melaninIndex}/100 • Tone Hex: {scanResult.shadeHex}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('regimen')}
            style={[
              styles.vtoLinkBtn,
              {
                backgroundColor: themeColors.emeraldMuted,
                borderColor: themeColors.borderEmerald,
              },
            ]}
          >
            <SparklesIcon size={14} color={themeColors.emerald} />
            <Text style={[styles.vtoLinkText, { color: themeColors.emerald }]}>
              VTO SPF Match
            </Text>
          </TouchableOpacity>
        </View>

        {/* 9 Clinical Parameter Breakdown */}
        <View style={styles.parametersHeader}>
          <Text style={[typography.h2, { color: themeColors.textPrimary }]}>
            Clinical Parameters
          </Text>
          <Text style={[styles.parametersSub, { color: themeColors.textSecondary }]}>
            Tap any marker for clinical etiology &amp; dermatological advice:
          </Text>
        </View>

        {Object.values(scanResult.parameters).map(metric => (
          <MetricPill key={metric.id} metric={metric} />
        ))}
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
    paddingBottom: 130, // Clearance for bottom nav
  },
  controlCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  phototypeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    marginRight: 6,
  },
  controlCaption: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    ...shadows.glowEmerald,
  },
  liveScanBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricsSummaryRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  miniMetricBox: {
    flex: 1,
    borderRadius: radius.md,
    padding: 7,
  },
  miniMetricLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  undertoneChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  miniMetricVal: {
    fontSize: 11,
    fontWeight: '800',
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: radius.full,
    padding: 3,
    marginVertical: spacing.sm,
    borderWidth: 1,
  },
  viewToggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  viewToggleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  viewToggleTextActive: {
    fontWeight: '800',
  },
  melaninCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
    ...shadows.card,
  },
  melaninLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  shadeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.card,
  },
  melaninCaption: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  melaninTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  melaninSub: {
    fontSize: 11,
    marginTop: 2,
  },
  vtoLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  vtoLinkText: {
    fontSize: 10,
    fontWeight: '800',
  },
  parametersHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  parametersSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
