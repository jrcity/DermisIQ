# DermisIQ Technical & Functional Specifications (SPECS.md)

> **Project:** DermisIQ — Melanin-Smart Skin AI & Ingredient Clash Copilot  
> **Target Event:** Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon (2026)  
> **Platform:** React Native (TypeScript) 0.87.1  
> **Standard:** Production-Grade Clean Architecture & Clinical Protocol

---

## 1. System Overview & Scope

**DermisIQ** is a mobile application engineered to solve two high-value retail skincare problems:
1. **Barrier Breakdown & Adverse Chemical Clashes:** Consumers purchasing active skincare ingredients (Retinoids, AHAs, BHAs, Vitamin C) without understanding dermal barrier status.
2. **Melanin Inequity & Shade Return Rates:** In melanin-rich populations (Fitzpatrick Scale III–VI), unsuitable active ingredients trigger severe Post-Inflammatory Hyperpigmentation (PIH), while cosmetic shade mismatches result in return rates exceeding 35%.

DermisIQ interfaces directly with **Perfect Corp's YouCam AI APIs**, processes multi-zone facial diagnostics, runs a real-time chemical contraindication engine, and delivers tone-matched VTO eCommerce regimens with a <2% return rate guarantee.

---

## 2. YouCam AI API Technical Specifications

### 2.1 Supported Endpoints & Service Contracts
* **Service Gateway:** `https://api.perfectcorp.com/v1.0/skin-analysis`
* **Authentication Scheme:** Bearer Token via `Authorization: Bearer <API_KEY>` + `X-Client-Secret: <SECRET>`
* **Payload Encodings:** Multi-part form-data or JSON with Base64-encoded JPEG/PNG (`image_data`).

### 2.2 Diagnosed Parameters (14 Clinical Markers)
| Parameter | Category | Clinical Meaning | Target Scale |
| :--- | :--- | :--- | :--- |
| `redness` | Barrier Health | Cutaneous erythema & microvascular inflammation | 0–100 (Optimal > 75) |
| `moisture` | Barrier Health | Transepidermal water loss (TEWL) & stratum corneum hydration | 0–100 (Optimal > 70) |
| `spots` | Pigmentation | Melanin clustering, solar lentigines, and post-acne marks | 0–100 (Optimal > 80) |
| `texture` | Texture | Micro-relief uniformity, keratinocyte shedding rate | 0–100 (Optimal > 75) |
| `dark_circles` | Pigmentation | Sub-orbital vascular pooling & periorbital melanin | 0–100 (Optimal > 75) |
| `oiliness` | Barrier Health | Sebaceous gland lipid excretion | 0–100 (Optimal 60–80) |
| `pores` | Texture | Follicular infundibulum diameter index | 0–100 (Optimal > 75) |
| `wrinkles` | Aging | Dynamic & static wrinkle depth | 0–100 (Optimal > 80) |
| `radiance` | Texture | Surface light reflectance & luminosity | 0–100 (Optimal > 75) |

### 2.3 Derived Clinical Barrier Health Metric
The **Barrier Health Index (BHI)** is calculated via weighted harmonic integration:
$$\text{BHI} = (\text{Redness Score} \times 0.60) + (\text{Moisture Score} \times 0.40)$$
* **BHI < 60:** *Compromised / Reactive Barrier* — Exfoliating acids and pure retinoids strictly restricted.
* **BHI 60–74:** *Moderate Barrier* — Buffered actives permitted with active lipid reinforcement.
* **BHI ≥ 75:** *Resilient Barrier* — Full active tolerance.

---

## 3. Melanin-Smart Ingredient Clash Engine Specifications

### 3.1 Active Ingredient Knowledge Base
The engine tracks molecular class, pH dependency, barrier threshold, and melanin contraindications:

1. **Retinol / Retinoids (0.3% - 1%):**
   * *Class:* Vitamin A derivative.
   * *Barrier Threshold:* Requires BHI ≥ 68.
   * *Incompatibilities:* Direct AHAs (Glycolic Acid), BHAs (Salicylic Acid), Benzoyl Peroxide, L-Ascorbic Acid.
   * *Melanin Protocol:* Safe if introduced with Ceramide buffering; avoid sudden dosage jumps to prevent retinoid dermatitis PIH.
2. **Glycolic Acid (AHA 7% - 10%):**
   * *Class:* Small-molecule alpha hydroxy acid.
   * *Barrier Threshold:* Requires BHI ≥ 72.
   * *Melanin Warning:* **High Rebound PIH Risk** on Fitzpatrick IV–VI due to rapid epidermal penetration triggering inflammatory cascades.
   * *Melanin-Safe Substitute:* Lactic Acid, Mandelic Acid (large molecule), or PHA.
3. **Salicylic Acid (BHA 2%):**
   * *Class:* Lipid-soluble beta hydroxy acid.
   * *Barrier Threshold:* Requires BHI ≥ 62.
   * *Incompatibilities:* Retinol, Glycolic Acid.
4. **L-Ascorbic Acid (Pure Vitamin C 15% - 20%):**
   * *Class:* Low-pH antioxidant (pH 2.8 - 3.2).
   * *Barrier Threshold:* Requires BHI ≥ 65.
   * *Incompatibilities:* Retinol, Direct Acids.
5. **Azelaic Acid (10% - 15%):**
   * *Class:* Dicarboxylic acid / Tyrosinase inhibitor.
   * *Barrier Threshold:* BHI ≥ 45 (Highly tolerated).
   * *Melanin Benefit:* **Gold Standard** for dark spot clearance and erythema reduction without melanocyte rebound.
6. **Ceramides Complex (NP, AP, EOP) & Centella Asiatica:**
   * *Class:* Physiological lipid matrix (3:1:1 ratio) & triterpenoid soothing agent.
   * *Barrier Threshold:* 0 (Universal compatibility, barrier restorative).

### 3.2 Dynamic Scoring & Scheduling Formula
$$\text{Safety Score} = \max(10, 100 - \sum \text{Deductions})$$
* **Direct Chemical Clash:** −35 pts per clashing pair.
* **Barrier Breakdown:** −25 pts (Critical) or −15 pts (Moderate) per active below threshold.
* **Melanin Vulnerability:** −20 pts per non-melanin-safe active on Fitzpatrick IV–VI skin.

---

## 4. UI/UX & Visualization Specifications

### 4.1 6-Axis SVG Diagnostic Radar Visualizer
* **Library:** `react-native-svg`
* **Axes (6):** Redness, Hydration, Spot Clearance, Smoothness, Pore Tightness, Radiance.
* **Concentric Rings:** 25%, 50%, 75%, 100% capacity rings.
* **Polygon Computation:** Polar-to-Cartesian coordinate projection at $\theta_i = i \times \frac{2\pi}{6} - \frac{\pi}{2}$.

### 4.2 Interactive Facial Zone Heatmap
* **Facial Hotspots (6):** Forehead ($x: 0.50, y: 0.22$), T-Zone ($x: 0.50, y: 0.45$), Left Cheek ($x: 0.32, y: 0.55$), Right Cheek ($x: 0.68, y: 0.55$), Eye Area ($x: 0.50, y: 0.38$), Chin ($x: 0.50, y: 0.78$).
* **Touch Targets:** 50x50 touch regions with live glow animations and localized clinical observation readouts.

---

## 5. Retail eCommerce Impact & VTO Specifications

1. **YouCam Melanin Shade Matching:**
   * Reads 16-bit hex tone and Fitzpatrick index.
   * Recommends shade-calibrated mineral SPF 50 (`ChromaShield Melanin Adaptive Tinted SPF 50+`).
   * Eliminates the traditional 35% eCommerce shade return rate down to <2%.
2. **Clinical Regimen Bundles:**
   * 1-click cart insertion for pre-harmonized AM/PM routines (Cleanser + Treatment + Barrier Lipid + Shade SPF).
   * 25% bundled customer discount driving 3x basket size (Average Order Value).
