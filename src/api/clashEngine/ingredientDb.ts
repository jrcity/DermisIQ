export interface IngredientDefinition {
  id: string;
  name: string;
  shortName: string;
  category: "Retinoid" | "AHA" | "BHA" | "Antioxidant" | "Barrier Lipid" | "Depigmenting" | "Soothing" | "Peptide";
  defaultStrength: string;
  melaninSafe: boolean; // Safe for Fitzpatrick IV-VI without rebound PIH risk
  minBarrierScore: number; // 0-100: Minimum barrier health required to prevent irritant contact dermatitis
  contraindications: string[]; // IDs of ingredients that conflict in the same regimen
  description: string;
  molecularMechanism: string;
  safeAlternatives: string[];
}

export const INGREDIENT_DATABASE: Record<string, IngredientDefinition> = {
  retinol: {
    id: "retinol",
    name: "Retinol / Retinoids (0.3% - 1%)",
    shortName: "Retinol",
    category: "Retinoid",
    defaultStrength: "0.5%",
    melaninSafe: true, // Safe if buffered, but causes retinoid dermatitis and PIH if barrier is compromised
    minBarrierScore: 68,
    contraindications: ["glycolic_acid", "salicylic_acid", "benzoyl_peroxide", "ascorbic_acid"],
    description: "Potent vitamin A derivative that accelerates cellular turnover. Can cause retinoid dermatitis if combined with direct acids.",
    molecularMechanism: "Binds to RAR receptors to upregulate gene transcription; increases transepidermal water loss during retinization.",
    safeAlternatives: ["bakuchiol", "peptides", "ceramides"],
  },

  glycolic_acid: {
    id: "glycolic_acid",
    name: "Glycolic Acid (AHA 7% - 10%)",
    shortName: "Glycolic Acid",
    category: "AHA",
    defaultStrength: "7%",
    melaninSafe: false, // High risk of rebound hyperpigmentation in darker skin tones due to tiny molecule size (76 Da)
    minBarrierScore: 72,
    contraindications: ["retinol", "salicylic_acid", "ascorbic_acid", "benzoyl_peroxide"],
    description: "Smallest alpha hydroxy acid molecule. Penetrates deeply and rapidly; prone to triggering post-inflammatory hyperpigmentation on melanin-rich skin.",
    molecularMechanism: "Cleaves desmosomes in stratum corneum. Ultra-rapid penetration triggers melanocyte inflammatory cascade in Fitzpatrick IV-VI.",
    safeAlternatives: ["lactic_acid", "azelaic_acid", "centella_asiatica"],
  },

  salicylic_acid: {
    id: "salicylic_acid",
    name: "Salicylic Acid (BHA 2%)",
    shortName: "Salicylic Acid",
    category: "BHA",
    defaultStrength: "2%",
    melaninSafe: true,
    minBarrierScore: 62,
    contraindications: ["retinol", "glycolic_acid"],
    description: "Lipid-soluble acid that penetrates pores to dissolve sebum and dead cells. Safe for melanin when skin redness is low.",
    molecularMechanism: "Oil-miscible keratolytic that exfoliates inside the follicular infundibulum and exerts mild anti-inflammatory effect.",
    safeAlternatives: ["niacinamide", "centella_asiatica"],
  },

  ascorbic_acid: {
    id: "ascorbic_acid",
    name: "L-Ascorbic Acid (Pure Vitamin C 15% - 20%)",
    shortName: "L-Ascorbic Acid",
    category: "Antioxidant",
    defaultStrength: "15%",
    melaninSafe: true,
    minBarrierScore: 65,
    contraindications: ["retinol", "glycolic_acid", "benzoyl_peroxide"],
    description: "Low-pH active (pH 2.8 - 3.2). Highly irritating to a compromised barrier and can cause severe stinging and redness flare-ups.",
    molecularMechanism: "Direct ROS scavenger and tyrosinase inhibitor. Requires acidic pH for cutaneous absorption, stressing the stratum corneum.",
    safeAlternatives: ["azelaic_acid", "tranexamic_acid", "niacinamide"],
  },

  azelaic_acid: {
    id: "azelaic_acid",
    name: "Azelaic Acid (10% - 15%)",
    shortName: "Azelaic Acid",
    category: "Depigmenting",
    defaultStrength: "10%",
    melaninSafe: true,
    minBarrierScore: 45,
    contraindications: [],
    description: "Gold-standard active for melanin-rich skin, rosacea, and post-inflammatory dark spots. Highly anti-inflammatory and barrier-friendly.",
    molecularMechanism: "Competitively inhibits tyrosinase in abnormal melanocytes without bleaching surrounding normal skin.",
    safeAlternatives: [],
  },

  tranexamic_acid: {
    id: "tranexamic_acid",
    name: "Tranexamic Acid (3% - 5%)",
    shortName: "Tranexamic Acid",
    category: "Depigmenting",
    defaultStrength: "3%",
    melaninSafe: true,
    minBarrierScore: 40,
    contraindications: [],
    description: "Inhibits plasmin and blocks melanocyte activation. Excellent for stubborn melasma and sun spots without acid irritation.",
    molecularMechanism: "Reversibly blocks lysine-binding sites on plasminogen, suppressing UV-induced keratinocyte-melanocyte signaling.",
    safeAlternatives: [],
  },

  benzoyl_peroxide: {
    id: "benzoyl_peroxide",
    name: "Benzoyl Peroxide (2.5% - 5%)",
    shortName: "Benzoyl Peroxide",
    category: "BHA",
    defaultStrength: "2.5%",
    melaninSafe: true,
    minBarrierScore: 68,
    contraindications: ["retinol", "ascorbic_acid", "glycolic_acid"],
    description: "Potent oxidizing antibacterial agent. Inactivates tretinoin/retinol and destabilizes pure vitamin C.",
    molecularMechanism: "Generates reactive free radical oxygen species that eradicate C. acnes bacteria; creates high oxidative stress.",
    safeAlternatives: ["salicylic_acid", "azelaic_acid"],
  },

  lactic_acid: {
    id: "lactic_acid",
    name: "Lactic Acid (AHA 5% - 10%)",
    shortName: "Lactic Acid",
    category: "AHA",
    defaultStrength: "5%",
    melaninSafe: true,
    minBarrierScore: 55,
    contraindications: ["retinol"],
    description: "Large-molecule alpha hydroxy acid (90 Da) with humectant properties. Much safer than glycolic acid for Fitzpatrick IV-VI.",
    molecularMechanism: "Mild stratum corneum desquamation with natural humectant moisturizing properties that strengthen ceramide synthesis.",
    safeAlternatives: ["centella_asiatica", "ceramides"],
  },

  bakuchiol: {
    id: "bakuchiol",
    name: "Bakuchiol (1%)",
    shortName: "Bakuchiol",
    category: "Retinoid",
    defaultStrength: "1%",
    melaninSafe: true,
    minBarrierScore: 30,
    contraindications: [],
    description: "Plant-derived functional retinol analog. Stimulates collagen without redness, peeling, or photosensitivity.",
    molecularMechanism: "Upregulates Type I and IV collagen genes similar to retinoids without triggering the RAR nuclear inflammation pathways.",
    safeAlternatives: [],
  },

  ceramides: {
    id: "ceramides",
    name: "Ceramides Complex (NP, AP, EOP) + Lipids",
    shortName: "Ceramides Complex",
    category: "Barrier Lipid",
    defaultStrength: "3:1:1 ratio",
    melaninSafe: true,
    minBarrierScore: 0,
    contraindications: [],
    description: "Essential intercellular lipids that repair the stratum corneum barrier, lock in hydration, and lower erythema.",
    molecularMechanism: "Rebuilds lamellar lipid bilayers between corneocytes, halting transepidermal water loss (TEWL) within 48-72 hours.",
    safeAlternatives: [],
  },

  centella_asiatica: {
    id: "centella_asiatica",
    name: "Centella Asiatica (Madecassoside)",
    shortName: "Centella Asiatica",
    category: "Soothing",
    defaultStrength: "2%",
    melaninSafe: true,
    minBarrierScore: 0,
    contraindications: [],
    description: "Rapidly extinguishes cutaneous redness, calms inflammatory cytokines, and accelerates wound healing.",
    molecularMechanism: "Downregulates NF-kB and IL-6 cytokines, suppressing post-inflammatory erythema and melanogenesis triggers.",
    safeAlternatives: [],
  },

  niacinamide: {
    id: "niacinamide",
    name: "Niacinamide (Vitamin B3 2% - 5%)",
    shortName: "Niacinamide",
    category: "Barrier Lipid",
    defaultStrength: "4%",
    melaninSafe: true,
    minBarrierScore: 45,
    contraindications: [],
    description: "Boosts natural ceramide production and curbs melanosome transfer. (Avoid 10%+ doses which trigger flushing).",
    molecularMechanism: "Increases intracellular NADP levels, stimulates epidermal sphingolipid synthesis, and inhibits melanosome transfer by 68%.",
    safeAlternatives: ["ceramides"],
  },

  peptides: {
    id: "peptides",
    name: "Signal Peptides (Matrixyl 3000 + Copper)",
    shortName: "Signal Peptides",
    category: "Peptide",
    defaultStrength: "5%",
    melaninSafe: true,
    minBarrierScore: 20,
    contraindications: [],
    description: "Cell-signaling peptide matrikines that promote collagen and fibronectin synthesis with zero barrier irritation.",
    molecularMechanism: "Binds to cell surface receptors to stimulate extracellular matrix repair without altering epidermal pH.",
    safeAlternatives: [],
  },

  hyaluronic_acid: {
    id: "hyaluronic_acid",
    name: "Multi-Molecular Hyaluronic Acid",
    shortName: "Hyaluronic Acid",
    category: "Soothing",
    defaultStrength: "2%",
    melaninSafe: true,
    minBarrierScore: 0,
    contraindications: [],
    description: "Deep cellular hydration across all epidermal layers without altering skin pH or aggravating barrier redness.",
    molecularMechanism: "Humectant glycosaminoglycan capable of binding up to 1000x its molecular weight in water inside extracellular matrices.",
    safeAlternatives: [],
  },
};
