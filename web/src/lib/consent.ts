// What the visitor agreed to, kept in this browser. "Essential" cookies are always on, so they are not stored here.
export type Consent = {analytics: boolean; preferences: boolean; marketing: boolean};
export const CONSENT_KEY = 'yz-cookies';

export function readConsent(): (Consent & {at: number}) | null {
  try { const raw = localStorage.getItem(CONSENT_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/** Saved language, currency and wishlist are written to this device only after the visitor accepted Preferences cookies. */
export const preferencesAllowed = () => readConsent()?.preferences === true;

export function saveConsent(c: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({...c, at: Date.now()}));
    if (!c.preferences) { localStorage.removeItem('yz-prefs'); localStorage.removeItem('yz-wish'); }
  } catch { /* storage blocked: the choice only lasts for this visit */ }
  window.dispatchEvent(new CustomEvent('yz-consent', {detail: c}));
}
