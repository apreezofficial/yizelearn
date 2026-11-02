'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Cancel01Icon} from '@hugeicons/core-free-icons';
import s from './Chrome.module.css';

const DISMISS_KEY = 'yz-offer-dismissed';

/** Offer strip above the nav, like Udemy's. Closing it is remembered on this browser. WELCOME10 is the same code the app's checkout accepts. */
export function OfferBar() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1'; } catch {}
    if (dismissed) { const t = setTimeout(() => setOpen(false), 0); return () => clearTimeout(t); }
  }, []);
  const close = () => { setOpen(false); try { localStorage.setItem(DISMISS_KEY, '1'); } catch {} };
  if (!open) return null;
  return <div className={s.offer} role="region" aria-label="Offer">
    <p><b>New to yizelearn?</b><span className={s.sep}>|</span>Use code <span className={s.code}>WELCOME10</span> for 10% off your first course.</p>
    <Link href="/signup" className={s.offerCta}>Get the offer</Link>
    <button className={s.close} onClick={close} aria-label="Close offer"><HugeiconsIcon icon={Cancel01Icon} size={18} /></button>
  </div>;
}

// The top bar lives in Nav.tsx; re-exported so pages keep importing both from here.
export {SiteNav} from './Nav';
