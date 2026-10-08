import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import {
  YouCamSkinAnalysisResult,
  FitzpatrickSkinType,
  FacialZoneIssue,
} from "../api/youcam/types";
import { defaultYouCamClient } from "../api/youcam/client";
import { mockProfiles, FALLBACK_FACE_ASSETS } from "../api/youcam/mockData";
import {
  IngredientClashEngine,
  RegimenSafetyEvaluation,
  RoutinePreset,
  ROUTINE_PRESETS,
} from "../api/clashEngine/engine";
import {
  ProductItem,
  RegimenBundle,
  PRODUCT_CATALOG,
} from "../api/clashEngine/recommendations";
import { darkColors, lightColors, ThemeMode } from "../theme";
import { ToastType } from "../components/common/Toast";

export interface CartItemEntry {
  product: ProductItem;
  quantity: number;
}

export type PaymentMethodType = "card" | "apple_pay" | "upi" | "bnpl";

interface AppContextType {
  scanResult: YouCamSkinAnalysisResult;
  activePreset: "melaninSensitive" | "balancedProfile" | "deepMelaninProfile";
  capturedFaceImage: any;
  setCapturedFaceImage: (img: any) => void;
  isScanning: boolean;
  scanProgressStage: string;
  scanProgress: number;
  selectedZone: FacialZoneIssue | null;
  setSelectedZone: (zone: FacialZoneIssue | null) => void;

  // Active Ingredient Clash State
  activeActives: string[];
  toggleActiveIngredient: (id: string) => void;
  loadRoutinePreset: (preset: RoutinePreset) => void;
  clearActiveIngredients: () => void;
  ingredientSearchQuery: string;
  setIngredientSearchQuery: (query: string) => void;
  ingredientCategoryFilter: string;
  setIngredientCategoryFilter: (cat: string) => void;
  evaluation: RegimenSafetyEvaluation;

  // Cart & eCommerce
  cart: ProductItem[];
  cartItems: CartItemEntry[];
  addToCart: (item: ProductItem) => void;
  addBundleToCart: (bundle: RegimenBundle) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  promoCode: string;
  promoDiscountPercentage: number;
  applyPromoCode: (code: string) => boolean;
  cartSubtotal: number;
  discountAmount: number;
  cartTotal: number;
  cartItemCount: number;

  // Multi-Payment Alternative State
  selectedPaymentMethod: PaymentMethodType;
  setSelectedPaymentMethod: (method: PaymentMethodType) => void;

  // Scanner & Profile
  runScan: (
    preset?: "melaninSensitive" | "balancedProfile" | "deepMelaninProfile",
    customFaceImage?: any,
    imageUriOrBase64?: string
  ) => Promise<void>;
  userFitzpatrick: FitzpatrickSkinType;
  setUserFitzpatrick: (type: FitzpatrickSkinType) => void;
  activeTab: "home" | "scan" | "clash" | "regimen" | "profile";
  setActiveTab: (tab: "home" | "scan" | "clash" | "regimen" | "profile") => void;

  // Theme Settings
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  activeTheme: "dark" | "light";
  themeColors: typeof darkColors;

  // Modals & Console
  isLiveScanModalOpen: boolean;
  setIsLiveScanModalOpen: (open: boolean) => void;
  isApiConsoleOpen: boolean;
  setIsApiConsoleOpen: (open: boolean) => void;
  checkoutSuccessModal: boolean;
  setCheckoutSuccessModal: (open: boolean) => void;

  // Global Toast Notifications
  toastConfig: {
    visible: boolean;
    message: string;
    title?: string;
    type?: ToastType;
  };
  showToast: (message: string, type?: ToastType, title?: string) => void;
  hideToast: () => void;

  // Guided Onboarding Flow
  isHydrating: boolean;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  completeOnboarding: (
    faceImage?: any,
    customPreset?: "melaninSensitive" | "balancedProfile" | "deepMelaninProfile",
    imageUriOrBase64?: string
  ) => Promise<void>;
  resetOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const activeTheme = useMemo<"dark" | "light">(() => {
    if (themeMode === "system") {
      return systemColorScheme === "light" ? "light" : "dark";
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const themeColors = activeTheme === "light" ? lightColors : darkColors;

  // Global Toast Notification State
  const [toastConfig, setToastConfig] = useState<{
    visible: boolean;
    message: string;
    title?: string;
    type?: ToastType;
  }>({
    visible: false,
    message: "",
    title: undefined,
    type: "info",
  });

  const showToast = (message: string, type: ToastType = "info", title?: string) => {
    setToastConfig({ visible: true, message, type, title });
  };

  const hideToast = () => {
    setToastConfig(prev => ({ ...prev, visible: false }));
  };

  // Wire YouCam Client alerts directly to Global Toast UI
  useEffect(() => {
    defaultYouCamClient.setErrorNotifier((message, type, title) => {
      showToast(message, type, title);
    });
    return () => {
      defaultYouCamClient.setErrorNotifier(null);
    };
  }, []);

  const [isHydrating, setIsHydrating] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);

  // Restore persisted calibration state & face image on cold launch
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [
          onboardingCompleted,
          savedScan,
          savedFaceType,
          savedFaceUri,
          savedFacePreset,
        ] = await Promise.all([
          AsyncStorage.getItem("@dermisiq_onboarding_completed"),
          AsyncStorage.getItem("@dermisiq_calibrated_scan_result"),
          AsyncStorage.getItem("@dermisiq_face_image_type"),
          AsyncStorage.getItem("@dermisiq_face_image_uri"),
          AsyncStorage.getItem("@dermisiq_face_image_preset"),
        ]);

        if (onboardingCompleted === "true") {
          setHasCompletedOnboarding(true);
        }

        if (savedScan) {
          const parsed = JSON.parse(savedScan);
          setScanResult(parsed);
          if (parsed.fitzpatrickType) {
            setUserFitzpatrick(parsed.fitzpatrickType);
          }
          if (parsed.zones && parsed.zones.length > 2) {
            setSelectedZone(parsed.zones[2]);
          }
        }

        // Restore exact face capture
        if (savedFaceType === "custom" && savedFaceUri) {
          setCapturedFaceImage({ uri: savedFaceUri });
        } else if (savedFacePreset) {
          if (savedFacePreset === "balancedProfile") {
            setCapturedFaceImage(FALLBACK_FACE_ASSETS.balancedProfile);
            setActivePreset("balancedProfile");
          } else if (savedFacePreset === "deepMelaninProfile") {
            setCapturedFaceImage(FALLBACK_FACE_ASSETS.deepMelaninProfile);
            setActivePreset("deepMelaninProfile");
          } else {
            setCapturedFaceImage(FALLBACK_FACE_ASSETS.melaninSensitive);
            setActivePreset("melaninSensitive");
          }
        }
      } catch (e) {
        console.warn("Error restoring persisted calibration:", e);
      } finally {
        setIsHydrating(false);
      }
    };
    loadPersistedState();
  }, []);

  const [activePreset, setActivePreset] = useState<
    "melaninSensitive" | "balancedProfile" | "deepMelaninProfile"
  >("melaninSensitive");

  const [capturedFaceImage, setCapturedFaceImage] = useState<any>(
    require("../assets/face_melanin_sensitive.jpg")
  );

  const [scanResult, setScanResult] = useState<YouCamSkinAnalysisResult>(
    mockProfiles.melaninSensitive
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgressStage, setScanProgressStage] = useState<string>("Ready");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [selectedZone, setSelectedZone] = useState<FacialZoneIssue | null>(
    mockProfiles.melaninSensitive.zones[2]
  );
  const [userFitzpatrick, setUserFitzpatrick] = useState<FitzpatrickSkinType>("Type IV");
  const [activeTab, setActiveTab] = useState<
    "home" | "scan" | "clash" | "regimen" | "profile"
  >("home");

  // Actives tested in Clash Copilot
  const [activeActives, setActiveActives] = useState<string[]>([
    "retinol",
    "glycolic_acid",
    "ascorbic_acid",
  ]);
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState<string>("");
  const [ingredientCategoryFilter, setIngredientCategoryFilter] = useState<string>("All");

  // Cart with quantity & discount handling
  const [cartItems, setCartItems] = useState<CartItemEntry[]>([
    { product: PRODUCT_CATALOG[4], quantity: 1 }, // ChromaShield Tinted SPF 50
    { product: PRODUCT_CATALOG[1], quantity: 1 }, // LipidShield 5X Ceramide Cream
  ]);
  const [promoCode, setPromoCode] = useState<string>("DERMIS25");
  const [promoDiscountPercentage, setPromoDiscountPercentage] = useState<number>(25);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("apple_pay");

  // Modals & Console
  const [isLiveScanModalOpen, setIsLiveScanModalOpen] = useState<boolean>(false);
  const [isApiConsoleOpen, setIsApiConsoleOpen] = useState<boolean>(false);
  const [checkoutSuccessModal, setCheckoutSuccessModal] = useState<boolean>(false);

  // Synchronize userFitzpatrick when scanResult changes
  useEffect(() => {
    if (scanResult.fitzpatrickType) {
      setUserFitzpatrick(scanResult.fitzpatrickType);
    }
  }, [scanResult]);

  // Derived Regimen Evaluation
  const evaluation = useMemo(() => {
    return IngredientClashEngine.evaluateRegimen(
      activeActives,
      scanResult,
      userFitzpatrick
    );
  }, [activeActives, scanResult, userFitzpatrick]);

  const toggleActiveIngredient = (id: string) => {
    setActiveActives(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const loadRoutinePreset = (preset: RoutinePreset) => {
    setActiveActives([...preset.actives]);
  };

  const clearActiveIngredients = () => {
    setActiveActives([]);
  };

  // Cart Operations
  const addToCart = (product: ProductItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const addBundleToCart = (bundle: RegimenBundle) => {
    bundle.products.forEach(p => addToCart(p));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItemEntry => item !== null);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyPromoCode = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "DERMIS25" || trimmed === "YOUCAM25") {
      setPromoCode(trimmed);
      setPromoDiscountPercentage(25);
      return true;
    }
    if (trimmed === "MELANIN15") {
      setPromoCode(trimmed);
      setPromoDiscountPercentage(15);
      return true;
    }
    return false;
  };

  // Cart Totals
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, curr) => acc + curr.product.price * curr.quantity,
      0
    );
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return (cartSubtotal * promoDiscountPercentage) / 100;
  }, [cartSubtotal, promoDiscountPercentage]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  // Backwards compatibility flat array
  const flatCart = useMemo(() => {
    return cartItems.map(item => item.product);
  }, [cartItems]);

  // Run Scan and infer Fitzpatrick scale dynamically
  const runScan = async (
    preset: "melaninSensitive" | "balancedProfile" | "deepMelaninProfile" = "melaninSensitive",
    customFaceImage?: any,
    imageUriOrBase64?: string
  ) => {
    setIsScanning(true);
    setActivePreset(preset);

    if (customFaceImage) {
      setCapturedFaceImage(customFaceImage);
      if (typeof customFaceImage === "object" && customFaceImage?.uri) {
        AsyncStorage.setItem("@dermisiq_face_image_type", "custom").catch(() => {});
        AsyncStorage.setItem("@dermisiq_face_image_uri", customFaceImage.uri).catch(() => {});
      }
    } else if (preset === "melaninSensitive") {
      setCapturedFaceImage(FALLBACK_FACE_ASSETS.melaninSensitive);
      AsyncStorage.setItem("@dermisiq_face_image_type", "preset").catch(() => {});
      AsyncStorage.setItem("@dermisiq_face_image_preset", "melaninSensitive").catch(() => {});
    } else if (preset === "balancedProfile") {
      setCapturedFaceImage(FALLBACK_FACE_ASSETS.balancedProfile);
      AsyncStorage.setItem("@dermisiq_face_image_type", "preset").catch(() => {});
      AsyncStorage.setItem("@dermisiq_face_image_preset", "balancedProfile").catch(() => {});
    } else {
      setCapturedFaceImage(FALLBACK_FACE_ASSETS.deepMelaninProfile);
      AsyncStorage.setItem("@dermisiq_face_image_type", "preset").catch(() => {});
      AsyncStorage.setItem("@dermisiq_face_image_preset", "deepMelaninProfile").catch(() => {});
    }

    try {
      const payload =
        imageUriOrBase64 ||
        (typeof customFaceImage === "object" && customFaceImage?.uri
          ? customFaceImage.uri
          : "mock://camera_frame_capture");

      const result = await defaultYouCamClient.analyzeSkin(
        payload,
        preset,
        (stage, progress) => {
          setScanProgressStage(stage);
          setScanProgress(progress);
        }
      );
      setScanResult(result);
      try {
        AsyncStorage.setItem("@dermisiq_calibrated_scan_result", JSON.stringify(result));
      } catch {}
      setUserFitzpatrick(result.fitzpatrickType); // Dynamically set to AI inferred phototype
      if (result.zones.length > 0) {
        setSelectedZone(result.zones[2]);
      }
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setScanProgressStage("Ready");
    }
  };

  const completeOnboarding = async (
    faceImage?: any,
    customPreset?: "melaninSensitive" | "balancedProfile" | "deepMelaninProfile",
    imageUriOrBase64?: string
  ) => {
    await runScan(customPreset || "melaninSensitive", faceImage, imageUriOrBase64);
    try {
      await AsyncStorage.setItem("@dermisiq_onboarding_completed", "true");
    } catch (e) {
      console.warn("Error saving onboarding state:", e);
    }
    setHasCompletedOnboarding(true);
    setActiveTab("home");
  };

  const resetOnboarding = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("@dermisiq_onboarding_completed"),
        AsyncStorage.removeItem("@dermisiq_calibrated_scan_result"),
        AsyncStorage.removeItem("@dermisiq_face_image_type"),
        AsyncStorage.removeItem("@dermisiq_face_image_uri"),
        AsyncStorage.removeItem("@dermisiq_face_image_preset"),
      ]);
    } catch (e) {
      console.warn("Error resetting onboarding state:", e);
    }
    setHasCompletedOnboarding(false);
    setCapturedFaceImage(FALLBACK_FACE_ASSETS.melaninSensitive);
  };

  return (
    <AppContext.Provider
      value={{
        scanResult,
        activePreset,
        capturedFaceImage,
        setCapturedFaceImage,
        isScanning,
        scanProgressStage,
        scanProgress,
        selectedZone,
        setSelectedZone,
        activeActives,
        toggleActiveIngredient,
        loadRoutinePreset,
        clearActiveIngredients,
        ingredientSearchQuery,
        setIngredientSearchQuery,
        ingredientCategoryFilter,
        setIngredientCategoryFilter,
        evaluation,
        cart: flatCart,
        cartItems,
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        promoCode,
        promoDiscountPercentage,
        applyPromoCode,
        cartSubtotal,
        discountAmount,
        cartTotal,
        cartItemCount,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        runScan,
        userFitzpatrick,
        setUserFitzpatrick,
        activeTab,
        setActiveTab,
        themeMode,
        setThemeMode,
        activeTheme,
        themeColors,
        isLiveScanModalOpen,
        setIsLiveScanModalOpen,
        isApiConsoleOpen,
        setIsApiConsoleOpen,
        checkoutSuccessModal,
        setCheckoutSuccessModal,
        toastConfig,
        showToast,
        hideToast,
        isHydrating,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
