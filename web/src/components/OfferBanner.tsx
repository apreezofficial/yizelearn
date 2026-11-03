'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Award01Icon, CheckmarkCircle02Icon, Copy01Icon, CreditCardIcon, Tick02Icon, Video01Icon, Discount01Icon, Ticket01Icon} from '@hugeicons/core-free-icons';
import s from './OfferBanner.module.css';

const CODE = 'WELCOME10';
const features = [
  {icon: CheckmarkCircle02Icon, text: 'Pay once, keep access', tone: 'sky'},
  {icon: Award01Icon, text: 'A certificate on every course', tone: 'gold'},
  {icon: Video01Icon, text: 'Live classes each week', tone: 'green'},
  {icon: CreditCardIcon, text: 'Pay by card or bank transfer', tone: 'blue'},
] as const;

/**
 * Special-offer banner after Udemy's: a dark rounded card with copy, a 2 x 2 feature list and a white button on the left,
 * and a collage of rounded panels on the right (brand art, a looping video with a floating "10% off" tile, and a marigold ticket).
 * The offer is the same WELCOME10 code the top bar and checkout use.
 */
export function OfferBanner() {
  const [copied, setCopied] = useState(false);
  const card = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Play the clip only while the banner is on screen.
  useEffect(() => {
    const el = card.current, v = video.current;
    if (!el || !v) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !still) v.play().catch(() => undefined); else v.pause(); }, {threshold: 0.25});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(CODE); } catch { /* the code stays visible either way */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return <section ref={card} className={s.card} aria-labelledby="offer-title">
    <div className={s.copy}>
      <h2 id="offer-title">Start strong with 10% off your first course</h2>
      <p>New to yizelearn? Take the welcome offer on any course. Learn in minutes a day from people who do the work, and finish with a certificate you can show.</p>
      <ul className={s.features}>
        {features.map(f => <li key={f.text}><span className={s.dot} data-tone={f.tone}><HugeiconsIcon icon={f.icon} size={16} strokeWidth={2} /></span>{f.text}</li>)}
      </ul>
      <Link href="/signup" className={s.cta}>Claim the offer</Link>
      <p className={s.code}>Use code <button onClick={copy} aria-label={`Copy code ${CODE}`}><b>{CODE}</b><HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} strokeWidth={2.2} />{copied ? 'Copied' : 'Copy'}</button> at checkout</p>
    </div>

    <div className={s.collage} aria-hidden>
      <div className={s.art}><span className={s.blobA} /><span className={s.blobB} /><span className={s.blobC} /></div>
      <div className={s.clip}>
        <video ref={video} src="/video/teach.mp4" muted loop playsInline preload="metadata" />
        <div className={s.tile}><HugeiconsIcon icon={Discount01Icon} size={34} strokeWidth={1.6} /><b>10%</b><i>OFF</i></div>
      </div>
      <div className={s.ticket}><HugeiconsIcon icon={Ticket01Icon} size={64} strokeWidth={1.2} /><span>Welcome<br />offer</span></div>
    </div>
  </section>;
}
