// Production Rate Limiting Utility
// Prevents rapid repetitive submissions, double clicks, and API abuse

const ACTION_COOLDOWNS = new Map();

/**
 * Checks whether an action is allowed based on a cooldown window
 * @param {string} actionKey - unique identifier (e.g. 'decision_submit', 'feedback_submit')
 * @param {number} cooldownMs - cooldown duration in milliseconds
 * @returns {{ allowed: boolean, remainingMs: number }}
 */
export function checkActionRateLimit(actionKey, cooldownMs = 1500) {
  const now = Date.now();
  const lastTime = ACTION_COOLDOWNS.get(actionKey) || 0;
  const elapsed = now - lastTime;

  if (elapsed < cooldownMs) {
    return {
      allowed: false,
      remainingMs: cooldownMs - elapsed
    };
  }

  ACTION_COOLDOWNS.set(actionKey, now);
  return { allowed: true, remainingMs: 0 };
}

/**
 * Debounce helper for search inputs
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
