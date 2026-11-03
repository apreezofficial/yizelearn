'use client';

import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Cancel01Icon, CookieIcon, Globe02Icon} from '@hugeicons/core-free-icons';
import {currencies, find} from '@/lib/currency';
import {findLang, more, popular} from '@/lib/languages';
import {setPrefs, usePrefs} from '@/lib/prefs';
import s from './FooterPrefs.module.css';

type Tab = 'language' | 'currency';
/** Opens the language and currency popup from anywhere (the navbar, the menu, the footer). */
export const openPrefs = (tab: Tab = 'language') => window.dispatchEvent(new CustomEvent('yz-prefs-open', {detail: tab}));

/**
 * Footer row after Fiverr's: a language button, a currency button and a round cookie button.
 * Language and currency share one popup (see PrefsHost).
 */
export function FooterPrefs() {
  const prefs = usePrefs();
  const cur = find(prefs.currency);
  const lang = findLang(prefs.language);
  return <div className={s.row}>
    <button className={s.pill} onClick={() => openPrefs('language')}><HugeiconsIcon icon={Globe02Icon} size={16} strokeWidth={1.8} /><span translate="no">{lang.name}</span></button>
    <button className={s.pill} onClick={() => openPrefs('currency')}><span translate="no">{cur.symbol} {cur.code}</span></button>
    <button className={s.cookieBtn} aria-label="Cookie settings" title="Cookie settings" onClick={() => window.dispatchEvent(new Event('yz-cookies-open'))}><HugeiconsIcon icon={CookieIcon} size={18} strokeWidth={1.8} /></button>
  </div>;
}

/** Lives once in the layout and shows the popup whenever something asks for it. */
export function PrefsHost() {
  const [open, setOpen] = useState<Tab | null>(null);
  useEffect(() => {
    const on = (e: Event) => setOpen((e as CustomEvent<Tab>).detail ?? 'language');
    window.addEventListener('yz-prefs-open', on);
    return () => window.removeEventListener('yz-prefs-open', on);
  }, []);
  return open ? <Popup start={open} onClose={() => setOpen(null)} /> : null;
}

function Popup({start, onClose}: {start: Tab; onClose: () => void}) {
  const prefs = usePrefs();
  const [tab, setTab] = useState<Tab>(start);
  const [language, setLanguage] = useState(prefs.language);
  const [currency, setCurrency] = useState(prefs.currency);
  const box = useRef<HTMLDivElement>(null);
  const changed = language !== prefs.language || currency !== prefs.currency;
  const inMore = more.some(l => l.code === language);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    box.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', key); };
  }, [onClose]);

  const save = () => { setPrefs({language, currency}); onClose(); };

  return <div className={s.scrim} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={s.box} role="dialog" aria-modal="true" aria-labelledby="prefs-title" tabIndex={-1} ref={box}>
      <div className={s.head}><h2 id="prefs-title">Choose language and currency</h2><button aria-label="Close" onClick={onClose}><HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} /></button></div>
      <div className={s.tabs} role="tablist">
        {(['language', 'currency'] as const).map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? s.tabOn : s.tab} onClick={() => setTab(t)}>{t === 'language' ? 'Language' : 'Currency'}</button>)}
      </div>
      <div className={s.body}>
        {tab === 'language' ? <>
          <div className={s.grid2}>{popular.map(l => <button key={l.code} translate="no" disabled={l.ready === false} aria-pressed={language === l.code} className={`${s.opt} ${language === l.code ? s.optOn : ''}`} onClick={() => setLanguage(l.code)}>
            <b>{l.name}</b>{l.ready === false && <i translate="yes">Coming soon</i>}</button>)}</div>
          <label className={s.more}><span>More languages</span>
            <select translate="no" value={inMore ? language : ''} onChange={e => { if (e.target.value) setLanguage(e.target.value); }}>
              <option value="">Choose another language…</option>
              {more.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </label>
          <p className={s.note}>Pages are translated automatically with Google Translate, so some wording may be rough. Edo is not available from Google yet. Your choice is remembered on this device only if you accept Preferences cookies.</p>
        </> : <>
          <div className={s.grid2}>{currencies.map(c => <button key={c.code} aria-pressed={currency === c.code} className={`${s.opt} ${currency === c.code ? s.optOn : ''}`} onClick={() => setCurrency(c.code)}>
            <b>{c.name}</b><span translate="no">{c.code} - {c.symbol}</span></button>)}</div>
          <p className={s.note}>Pay or withdraw in the currency you choose. Prices shown here are converted, and the exact amount appears at checkout.</p>
        </>}
      </div>
      <div className={s.foot}><button className={s.cancel} onClick={onClose}>Cancel</button><button className={s.save} disabled={!changed} onClick={save}>Save</button></div>
    </div>
  </div>;
}
