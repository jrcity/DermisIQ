import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { radius, spacing, typography, shadows } from '../theme';
import { useApp } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { BarrierHealthMeter } from '../components/SkinMetrics/BarrierHealthMeter';
import { ClashAlertBanner } from '../components/IngredientClash/ClashAlertBanner';
import {
  CameraIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
} from '../components/common/Icons';

export const HomeScreen: React.FC = () => {
  const {
    scanResult,
    evaluation,
    setActiveTab,
    runScan,
    isScanning,
    capturedFaceImage,
        setIsLiveScanModalOpen,
    themeColors,
    setIsApiConsoleOpen,
    userFitzpatrick,
  } = useApp();

  const isDeepOrOlive =
    userFitzpatrick === "Type IV" ||
    userFitzpatrick === "Type V" ||
    userFitzpatrick === "Type VI";

  return (
    <View style={[styles.screenWrapper, { backgroundColor: themeColors.bgPrimary }]}>
      <Header />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* YouCam Connectivity & Telemetry Row */}
        <View style={styles.statusRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsApiConsoleOpen(true)}
            style={styles.apiOnlineBadge}
          >
            <View style={[styles.onlineDot, { backgroundColor: themeColors.emerald }]} />
            <Text style={[styles.apiOnlineText, { color: themeColors.emerald }]}>
              CLINICAL AI ENGINE • ACTIVE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsApiConsoleOpen(true)}
          >
            <Text style={[styles.liveModeText, { color: themeColors.textMuted }]}>
              Calibrated Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current Scanned Face Profile Summary Card */}
        <View
          style={[
            styles.faceSubjectBanner,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Image
            source={capturedFaceImage}
            style={styles.subjectThumbnail}
            resizeMode="cover"
          />

          <View style={styles.subjectInfo}>
            <View style={styles.subjectBadgeRow}>
              <View
                style={[
                  styles.subjectToneDot,
                  { backgroundColor: scanResult.shadeHex },
                ]}
              />
              <Text style={[styles.subjectType, { color: themeColors.textPrimary }]}>
                {scanResult.fitzpatrickType} • {scanResult.undertone}
              </Text>
            </View>
            <Text style={[styles.subjectSub, { color: themeColors.textSecondary }]}>
              Tone Hex: {scanResult.shadeHex} • Bio Age: {scanResult.skinAge} yrs
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsLiveScanModalOpen(true)}
            style={[
              styles.rescanMiniBtn,
              {
                backgroundColor: themeColors.emeraldMuted,
                borderColor: themeColors.borderEmerald,
              },
            ]}
          >
            <CameraIcon size={13} color={themeColors.emerald} />
            <Text style={[styles.rescanMiniText, { color: themeColors.emerald }]}>
              Rescan Face
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clinical Stratum Corneum Barrier Meter */}
        <BarrierHealthMeter
          score={scanResult.barrierHealthScore}
          skinAge={scanResult.skinAge}
          fitzpatrick={scanResult.fitzpatrickType}
          undertone={scanResult.undertone}
        />

        {/* Live Camera Scanner Trigger Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setIsLiveScanModalOpen(true)}
          style={[
            styles.scannerHeroCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderEmerald,
            },
          ]}
        >
          <View style={styles.scannerLeft}>
            <View
              style={[
                styles.cameraIconCircle,
                { backgroundColor: themeColors.emerald },
              ]}
            >
              <CameraIcon size={22} color="#FFFFFF" />
            </View>
            <View style={styles.scannerTextCol}>
              <Text style={[styles.scannerTitle, { color: themeColors.textPrimary }]}>
                Live Facial Skin Diagnostic
              </Text>
              <Text
                style={[styles.scannerDesc, { color: themeColors.textSecondary }]}
                numberOfLines={1}
              >
                Inferred: {userFitzpatrick} • Zone Heatmap • Shade VTO
              </Text>
            </View>
          </View>
          <ChevronRightIcon size={18} color={themeColors.emerald} />
        </TouchableOpacity>

        {/* AI-Inferred Melanin Phototype Calibration Banner */}
        <View
          style={[
            styles.inferredCalibrationCard,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <View style={styles.calibrationHeaderRow}>
            <View style={styles.calibrationTagRow}>
              <SparklesIcon size={12} color={themeColors.emerald} />
              <Text style={[styles.calibrationTagText, { color: themeColors.emerald }]}>
                CLINICAL MELANIN PHOTOTYPE
              </Text>
            </View>
            <Text style={[styles.confidenceLabel, { color: themeColors.textMuted }]}>
              Confidence: 98%
            </Text>
          </View>

          <View style={styles.calibrationMainRow}>
            <View
              style={[
                styles.toneSquare,
                { backgroundColor: scanResult.shadeHex },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.calibrationTitle, { color: themeColors.textPrimary }]}>
                {userFitzpatrick} ({scanResult.undertone})
              </Text>
              <Text style={[styles.calibrationDesc, { color: themeColors.textSecondary }]}>
                {isDeepOrOlive
                  ? "Elevated Post-Inflammatory Hyperpigmentation (PIH) risk. Harsh acids buffered automatically."
                  : "Elevated erythema and sun sensitivity. Calibrated with high broad-spectrum zinc barrier."}
              </Text>
            </View>
          </View>

          <View style={styles.calibrationActionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsLiveScanModalOpen(true)}
              style={[
                styles.quickActionBtn,
                { backgroundColor: themeColors.bgCardSubtle, borderColor: themeColors.border },
              ]}
            >
              <CameraIcon size={13} color={themeColors.emerald} />
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>
                Use Live Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsLiveScanModalOpen(true)}
              style={[
                styles.quickActionBtn,
                { backgroundColor: themeColors.bgCardSubtle, borderColor: themeColors.border },
              ]}
            >
              <SparklesIcon size={13} color={themeColors.emerald} />
              <Text style={[styles.quickActionText, { color: themeColors.textPrimary }]}>
                Upload Face Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Regimen Safety Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <ShieldCheckIcon size={16} color={themeColors.emerald} />
            <Text style={[typography.h3, { color: themeColors.textPrimary }]}>
              Active Chemical Clash Copilot
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveTab('clash')}
            accessibilityRole="button"
          >
            <Text style={[styles.sectionLink, { color: themeColors.cyan }]}>
              Open Copilot →
            </Text>
          </TouchableOpacity>
        </View>

        <ClashAlertBanner evaluation={evaluation} />

        {/* Today's Dermatological Timeline */}
        <View
          style={[
            styles.routineSection,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <Text style={[typography.h3, { color: themeColors.textPrimary, marginBottom: 8 }]}>
            Today's Clinical Regimen
          </Text>

          <View style={styles.routineTimeline}>
            {/* AM Step */}
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineIconBox,
                  { backgroundColor: themeColors.goldMuted },
                ]}
              >
                <SunIcon size={14} color={themeColors.gold} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: themeColors.textPrimary }]}>
                  Morning Protocol (AM)
                </Text>
                <Text style={[styles.timelineDesc, { color: themeColors.textSecondary }]}>
                  Gentle Amino Cleanser + ChromaShield Tinted Mineral SPF 50 ({scanResult.shadeHex})
                </Text>
              </View>
            </View>

            {/* PM Step */}
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineIconBox,
                  { backgroundColor: themeColors.cyanMuted },
                ]}
              >
                <MoonIcon size={14} color={themeColors.cyan} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: themeColors.textPrimary }]}>
                  Evening Protocol (PM)
                </Text>
                <Text style={[styles.timelineDesc, { color: themeColors.textSecondary }]}>
                  {scanResult.barrierHealthScore < 60
                    ? 'LipidShield Ceramide Slugging (Potent acids paused for barrier recovery)'
                    : isDeepOrOlive
                    ? 'Azelaic Acid 10% (Anti-PIH) + LipidShield 5X Ceramide Fortification'
                    : 'Centella Barrier Gel + Peptide Matrix Fortification'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('regimen')}
            style={[
              styles.viewStoreBtn,
              {
                backgroundColor: themeColors.bgCardSubtle,
                borderColor: themeColors.borderLight,
              },
            ]}
          >
            <Text style={[styles.viewStoreBtnText, { color: themeColors.emerald }]}>
              Browse Recommended Regimen Products →
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 130, // Generous padding to prevent overlap with bottom navigation!
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  apiOnlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  apiOnlineText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveModeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  faceSubjectBanner: {
    borderRadius: radius.lg,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: spacing.xs,
    gap: 10,
    ...shadows.card,
  },
  subjectThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subjectToneDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  subjectType: {
    fontSize: 12,
    fontWeight: '800',
  },
  subjectSub: {
    fontSize: 10,
    marginTop: 2,
  },
  rescanMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  rescanMiniText: {
    fontSize: 10,
    fontWeight: '800',
  },
  scannerHeroCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    marginVertical: spacing.xs,
    ...shadows.glowEmerald,
  },
  scannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cameraIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTextCol: {
    flex: 1,
  },
  scannerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  scannerDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  inferredCalibrationCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  calibrationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calibrationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  calibrationTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  confidenceLabel: {
    fontSize: 10,
  },
  calibrationMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  toneSquare: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  calibrationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  calibrationDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  calibrationActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionLink: {
    fontSize: 11,
    fontWeight: '800',
  },
  routineSection: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    ...shadows.card,
  },
  routineTimeline: {
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  timelineIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  timelineDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  viewStoreBtn: {
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  viewStoreBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
