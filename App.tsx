import React, { useEffect } from "react";
import { StatusBar, StyleSheet, BackHandler, Platform, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppProvider, useApp } from "./src/context/AppContext";
import { BottomNav } from "./src/components/common/BottomNav";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ScanScreen } from "./src/screens/ScanScreen";
import { ClashCheckScreen } from "./src/screens/ClashCheckScreen";
import { RoutineScreen } from "./src/screens/RoutineScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { LiveScanModal } from "./src/components/FaceScanner/LiveScanModal";
import { Toast } from "./src/components/common/Toast";

function MainApp() {
  const {
    activeTab,
    setActiveTab,
    themeColors,
    activeTheme,
    isHydrating,
    hasCompletedOnboarding,
    isLiveScanModalOpen,
    setIsLiveScanModalOpen,
    toastConfig,
    hideToast,
  } = useApp();

  // Android hardware back button handler
  useEffect(() => {
    const backAction = () => {
      if (activeTab !== "home") {
        setActiveTab("home");
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [activeTab, setActiveTab]);

  // While restoring persisted state from AsyncStorage on cold boot, show clean branding splash
  if (isHydrating) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: themeColors.bgPrimary }]}>
        <StatusBar
          barStyle={activeTheme === "dark" ? "light-content" : "dark-content"}
          {...(Platform.OS === "android" ? { backgroundColor: themeColors.bgPrimary } : {})}
        />
        <ActivityIndicator size="large" color={themeColors.emerald} />
      </View>
    );
  }

  // If user has not finished the onboarding walkthrough, render immersive OnboardingScreen
  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: themeColors.bgPrimary }]}
        edges={["top", "left", "right", "bottom"]}
      >
        <StatusBar
          barStyle={activeTheme === "dark" ? "light-content" : "dark-content"}
          {...(Platform.OS === "android" ? { backgroundColor: themeColors.bgPrimary } : {})}
        />
        <OnboardingScreen />
        <Toast
          visible={toastConfig.visible}
          message={toastConfig.message}
          title={toastConfig.title}
          type={toastConfig.type}
          onDismiss={hideToast}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.bgPrimary }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar
        barStyle={activeTheme === "dark" ? "light-content" : "dark-content"}
        {...(Platform.OS === "android" ? { backgroundColor: themeColors.bgPrimary } : {})}
      />

      {/* Main Tab Screens Container: Instantaneous Zero-Lag Tab Switching */}
      <View style={styles.screensWrapper}>
        <View
          style={[
            styles.screenTab,
            {
              opacity: activeTab === "home" ? 1 : 0,
              zIndex: activeTab === "home" ? 1 : 0,
            },
          ]}
          pointerEvents={activeTab === "home" ? "auto" : "none"}
        >
          <HomeScreen />
        </View>

        <View
          style={[
            styles.screenTab,
            {
              opacity: activeTab === "scan" ? 1 : 0,
              zIndex: activeTab === "scan" ? 1 : 0,
            },
          ]}
          pointerEvents={activeTab === "scan" ? "auto" : "none"}
        >
          <ScanScreen />
        </View>

        <View
          style={[
            styles.screenTab,
            {
              opacity: activeTab === "clash" ? 1 : 0,
              zIndex: activeTab === "clash" ? 1 : 0,
            },
          ]}
          pointerEvents={activeTab === "clash" ? "auto" : "none"}
        >
          <ClashCheckScreen />
        </View>

        <View
          style={[
            styles.screenTab,
            {
              opacity: activeTab === "regimen" ? 1 : 0,
              zIndex: activeTab === "regimen" ? 1 : 0,
            },
          ]}
          pointerEvents={activeTab === "regimen" ? "auto" : "none"}
        >
          <RoutineScreen />
        </View>

        <View
          style={[
            styles.screenTab,
            {
              opacity: activeTab === "profile" ? 1 : 0,
              zIndex: activeTab === "profile" ? 1 : 0,
            },
          ]}
          pointerEvents={activeTab === "profile" ? "auto" : "none"}
        >
          <ProfileScreen />
        </View>
      </View>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Toast Notification */}
      <Toast
        visible={toastConfig.visible}
        message={toastConfig.message}
        title={toastConfig.title}
        type={toastConfig.type}
        onDismiss={hideToast}
      />

      {/* Single Global Live Facial Diagnostic Modal */}
      <LiveScanModal
        visible={isLiveScanModalOpen}
        onClose={() => setIsLiveScanModalOpen(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screensWrapper: {
    flex: 1,
    position: "relative",
  },
  screenTab: {
    ...StyleSheet.absoluteFill,
  },
});
