'use client';

import Link from 'next/link';
import {useCallback, useEffect, useRef, useState} from 'react';
import {readConsent, saveConsent, type Consent} from '@/lib/consent';
import {Man3D, type Ev} from './Man3D';
import s from './CookieConsent.module.css';

const OPTIONS: {key: keyof Consent; title: string; text: string}[] = [
  {key: 'analytics', title: 'Analytics', text: 'Helps us see what to improve.'},
  {key: 'preferences', title: 'Preferences', text: 'Remembers your currency, language and saved courses.'},
  {key: 'marketing', title: 'Marketing', text: 'Offers and reminders that fit you.'},
];
const SAYS = ['I am so hungry…', 'Mmm, thank you!', 'More cookies please!', 'I am stuffed!'];

/** The scene: a speech bubble over the 3D man. */
function Mascot({fed, events, chew, burp}: {fed: number; events: Ev[]; chew: boolean; burp: boolean}) {
  return <div className={s.scene}>
    <div className={s.bubble} key={`${fed}-${burp}`}>{burp ? 'Burp! Excuse me.' : SAYS[fed]}</div>
    <Man3D fed={fed} chew={chew} burp={burp} events={events} />
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
    if (!readConsent()) { later(() => setOpen(true), 350); import('three').catch(() => {}); } // start fetching the 3D library right away so the man is ready
    const reopen = () => { const r = readConsent(); if (r) setC({analytics: r.analytics, preferences: r.preferences, marketing: r.marketing}); setBusy(false); setClosing(false); setBurp(false); setOpen(true); };
    window.addEventListener('yz-cookies-open', reopen);
    const list = timers.current;
    return () => { window.removeEventListener('yz-cookies-open', reopen); list.forEach(clearTimeout); };
  }, []);

  const fed = Object.values(c).filter(Boolean).length;
  // The choice is saved the moment you click (it only goes to this browser, so there is nothing to wait for);
  // the short animation then plays out on its own before the popup slides away.
  const finish = (next: Consent, wait: number) => {
    setBusy(true);
    saveConsent(next);
    later(() => { setClosing(true); later(() => { setOpen(false); setClosing(false); setBusy(false); setEvents([]); }, 260); }, wait);
  };
  const toggle = (k: keyof Consent) => { if (busy) return; const on = !c[k]; setC({...c, [k]: on}); push(on ? 'eat' : 'drop'); };
  const acceptAll = () => { if (busy) return; setC({analytics: true, preferences: true, marketing: true}); [0, 1, 2].forEach(i => { if (!c[OPTIONS[i].key]) push('eat', i * 100); }); later(() => setBurp(true), 380); finish({analytics: true, preferences: true, marketing: true}, 650); };
  const rejectAll = () => { if (busy) return; setC({analytics: false, preferences: false, marketing: false}); [0, 1].forEach(i => push('drop', i * 100)); finish({analytics: false, preferences: false, marketing: false}, 500); };
  const save = () => { if (busy) return; finish(c, 0); };

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
