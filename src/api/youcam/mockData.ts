import { YouCamSkinAnalysisResult, FacialZoneIssue } from "./types";

/**
 * Fallback Face Photo Assets.
 * These are the strictly preserved local image assets for fallback visualization.
 */
export const FALLBACK_FACE_ASSETS = {
  melaninSensitive: require("../../assets/face_melanin_sensitive.jpg"),
  balancedProfile: require("../../assets/face_balanced.jpg"),
  deepMelaninProfile: require("../../assets/face_deep_melanin.jpg"),
};

const createBaselineZones = (redness: number, moisture: number, spots: number): FacialZoneIssue[] => [
  { zone: "Forehead", dominantIssue: "Sebum & Hydration", intensity: 100 - moisture, coordinates: { x: 0.5, y: 0.22 }, targetedActiveSuggestion: "Ceramide Matrix" },
  { zone: "T-Zone", dominantIssue: "Sebum Equilibrium", intensity: 35, coordinates: { x: 0.5, y: 0.44 }, targetedActiveSuggestion: "Niacinamide 4%" },
  { zone: "Left Cheek", dominantIssue: "Vascular Erythema", intensity: 100 - redness, coordinates: { x: 0.28, y: 0.52 }, targetedActiveSuggestion: "Centella Asiatica" },
  { zone: "Right Cheek", dominantIssue: "Melanin Reactivity", intensity: 100 - spots, coordinates: { x: 0.72, y: 0.52 }, targetedActiveSuggestion: "Azelaic Acid 10%" },
  { zone: "Eye Area", dominantIssue: "Periorbital Moisture", intensity: 40, coordinates: { x: 0.5, y: 0.36 }, targetedActiveSuggestion: "Multi-Hyaluronic Serum" },
  { zone: "Chin", dominantIssue: "Follicular Texture", intensity: 30, coordinates: { x: 0.5, y: 0.78 }, targetedActiveSuggestion: "Zinc PCA" },
];

/**
 * Minimal offline baselines for resilience and test runner.
 * Real scans populate dynamic live data from Perfect Corp neural endpoints.
 */
export const mockProfiles: Record<string, YouCamSkinAnalysisResult> = {
  melaninSensitive: {
    scanId: "CALIBRATED-FITZ-IV",
    timestamp: new Date().toISOString(),
    skinAge: 25,
    overallScore: 68,
    barrierHealthScore: 54,
    fitzpatrickType: "Type IV",
    undertone: "Warm Golden",
    shadeHex: "#A26E4F",
    melaninIndex: 64,
    parameters: {
      redness: { id: "redness", name: "Vascular Erythema", score: 48, severity: "high", category: "barrier", description: "Microvascular reactivity and surface erythema.", recommendationHint: "Buffer acids; incorporate 5X Ceramide Matrix cream." },
      moisture: { id: "moisture", name: "Stratum Corneum Hydration", score: 52, severity: "moderate", category: "barrier", description: "Epidermal moisture retention.", recommendationHint: "Apply beta-glucan & ectoin multi-molecular serum." },
      spots: { id: "spots", name: "Post-Inflammatory Hyperpigmentation", score: 62, severity: "moderate", category: "pigmentation", description: "Sub-surface melanin cluster distribution.", recommendationHint: "Use Azelaic Acid 10%; strictly avoid harsh Glycolic peels." },
      texture: { id: "texture", name: "Epidermal Smoothness", score: 58, severity: "moderate", category: "texture", description: "Surface topography roughness.", recommendationHint: "Gentle PHA gluconolactone." },
      pores: { id: "pores", name: "Follicular Pore Tightness", score: 65, severity: "mild", category: "texture", description: "Pore dilation density.", recommendationHint: "Regulate sebum with Zinc PCA." },
      wrinkles: { id: "wrinkles", name: "Dermal Elasticity", score: 80, severity: "optimal", category: "aging", description: "Dynamic crease depth analysis.", recommendationHint: "Signal peptides and Bakuchiol 1%." },
      darkCircles: { id: "darkCircles", name: "Periorbital Uniformity", score: 72, severity: "mild", category: "aging", description: "Periorbital shadow.", recommendationHint: "Caffeine 5% + EGCG concentrate." },
      oiliness: { id: "oiliness", name: "Sebum Production", score: 68, severity: "mild", category: "texture", description: "Sebaceous balance.", recommendationHint: "Gentle pH 5.5 cleanser." },
      radiance: { id: "radiance", name: "Skin Radiance", score: 74, severity: "optimal", category: "barrier", description: "Luminosity and vitality.", recommendationHint: "Mineral SPF 50." },
    },
    zones: createBaselineZones(48, 52, 62),
    clinicalObservations: [
      "Confirmed Fitzpatrick IV phototype (Warm Golden #A26E4F).",
      "Stratum Corneum BHI: 54/100 — Active microvascular erythema present.",
      "Melanin vulnerability elevated: Avoid aggressive glycolic peels to mitigate rebound PIH.",
    ],
  },

  balancedProfile: {
    scanId: "CALIBRATED-FITZ-III",
    timestamp: new Date().toISOString(),
    skinAge: 23,
    overallScore: 89,
    barrierHealthScore: 88,
    fitzpatrickType: "Type III",
    undertone: "Olive Golden",
    shadeHex: "#C59A78",
    melaninIndex: 44,
    parameters: {
      redness: { id: "redness", name: "Vascular Erythema", score: 86, severity: "optimal", category: "barrier", description: "Even tone with calm microvascular circulation.", recommendationHint: "Barrier is resilient and fortified." },
      moisture: { id: "moisture", name: "Stratum Corneum Hydration", score: 89, severity: "optimal", category: "barrier", description: "Optimal intracellular hydration.", recommendationHint: "Maintain current hydration protocol." },
      spots: { id: "spots", name: "Post-Inflammatory Hyperpigmentation", score: 84, severity: "optimal", category: "pigmentation", description: "Minimal melanin clustering.", recommendationHint: "Continue daily mineral SPF 50." },
      texture: { id: "texture", name: "Epidermal Smoothness", score: 90, severity: "optimal", category: "texture", description: "Silky, uniform stratum corneum relief.", recommendationHint: "Bi-weekly gentle exfoliation is tolerated." },
      pores: { id: "pores", name: "Follicular Pore Tightness", score: 86, severity: "optimal", category: "texture", description: "Refined pore structure.", recommendationHint: "Continue gentle routine." },
      wrinkles: { id: "wrinkles", name: "Dermal Elasticity", score: 92, severity: "optimal", category: "aging", description: "High collagen bounce.", recommendationHint: "Antioxidant preventative care." },
      darkCircles: { id: "darkCircles", name: "Periorbital Uniformity", score: 82, severity: "optimal", category: "aging", description: "Minimal fatigue shadow.", recommendationHint: "Hydrating eye complex." },
      oiliness: { id: "oiliness", name: "Sebum Production", score: 85, severity: "optimal", category: "texture", description: "Harmonious sebaceous balance.", recommendationHint: "Balanced gel hydrator." },
      radiance: { id: "radiance", name: "Skin Radiance", score: 88, severity: "optimal", category: "barrier", description: "High optical luminescence.", recommendationHint: "Vitamin C serum." },
    },
    zones: createBaselineZones(86, 89, 84),
    clinicalObservations: [
      "Confirmed Fitzpatrick III phototype (Olive Golden #C59A78).",
      "Stratum Corneum BHI: 88/100 — Resilient barrier tolerance.",
    ],
  },

  deepMelaninProfile: {
    scanId: "CALIBRATED-FITZ-VI",
    timestamp: new Date().toISOString(),
    skinAge: 27,
    overallScore: 78,
    barrierHealthScore: 72,
    fitzpatrickType: "Type VI",
    undertone: "Deep Neutral",
    shadeHex: "#4A2B19",
    melaninIndex: 88,
    parameters: {
      redness: { id: "redness", name: "Vascular Erythema", score: 76, severity: "mild", category: "barrier", description: "Sub-surface vascular balance.", recommendationHint: "Centella Asiatica + Squalane." },
      moisture: { id: "moisture", name: "Stratum Corneum Hydration", score: 66, severity: "moderate", category: "barrier", description: "Mild moisture evaporation tendency.", recommendationHint: "Lipid-rich Ceramide barrier cream." },
      spots: { id: "spots", name: "Post-Inflammatory Hyperpigmentation", score: 55, severity: "high", category: "pigmentation", description: "Melanin reactivity following blemishes.", recommendationHint: "Tranexamic Acid 4% + Azelaic Acid 10%." },
      texture: { id: "texture", name: "Epidermal Smoothness", score: 82, severity: "mild", category: "texture", description: "Firm collagen base.", recommendationHint: "PHA gentle polishing." },
      pores: { id: "pores", name: "Follicular Pore Tightness", score: 80, severity: "optimal", category: "texture", description: "Refined pore structure.", recommendationHint: "Gentle double cleansing." },
      wrinkles: { id: "wrinkles", name: "Dermal Elasticity", score: 94, severity: "optimal", category: "aging", description: "Exceptional melanin photoprotection.", recommendationHint: "Broad-spectrum zero white-cast SPF 50." },
      darkCircles: { id: "darkCircles", name: "Periorbital Uniformity", score: 68, severity: "mild", category: "aging", description: "Periorbital melanin clustering.", recommendationHint: "Antioxidant eye complex." },
      oiliness: { id: "oiliness", name: "Sebum Production", score: 74, severity: "mild", category: "texture", description: "Healthy lipid production.", recommendationHint: "Non-stripping foam." },
      radiance: { id: "radiance", name: "Skin Radiance", score: 72, severity: "mild", category: "barrier", description: "Hydration-dampened glow.", recommendationHint: "Squalane and HA complex." },
    },
    zones: createBaselineZones(76, 66, 55),
    clinicalObservations: [
      "Confirmed Fitzpatrick VI phototype (Deep Neutral #4A2B19).",
      "High natural photoprotection index with heightened melanocyte reactivity.",
    ],
  },
};
