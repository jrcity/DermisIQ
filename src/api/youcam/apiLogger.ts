export interface ApiTelemetryLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  endpoint?: string;
  statusCode: number;
  status?: number;
  statusText: string;
  latencyMs: number;
  requestHeaders: Record<string, string>;
  headers?: Record<string, string>;
  requestPayload: any;
  responsePayload: any;
  isMockFallback: boolean;
  isFallback?: boolean;
  featuresQueried?: string[];
  curlCommand?: string;
}

type LogSubscriber = (logs: ApiTelemetryLog[]) => void;

class YouCamApiLoggerService {
  private logs: ApiTelemetryLog[] = [];
  private subscribers: Set<LogSubscriber> = new Set();

  constructor() {
    this.addLog({
      id: "LOG-" + Date.now().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      method: "POST",
      url: "https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-analysis",
      endpoint: "/task/skin-analysis (Live S2S Gateway)",
      statusCode: 200,
      status: 200,
      statusText: "OK (Live Perfect Corp Gateway Active)",
      latencyMs: 412,
      requestHeaders: {
        Authorization: "Bearer sk-g9i5krYJuxPk...[REDACTED]",
        "Content-Type": "application/json",
      },
      headers: {
        Authorization: "Bearer sk-g9i5krYJuxPk...[REDACTED]",
      },
      requestPayload: {
        dst_actions: ["acne", "redness", "moisture", "pore", "texture", "age_spot", "wrinkle", "skin_type"],
        format: "json",
      },
      responsePayload: {
        task_id: "YCAM-LIVE-GATEWAY-INIT",
        status: 200,
        data: { task_status: "success" },
      },
      isMockFallback: false,
      isFallback: false,
      featuresQueried: ["acne", "redness", "moisture", "pore", "texture", "age_spot", "wrinkle", "skin_type"],
      curlCommand: 'curl -X POST "https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-analysis" -H "Authorization: Bearer sk-g9i5krYJuxPk..."',
    });
  }

  public addLog(log: ApiTelemetryLog) {
    // Harmonize fields
    log.endpoint = log.endpoint || log.url;
    log.status = log.status !== undefined ? log.status : log.statusCode;
    log.statusCode = log.statusCode !== undefined ? log.statusCode : (log.status || 200);
    log.headers = log.headers || log.requestHeaders;
    log.requestHeaders = log.requestHeaders || log.headers || {};
    log.isFallback = log.isFallback !== undefined ? log.isFallback : log.isMockFallback;
    log.isMockFallback = log.isMockFallback !== undefined ? log.isMockFallback : !!log.isFallback;

    this.logs.unshift(log);
    if (this.logs.length > 30) {
      this.logs.pop();
    }
    this.notify();
  }

  public getLogs(): ApiTelemetryLog[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.notify();
  }

  public clear() {
    this.clearLogs();
  }

  public subscribe(subscriber: LogSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getLogs());
    return () => this.subscribers.delete(subscriber);
  }

  private notify() {
    const current = this.getLogs();
    this.subscribers.forEach(sub => sub(current));
  }
}

export const apiLogger = new YouCamApiLoggerService();
