import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import { radius, spacing, shadows } from "../../theme";
import { apiLogger, ApiTelemetryLog } from "../../api/youcam/apiLogger";
import { defaultYouCamClient } from "../../api/youcam/client";
import { SparklesIcon, CheckIcon, TrashIcon, RefreshIcon } from "./Icons";
import { useApp } from "../../context/AppContext";

interface ApiConsoleModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ApiConsoleModal: React.FC<ApiConsoleModalProps> = ({ visible, onClose }) => {
  const { themeColors, activeTheme } = useApp();
  const [logs, setLogs] = useState<ApiTelemetryLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const unsubscribe = apiLogger.subscribe(updatedLogs => {
      setLogs(updatedLogs);
      if (updatedLogs.length > 0 && !expandedLogId) {
        setExpandedLogId(updatedLogs[0].id);
      }
    });
    return unsubscribe;
  }, [expandedLogId]);

  const handleTestPing = async () => {
    setIsPinging(true);
    try {
      await defaultYouCamClient.analyzeSkin("data:image/jpeg;base64,TEST_PROBE_PING", "melaninSensitive");
    } finally {
      setIsPinging(false);
    }
  };

  const handleShareLog = (log: ApiTelemetryLog) => {
    Share.share({
      title: `YouCam API Log [${log.status}]`,
      message: `${log.curlCommand}\n\nResponse:\n${JSON.stringify(log.responsePayload, null, 2)}`,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: themeColors.bgPrimary }]}>
        {/* Header Bar */}
        <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={[styles.onlineDot, { backgroundColor: themeColors.emerald }]} />
              <Text style={[styles.headerCaption, { color: themeColors.emerald }]}>
                PERFECT CORP S2S NETWORK INSPECTOR
              </Text>
            </View>
            <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
              YouCam AI API Console
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: themeColors.bgCardSubtle, borderColor: themeColors.border }]}
          >
            <Text style={[styles.closeBtnText, { color: themeColors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Live Status Sub-bar & Test Ping Action */}
        <View
          style={[
            styles.statusBar,
            {
              backgroundColor: themeColors.bgCard,
              borderColor: themeColors.borderLight,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTarget, { color: themeColors.textPrimary }]}>
              Target: <Text style={{ color: themeColors.emerald, fontWeight: "800" }}>yce-api-01.makeupar.com</Text>
            </Text>
            <Text style={[styles.statusSub, { color: themeColors.textSecondary }]}>
              Captured: {logs.length} request(s) • Live S2S Gateway Active
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleTestPing}
              disabled={isPinging}
              style={[styles.pingBtn, { backgroundColor: themeColors.emerald }]}
            >
              <RefreshIcon size={13} color="#FFFFFF" />
              <Text style={styles.pingBtnText}>
                {isPinging ? "Pinging..." : "Send S2S Probe"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => apiLogger.clear()}
              style={[
                styles.clearBtn,
                {
                  backgroundColor: themeColors.roseMuted,
                  borderColor: themeColors.borderRose,
                },
              ]}
            >
              <TrashIcon size={13} color={themeColors.rose} />
              <Text style={[styles.clearBtnText, { color: themeColors.rose }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logs Feed */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.logList}
          showsVerticalScrollIndicator={false}
        >
          {logs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SparklesIcon size={34} color={themeColors.textMuted} />
              <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
                No API Calls Captured Yet
              </Text>
              <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                Run a live diagnostic scan or tap "Send S2S Probe" above to inspect real YouCam HTTP transactions.
              </Text>
            </View>
          ) : (
            logs.map(log => {
              const isExpanded = expandedLogId === log.id;
              const statusNum = (log.status !== undefined ? log.status : log.statusCode) || 200;
              const isSuccess = statusNum >= 200 && statusNum < 300;

              return (
                <View
                  key={log.id}
                  style={[
                    styles.logCard,
                    {
                      backgroundColor: themeColors.bgCard,
                      borderColor: isExpanded ? themeColors.emerald : themeColors.borderLight,
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setExpandedLogId(isExpanded ? null : log.id)}
                    style={styles.cardHeader}
                  >
                    <View style={styles.cardHeaderLeft}>
                      <View
                        style={[
                          styles.methodPill,
                          {
                            backgroundColor: themeColors.bgElevated,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.methodText, { color: themeColors.textPrimary }]}>
                          {log.method}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[styles.endpointText, { color: themeColors.textPrimary }]}
                          numberOfLines={1}
                        >
                          {log.endpoint}
                        </Text>
                        <Text style={[styles.timestampText, { color: themeColors.textMuted }]}>
                          {log.timestamp} • Latency: {log.latencyMs}ms
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardHeaderRight}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isSuccess
                              ? themeColors.emeraldMuted
                              : themeColors.roseMuted,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: isSuccess ? themeColors.emerald : themeColors.rose },
                          ]}
                        >
                          {statusNum} {isSuccess ? "OK" : "ERR"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Inspector Panel */}
                  {isExpanded && (
                    <View
                      style={[
                        styles.cardDetails,
                        { borderTopColor: themeColors.borderLight },
                      ]}
                    >
                      {/* Curl Command Snippet */}
                      <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
                        REPRODUCIBLE CURL:
                      </Text>
                      <View
                        style={[
                          styles.codeBox,
                          {
                            backgroundColor: themeColors.bgCardSubtle,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.codeText, { color: themeColors.textSecondary }]}>
                          {log.curlCommand}
                        </Text>
                      </View>

                      {/* Request Payload */}
                      <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
                        REQUEST PAYLOAD (JSON):
                      </Text>
                      <View
                        style={[
                          styles.codeBox,
                          {
                            backgroundColor: themeColors.bgCardSubtle,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.codeText, { color: themeColors.textSecondary }]}>
                          {JSON.stringify(log.requestPayload, null, 2)}
                        </Text>
                      </View>

                      {/* Response Payload */}
                      <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
                        YOUCAM RESPONSE (JSON):
                      </Text>
                      <View
                        style={[
                          styles.codeBox,
                          {
                            backgroundColor: themeColors.bgCardSubtle,
                            borderColor: themeColors.borderEmerald,
                          },
                        ]}
                      >
                        <Text style={[styles.codeText, { color: themeColors.emerald }]}>
                          {JSON.stringify(log.responsePayload, null, 2)}
                        </Text>
                      </View>

                      {/* Share / Copy Action */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleShareLog(log)}
                        style={[
                          styles.shareBtn,
                          {
                            backgroundColor: themeColors.cyanMuted,
                            borderColor: themeColors.cyan,
                          },
                        ]}
                      >
                        <SparklesIcon size={14} color={themeColors.cyan} />
                        <Text style={[styles.shareBtnText, { color: themeColors.cyan }]}>
                          Share / Export Telemetry
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerCaption: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  statusTarget: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusSub: {
    fontSize: 10,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  pingBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: "800",
  },
  logList: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  logCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
    overflow: "hidden",
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.sm + 4,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  methodPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  methodText: {
    fontSize: 10,
    fontWeight: "900",
  },
  endpointText: {
    fontSize: 12,
    fontWeight: "800",
  },
  timestampText: {
    fontSize: 10,
    marginTop: 2,
  },
  cardHeaderRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "900",
  },
  cardDetails: {
    padding: spacing.sm + 4,
    borderTopWidth: 1,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  codeBox: {
    padding: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: 12,
  },
  shareBtnText: {
    fontSize: 11,
    fontWeight: "800",
  },
});
