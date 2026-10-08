// YouCam API & Clinical Skin Diagnostic Types

export type FitzpatrickSkinType =
  | "Type I"   // Very Fair (Burns easily, never tans)
  | "Type II"  // Fair (Burns easily, tans minimally)
  | "Type III" // Medium (Burns moderately, tans uniformly)
  | "Type IV"  // Olive / South Asian (Burns minimally, tans easily, prone to PIH)
  | "Type V"   // Brown / Dark Brown (Rarely burns, tans profusely)
  | "Type VI"; // Deep Melanin (Never burns, deeply pigmented)

export type Undertone = "Warm Golden" | "Cool Rosy" | "Neutral" | "Olive Golden" | "Deep Neutral";

export interface SkinParameterMetric {
  id: string;
  name: string;
  score: number; // 0 - 100 (Clinical Scale)
  severity: "optimal" | "mild" | "moderate" | "high";
  category: "barrier" | "pigmentation" | "texture" | "aging";
  description: string;
  recommendationHint: string;
  maskUrl?: string; // Live YouCam AI mask overlay URL
}

export interface FacialZoneIssue {
  zone: "Forehead" | "T-Zone" | "Left Cheek" | "Right Cheek" | "Eye Area" | "Chin";
  dominantIssue: string;
  intensity: number; // 0 - 100
  coordinates: { x: number; y: number }; // Relative 0 - 1 coordinates
  targetedActiveSuggestion?: string;
}

export interface FaceQualityMetrics {
  hasFace: boolean;
  area: string;
  frontal: string;
  lighting: string;
  faceAngle: string;
}

export interface MaskOverlayUrls {
  texture?: string;
  age_spot?: string;
  redness?: string;
  pore?: string;
  acne?: string;
  wrinkle?: string;
  moisture?: string;
  skin_type?: string;
  resize_image?: string;
}

export interface FaceAttributeResults {
  age?: number;
  gender?: string;
  faceShape?: string;
  cheekbones?: {
    left?: string;
    right?: string;
    overall?: string;
  };
  eyelid?: {
    left_eyelid?: string;
    right_eyelid?: string;
    left_shape?: string;
    right_shape?: string;
    setting?: string;
    size?: string;
  };
  eyebrow?: {
    left_shape?: string;
    right_shape?: string;
    gap?: string;
  };
  nose?: {
    width?: string;
    length?: string;
  };
  lipshape?: string[];
}

export interface FacialRatioResults {
  horizontal_third?: number[];
  vertical_fifth?: number[];
  face_aspect_ratio?: number[];
  nose_aspect_ratio?: number[];
  nose_width_to_mouth_width?: number[];
  upper_lip_to_lower_lip?: number[];
}

export interface YouCamSkinAnalysisResult {
  scanId: string;
  timestamp: string;
  skinAge: number;
  overallScore: number;
  barrierHealthScore: number; // Derived: (Redness * 0.6) + (Moisture * 0.4)
  fitzpatrickType: FitzpatrickSkinType;
  undertone: Undertone;
  shadeHex: string;
  melaninIndex: number; // 0 - 100
  parameters: {
    redness: SkinParameterMetric;
    moisture: SkinParameterMetric;
    spots: SkinParameterMetric;
    texture: SkinParameterMetric;
    darkCircles: SkinParameterMetric;
    oiliness: SkinParameterMetric;
    pores: SkinParameterMetric;
    wrinkles: SkinParameterMetric;
    radiance: SkinParameterMetric;
  };
  zones: FacialZoneIssue[];
  clinicalObservations: string[];
  faceQuality?: FaceQualityMetrics;
  maskOverlayUrls?: MaskOverlayUrls;
  skinTypeRegions?: { whole: string; t_zone: string; u_zone: string };
  faceAttributes?: FaceAttributeResults;
  facialRatios?: FacialRatioResults;
  isRealApi?: boolean;
  taskId?: string;
  inferredFitzpatrickConfidence?: number;
}

export interface YouCamApiConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  useMockFallback: boolean;
}
