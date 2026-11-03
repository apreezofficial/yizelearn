'use client';

import {useSyncExternalStore} from 'react';
import {preferencesAllowed} from './consent';
import {DEFAULT_CURRENCY, format} from './currency';

// Language and currency live in this browser (localStorage) and are shared by every component through a tiny store.
export type Prefs = {currency: string; language: string};
const KEY = 'yz-prefs';
const DEFAULT: Prefs = {currency: DEFAULT_CURRENCY, language: 'en'};
const listeners = new Set<() => void>();
let cache: {raw: string; value: Prefs} = {raw: '', value: DEFAULT};

function read(): Prefs {
  let raw = '';
  try { raw = localStorage.getItem(KEY) ?? ''; } catch { /* storage blocked: defaults */ }
  if (raw === cache.raw) return cache.value;
  let value = DEFAULT;
  try { if (raw) value = {...DEFAULT, ...JSON.parse(raw)}; } catch { /* ignore bad data */ }
  cache = {raw, value};
  return value;
}
const subscribe = (fn: () => void) => { listeners.add(fn); window.addEventListener('storage', fn); return () => { listeners.delete(fn); window.removeEventListener('storage', fn); }; };

export function setPrefs(next: Partial<Prefs>) {
  const value = {...read(), ...next};
  try { if (preferencesAllowed()) localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* keep for this visit only */ }
  cache = {raw: JSON.stringify(value), value};
  listeners.forEach(fn => fn());
}

export const usePrefs = () => useSyncExternalStore(subscribe, read, () => DEFAULT);

/** Price formatter for the visitor's chosen currency. Prices are stored in naira and converted. */
export function useMoney() {
  const {currency} = usePrefs();
  return (naira: number) => format(naira, currency);
}
