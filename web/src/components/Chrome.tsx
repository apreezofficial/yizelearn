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

const nav: {label: string; href: string}[] = [{label: 'Courses', href: '/#courses'}, {label: 'Live classes', href: '#'}, {label: 'Teach', href: '#'}, {label: 'About', href: '/about'}];

/** Floating pill nav after Aceternity's: logo, dot-separated links, a blue button. Sticks just below the top and firms up once scrolled. */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <header className={`${s.bar} ${scrolled ? s.scrolled : ''}`}>
    <div className={s.pill}>
      <Link href="/" className={s.brand}><Image src="/logo.png" alt="yizelearn home" width={96} height={37} priority /></Link>
      <nav className={s.links} aria-label="Main">{nav.map(n => <Link key={n.label} href={n.href}>{n.label}</Link>)}</nav>
      <div className={s.right}>
        <Link href="#" className={s.signIn}>Sign in</Link>
        <Link href="#" className={s.cta}>Get started <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.4} className={s.arrow} /></Link>
      </div>
    </div>
  </header>;
}
