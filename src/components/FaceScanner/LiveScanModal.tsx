declare const document: any;
declare const FileReader: any;
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import Svg, { Ellipse, Circle } from "react-native-svg";
import { radius, spacing, shadows } from "../../theme";
import { Toast } from "../common/Toast";
import { useApp } from "../../context/AppContext";
import {
  CameraIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "../common/Icons";
import {
  pickPhotoFromGallery,
  capturePhotoFromCamera,
} from "../../utils/imagePicker";

interface LiveScanModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LiveScanModal: React.FC<LiveScanModalProps> = ({ visible, onClose }) => {
  const {
    runScan,
    isScanning,
    scanProgressStage,
    scanResult,
    setActiveTab,
    capturedFaceImage,
    themeColors,
    userFitzpatrick,
    toastConfig,
    hideToast,
  } = useApp();

  const [inputMode, setInputMode] = useState<"camera" | "upload" | "samples">("camera");
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);
  const [customPhotoBase64, setCustomPhotoBase64] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [scanFinished, setScanFinished] = useState(false);

  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && isScanning) {
      setScanFinished(false);
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      laserAnim.setValue(0);
    }
  }, [visible, isScanning, laserAnim]);

  // Open native gallery or web file input
  const handleUploadPhoto = async () => {
    setIsCapturing(true);
    try {
      const res = await pickPhotoFromGallery();
      if (res) {
        setCustomPhotoUri(res.uri);
        setCustomPhotoBase64(res.base64 || res.uri);
        setInputMode("upload");
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Open native camera or web front camera
  const handleCaptureSnapshot = async () => {
    setIsCapturing(true);
    try {
      const res = await capturePhotoFromCamera();
      if (res) {
        setCustomPhotoUri(res.uri);
        setCustomPhotoBase64(res.base64 || res.uri);
        setInputMode("camera");
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Load custom image URL
  const handleApplyUrl = () => {
    if (customUrlInput.trim().startsWith("http")) {
      setCustomPhotoUri(customUrlInput.trim());
      setCustomPhotoBase64(customUrlInput.trim());
      setInputMode("upload");
    }
  };

  // Run the full AI Diagnostic Pipeline
  const handleExecuteScan = async (presetId: "melaninSensitive" | "balancedProfile" | "deepMelaninProfile" = "melaninSensitive") => {
    setScanFinished(false);
    let imageSource: any = null;
    let base64OrUri: string | undefined = undefined;

    if (customPhotoUri) {
      imageSource = { uri: customPhotoUri };
      base64OrUri = customPhotoBase64 || customPhotoUri;
    }

    await runScan(presetId, imageSource, base64OrUri);
    setScanFinished(true);
  };

  const handleViewResults = () => {
    onClose();
    setActiveTab("scan");
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-115, 115],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: themeColors.bgPrimary }]}>
        {/* Header Bar */}
        <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
          <View>
            <View style={styles.badgeRow}>
              <View style={[styles.pulseDot, { backgroundColor: themeColors.emerald }]} />
              <Text style={[styles.headerCaption, { color: themeColors.emerald }]}>
                MULTISPECTRAL CLINICAL SCANNER
              </Text>
            </View>
            <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
              Live Facial Skin Diagnostic
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: themeColors.bgCardSubtle, borderColor: themeColors.border }]}
          >
            <Text style={[styles.closeBtnText, { color: themeColors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mode Tabs: Camera vs Upload vs Sample */}
          <View style={styles.modeTabsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setInputMode("camera")}
              style={[
                styles.modeTabBtn,
                {
                  backgroundColor: inputMode === "camera" ? themeColors.bgElevated : themeColors.bgCard,
                  borderColor: inputMode === "camera" ? themeColors.emerald : themeColors.borderLight,
                },
              ]}
            >
              <CameraIcon size={14} color={inputMode === "camera" ? themeColors.emerald : themeColors.textMuted} />
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color: inputMode === "camera" ? themeColors.textPrimary : themeColors.textMuted,
                    fontWeight: inputMode === "camera" ? "800" : "600",
                  },
                ]}
              >
                Live Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setInputMode("upload")}
              style={[
                styles.modeTabBtn,
                {
                  backgroundColor: inputMode === "upload" ? themeColors.bgElevated : themeColors.bgCard,
                  borderColor: inputMode === "upload" ? themeColors.emerald : themeColors.borderLight,
                },
              ]}
            >
              <SparklesIcon size={14} color={inputMode === "upload" ? themeColors.emerald : themeColors.textMuted} />
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color: inputMode === "upload" ? themeColors.textPrimary : themeColors.textMuted,
                    fontWeight: inputMode === "upload" ? "800" : "600",
                  },
                ]}
              >
                Gallery Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setInputMode("samples")}
              style={[
                styles.modeTabBtn,
                {
                  backgroundColor: inputMode === "samples" ? themeColors.bgElevated : themeColors.bgCard,
                  borderColor: inputMode === "samples" ? themeColors.emerald : themeColors.borderLight,
                },
              ]}
            >
              <ShieldCheckIcon size={14} color={inputMode === "samples" ? themeColors.emerald : themeColors.textMuted} />
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color: inputMode === "samples" ? themeColors.textPrimary : themeColors.textMuted,
                    fontWeight: inputMode === "samples" ? "800" : "600",
                  },
                ]}
              >
                Sample Faces
              </Text>
            </TouchableOpacity>
          </View>

          {/* Viewfinder Canvas with Face Guide & Laser Animation */}
          <View style={styles.viewfinderContainer}>
            <View
              style={[
                styles.viewfinderFrame,
                {
                  backgroundColor: "#070A10",
                  borderColor: isScanning ? themeColors.emerald : themeColors.borderEmerald,
                },
              ]}
            >
              <Image
                source={customPhotoUri ? { uri: customPhotoUri } : capturedFaceImage}
                style={styles.facePhoto}
                resizeMode="cover"
              />

              <View style={styles.photoOverlay} />

              {/* Facial Geometry Target Overlay */}
              <View style={styles.svgGuideContainer}>
                <Svg width="220" height="260" viewBox="0 0 220 260">
                  <Ellipse
                    cx="110"
                    cy="125"
                    rx="75"
                    ry="100"
                    stroke={isScanning ? themeColors.emerald : "rgba(16, 185, 129, 0.45)"}
                    strokeWidth="1.8"
                    strokeDasharray="6,4"
                    fill="none"
                  />
                  <Circle
                    cx="80"
                    cy="105"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    fill="none"
                  />
                  <Circle
                    cx="140"
                    cy="105"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    fill="none"
                  />
                </Svg>
              </View>

              {/* Viewfinder Corner Brackets */}
              <View style={[styles.cornerBracket, styles.topLeft, { borderColor: themeColors.emerald }]} />
              <View style={[styles.cornerBracket, styles.topRight, { borderColor: themeColors.emerald }]} />
              <View style={[styles.cornerBracket, styles.bottomLeft, { borderColor: themeColors.emerald }]} />
              <View style={[styles.cornerBracket, styles.bottomRight, { borderColor: themeColors.emerald }]} />

              {/* Animated Hyperspectral Laser Sweep */}
              {isScanning && (
                <Animated.View
                  style={[
                    styles.laserBeam,
                    { transform: [{ translateY: laserTranslateY }] },
                  ]}
                >
                  <View style={[styles.laserCore, { backgroundColor: themeColors.emerald }]} />
                  <View style={styles.laserGlow} />
                </Animated.View>
              )}

              {/* Capturing Indicator Overlay */}
              {isCapturing && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.loadingText}>Opening Camera...</Text>
                </View>
              )}

              {/* Telemetry Stage Pill */}
              {isScanning && (
                <View style={styles.telemetryOverlay}>
                  <ActivityIndicator size="small" color="#10B981" />
                  <Text style={styles.telemetryText}>{scanProgressStage}</Text>
                </View>
              )}

              {/* Scan Completed Success Overlay */}
              {scanFinished && !isScanning && (
                <View style={styles.completeOverlay}>
                  <CheckIcon size={18} color="#10B981" />
                  <Text style={styles.completeTitle}>Diagnostic Inferred &amp; Verified</Text>
                  <Text style={styles.completeScore}>
                    Inferred Phototype: {scanResult.fitzpatrickType} • BHI {scanResult.barrierHealthScore}/100
                  </Text>
                  <View style={styles.toneResultPill}>
                    <View style={[styles.toneResultDot, { backgroundColor: scanResult.shadeHex }]} />
                    <Text style={styles.toneResultText}>
                      {scanResult.undertone} ({scanResult.shadeHex})
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Camera Snapshot Shutter Trigger */}
          {inputMode === "camera" && !isScanning && (
            <View style={styles.cameraActionRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCaptureSnapshot}
                style={[styles.cameraSnapBtn, { backgroundColor: themeColors.emerald }]}
              >
                <CameraIcon size={18} color="#FFFFFF" />
                <Text style={styles.cameraSnapText}>
                  {customPhotoUri ? "Snap New Face Photo" : "Take Photo with Camera"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Upload Picture File Picker Trigger */}
          {inputMode === "upload" && !isScanning && (
            <View style={styles.uploadActionRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleUploadPhoto}
                style={[styles.uploadPickBtn, { backgroundColor: themeColors.emerald }]}
              >
                <SparklesIcon size={18} color="#FFFFFF" />
                <Text style={styles.cameraSnapText}>
                  {customPhotoUri ? "Choose Different Gallery Photo" : "Pick Photo from Device Gallery"}
                </Text>
              </TouchableOpacity>

              {/* Direct Image URL input */}
              <View style={styles.urlInputRow}>
                <TextInput
                  placeholder="Or paste direct image URL (https://...)"
                  placeholderTextColor={themeColors.textMuted}
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  style={[
                    styles.urlTextInput,
                    {
                      backgroundColor: themeColors.bgCardSubtle,
                      borderColor: themeColors.borderLight,
                      color: themeColors.textPrimary,
                    },
                  ]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleApplyUrl}
                  style={[styles.applyUrlBtn, { backgroundColor: themeColors.emeraldMuted, borderColor: themeColors.borderEmerald }]}
                >
                  <Text style={[styles.applyUrlBtnText, { color: themeColors.emerald }]}>Load</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Sample Faces Switcher */}
          {inputMode === "samples" && (
            <View style={styles.samplesRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setCustomPhotoUri(null);
                  setCustomPhotoBase64(null);
                  handleExecuteScan("melaninSensitive");
                }}
                style={[styles.sampleMiniBtn, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}
              >
                <View style={[styles.sampleMiniDot, { backgroundColor: "#A26E4F" }]} />
                <Text style={[styles.sampleMiniText, { color: themeColors.textPrimary }]}>
                  Sample IV (Sensitive)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setCustomPhotoUri(null);
                  setCustomPhotoBase64(null);
                  handleExecuteScan("balancedProfile");
                }}
                style={[styles.sampleMiniBtn, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}
              >
                <View style={[styles.sampleMiniDot, { backgroundColor: "#C59A78" }]} />
                <Text style={[styles.sampleMiniText, { color: themeColors.textPrimary }]}>
                  Sample III (Balanced)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setCustomPhotoUri(null);
                  setCustomPhotoBase64(null);
                  handleExecuteScan("deepMelaninProfile");
                }}
                style={[styles.sampleMiniBtn, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}
              >
                <View style={[styles.sampleMiniDot, { backgroundColor: "#4A2B19" }]} />
                <Text style={[styles.sampleMiniText, { color: themeColors.textPrimary }]}>
                  Sample VI (Deep Melanin)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Liveliness & Quality Validation Card */}
          <View
            style={[
              styles.livelinessCard,
              {
                backgroundColor: themeColors.bgCard,
                borderColor: themeColors.borderLight,
              },
            ]}
          >
            <View style={styles.livelinessHeader}>
              <Text style={[styles.livelinessTitle, { color: themeColors.textMuted }]}>
                LIVELINESS BIOMETRICS
              </Text>
              <View
                style={[
                  styles.liveStatusBadge,
                  { backgroundColor: themeColors.emeraldMuted },
                ]}
              >
                <Text style={[styles.liveStatusText, { color: themeColors.emerald }]}>
                  OPTIMAL
                </Text>
              </View>
            </View>

            <View style={styles.livelinessGrid}>
              <View style={styles.livelinessItem}>
                <View style={[styles.livelinessDot, { backgroundColor: themeColors.emerald }]} />
                <Text style={[styles.livelinessLabel, { color: themeColors.textSecondary }]}>
                  Face Position: Centered
                </Text>
              </View>
              <View style={styles.livelinessItem}>
                <View style={[styles.livelinessDot, { backgroundColor: themeColors.emerald }]} />
                <Text style={[styles.livelinessLabel, { color: themeColors.textSecondary }]}>
                  Lighting: Good (Diffused)
                </Text>
              </View>
              <View style={styles.livelinessItem}>
                <View style={[styles.livelinessDot, { backgroundColor: themeColors.emerald }]} />
                <Text style={[styles.livelinessLabel, { color: themeColors.textSecondary }]}>
                  Frontal Angle: 0° Tilt
                </Text>
              </View>
              <View style={styles.livelinessItem}>
                <View style={[styles.livelinessDot, { backgroundColor: themeColors.emerald }]} />
                <Text style={[styles.livelinessLabel, { color: themeColors.textSecondary }]}>
                  Face Coverage: 88% Area
                </Text>
              </View>
            </View>
          </View>

          {/* Primary Action Button */}
          {!isScanning && !scanFinished && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleExecuteScan()}
              style={[
                styles.primaryScanBtn,
                { backgroundColor: themeColors.emerald },
              ]}
            >
              <View style={styles.btnRow}>
                <SparklesIcon size={16} color="#FFFFFF" />
                <Text style={styles.primaryScanBtnText}>
                  Infer Fitzpatrick Scale &amp; Analyze Skin
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Results Action Buttons */}
          {scanFinished && !isScanning && (
            <View style={styles.btnRowDouble}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleExecuteScan()}
                style={[
                  styles.rescanBtn,
                  {
                    backgroundColor: themeColors.bgCardSubtle,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text style={[styles.rescanBtnText, { color: themeColors.textPrimary }]}>
                  Rescan Face
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleViewResults}
                style={[
                  styles.viewResultsBtn,
                  {
                    backgroundColor: themeColors.emerald,
                  },
                ]}
              >
                <ShieldCheckIcon size={14} color="#FFFFFF" />
                <Text style={styles.viewResultsBtnText}>
                  Explore Diagnostics &amp; Store →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Inferred Fitzpatrick Phototype Showcase */}
          <View style={styles.inferredCard}>
            <View
              style={[
                styles.inferredInner,
                {
                  backgroundColor: themeColors.bgCard,
                  borderColor: themeColors.borderEmerald,
                },
              ]}
            >
              <View style={styles.inferredHeader}>
                <View style={styles.inferredTitleRow}>
                  <View style={[styles.phototypeBadge, { backgroundColor: themeColors.emeraldMuted }]}>
                    <Text style={[styles.phototypeBadgeText, { color: themeColors.emerald }]}>
                      AUTOMATIC INFERENCE
                    </Text>
                  </View>
                  <Text style={[styles.confidenceText, { color: themeColors.textMuted }]}>
                    Confidence: 98%
                  </Text>
                </View>

                <Text style={[styles.inferredMainTitle, { color: themeColors.textPrimary }]}>
                  Inferred: {userFitzpatrick} ({scanResult.undertone})
                </Text>
                <Text style={[styles.inferredDesc, { color: themeColors.textSecondary }]}>
                  Extracted via Fitzpatrick Phototype &amp; Color Tone Neural Models. All product formulations and clash warnings automatically recalibrated.
                </Text>
              </View>

              <View style={styles.inferredMetricsRow}>
                <View style={[styles.inferredMetricBox, { backgroundColor: themeColors.bgCardSubtle }]}>
                  <Text style={[styles.metricBoxLabel, { color: themeColors.textMuted }]}>
                    TONE SWATCH
                  </Text>
                  <View style={styles.metricSwatchRow}>
                    <View style={[styles.swatchDot, { backgroundColor: scanResult.shadeHex }]} />
                    <Text style={[styles.metricBoxVal, { color: themeColors.textPrimary }]}>
                      {scanResult.shadeHex}
                    </Text>
                  </View>
                </View>

                <View style={[styles.inferredMetricBox, { backgroundColor: themeColors.bgCardSubtle }]}>
                  <Text style={[styles.metricBoxLabel, { color: themeColors.textMuted }]}>
                    BARRIER HEALTH (BHI)
                  </Text>
                  <Text style={[styles.metricBoxVal, { color: themeColors.emerald }]}>
                    {scanResult.barrierHealthScore}/100
                  </Text>
                </View>

                <View style={[styles.inferredMetricBox, { backgroundColor: themeColors.bgCardSubtle }]}>
                  <Text style={[styles.metricBoxLabel, { color: themeColors.textMuted }]}>
                    MELANIN RISK
                  </Text>
                  <Text
                    style={[
                      styles.metricBoxVal,
                      {
                        color:
                          userFitzpatrick === "Type IV" ||
                          userFitzpatrick === "Type V" ||
                          userFitzpatrick === "Type VI"
                            ? themeColors.gold
                            : themeColors.cyan,
                      },
                    ]}
                  >
                    {userFitzpatrick === "Type IV" ||
                    userFitzpatrick === "Type V" ||
                    userFitzpatrick === "Type VI"
                      ? "High PIH"
                      : "Erythema"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <Toast
          visible={toastConfig.visible}
          message={toastConfig.message}
          title={toastConfig.title}
          type={toastConfig.type}
          onDismiss={hideToast}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerCaption: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  modeTabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  modeTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  modeTabText: {
    fontSize: 10,
  },
  viewfinderContainer: {
    alignItems: "center",
    paddingTop: spacing.sm,
  },
  viewfinderFrame: {
    width: 250,
    height: 290,
    borderRadius: radius.xl,
    borderWidth: 2,
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
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(7, 10, 16, 0.22)",
  },
  svgGuideContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cornerBracket: {
    position: "absolute",
    width: 22,
    height: 22,
  },
  topLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  topRight: {
    top: 12,
    right: 12,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
  },
  bottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  bottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  laserBeam: {
    position: "absolute",
    width: "100%",
    height: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  laserCore: {
    width: "92%",
    height: 2.5,
    borderRadius: 1,
  },
  laserGlow: {
    position: "absolute",
    width: "92%",
    height: 12,
    backgroundColor: "rgba(16, 185, 129, 0.28)",
  },
  loadingOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  telemetryOverlay: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(7, 10, 16, 0.92)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  telemetryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  completeOverlay: {
    position: "absolute",
    bottom: 12,
    left: 10,
    right: 10,
    backgroundColor: "rgba(7, 10, 16, 0.94)",
    padding: 10,
    borderRadius: radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.6)",
  },
  completeTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },
  completeScore: {
    color: "#CBD5E1",
    fontSize: 10,
    marginTop: 2,
  },
  toneResultPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  toneResultDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  toneResultText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  cameraActionRow: {
    paddingHorizontal: spacing.md,
    marginTop: 8,
  },
  cameraSnapBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: radius.lg,
    ...shadows.glowEmerald,
  },
  cameraSnapText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  uploadActionRow: {
    paddingHorizontal: spacing.md,
    marginTop: 8,
    gap: 8,
  },
  uploadPickBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: radius.lg,
    ...shadows.glowEmerald,
  },
  urlInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  urlTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 11,
  },
  applyUrlBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  applyUrlBtnText: {
    fontSize: 11,
    fontWeight: "800",
  },
  samplesRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.md,
    marginTop: 8,
  },
  sampleMiniBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 7,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  sampleMiniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sampleMiniText: {
    fontSize: 9,
    fontWeight: "700",
  },
  livelinessCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    ...shadows.card,
  },
  livelinessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  livelinessTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  liveStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  liveStatusText: {
    fontSize: 8,
    fontWeight: "900",
  },
  livelinessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
  },
  livelinessItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "48%",
  },
  livelinessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  livelinessLabel: {
    fontSize: 10,
  },
  primaryScanBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.glowEmerald,
  },
  primaryScanBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnRowDouble: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  rescanBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rescanBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  viewResultsBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  viewResultsBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  inferredCard: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  inferredInner: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    ...shadows.card,
  },
  inferredHeader: {
    marginBottom: 10,
  },
  inferredTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  phototypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  phototypeBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  confidenceText: {
    fontSize: 10,
  },
  inferredMainTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  inferredDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  inferredMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  inferredMetricBox: {
    flex: 1,
    borderRadius: radius.md,
    padding: 8,
  },
  metricBoxLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  metricSwatchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  swatchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricBoxVal: {
    fontSize: 11,
    fontWeight: "800",
  },
});
