import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';

export const metadata: Metadata = {title: 'System status', description: 'Live status of the yizelearn website and API.'};

type Health = {status: string; version: string; checks: Record<string, string>};

const BASE = process.env.API_URL ?? 'https://16-170-53-222.sslip.io';

async function readHealth(): Promise<{ok: true; data: Health} | {ok: false}> {
  try {
    const res = await fetch(`${BASE}/v1/health/ready`, {cache: 'no-store', signal: AbortSignal.timeout(6000)});
    const data = (await res.json()) as Health;
    return {ok: true, data: {...data, status: res.ok ? data.status : 'down'}};
  } catch {
    return {ok: false};
  }
}

const LABEL: Record<string, string> = {db: 'Database', disk: 'Storage', queue: 'Background jobs'};

export default async function StatusPage() {
  const health = await readHealth();
  const checkedAt = new Date().toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'});
  const apiUp = health.ok && health.data.status === 'ok';
  const headline = !health.ok ? 'We cannot reach the status service' : apiUp ? 'All systems operational' : 'Some systems are degraded';

  return <>
    <OfferBar />
    <SiteNav />
    <main className="status">
      <h1>System status</h1>
      <section className={`banner ${!health.ok ? 'unknown' : apiUp ? 'ok' : 'bad'}`} aria-live="polite">
        <strong>{headline}</strong>
        <span>Checked {checkedAt}</span>
      </section>

      <h2>Components</h2>
      <ul className="components">
        <li><span>Website</span><span className="pill ok">Operational</span></li>
        <li><span>API</span><span className={`pill ${health.ok ? 'ok' : 'unknown'}`}>{health.ok ? 'Reachable' : 'Unknown'}</span></li>
        {health.ok && Object.entries(health.data.checks).map(([key, value]) => (
          <li key={key}>
            <span>{LABEL[key] ?? key}</span>
            <span className={`pill ${value === 'up' ? 'ok' : 'bad'}`}>{value === 'up' ? 'Operational' : 'Down'}</span>
          </li>
        ))}
      </ul>
      {health.ok && <p className="meta">API version {health.data.version}</p>}
      <p className="meta">This page reads the live readiness check on every visit. Incident history is not published yet.</p>
    </main>
    <Footer />
  </>;
}
