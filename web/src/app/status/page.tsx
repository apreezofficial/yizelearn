import {pageMetadata} from '@/lib/metadata';
import {Suspense} from 'react';
import {StatusDashboard, type HealthSnapshot} from './StatusDashboard';
export const metadata = pageMetadata("/status");
const BASE = process.env.API_URL ?? 'https://16-170-53-222.sslip.io';
async function LiveStatus() {
  let health: HealthSnapshot = null;
  try {
    const res = await fetch(`${BASE}/v1/health/ready`, {cache: 'no-store', signal: AbortSignal.timeout(6000)});
    const data = await res.json();
    if (typeof data.status === 'string' && data.checks && typeof data.checks === 'object' && !Array.isArray(data.checks)) health = {status: res.ok ? data.status : 'down', checks: Object.fromEntries(Object.entries(data.checks).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))};
  } catch { /* Failed checks must never appear operational. */ }
  return <StatusDashboard health={health} checkedAt={new Date().toISOString()} />;
}
export default function StatusPage() {return <Suspense fallback={<StatusDashboard health={null} checkedAt={null} />}><LiveStatus /></Suspense>;}
