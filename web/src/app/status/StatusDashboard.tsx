'use client';
import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {SUPPORT_EMAIL} from '@/lib/faq';
import s from './status.module.css';
export type HealthSnapshot = {status: string; checks: Record<string, string>} | null;
type State = 'up' | 'down' | 'unknown';
type Tab = 'status' | 'maintenance' | 'incidents';
const label = {up: 'Operational', down: 'Degraded', unknown: 'Unknown'};
function Mark({state, large = false}: {state: State; large?: boolean}) {
  return <span className={`${s.mark} ${s[state]} ${large ? s.large : ''}`} aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d={state === 'up' ? 'm5 10 3.2 3.2L15 6.5' : state === 'down' ? 'M10 5v6m0 3v.1' : 'M7 7a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3v.1'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
}
export function StatusDashboard({health, checkedAt}: {health: HealthSnapshot; checkedAt: string | null}) {
  const [tab, setTab] = useState<Tab>('status');
  const [expanded, setExpanded] = useState(true);
  const [offset, setOffset] = useState(0);
  const router = useRouter();
  const overall: State = !health ? 'unknown' : health.status === 'ok' && Object.values(health.checks).every(v => v === 'up') ? 'up' : 'down';
  const services: {name: string; state: State}[] = [
    {name: 'yizelearn Website', state: 'up'},
    {name: 'API', state: !health ? 'unknown' : health.status === 'ok' ? 'up' : 'down'},
    ...['db', 'disk', 'queue'].map(key => ({name: ({db: 'Database', disk: 'Storage', queue: 'Background jobs'} as Record<string, string>)[key], state: (!health || !health.checks[key] ? 'unknown' : health.checks[key] === 'up' ? 'up' : 'down') as State})),
  ];
  const timestamp = checkedAt ? new Intl.DateTimeFormat('en-US', {timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short'}).format(new Date(checkedAt)) : null;
  const today = checkedAt ? new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(checkedAt)) : '2026-11-18';
  const [year, month] = today.split('-').map(Number);
  const months = Array.from({length: 3}, (_, i) => new Date(Date.UTC(year, month - 1 + offset + (tab === 'maintenance' ? 2 : 0) - i, 1)));
  const monthLabel = (d: Date, short = false) => d.toLocaleDateString('en-US', {month: short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC'});
  return <div className={s.page}>
    <header className={s.header}>
      <Link href="/" className={s.logo} aria-label="yizelearn home">yize<span>learn</span><i /></Link>
      <nav aria-label="Status navigation">{([['status', 'Status'], ['maintenance', 'Maintenance'], ['incidents', 'Previous incidents']] as const).map(([key, title]) => <button key={key} aria-current={tab === key ? 'page' : undefined} onClick={() => {setTab(key); setOffset(0);}}>{title}</button>)}</nav>
      <a className={s.contact} href={`mailto:${SUPPORT_EMAIL}`}>Get in touch</a>
    </header>
    <main className={s.main}>
      {tab === 'status' ? <>
        <section className={s.hero} aria-live="polite"><Mark state={overall} large /><h1>{!checkedAt ? 'Checking services…' : overall === 'up' ? 'All services are online' : overall === 'down' ? 'Some services are degraded' : 'Service status is unavailable'}</h1><p>{timestamp ? `Last updated on ${timestamp}` : 'Retrieving the latest service status'}</p></section>
        <section className={s.card}>
          <button className={s.groupHead} aria-expanded={expanded} aria-controls="service-list" onClick={() => setExpanded(!expanded)}><span>yizelearn Main Services</span><span className={s.groupRight}><span className={s.pill}><Mark state={overall} />{label[overall]}</span><svg className={expanded ? s.chevronOpen : s.chevron} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg></span></button>
          {expanded && <div id="service-list" className={s.services}>{services.map(service => <article key={service.name} className={s.service}>
            <div className={s.serviceHead}><h2><Mark state={service.state} />{service.name}</h2><span className={`${s.current} ${s[service.state]}`}>{label[service.state]}</span></div>
            <div className={s.bars} role="img" aria-label={`${service.name}: previous 29 days unavailable. Current status: ${label[service.state]}.`}>{Array.from({length: 30}, (_, i) => <span key={i} className={i === 29 ? s[`bar_${service.state}`] : s.bar_unknown} title={i === 29 ? `Current check: ${label[service.state]}` : 'No historical data available'} />)}</div>
            <div className={s.axis}><span>30 days ago</span><span>Today</span></div>
          </article>)}</div>}
        </section>
        <div className={s.note}><p><span className={s.legendDot} />Historical uptime is not available yet. Colored bars show the current check.</p><button onClick={() => router.refresh()}>Refresh status ↻</button></div>
      </> : <>
        <section className={s.historyHero}><h1>{tab === 'maintenance' ? 'Maintenance' : 'Previous incidents'}</h1><div className={s.period}><button onClick={() => setOffset(offset - 3)} aria-label="Previous three months">‹</button><span>{monthLabel(months[2], true)} to {monthLabel(months[0], true)}</span><button onClick={() => setOffset(offset + 3)} aria-label="Next three months">›</button></div></section>
        <div className={s.months}>{months.map(d => <section className={s.month} key={d.toISOString()}><h2>{monthLabel(d)}</h2><div><span aria-hidden="true">{tab === 'maintenance' ? '◷' : 'ⓘ'}</span><p>{tab === 'maintenance' ? 'Maintenance schedule not published yet' : 'Incident history not published yet'}</p></div></section>)}</div>
      </>}
    </main>
    <footer className={s.footer}>Status by <Link href="/">yizelearn</Link></footer>
  </div>;
}
