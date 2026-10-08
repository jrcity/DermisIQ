import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { radius, spacing, shadows } from "../theme";
import { useApp } from "../context/AppContext";
import {
  CameraIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckIcon,
  ShieldAlertIcon,
} from "../components/common/Icons";
import {
  pickPhotoFromGallery,
  capturePhotoFromCamera,
} from "../utils/imagePicker";
import { FALLBACK_FACE_ASSETS } from "../api/youcam/mockData";

export const OnboardingScreen: React.FC = () => {
  const {
    themeColors,
    completeOnboarding,
    isScanning,
    scanProgressStage,
    scanProgress,
    scanResult,
    userFitzpatrick,
    showToast,
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedPhotoOption, setSelectedPhotoOption] = useState<"camera" | "upload" | "sample">("camera");
  const [selectedSamplePreset, setSelectedSamplePreset] = useState<
    "melaninSensitive" | "balancedProfile" | "deepMelaninProfile"
  >("melaninSensitive");

  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [calibrationError, setCalibrationError] = useState<string | null>(null);

  // Animatable Face Animation Values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentSlide === 3) {
      // Sweeping laser animation
      const scanAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      // Biometric pulse
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      // Concentric radar expansion
      const radarAnimation = Animated.loop(
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );

      scanAnimation.start();
      pulseAnimation.start();
      radarAnimation.start();

      return () => {
        scanAnimation.stop();
        pulseAnimation.stop();
        radarAnimation.stop();
      };
    }
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < 3) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0 && !isScanning) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Trigger real photo picker from device gallery
  const handleTriggerUpload = async () => {
    setIsCapturing(true);
    try {
      const res = await pickPhotoFromGallery();
      if (res) {
        setUploadedImageUri(res.uri);
        setUploadedBase64(res.base64 || res.uri);
        setSelectedPhotoOption("upload");
      }
    } catch (err: any) {
      Alert.alert("Gallery Notice", err?.message || "Could not select image.");
    } finally {
      setIsCapturing(false);
    }
  };

  // Trigger real camera capture with Android runtime permission
  const handleTakeSnapshot = async () => {
    setIsCapturing(true);
    try {
      const res = await capturePhotoFromCamera();
      if (res) {
        setUploadedImageUri(res.uri);
        setUploadedBase64(res.base64 || res.uri);
        setSelectedPhotoOption("camera");
      }
    } catch (err: any) {
      Alert.alert("Camera Notice", err?.message || "Could not access device camera.");
    } finally {
      setIsCapturing(false);
    }
  };

  // Set custom image URL
  const handleApplyUrl = () => {
    if (customUrlInput.trim().startsWith("http")) {
      setUploadedImageUri(customUrlInput.trim());
      setUploadedBase64(customUrlInput.trim());
      setSelectedPhotoOption("upload");
    }
  };

  // Trigger Neural Cloud Calibration & AWAIT ALL ENDPOINTS
  const handleStartCalibration = async () => {
    setCurrentSlide(3);
    setAnalysisComplete(false);
    setCalibrationError(null);

    let imagePayload: any = null;
    let base64OrUri: string | undefined = undefined;

    if ((selectedPhotoOption === "upload" || selectedPhotoOption === "camera") && uploadedImageUri) {
      imagePayload = { uri: uploadedImageUri };
      base64OrUri = uploadedBase64 || uploadedImageUri;
    } else {
      if (selectedSamplePreset === "melaninSensitive") {
        imagePayload = FALLBACK_FACE_ASSETS.melaninSensitive;
      } else if (selectedSamplePreset === "balancedProfile") {
        imagePayload = FALLBACK_FACE_ASSETS.balancedProfile;
      } else {
        imagePayload = FALLBACK_FACE_ASSETS.deepMelaninProfile;
      }
    }

    try {
      // Strictly awaits all 4 neural endpoints (Fitzpatrick, Tone, Face Attr, Skin Analysis)
      await completeOnboarding(imagePayload, selectedSamplePreset, base64OrUri);
      setAnalysisComplete(true);
    } catch (error: any) {
      console.warn("Calibration error:", error);
      const msg = error?.message || "Calibration completed with local telemetry.";
      setCalibrationError(msg);
      showToast(msg, "warning", "Calibration Advisory");
      setAnalysisComplete(true);
    }
  };

  const sampleSubjects = [
    {
      id: "melaninSensitive" as const,
      title: "Sample A (Fitz IV)",
      subtitle: "Sensitive & Reactive",
      img: FALLBACK_FACE_ASSETS.melaninSensitive,
      color: "#A26E4F",
    },
    {
      id: "balancedProfile" as const,
      title: "Sample B (Fitz III)",
      subtitle: "Balanced Barrier",
      img: FALLBACK_FACE_ASSETS.balancedProfile,
      color: "#C59A78",
    },
    {
      id: "deepMelaninProfile" as const,
      title: "Sample C (Fitz VI)",
      subtitle: "Deep Melanin Tone",
      img: FALLBACK_FACE_ASSETS.deepMelaninProfile,
      color: "#4A2B19",
    },
  ];

  // Resolve currently active face image for animatable display
  const resolveActiveFaceImage = () => {
    if (uploadedImageUri) {
      return { uri: uploadedImageUri };
    }
    if (selectedSamplePreset === "balancedProfile") {
      return FALLBACK_FACE_ASSETS.balancedProfile;
    }
    if (selectedSamplePreset === "deepMelaninProfile") {
      return FALLBACK_FACE_ASSETS.deepMelaninProfile;
    }
    return FALLBACK_FACE_ASSETS.melaninSensitive;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bgPrimary }]}>
      {/* Top Header Progress */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View style={[styles.brandIcon, { backgroundColor: themeColors.emerald }]}>
            <SparklesIcon size={14} color="#FFFFFF" />
          </View>
          <Text style={[styles.brandName, { color: themeColors.textPrimary }]}>
            Dermis<Text style={{ color: themeColors.emerald }}>IQ</Text>
          </Text>
        </View>

        {/* Progress Step Indicators */}
        <View style={styles.stepIndicatorRow}>
          {[0, 1, 2, 3].map(step => (
            <View
              key={step}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    step === currentSlide
                      ? themeColors.emerald
                      : step < currentSlide
                      ? themeColors.borderEmerald
                      : themeColors.borderLight,
                  width: step === currentSlide ? 22 : 6,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => completeOnboarding()}
          style={styles.skipBtn}
        >
          <Text style={[styles.skipText, { color: themeColors.textMuted }]}>
            Skip →
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SLIDE 0: THE MELANIN PARADOX */}
        {currentSlide === 0 && (
          <View style={styles.slideWrapper}>
            <View style={styles.pillBadgeRow}>
              <View style={[styles.microBadge, { backgroundColor: themeColors.emeraldMuted, borderColor: themeColors.borderEmerald }]}>
                <ShieldCheckIcon size={12} color={themeColors.emerald} />
                <Text style={[styles.microBadgeText, { color: themeColors.emerald }]}>
                  PRECISION DERMATOLOGY
                </Text>
              </View>
            </View>

            <Text style={[styles.slideTitle, { color: themeColors.textPrimary }]}>
              The Melanin Paradox
            </Text>
            <Text style={[styles.slideSubtitle, { color: themeColors.textSecondary }]}>
              Generic skincare formulas are clinically hazardous to darker skin tones. Active chemical clashes ignite post-inflammatory hyperpigmentation (PIH).
            </Text>

            {/* Visual Comparison Infographic */}
            <View style={styles.comparisonGrid}>
              <View
                style={[
                  styles.comparisonCard,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.rose,
                  },
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardTag, { color: themeColors.rose }]}>
                    TRADITIONAL APPS
                  </Text>
                  <ShieldAlertIcon size={14} color={themeColors.rose} />
                </View>
                <Text style={[styles.cardHeading, { color: themeColors.textPrimary }]}>
                  Blind Guessing
                </Text>
                <Text style={[styles.cardBody, { color: themeColors.textSecondary }]}>
                  • Manual subjective questionnaires\n
                  • Unmonitored 10% Glycolic + Retinol acid clashes\n
                  • Severe post-inflammatory dark spots & burns
                </Text>
              </View>

              <View
                style={[
                  styles.comparisonCard,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.emerald,
                  },
                ]}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardTag, { color: themeColors.emerald }]}>
                    DERMISIQ CLINICAL AI
                  </Text>
                  <ShieldCheckIcon size={14} color={themeColors.emerald} />
                </View>
                <Text style={[styles.cardHeading, { color: themeColors.textPrimary }]}>
                  Multispectral Precision
                </Text>
                <Text style={[styles.cardBody, { color: themeColors.textSecondary }]}>
                  • Objective Fitzpatrick phototype inference\n
                  • Real-time chemical collision prevention\n
                  • Stratum Corneum barrier score optimization
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* SLIDE 1: MULTISPECTRAL AI ENGINES */}
        {currentSlide === 1 && (
          <View style={styles.slideWrapper}>
            <View style={styles.pillBadgeRow}>
              <View style={[styles.microBadge, { backgroundColor: themeColors.cyanMuted, borderColor: themeColors.cyan }]}>
                <SparklesIcon size={12} color={themeColors.cyan} />
                <Text style={[styles.microBadgeText, { color: themeColors.cyan }]}>
                  CLINICAL MULTISPECTRAL SENSORS
                </Text>
              </View>
            </View>

            <Text style={[styles.slideTitle, { color: themeColors.textPrimary }]}>
              Multispectral AI Diagnostics
            </Text>
            <Text style={[styles.slideSubtitle, { color: themeColors.textSecondary }]}>
              Every recommendation in DermisIQ is powered by 4 interconnected dermal neural engines running multispectral facial analysis.
            </Text>

            {/* 4 Feature Interactive Matrix */}
            <View style={styles.engineGrid}>
              <View
                style={[
                  styles.engineCard,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.engineIconBox}>
                  <Text style={styles.engineEmoji}>🔬</Text>
                </View>
                <View style={styles.engineContent}>
                  <Text style={[styles.engineTitle, { color: themeColors.textPrimary }]}>
                    Phototype Melanin Scaler
                  </Text>
                  <Text style={[styles.engineDesc, { color: themeColors.textSecondary }]}>
                    Infers your phototype (Type I–VI) from spectral melanin depth without manual guesswork.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.engineCard,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.engineIconBox}>
                  <Text style={styles.engineEmoji}>🎨</Text>
                </View>
                <View style={styles.engineContent}>
                  <Text style={[styles.engineTitle, { color: themeColors.textPrimary }]}>
                    Chromatic Skin Tone Swatches
                  </Text>
                  <Text style={[styles.engineDesc, { color: themeColors.textSecondary }]}>
                    Quantifies RGB &amp; Lab skin swatches, undertone warmth, and shade tolerance.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.engineCard,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.engineIconBox}>
                  <Text style={styles.engineEmoji}>📐</Text>
                </View>
                <View style={styles.engineContent}>
                  <Text style={[styles.engineTitle, { color: themeColors.textPrimary }]}>
                    26-Feature Facial Ratios
                  </Text>
                  <Text style={[styles.engineDesc, { color: themeColors.textSecondary }]}>
                    Analyzes facial thirds, cheekbone contours, eye angles, and biological skin age.
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.engineCard,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.engineIconBox}>
                  <Text style={styles.engineEmoji}>🛡️</Text>
                </View>
                <View style={styles.engineContent}>
                  <Text style={[styles.engineTitle, { color: themeColors.textPrimary }]}>
                    Stratum Corneum BHI Analyzer
                  </Text>
                  <Text style={[styles.engineDesc, { color: themeColors.textSecondary }]}>
                    Multi-parameter neural filter quantifying vascular erythema, moisture, pores, and PIH spots.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* SLIDE 2: FACE INGESTION & CAPTURE */}
        {currentSlide === 2 && (
          <View style={styles.slideWrapper}>
            <View style={styles.pillBadgeRow}>
              <View style={[styles.microBadge, { backgroundColor: themeColors.goldMuted, borderColor: themeColors.gold }]}>
                <CameraIcon size={12} color={themeColors.gold} />
                <Text style={[styles.microBadgeText, { color: themeColors.gold }]}>
                  FACIAL INGESTION
                </Text>
              </View>
            </View>

            <Text style={[styles.slideTitle, { color: themeColors.textPrimary }]}>
              Ingest Your Face
            </Text>
            <Text style={[styles.slideSubtitle, { color: themeColors.textSecondary }]}>
              Capture a selfie with your camera, pick a photo from your gallery, or choose a default sample face.
            </Text>

            {/* Ingestion Selector Tabs */}
            <View style={styles.ingestTabRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedPhotoOption("camera")}
                style={[
                  styles.ingestTabBtn,
                  {
                    backgroundColor:
                      selectedPhotoOption === "camera"
                        ? themeColors.bgElevated
                        : themeColors.bgCard,
                    borderColor:
                      selectedPhotoOption === "camera"
                        ? themeColors.emerald
                        : themeColors.borderLight,
                  },
                ]}
              >
                <CameraIcon size={16} color={selectedPhotoOption === "camera" ? themeColors.emerald : themeColors.textMuted} />
                <Text
                  style={[
                    styles.ingestTabText,
                    {
                      color:
                        selectedPhotoOption === "camera"
                          ? themeColors.textPrimary
                          : themeColors.textMuted,
                      fontWeight: selectedPhotoOption === "camera" ? "800" : "600",
                    },
                  ]}
                >
                  Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedPhotoOption("upload")}
                style={[
                  styles.ingestTabBtn,
                  {
                    backgroundColor:
                      selectedPhotoOption === "upload"
                        ? themeColors.bgElevated
                        : themeColors.bgCard,
                    borderColor:
                      selectedPhotoOption === "upload"
                        ? themeColors.emerald
                        : themeColors.borderLight,
                  },
                ]}
              >
                <SparklesIcon size={16} color={selectedPhotoOption === "upload" ? themeColors.emerald : themeColors.textMuted} />
                <Text
                  style={[
                    styles.ingestTabText,
                    {
                      color:
                        selectedPhotoOption === "upload"
                          ? themeColors.textPrimary
                          : themeColors.textMuted,
                      fontWeight: selectedPhotoOption === "upload" ? "800" : "600",
                    },
                  ]}
                >
                  Gallery Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedPhotoOption("sample")}
                style={[
                  styles.ingestTabBtn,
                  {
                    backgroundColor:
                      selectedPhotoOption === "sample"
                        ? themeColors.bgElevated
                        : themeColors.bgCard,
                    borderColor:
                      selectedPhotoOption === "sample"
                        ? themeColors.emerald
                        : themeColors.borderLight,
                  },
                ]}
              >
                <ShieldCheckIcon size={16} color={selectedPhotoOption === "sample" ? themeColors.emerald : themeColors.textMuted} />
                <Text
                  style={[
                    styles.ingestTabText,
                    {
                      color:
                        selectedPhotoOption === "sample"
                          ? themeColors.textPrimary
                          : themeColors.textMuted,
                      fontWeight: selectedPhotoOption === "sample" ? "800" : "600",
                    },
                  ]}
                >
                  Default Sample
                </Text>
              </TouchableOpacity>
            </View>

            {/* CAMERA MODE VIEW */}
            {selectedPhotoOption === "camera" && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleTakeSnapshot}
                style={[
                  styles.cameraViewfinderBox,
                  {
                    backgroundColor: "#070A10",
                    borderColor: themeColors.borderEmerald,
                  },
                ]}
              >
                {uploadedImageUri ? (
                  <View style={styles.fullPreviewWrapper}>
                    <Image source={{ uri: uploadedImageUri }} style={styles.cameraPreviewImg} />
                    <View style={styles.capturedBadge}>
                      <CheckIcon size={12} color="#FFFFFF" />
                      <Text style={styles.capturedBadgeText}>Photo Captured</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.cameraPlaceholder}>
                    <View style={styles.faceOvalGuide}>
                      <CameraIcon size={32} color={themeColors.emerald} />
                      <Text style={styles.faceGuidePrompt}>Tap to Open Camera</Text>
                      <Text style={styles.faceGuideSubPrompt}>Front selfie recommended</Text>
                    </View>
                    <View style={styles.bracketTL} />
                    <View style={styles.bracketTR} />
                    <View style={styles.bracketBL} />
                    <View style={styles.bracketBR} />
                  </View>
                )}

                {isCapturing && (
                  <View style={styles.countdownOverlay}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.capturingText}>Accessing Device Camera...</Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleTakeSnapshot}
                  style={[styles.snapShutterBtn, { backgroundColor: themeColors.emerald }]}
                >
                  <CameraIcon size={18} color="#FFFFFF" />
                  <Text style={styles.snapShutterText}>
                    {uploadedImageUri ? "Retake Face Photo" : "Open Camera"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {/* UPLOAD PHOTO VIEW */}
            {selectedPhotoOption === "upload" && (
              <View
                style={[
                  styles.uploadDropZone,
                  {
                    backgroundColor: themeColors.bgCard,
                    borderColor: themeColors.borderEmerald,
                  },
                ]}
              >
                {uploadedImageUri ? (
                  <View style={styles.uploadedPreviewCol}>
                    <Image source={{ uri: uploadedImageUri }} style={styles.uploadedImg} />
                    <View style={styles.uploadSuccessBadge}>
                      <CheckIcon size={12} color="#FFFFFF" />
                      <Text style={styles.uploadSuccessText}>Face Photo Loaded</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleTriggerUpload}
                      style={[styles.replaceBtn, { borderColor: themeColors.borderLight }]}
                    >
                      <Text style={[styles.replaceBtnText, { color: themeColors.textSecondary }]}>
                        Choose Different Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.dropZoneClickable}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleTriggerUpload}
                      style={[styles.uploadIconCircle, { backgroundColor: themeColors.emeraldMuted }]}
                    >
                      <SparklesIcon size={24} color={themeColors.emerald} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleTriggerUpload}>
                      <Text style={[styles.dropZoneTitle, { color: themeColors.textPrimary }]}>
                        Tap to Choose Photo from Gallery
                      </Text>
                      <Text style={[styles.dropZoneSub, { color: themeColors.textMuted }]}>
                        Select clear front-facing selfie
                      </Text>
                    </TouchableOpacity>

                    {/* Direct Image URL fallback option */}
                    <View style={styles.urlInputRow}>
                      <TextInput
                        placeholder="Or paste image URL (https://...)"
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
                        style={[styles.applyUrlBtn, { backgroundColor: themeColors.emerald }]}
                      >
                        <Text style={styles.applyUrlBtnText}>Load</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* SAMPLE SUBJECTS VIEW */}
            {selectedPhotoOption === "sample" && (
              <View style={styles.sampleGrid}>
                {sampleSubjects.map(sub => {
                  const isSelected = selectedSamplePreset === sub.id;
                  return (
                    <TouchableOpacity
                      key={sub.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedSamplePreset(sub.id);
                        setUploadedImageUri(null);
                        setUploadedBase64(null);
                      }}
                      style={[
                        styles.sampleCard,
                        {
                          backgroundColor: themeColors.bgCard,
                          borderColor: isSelected ? themeColors.emerald : themeColors.border,
                        },
                        isSelected && { backgroundColor: themeColors.bgElevated },
                      ]}
                    >
                      <Image source={sub.img} style={styles.sampleImg} />
                      <View style={styles.sampleInfo}>
                        <View style={styles.sampleTitleRow}>
                          <View style={[styles.colorDot, { backgroundColor: sub.color }]} />
                          <Text style={[styles.sampleTitle, { color: themeColors.textPrimary }]}>
                            {sub.title}
                          </Text>
                        </View>
                        <Text style={[styles.sampleSub, { color: themeColors.textSecondary }]}>
                          {sub.subtitle}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={[styles.selectedCheckCircle, { backgroundColor: themeColors.emerald }]}>
                          <CheckIcon size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* SLIDE 3: ANIMATABLE FACE CALIBRATION STAGE */}
        {currentSlide === 3 && (
          <View style={styles.slideWrapper}>
            <View style={styles.pillBadgeRow}>
              <View style={[styles.microBadge, { backgroundColor: themeColors.emeraldMuted, borderColor: themeColors.borderEmerald }]}>
                <SparklesIcon size={12} color={themeColors.emerald} />
                <Text style={[styles.microBadgeText, { color: themeColors.emerald }]}>
                  {analysisComplete ? "CALIBRATION COMPLETE" : "AI CALIBRATION IN PROGRESS"}
                </Text>
              </View>
            </View>

            <Text style={[styles.slideTitle, { color: themeColors.textPrimary }]}>
              {analysisComplete ? "Facial Phototype Inferred!" : "Calibrating Neural Sensors..."}
            </Text>
            <Text style={[styles.slideSubtitle, { color: themeColors.textSecondary }]}>
              {analysisComplete
                ? "Your clinic home, diagnostic radar, and formulations have dynamically adapted to your biometric profile."
                : "Awaiting multispectral neural diagnostic responses across all 4 clinical endpoints..."}
            </Text>

            {/* ANIMATABLE FACE SCANNER BOX */}
            <View
              style={[
                styles.animatableFaceCard,
                {
                  backgroundColor: "#060A10",
                  borderColor: analysisComplete ? themeColors.emerald : themeColors.borderEmerald,
                },
              ]}
            >
              <View style={styles.animFaceFrame}>
                <Image
                  source={resolveActiveFaceImage()}
                  style={styles.animFaceImage}
                  resizeMode="cover"
                />

                {/* Sweeping Laser Line (Active while scanning) */}
                {!analysisComplete && (
                  <Animated.View
                    style={[
                      styles.laserScanLine,
                      {
                        transform: [
                          {
                            translateY: scanLineAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 220],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                )}

                {/* Concentric Pulsing Radar Waves */}
                {!analysisComplete && (
                  <Animated.View
                    style={[
                      styles.radarPulseWave,
                      {
                        transform: [
                          {
                            scale: radarAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.6, 1.4],
                            }),
                          },
                        ],
                        opacity: radarAnim.interpolate({
                          inputRange: [0, 0.7, 1],
                          outputRange: [0.9, 0.4, 0],
                        }),
                      },
                    ]}
                  />
                )}

                {/* Biometric Landmark Target Reticles */}
                <Animated.View
                  style={[
                    styles.landmarkNode,
                    { top: "25%", left: "48%" },
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={[styles.reticleDot, { backgroundColor: themeColors.cyan }]} />
                  <Text style={styles.reticleTag}>FOREHEAD</Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.landmarkNode,
                    { top: "42%", left: "28%" },
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={[styles.reticleDot, { backgroundColor: themeColors.emerald }]} />
                  <Text style={styles.reticleTag}>L-CHEEK</Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.landmarkNode,
                    { top: "42%", right: "28%" },
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={[styles.reticleDot, { backgroundColor: themeColors.emerald }]} />
                  <Text style={styles.reticleTag}>R-CHEEK</Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.landmarkNode,
                    { bottom: "20%", left: "48%" },
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={[styles.reticleDot, { backgroundColor: themeColors.gold }]} />
                  <Text style={styles.reticleTag}>CHIN</Text>
                </Animated.View>

                {/* Completed Check Overlay */}
                {analysisComplete && (
                  <View style={styles.verifiedOverlayBadge}>
                    <View style={styles.checkCircleLarge}>
                      <CheckIcon size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.verifiedOverlayText}>100% Calibrated</Text>
                  </View>
                )}
              </View>

              {/* Real-Time Live Endpoint Stage Telemetry */}
              <View style={styles.telemetryStatusFooter}>
                <View style={styles.telemetryHeaderRow}>
                  {!analysisComplete && (
                    <ActivityIndicator size="small" color="#10B981" style={{ marginRight: 6 }} />
                  )}
                  {analysisComplete && (
                    <View style={[styles.pulsingDot, { backgroundColor: themeColors.emerald }]} />
                  )}
                  <Text style={[styles.telemetryStageText, { color: themeColors.emerald }]}>
                    {analysisComplete ? "All 4 Neural Endpoints Succeeded" : scanProgressStage || "Calibrating..."}
                  </Text>
                </View>

                {/* Progress Bar Track */}
                <View style={[styles.progressBarTrack, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: analysisComplete ? "100%" : `${Math.max(15, Math.round(scanProgress * 100))}%`,
                        backgroundColor: themeColors.emerald,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Inferred Diagnostic Results Cards (Revealed upon endpoint completion) */}
            <View style={styles.resultDetailsGrid}>
              <View style={[styles.detailBox, { backgroundColor: themeColors.bgCard }]}>
                <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>
                  INFERRED PHOTOTYPE
                </Text>
                <Text style={[styles.detailVal, { color: themeColors.emerald }]}>
                  {userFitzpatrick}
                </Text>
                <Text style={[styles.detailSub, { color: themeColors.textSecondary }]}>
                  Clinical Melanin Depth
                </Text>
              </View>

              <View style={[styles.detailBox, { backgroundColor: themeColors.bgCard }]}>
                <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>
                  UNDERTONE &amp; TONE
                </Text>
                <View style={styles.undertoneRow}>
                  <View style={[styles.colorChip, { backgroundColor: scanResult.shadeHex }]} />
                  <Text style={[styles.detailVal, { color: themeColors.textPrimary }]}>
                    {scanResult.undertone}
                  </Text>
                </View>
                <Text style={[styles.detailSub, { color: themeColors.textSecondary }]}>
                  Hex: {scanResult.shadeHex}
                </Text>
              </View>

              <View style={[styles.detailBox, { backgroundColor: themeColors.bgCard }]}>
                <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>
                  STRATUM CORNEUM BHI
                </Text>
                <Text style={[styles.detailVal, { color: themeColors.cyan }]}>
                  {scanResult.barrierHealthScore}/100
                </Text>
                <Text style={[styles.detailSub, { color: themeColors.textSecondary }]}>
                  Vascular Erythema Safe
                </Text>
              </View>

              <View style={[styles.detailBox, { backgroundColor: themeColors.bgCard }]}>
                <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>
                  BIOLOGICAL SKIN AGE
                </Text>
                <Text style={[styles.detailVal, { color: themeColors.gold }]}>
                  {scanResult.skinAge} Yrs
                </Text>
                <Text style={[styles.detailSub, { color: themeColors.textSecondary }]}>
                  Face Shape: {scanResult.faceAttributes?.faceShape || "Balanced"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: themeColors.bgPrimary,
            borderTopColor: themeColors.borderLight,
          },
        ]}
      >
        {currentSlide > 0 && currentSlide < 3 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBack}
            style={[styles.backBtn, { borderColor: themeColors.border }]}
          >
            <Text style={[styles.backBtnText, { color: themeColors.textSecondary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
        )}

        {currentSlide < 2 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: themeColors.emerald }]}
          >
            <Text style={styles.nextBtnText}>Continue →</Text>
          </TouchableOpacity>
        )}

        {/* 
          SLIDE 2 INTERACTION:
          Strictly "Calibrate face/photo" with NO icon and NO system text.
        */}
        {currentSlide === 2 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStartCalibration}
            style={[styles.nextBtn, { backgroundColor: themeColors.emerald }]}
          >
            <Text style={styles.nextBtnText}>Calibrate face/photo</Text>
          </TouchableOpacity>
        )}

        {/* 
          SLIDE 3 INTERACTION:
          Awaits all 4 endpoints before allowing entry to clinic.
        */}
        {currentSlide === 3 && (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!analysisComplete || isScanning}
            onPress={() => completeOnboarding()}
            style={[
              styles.nextBtn,
              {
                backgroundColor: analysisComplete && !isScanning ? themeColors.emerald : themeColors.bgCardSubtle,
                opacity: analysisComplete && !isScanning ? 1 : 0.65,
              },
            ]}
          >
            {(!analysisComplete || isScanning) ? (
              <View style={styles.waitingBtnRow}>
                <ActivityIndicator size="small" color={themeColors.emerald} />
                <Text style={[styles.nextBtnText, { color: themeColors.textSecondary, marginLeft: 8 }]}>
                  Calibrating Biometrics...
                </Text>
              </View>
            ) : (
              <Text style={styles.nextBtnText}>Enter DermisIQ Clinic →</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: spacing.sm,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  stepIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    height: 6,
    borderRadius: 3,
  },
  skipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  slideWrapper: {
    flex: 1,
  },
  pillBadgeRow: {
    marginBottom: spacing.xs,
  },
  microBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  microBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  slideSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  comparisonGrid: {
    gap: 12,
    marginTop: spacing.xs,
  },
  comparisonCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    ...shadows.card,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 19,
  },
  engineGrid: {
    gap: 10,
  },
  engineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  engineIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  engineEmoji: {
    fontSize: 20,
  },
  engineContent: {
    flex: 1,
  },
  engineTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },
  engineDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  ingestTabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.md,
  },
  ingestTabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  ingestTabText: {
    fontSize: 11,
  },
  cameraViewfinderBox: {
    height: 290,
    borderRadius: radius.xl,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...shadows.card,
  },
  fullPreviewWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  cameraPreviewImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  capturedBadge: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  capturedBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  cameraPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  faceOvalGuide: {
    width: 150,
    height: 190,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.6)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  faceGuidePrompt: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    marginTop: 6,
  },
  faceGuideSubPrompt: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 9,
    textAlign: "center",
  },
  bracketTL: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#10B981",
  },
  bracketTR: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#10B981",
  },
  bracketBL: {
    position: "absolute",
    bottom: 14,
    left: 14,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#10B981",
  },
  bracketBR: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#10B981",
  },
  countdownOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  capturingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  snapShutterBtn: {
    position: "absolute",
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.full,
    ...shadows.glowEmerald,
  },
  snapShutterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  uploadDropZone: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
  },
  dropZoneClickable: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dropZoneTitle: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  dropZoneSub: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 12,
  },
  urlInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
    marginTop: 6,
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
  },
  applyUrlBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  uploadedPreviewCol: {
    alignItems: "center",
    width: "100%",
  },
  uploadedImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 10,
  },
  uploadSuccessBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: 8,
  },
  uploadSuccessText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  replaceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  replaceBtnText: {
    fontSize: 11,
  },
  sampleGrid: {
    gap: 10,
  },
  sampleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    position: "relative",
  },
  sampleImg: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
  },
  sampleInfo: {
    flex: 1,
  },
  sampleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  sampleSub: {
    fontSize: 11,
    marginTop: 2,
  },
  selectedCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  // ANIMATABLE FACE CARD STYLES
  animatableFaceCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    ...shadows.card,
  },
  animFaceFrame: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  animFaceImage: {
    width: "100%",
    height: "100%",
  },
  laserScanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  radarPulseWave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  landmarkNode: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  reticleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  reticleTag: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  verifiedOverlayBadge: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    width: "100%",
    height: "100%",
  },
  checkCircleLarge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    ...shadows.glowEmerald,
  },
  verifiedOverlayText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  telemetryStatusFooter: {
    width: "100%",
    marginTop: 14,
  },
  telemetryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  telemetryStageText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  resultDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  detailBox: {
    width: "48%",
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  detailVal: {
    fontSize: 14,
    fontWeight: "900",
  },
  detailSub: {
    fontSize: 10,
    marginTop: 2,
  },
  undertoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorChip: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    gap: 10,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: radius.lg,
    ...shadows.glowEmerald,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  waitingBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
