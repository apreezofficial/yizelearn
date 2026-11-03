'use client';

import Link from 'next/link';
import {useCallback, useEffect, useRef, useState} from 'react';
import {readConsent, saveConsent, type Consent} from '@/lib/consent';
import s from './CookieConsent.module.css';

type Ev = {id: number; kind: 'eat' | 'drop'};
const OPTIONS: {key: keyof Consent; title: string; text: string}[] = [
  {key: 'analytics', title: 'Analytics', text: 'Helps us see what to improve.'},
  {key: 'preferences', title: 'Preferences', text: 'Remembers your currency, language and saved courses.'},
  {key: 'marketing', title: 'Marketing', text: 'Offers and reminders that fit you.'},
];
const SAYS = ['I am so hungry…', 'Mmm, thank you!', 'More cookies please!', 'I am stuffed!'];

/** A small 3D-style man. His belly grows with every cookie you accept and he goes hungry and sad when you reject them. */
function Mascot({fed, events, chew, burp}: {fed: number; events: Ev[]; chew: boolean; burp: boolean}) {
  const belly = [[0.74, 0.86], [1, 1], [1.2, 1.08], [1.42, 1.15]][fed];
  const arms = [[10, -10], [0, -8], [-24, 24], [-40, 40]][fed];
  const mood = fed === 0 ? 'sad' : fed === 1 ? 'ok' : 'happy';
  return <div className={s.scene}>
    <div className={s.bubble} key={`${fed}-${burp}`}>{burp ? 'Burp! Excuse me.' : SAYS[fed]}</div>
    <div className={s.tilt}>
      <svg viewBox="0 0 260 220" className={s.man} data-mood={mood} role="img" aria-label={`Cookie mascot with ${fed} of 3 cookies eaten`}>
        <defs>
          <radialGradient id="ck-skin" cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#F8D3AE" /><stop offset="0.6" stopColor="#E0A672" /><stop offset="1" stopColor="#B87A47" /></radialGradient>
          <radialGradient id="ck-shirt" cx="35%" cy="28%" r="80%"><stop offset="0" stopColor="#7DB1EE" /><stop offset="0.55" stopColor="#2F6DB5" /><stop offset="1" stopColor="#173F77" /></radialGradient>
          <linearGradient id="ck-pants" x1="0" x2="1"><stop offset="0" stopColor="#24508F" /><stop offset="1" stopColor="#0F2748" /></linearGradient>
          <radialGradient id="ck-cookie" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F3C98B" /><stop offset="1" stopColor="#C98A3E" /></radialGradient>
          <filter id="ck-blur"><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        <ellipse cx="130" cy="208" rx={72 + fed * 6} ry="9" fill="#0B1A2E" opacity="0.28" filter="url(#ck-blur)" />
        <g>
          <rect x="102" y="162" width="22" height="40" rx="10" fill="url(#ck-pants)" />
          <rect x="136" y="162" width="22" height="40" rx="10" fill="url(#ck-pants)" />
          <ellipse cx="110" cy="203" rx="15" ry="7" fill="#1C1F33" /><ellipse cx="150" cy="203" rx="15" ry="7" fill="#1C1F33" />
        </g>
        <g className={s.belly} style={{transform: `scale(${belly[0]}, ${belly[1]})`}}>
          <g className={s.gulp} key={events.length}>
            <ellipse cx="130" cy="138" rx="46" ry="44" fill="url(#ck-shirt)" />
            <ellipse cx="116" cy="118" rx="18" ry="12" fill="#fff" opacity="0.2" />
            <path d="M130 146 q3 3 0 6" stroke="#173F77" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            {fed >= 3 && <><circle cx="130" cy="124" r="3" fill="#F5EFA8" /><circle cx="130" cy="164" r="3" fill="#F5EFA8" /></>}
          </g>
        </g>
        <g className={s.arm} style={{transform: `rotate(${arms[0]}deg)`, transformOrigin: '88px 112px'}}><line x1="88" y1="112" x2="76" y2="154" stroke="url(#ck-shirt)" strokeWidth="14" strokeLinecap="round" /><circle cx="76" cy="157" r="8" fill="url(#ck-skin)" /></g>
        <g className={s.arm} style={{transform: `rotate(${arms[1]}deg)`, transformOrigin: '172px 112px'}}><line x1="172" y1="112" x2="184" y2="154" stroke="url(#ck-shirt)" strokeWidth="14" strokeLinecap="round" /><circle cx="184" cy="157" r="8" fill="url(#ck-skin)" /></g>
        <rect x="120" y="92" width="20" height="18" rx="7" fill="#C98F5B" />
        <g className={`${s.head} ${events.length && events[events.length - 1].kind === 'drop' ? s.nope : ''}`} key={events.length ? events[events.length - 1].id : 0}>
          <circle cx="97" cy="72" r="7" fill="url(#ck-skin)" /><circle cx="163" cy="72" r="7" fill="url(#ck-skin)" />
          <circle cx="130" cy="68" r="35" fill="url(#ck-skin)" />
          <path d="M94 66 Q92 32 130 30 Q168 32 166 66 Q154 48 130 48 Q106 48 94 66Z" fill="#2B1D14" />
          <ellipse cx="108" cy="80" rx="6" ry="4" fill="#E26D6D" opacity="0.35" /><ellipse cx="152" cy="80" rx="6" ry="4" fill="#E26D6D" opacity="0.35" />
          <g className={s.eyes}><ellipse cx="117" cy="68" rx="6.5" ry="7.5" fill="#fff" /><ellipse cx="143" cy="68" rx="6.5" ry="7.5" fill="#fff" /><circle cx="118" cy="69" r="3.6" fill="#2B1D14" /><circle cx="144" cy="69" r="3.6" fill="#2B1D14" /><circle cx="119.4" cy="67.4" r="1.2" fill="#fff" /><circle cx="145.4" cy="67.4" r="1.2" fill="#fff" /></g>
          <line className={s.browL} x1="108" y1="56" x2="126" y2="56" stroke="#2B1D14" strokeWidth="3.2" strokeLinecap="round" />
          <line className={s.browR} x1="134" y1="56" x2="152" y2="56" stroke="#2B1D14" strokeWidth="3.2" strokeLinecap="round" />
          <ellipse className={s.tear} cx="108" cy="80" rx="2.6" ry="4" fill="#7DB1EE" />
          <path className={s.mSad} d="M116 94 Q130 83 144 94" stroke="#7A3B2E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path className={s.mOk} d="M118 86 Q130 96 142 86" stroke="#7A3B2E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <g className={chew ? s.mChew : s.mHappy}><path d="M113 84 Q130 108 147 84 Z" fill="#8A2F2F" /><path d="M122 97 Q130 91 138 97 Q130 104 122 97Z" fill="#E8697D" /></g>
        </g>
        {events.slice(-6).map(e => <g key={e.id} className={e.kind === 'eat' ? s.eat : s.drop}>
          <circle cx="130" cy="88" r="12" fill="url(#ck-cookie)" /><circle cx="125" cy="84" r="2" fill="#5B3A1E" /><circle cx="134" cy="91" r="2" fill="#5B3A1E" /><circle cx="131" cy="83" r="1.6" fill="#5B3A1E" /><circle cx="126" cy="92" r="1.6" fill="#5B3A1E" />
        </g>)}
      </svg>
    </div>
  </div>;
}

/**
 * Cookie popup. Each optional kind of cookie you accept is a cookie the man eats, so his belly grows; reject them and he
 * gets thin and sad. Choices are saved in this browser, and "Cookie settings" in the footer opens it again.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [c, setC] = useState<Consent>({analytics: false, preferences: false, marketing: false});
  const [events, setEvents] = useState<Ev[]>([]);
  const [chew, setChew] = useState(false);
  const [burp, setBurp] = useState(false);
  const [busy, setBusy] = useState(false);
  const id = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const push = useCallback((kind: Ev['kind'], delay = 0) => {
    later(() => {
      setEvents(e => [...e, {id: ++id.current, kind}]);
      if (kind === 'eat') { setChew(true); later(() => setChew(false), 700); }
    }, delay);
  }, []);

  useEffect(() => {
    // First visit: pop up after a moment. Returning visitors only see it again through "Cookie settings".
    if (!readConsent()) later(() => setOpen(true), 900);
    const reopen = () => { const r = readConsent(); if (r) setC({analytics: r.analytics, preferences: r.preferences, marketing: r.marketing}); setBusy(false); setClosing(false); setBurp(false); setOpen(true); };
    window.addEventListener('yz-cookies-open', reopen);
    const list = timers.current;
    return () => { window.removeEventListener('yz-cookies-open', reopen); list.forEach(clearTimeout); };
  }, []);

  const fed = Object.values(c).filter(Boolean).length;
  const finish = (next: Consent, wait: number) => {
    setBusy(true);
    later(() => { saveConsent(next); setClosing(true); later(() => { setOpen(false); setClosing(false); setBusy(false); setEvents([]); }, 380); }, wait);
  };
  const toggle = (k: keyof Consent) => { if (busy) return; const on = !c[k]; setC({...c, [k]: on}); push(on ? 'eat' : 'drop'); };
  const acceptAll = () => { if (busy) return; setC({analytics: true, preferences: true, marketing: true}); [0, 1, 2].forEach(i => { if (!c[OPTIONS[i].key]) push('eat', i * 420); }); later(() => setBurp(true), 1500); finish({analytics: true, preferences: true, marketing: true}, 2500); };
  const rejectAll = () => { if (busy) return; setC({analytics: false, preferences: false, marketing: false}); [0, 1].forEach(i => push('drop', i * 300)); finish({analytics: false, preferences: false, marketing: false}, 1500); };
  const save = () => { if (busy) return; finish(c, 250); };

  if (!open) return null;
  return <section className={`${s.card} ${closing ? s.out : ''}`} role="dialog" aria-labelledby="ck-title" aria-describedby="ck-text">
    <Mascot fed={fed} events={events} chew={chew} burp={burp} />
    <div className={s.panel}>
      <h2 id="ck-title">Cookie time?</h2>
      <p id="ck-text">We use cookies to keep the site working and to make it better. Feed him the ones you are happy with, or keep him hungry. Your call.</p>
      <ul className={s.list}>
        <li><span><b>Essential</b><i>Sign-in and security. Always on.</i></span><button className={`${s.sw} ${s.on}`} role="switch" aria-checked="true" aria-label="Essential cookies, always on" disabled><span /></button></li>
        {OPTIONS.map(o => <li key={o.key}><span><b>{o.title}</b><i>{o.text}</i></span>
          <button className={`${s.sw} ${c[o.key] ? s.on : ''}`} role="switch" aria-checked={c[o.key]} aria-label={`${o.title} cookies`} onClick={() => toggle(o.key)}><span /></button></li>)}
      </ul>
      <div className={s.btns}>
        <button className={s.reject} onClick={rejectAll} disabled={busy}>Reject all</button>
        <button className={s.saveBtn} onClick={save} disabled={busy}>Save choices</button>
        <button className={s.accept} onClick={acceptAll} disabled={busy}>Accept all</button>
      </div>
      <p className={s.more}><Link href="/privacy">How we use cookies</Link><span aria-live="polite" className={s.srOnly}>{fed} of 3 optional cookie types accepted</span></p>
    </div>
  </section>;
}
