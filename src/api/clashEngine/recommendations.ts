import { Undertone } from "../youcam/types";

export interface ProductItem {
  id: string;
  brand: string;
  name: string;
  category: "Cleanser" | "Serum" | "Barrier Cream" | "Sunscreen" | "Tinted VTO";
  price: number; // in USD
  currency: string;
  rating: number;
  reviewCount: number;
  actives: string[]; // references INGREDIENT_DATABASE keys
  melaninFriendly: boolean;
  undertoneMatch?: Undertone[];
  shadeName?: string;
  shadeHex?: string;
  tag: string;
  heroBenefit: string;
  usageTime: "AM" | "PM" | "AM/PM";
  stepNumber: number;
  returnRateRisk: "Ultra Low (<2%)" | "Moderate" | "High without AI match";
  youcamReason: string;
  image: any;
}

export type CuratedBundle = RegimenBundle;
export interface RegimenBundle {
  id: string;
  title: string;
  subtitle: string;
  targetCondition: string;
  products: ProductItem[];
  bundlePrice: number;
  originalPrice: number;
  discountPercentage: number;
  clinicalTrialClaim: string;
  heroBadge: string;
}

export const PRODUCT_CATALOG: ProductItem[] = [
  {
    id: "prod-gentle-cleanser",
    brand: "PureBarrier Clinical",
    name: "Oat Amino Acid Calming Gel Cleanser (pH 5.5)",
    category: "Cleanser",
    price: 24.0,
    currency: "$",
    rating: 4.9,
    reviewCount: 1520,
    actives: ["centella_asiatica", "hyaluronic_acid"],
    melaninFriendly: true,
    tag: "Acid Mantle Protector",
    heroBenefit: "Preserves natural moisture factor (NMF) and acid mantle during face cleansing.",
    usageTime: "AM/PM",
    stepNumber: 1,
    returnRateRisk: "Ultra Low (<2%)",
    youcamReason: "Clinical pH 5.5 Gate: Prevents lipid bilayer disruption on reactive stratum corneum.",
    image: require("../../assets/product_cleanser.jpg"),
  },
  {
    id: "prod-ceramide-barrier",
    brand: "DermisIQ Clinical",
    name: "LipidShield 5X Physiological Ceramide Cream",
    category: "Barrier Cream",
    price: 36.0,
    currency: "$",
    rating: 4.9,
    reviewCount: 1240,
    actives: ["ceramides", "centella_asiatica", "hyaluronic_acid"],
    melaninFriendly: true,
    tag: "Barrier Repair Essential",
    heroBenefit: "Repairs stratum corneum barrier within 72 hours and cuts erythema score by 45%.",
    usageTime: "PM",
    stepNumber: 3,
    returnRateRisk: "Ultra Low (<2%)",
    youcamReason: "Stratum Corneum Moisture Score (52/100): High TEWL requires 3:1:1 physiological ceramide matrix.",
    image: require("../../assets/product_ceramide.jpg"),
  },
  {
    id: "prod-azelaic-clarity",
    brand: "Melanix Labs",
    name: "Azelaic Clarifying Suspension 10% + Ectoin",
    category: "Serum",
    price: 28.0,
    currency: "$",
    rating: 4.8,
    reviewCount: 890,
    actives: ["azelaic_acid", "centella_asiatica"],
    melaninFriendly: true,
    tag: "PIH & Redness Solution",
    heroBenefit: "Clears post-inflammatory dark spots without peeling or melanocyte rebound.",
    usageTime: "PM",
    stepNumber: 2,
    returnRateRisk: "Ultra Low (<2%)",
    youcamReason: "Microvascular Redness & Spots: Extinguishes cheek microvascular redness (Score: 48).",
    image: require("../../assets/product_azelaic.jpg"),
  },
  {
    id: "prod-tranexamic-pigment",
    brand: "ChronoDerm AI",
    name: "Multi-Depth Tranexamic 4% + Alpha Arbutin Elixir",
    category: "Serum",
    price: 38.0,
    currency: "$",
    rating: 4.7,
    reviewCount: 654,
    actives: ["tranexamic_acid", "niacinamide", "hyaluronic_acid"],
    melaninFriendly: true,
    tag: "Deep Hyperpigmentation",
    heroBenefit: "Blocks UV-induced melanin cascades with zero stratum corneum irritation.",
    usageTime: "AM",
    stepNumber: 2,
    returnRateRisk: "Ultra Low (<2%)",
    youcamReason: "Targeted Melanin Regulation: Suppresses plasminogen UV activation.",
    image: require("../../assets/product_azelaic.jpg"),
  },
  {
    id: "prod-tinted-vto-spf",
    brand: "DermisIQ VTO",
    name: "ChromaShield Melanin Adaptive Tinted SPF 50+ PA++++",
    category: "Tinted VTO",
    price: 38.0,
    currency: "$",
    rating: 4.9,
    reviewCount: 2100,
    actives: ["niacinamide", "centella_asiatica"],
    melaninFriendly: true,
    undertoneMatch: ["Warm Golden", "Olive Golden", "Neutral", "Deep Neutral"],
    shadeName: "Golden Sand (Matched: #A26E4F)",
    shadeHex: "#A26E4F",
    tag: "Spectral Tone Matched",
    heroBenefit: "Zero white-cast, 100% mineral photoprotection matched to detected facial shade.",
    usageTime: "AM",
    stepNumber: 3,
    returnRateRisk: "Ultra Low (<2%)",
    youcamReason: "Spectral Shade Match #A26E4F: 16-bit chromatic match slashes eCommerce return rate to <2%.",
    image: require("../../assets/product_tinted_spf.jpg"),
  },
  {
    id: "prod-bakuchiol-peptide",
    brand: "CelluRenew Labs",
    name: "Phyto-Retinol Bakuchiol 1% + Copper Peptide Serum",
    category: "Serum",
    price: 44.0,
    currency: "$",
    rating: 4.8,
    reviewCount: 512,
    actives: ["bakuchiol", "peptides", "hyaluronic_acid"],
    melaninFriendly: true,
    tag: "Gentle Collagen Renewal",
    heroBenefit: "Stimulates collagen density without redness, flaking, or photosensitivity.",
    usageTime: "PM",
    stepNumber: 2,
    returnRateRisk: "Ultra Low (<2%)",
    youcamReason: "Cellular Renewal: Cellular renewal without barrier degradation.",
    image: require("../../assets/product_azelaic.jpg"),
  },
  {
    id: "prod-active-retinol-caution",
    brand: "DermaPro Resurfacing",
    name: "Pure Micro-Encapsulated Retinol 0.5% Night Fluid",
    category: "Serum",
    price: 42.0,
    currency: "$",
    rating: 4.5,
    reviewCount: 780,
    actives: ["retinol"],
    melaninFriendly: true,
    tag: "High Potency (Restricted)",
    heroBenefit: "Potent collagen turnover. REQUIRES barrier health score > 68 before unlocking.",
    usageTime: "PM",
    stepNumber: 2,
    returnRateRisk: "High without AI match",
    youcamReason: "Requires Stratum Corneum BHI > 68. Currently locked for barrier protection.",
    image: require("../../assets/product_azelaic.jpg"),
  },
];

export const CURATED_BUNDLES: RegimenBundle[] = [
  {
    id: "bundle-barrier-rescue",
    title: "Melanin Barrier Rescue & PIH Defense Bundle",
    subtitle: "Complete 3-Step AM/PM System for Irritated, Sensitive Skin",
    targetCondition: "High Erythema + Moisture Loss + Post-Acne Marks",
    products: [
      PRODUCT_CATALOG[1], // LipidShield 5X Ceramide
      PRODUCT_CATALOG[2], // Azelaic Clarifying
      PRODUCT_CATALOG[4], // ChromaShield Tinted SPF 50
    ],
    originalPrice: 102.0,
    bundlePrice: 76.0,
    discountPercentage: 25,
    clinicalTrialClaim: "Clinically reduces facial erythema by 48% and lifts hydration by 62% in 14 days.",
    heroBadge: "Most Popular for Fitzpatrick IV-VI",
  },
  {
    id: "bundle-melasma-clarity",
    title: "Precision Pigment Clarification Routine",
    subtitle: "Non-Acid Brightening Trio for Melasma & Sun Damage",
    targetCondition: "Stubborn Hyperpigmentation & Uneven Undertone",
    products: [
      PRODUCT_CATALOG[0], // Gentle Cleanser
      PRODUCT_CATALOG[3], // Tranexamic Acid
      PRODUCT_CATALOG[4], // Tinted SPF 50
    ],
    originalPrice: 100.0,
    bundlePrice: 78.0,
    discountPercentage: 22,
    clinicalTrialClaim: "Visible lightening of stubborn UV marks without triggering rebound melanocyte darkening.",
    heroBadge: "Zero-Rebound PIH",
  },
  {
    id: "bundle-gentle-renewal",
    title: "Barrier-Safe Collagen & Elasticity Trio",
    subtitle: "Bakuchiol + Signal Peptides + Ceramide Fortification",
    targetCondition: "Fine Lines & Texture with Sensitive Skin",
    products: [
      PRODUCT_CATALOG[0], // Cleanser
      PRODUCT_CATALOG[5], // Bakuchiol + Peptides
      PRODUCT_CATALOG[1], // Ceramide Cream
    ],
    originalPrice: 104.0,
    bundlePrice: 79.0,
    discountPercentage: 24,
    clinicalTrialClaim: "Increases dermal bounce and micro-smoothness by 54% without stinging or redness.",
    heroBadge: "Derm-Approved",
  },
];
