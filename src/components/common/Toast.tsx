import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { ShieldAlertIcon, CheckIcon, SparklesIcon } from "./Icons";

export type ToastType = "error" | "warning" | "success" | "info";

export interface ToastProps {
  visible: boolean;
  message: string;
  title?: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  title,
  type = "info",
  onDismiss,
  duration = 6000,
}) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShouldRender(false);
      onDismiss();
    });
  };

  if (!visible && !shouldRender) return null;

  const getColors = () => {
    switch (type) {
      case "error":
        return {
          bg: "#1C0A0E",
          border: "#EF4444",
          text: "#FCA5A5",
          accent: "#EF4444",
          defaultTitle: "Diagnostic Error",
        };
      case "warning":
        return {
          bg: "#1C1408",
          border: "#F59E0B",
          text: "#FDE68A",
          accent: "#F59E0B",
          defaultTitle: "Scan Advisory",
        };
      case "success":
        return {
          bg: "#0A1C14",
          border: "#10B981",
          text: "#A7F3D0",
          accent: "#10B981",
          defaultTitle: "Calibration Successful",
        };
      case "info":
      default:
        return {
          bg: "#081624",
          border: "#06B6D4",
          text: "#BAE6FD",
          accent: "#06B6D4",
          defaultTitle: "API Telemetry Notice",
        };
    }
  };

  const colors = getColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.iconColumn}>
          {type === "error" && <ShieldAlertIcon size={20} color={colors.accent} />}
          {type === "warning" && <ShieldAlertIcon size={20} color={colors.accent} />}
          {type === "success" && <CheckIcon size={20} color={colors.accent} />}
          {type === "info" && <SparklesIcon size={20} color={colors.accent} />}
        </View>

        <View style={styles.contentColumn}>
          <Text style={[styles.title, { color: colors.accent }]}>
            {title || colors.defaultTitle}
          </Text>
          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDismiss}
          style={styles.closeBtn}
          accessibilityLabel="Dismiss notification"
        >
          <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 32,
    left: spacing.md,
    right: spacing.md,
    zIndex: 99999,
    elevation: 20,
  },
  toastCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    ...shadows.card,
    gap: 10,
  },
  iconColumn: {
    paddingTop: 1,
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  closeBtn: {
    padding: 4,
    marginLeft: 4,
  },
  closeText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
