import { INGREDIENT_DATABASE, IngredientDefinition } from "./ingredientDb";
import { FitzpatrickSkinType, YouCamSkinAnalysisResult } from "../youcam/types";

export interface ClashAlert {
  id: string;
  severity: "CRITICAL" | "WARNING" | "CAUTION" | "SAFE";
  title: string;
  detail: string;
  affectedActives: string[];
  remedyAction: string;
  saferAlternative?: string;
  molecularReason?: string;
}

export interface RegimenSafetyEvaluation {
  overallSafetyScore: number; // 0 - 100
  isSafeToApply: boolean;
  alerts: ClashAlert[];
  recommendedSchedule: {
    morningActives: string[];
    eveningActives: string[];
    pausedActives: string[];
  };
  barrierReadinessSummary: string;
}

export interface RoutinePreset {
  id: string;
  name: string;
  subtitle: string;
  actives: string[];
  intent: "hazard" | "recovery" | "pigmentation" | "gentle";
}

export const ROUTINE_PRESETS: RoutinePreset[] = [
  {
    id: "dangerous-stack",
    name: "High-Acid Stripping Stack",
    subtitle: "Common consumer error: Retinol + Glycolic + Vitamin C",
    actives: ["retinol", "glycolic_acid", "ascorbic_acid"],
    intent: "hazard",
  },
  {
    id: "barrier-repair",
    name: "Ceramide Barrier Rescue",
    subtitle: "Restorative lipid replenishment & erythema calm",
    actives: ["ceramides", "centella_asiatica", "hyaluronic_acid"],
    intent: "recovery",
  },
  {
    id: "melanin-pih",
    name: "Melanin PIH Clearance",
    subtitle: "Dermatologist gold-standard for dark spot resolution",
    actives: ["azelaic_acid", "tranexamic_acid", "niacinamide"],
    intent: "pigmentation",
  },
  {
    id: "gentle-collagen",
    name: "Gentle Cellular Renewal",
    subtitle: "Zero-irritation retinol alternative + peptides",
    actives: ["bakuchiol", "peptides", "ceramides", "hyaluronic_acid"],
    intent: "gentle",
  },
];

export class IngredientClashEngine {
  /**
   * Evaluates a list of selected ingredient IDs against the user's live YouCam skin diagnostics
   */
  public static evaluateRegimen(
    ingredientIds: string[],
    scan: YouCamSkinAnalysisResult | null,
    userFitzpatrick: FitzpatrickSkinType = "Type IV"
  ): RegimenSafetyEvaluation {
    const alerts: ClashAlert[] = [];
    const activeDefs: IngredientDefinition[] = ingredientIds
      .map(id => INGREDIENT_DATABASE[id])
      .filter((def): def is IngredientDefinition => Boolean(def));

    const barrierScore = scan?.barrierHealthScore ?? 54;
    const rednessScore = scan?.parameters?.redness?.score ?? 50;
    const isDarkerFitzpatrick =
      userFitzpatrick === "Type IV" || userFitzpatrick === "Type V" || userFitzpatrick === "Type VI";

    let deductionTotal = 0;

    // 1. Direct Contraindication Cross-Check (Active vs Active clash)
    for (let i = 0; i < activeDefs.length; i++) {
      for (let j = i + 1; j < activeDefs.length; j++) {
        const itemA = activeDefs[i];
        const itemB = activeDefs[j];

        if (itemA.contraindications.includes(itemB.id) || itemB.contraindications.includes(itemA.id)) {
          deductionTotal += 35;
          alerts.push({
            id: `clash-${itemA.id}-${itemB.id}`,
            severity: "CRITICAL",
            title: `Active Clash: ${itemA.name} + ${itemB.name}`,
            detail: `Layering these concurrently triggers severe stratum corneum irritation, pH destabilization, and barrier rupture.`,
            affectedActives: [itemA.name, itemB.name],
            remedyAction: "Do not layer concurrently. Segregate into AM vs PM or cycle on alternate evenings.",
            saferAlternative: itemA.safeAlternatives[0] || "Ceramides Complex",
            molecularReason: `${itemA.molecularMechanism} conflicts with ${itemB.molecularMechanism}`,
          });
        }
      }
    }

    // 2. Barrier Sensitivity Threshold Check (Active vs Current Skin State)
    for (const item of activeDefs) {
      if (barrierScore < item.minBarrierScore) {
        const delta = item.minBarrierScore - barrierScore;
        const severity = delta > 15 ? "CRITICAL" : "WARNING";
        deductionTotal += severity === "CRITICAL" ? 25 : 15;

        alerts.push({
          id: `barrier-risk-${item.id}`,
          severity,
          title: `Barrier Barrier Breakdown: ${item.name}`,
          detail: `Your detected barrier health is ${barrierScore}/100 (Redness: ${rednessScore}/100). ${item.name} requires a minimum resilience score of ${item.minBarrierScore}/100 to prevent acute dermatitis.`,
          affectedActives: [item.name],
          remedyAction: "Pause this active for 10-14 days while replenishing barrier with Ceramides & Centella Asiatica.",
          saferAlternative: item.safeAlternatives[0] || "Centella Asiatica",
          molecularReason: `Minimum required barrier index is ${item.minBarrierScore}/100 vs current ${barrierScore}/100.`,
        });
      }
    }

    // 3. Melanin Vulnerability & Rebound PIH Check
    if (isDarkerFitzpatrick) {
      for (const item of activeDefs) {
        if (!item.melaninSafe) {
          deductionTotal += 20;
          alerts.push({
            id: `pih-risk-${item.id}`,
            severity: "WARNING",
            title: `Rebound Hyperpigmentation Risk: ${item.name}`,
            detail: `For ${userFitzpatrick} melanin profiles, rapid penetrants like ${item.name} inflame melanocytes, triggering prolonged Post-Inflammatory Hyperpigmentation (PIH).`,
            affectedActives: [item.name],
            remedyAction: "Replace with large-molecule Mandelic Acid, Azelaic Acid 10%, or PHA.",
            saferAlternative: item.safeAlternatives[0] || "Azelaic Acid (10%)",
            molecularReason: item.molecularMechanism,
          });
        }
      }
    }

    // If no conflicts detected
    if (alerts.length === 0) {
      alerts.push({
        id: "all-clear",
        severity: "SAFE",
        title: "Synergistic & Barrier Compatible",
        detail: "All selected actives match your current barrier score and melanin profile without negative molecular interactions.",
        affectedActives: [],
        remedyAction: "Proceed with application followed by broad-spectrum mineral SPF 50+.",
      });
    }

    const calculatedSafety = Math.max(10, 100 - deductionTotal);

    // Dynamic AM/PM scheduling
    const morningActives: string[] = [];
    const eveningActives: string[] = [];
    const pausedActives: string[] = [];

    activeDefs.forEach(item => {
      if (barrierScore < item.minBarrierScore) {
        pausedActives.push(item.name);
      } else if (
        item.category === "Antioxidant" ||
        item.category === "Barrier Lipid" ||
        item.category === "Soothing" ||
        item.category === "Peptide"
      ) {
        morningActives.push(item.name);
      } else if (item.category === "Retinoid") {
        eveningActives.push(item.name);
      } else {
        eveningActives.push(item.name);
      }
    });

    return {
      overallSafetyScore: calculatedSafety,
      isSafeToApply: calculatedSafety >= 70,
      alerts,
      recommendedSchedule: {
        morningActives,
        eveningActives,
        pausedActives,
      },
      barrierReadinessSummary:
        barrierScore < 60
          ? "Compromised Barrier: Intensive repair protocol recommended. Exfoliants paused."
          : barrierScore < 75
          ? "Moderate Barrier: Buffered actives permitted with lipid reinforcement."
          : "Resilient Barrier: Optimal tolerance for targeted treatments.",
    };
  }
}
