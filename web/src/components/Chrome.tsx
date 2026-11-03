'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, Cancel01Icon} from '@hugeicons/core-free-icons';
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
    <Link href="#" className={s.offerCta}>Get the offer</Link>
    <button className={s.close} onClick={close} aria-label="Close offer"><HugeiconsIcon icon={Cancel01Icon} size={18} /></button>
  </div>;
}

const nav = ['Courses', 'Live classes', 'Certificates', 'For teams', 'Teach'];

/** Sticky nav: clear over the hero ribbon, then a white blurred bar with a hairline once the page scrolls. */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const arrow = <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.4} className={s.arrow} />;
  return <header className={`${s.bar} ${scrolled ? s.scrolled : ''}`}>
    <div className={s.inner}>
      <Link href="/" className={s.brand}><Image src="/logo.png" alt="yizelearn" width={104} height={40} priority /></Link>
      <nav className={s.links} aria-label="Main">{nav.map(n => <Link key={n} href="#">{n}</Link>)}</nav>
      <div className={s.right}>
        <Link href="#" className={s.signIn}>Sign in {arrow}</Link>
        <Link href="#" className={s.cta}>Get started {arrow}</Link>
      </div>
    </div>
  </header>;
}
