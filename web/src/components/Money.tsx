'use client';

import {useMoney} from '@/lib/prefs';

/** A price in the visitor's chosen currency, for server components. `n` is in naira. */
export function Money({n, minus}: {n: number; minus?: boolean}) {
  const money = useMoney();
  return <>{minus ? '−' : ''}{money(n)}</>;
}
