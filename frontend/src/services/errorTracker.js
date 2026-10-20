// Production Error Tracking & Diagnostic Logging Service
// Catches unhandled promise rejections, UI crashes, and logs contextual breadcrumbs

const ERROR_LOG_KEY = "fdss_error_logs";

export function logError(error, errorInfo = {}) {
  const errorEntry = {
    message: error?.message || String(error),
    stack: error?.stack || null,
    componentStack: errorInfo?.componentStack || null,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  console.error("[ErrorTracker] Captured exception:", errorEntry);

  try {
    const raw = localStorage.getItem(ERROR_LOG_KEY);
    const logs = raw ? JSON.parse(raw) : [];
    logs.push(errorEntry);
    if (logs.length > 30) logs.shift(); // retain last 30
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    // Fail-safe
  }
}

export function initGlobalErrorTracking() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    logError(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason || "Unhandled Promise Rejection");
  });
}

export function getStoredErrors() {
  try {
    const raw = localStorage.getItem(ERROR_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearStoredErrors() {
  try {
    localStorage.removeItem(ERROR_LOG_KEY);
  } catch {}
}
