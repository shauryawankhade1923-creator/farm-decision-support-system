// Production Client Analytics & Telemetry Service
// Privacy-respecting, lightweight event tracking with local storage stream and optional server dispatch

const ANALYTICS_STORAGE_KEY = "fdss_analytics_events";
const OPT_OUT_KEY = "fdss_analytics_opt_out";

export function isAnalyticsOptedOut() {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAnalyticsOptOut(optOut) {
  try {
    localStorage.setItem(OPT_OUT_KEY, optOut ? "true" : "false");
  } catch (e) {
    console.error(e);
  }
}

export function trackEvent(eventName, properties = {}) {
  if (isAnalyticsOptedOut()) return;

  const eventPayload = {
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    screen: properties.screen || "unknown",
    sessionId: getSessionId()
  };

  // Console telemetry in dev
  if (import.meta.env.DEV) {
    console.debug(`[Analytics] ${eventName}`, properties);
  }

  // Persist locally for audit / offline review
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(eventPayload);
    // Keep last 100 events to prevent quota bloat
    if (events.length > 100) events.shift();
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // Ignore storage issues
  }
}

export function trackPageView(screenName) {
  trackEvent("page_view", { screen: screenName });
}

export function trackDecisionAssessment(crop, location, verdict, score) {
  trackEvent("decision_evaluated", {
    crop,
    location,
    verdict,
    score
  });
}

function getSessionId() {
  let sId = sessionStorage.getItem("fdss_analytics_session");
  if (!sId) {
    sId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("fdss_analytics_session", sId);
  }
  return sId;
}

export function getStoredAnalyticsSummary() {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    return {
      totalEvents: events.length,
      recentEvents: events.slice(-10).reverse()
    };
  } catch {
    return { totalEvents: 0, recentEvents: [] };
  }
}
