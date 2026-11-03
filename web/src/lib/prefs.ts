'use client';

import {useSyncExternalStore} from 'react';
import {preferencesAllowed} from './consent';
import {DEFAULT_CURRENCY, format} from './currency';

// Language and currency are shared by every component through a tiny store. They are written to localStorage only after
// the visitor accepted Preferences cookies; until then they live in memory for this visit.
export type Prefs = {currency: string; language: string};
const KEY = 'yz-prefs';
const DEFAULT: Prefs = {currency: DEFAULT_CURRENCY, language: 'en'};
const listeners = new Set<() => void>();
let snapshot: Prefs = DEFAULT;
let lastRaw = '';

function read(): Prefs {
  let raw = '';
  try { raw = localStorage.getItem(KEY) ?? ''; } catch { /* storage blocked: keep what we have */ }
  if (raw && raw !== lastRaw) {
    lastRaw = raw;
    try { snapshot = {...DEFAULT, ...JSON.parse(raw)}; } catch { /* ignore bad data */ }
  }
  return snapshot;
}
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  window.addEventListener('storage', fn);
  window.addEventListener('yz-consent', persistIfAllowed);
  return () => { listeners.delete(fn); window.removeEventListener('storage', fn); window.removeEventListener('yz-consent', persistIfAllowed); };
};

function persistIfAllowed() {
  try {
    if (preferencesAllowed()) { const raw = JSON.stringify(snapshot); localStorage.setItem(KEY, raw); lastRaw = raw; }
  } catch { /* keep for this visit only */ }
}

export function setPrefs(next: Partial<Prefs>) {
  snapshot = {...read(), ...next};
  persistIfAllowed();
  listeners.forEach(fn => fn());
}

export const usePrefs = () => useSyncExternalStore(subscribe, read, () => DEFAULT);

/** Price formatter for the visitor's chosen currency. Prices are stored in naira and converted. */
export function useMoney() {
  const {currency} = usePrefs();
  return (naira: number) => format(naira, currency);
}
