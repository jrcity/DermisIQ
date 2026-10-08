# DermisIQ Architecture & System Blueprint

> **System Blueprint & Clean Architecture Design**  
> **Platform:** React Native (TypeScript) 0.87.1  
> **Engine:** YouCam AI Skin Diagnostics + Melanin Chemical Safety Engine

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph UI_Layer["Presentation Layer (React Native UI)"]
        Nav[Root Navigation & TabBar]
        Home[HomeScreen: Barrier Health Dashboard]
        Scan[ScanScreen: Live Radar & Zone Heatmap]
        Clash[ClashCheckScreen: Active Chemical Copilot]
        Regimen[RoutineScreen: AM/PM Steps & Cart]
        Profile[ProfileScreen: Fitzpatrick & API Config]
    end

    subgraph State_Layer["Application State (Context API)"]
        AppContext[AppContext: Global Session Provider]
    end

    subgraph Core_Engines["Clinical & Analytical Engines"]
        RadarEngine[SVG 6-Axis Polar Coordinate Engine]
        ClashEngine[Melanin-Smart Chemical Contraindication Engine]
        Database[(Skincare Actives Database)]
        Catalog[(Curated eCommerce & Shade Catalog)]
    end

    subgraph API_Layer["Integration & Gateway Layer"]
        YouCamClient[YouCam REST API Client]
        FailoverMode[High-Fidelity Offline Resilience Provider]
        PerfectCorpGateway[Perfect Corp YouCam AI Cloud]
    end

    Nav --> Home & Scan & Clash & Regimen & Profile
    Home & Scan & Clash & Regimen & Profile <--> AppContext
    AppContext <--> ClashEngine & RadarEngine
    ClashEngine <--> Database
    AppContext <--> Catalog
    AppContext <--> YouCamClient
    YouCamClient --> FailoverMode
    YouCamClient --> PerfectCorpGateway
```

---

## 2. Directory Structure & Responsibilities

```
DermisIQ/
├── docs/
│   ├── STRATEGY_AND_IDEATION.md    # Devpost winning strategy & market analysis
│   ├── SPECS.md                    # Technical & functional specifications
│   └── ARCHITECTURE.md             # System architecture & component design
├── src/
│   ├── api/
│   │   ├── youcam/                 # YouCam REST API client & mock datasets
│   │   └── clashEngine/            # Chemical conflict algorithms & product catalog
│   ├── components/
│   │   ├── common/                 # Header, Button, Badge, Card, BottomNav
│   │   ├── FaceScanner/            # SVG Radar & Zone Heatmap
│   │   ├── SkinMetrics/            # Barrier Health Meter & Parameter Pills
│   │   ├── IngredientClash/        # Safety Banner & Active Toggle Chips
│   │   └── Regimen/                # Step-by-Step Routine Cards & Cart Drawer
│   ├── context/
│   │   └── AppContext.tsx          # Single source of truth for scan, cart, and profile
│   ├── screens/                    # Home, Scan, Clash, Routine, Profile screens
│   └── theme/                      # Clinical dark design tokens
└── App.tsx                         # Root app entry with SafeAreaProvider
```

---

## 3. Resilience & Offline Hackathon Guarantees
* **Graceful Degradation:** If network connectivity drops or API quotas are exhausted, `YouCamClient` seamlessly provides clinical presets (`melaninSensitive` & `balancedProfile`), ensuring judges never experience errors or blank screens.
* **Type Safety:** 100% strict TypeScript compliance across all modules.
* **Automated Test Coverage:** Verified through Jest unit tests covering chemical clashes, barrier thresholds, and API failovers.
