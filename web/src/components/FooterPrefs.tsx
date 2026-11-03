'use client';

import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Cancel01Icon, Globe02Icon} from '@hugeicons/core-free-icons';
import {currencies, find, languages} from '@/lib/currency';
import {setPrefs, usePrefs} from '@/lib/prefs';
import s from './FooterPrefs.module.css';

/**
 * Footer row after Fiverr's: a language button and a currency button. Either opens one popup with Language and
 * Currency tabs, option cards, and Cancel / Save (Save wakes up once something changes). Choices are kept in this browser.
 */
export function FooterPrefs() {
  const prefs = usePrefs();
  const [open, setOpen] = useState<'language' | 'currency' | null>(null);
  const cur = find(prefs.currency);
  const lang = languages.find(l => l.code === prefs.language) ?? languages[0];
  return <div className={s.row}>
    <button className={s.pill} onClick={() => setOpen('language')}><HugeiconsIcon icon={Globe02Icon} size={16} strokeWidth={1.8} />{lang.name}</button>
    <button className={s.pill} onClick={() => setOpen('currency')}>{cur.symbol} {cur.code}</button>
    <button className={s.pill} onClick={() => window.dispatchEvent(new Event('yz-cookies-open'))}>Cookie settings</button>
    {open && <Popup start={open} onClose={() => setOpen(null)} />}
  </div>;
}

function Popup({start, onClose}: {start: 'language' | 'currency'; onClose: () => void}) {
  const prefs = usePrefs();
  const [tab, setTab] = useState(start);
  const [language, setLanguage] = useState(prefs.language);
  const [currency, setCurrency] = useState(prefs.currency);
  const box = useRef<HTMLDivElement>(null);
  const changed = language !== prefs.language || currency !== prefs.currency;

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
          <div className={s.grid2}>{languages.map(l => <button key={l.code} disabled={!l.ready} aria-pressed={language === l.code} className={`${s.opt} ${language === l.code ? s.optOn : ''}`} onClick={() => setLanguage(l.code)}>
            <b>{l.name}</b>{!l.ready && <i>Coming soon</i>}</button>)}</div>
          <p className={s.note}>The site is in English for now. More languages are on the way.</p>
        </> : <>
          <div className={s.grid2}>{currencies.map(c => <button key={c.code} aria-pressed={currency === c.code} className={`${s.opt} ${currency === c.code ? s.optOn : ''}`} onClick={() => setCurrency(c.code)}>
            <b>{c.name}</b><span>{c.code} - {c.symbol}</span></button>)}</div>
          <p className={s.note}>Pay or withdraw in the currency you choose. Prices shown here are converted, and the exact amount appears at checkout.</p>
        </>}
      </div>
      <div className={s.foot}><button className={s.cancel} onClick={onClose}>Cancel</button><button className={s.save} disabled={!changed} onClick={save}>Save</button></div>
    </div>
  </div>;
}
