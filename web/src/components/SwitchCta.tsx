'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon} from '@hugeicons/core-free-icons';
import s from './SwitchCta.module.css';

type Side = 'learn' | 'teach';
const sides: Record<Side, {tab: string; title: string; text: string; cta: string; href: string; video: string}> = {
  learn: {tab: 'Learn', title: 'Learn the skills your next role needs', text: 'Short, practical courses from people who do the work. Pay once, keep access, and finish with a certificate you can show.', cta: 'Start learning', href: '/signup', video: '/video/learn.mp4'},
  teach: {tab: 'Teach', title: 'Teach what you know, to people who need it', text: 'Turn your experience into a course. We help with the outline, filming tips and getting your first learners.', cta: 'Become an instructor', href: '/signup?as=teach', video: '/video/teach.mp4'},
};

/**
 * Closing call to action after Upwork's hero: a rounded card whose background is a looping video,
 * with a Learn / Teach switch that swaps the copy, button and video (cross-faded). The brand gradient
 * shows while a video loads. Reduced motion: videos stay paused on their first frame.
 * Clips: Pexels (free to use), see public/video/CREDITS.md.
 */
export function SwitchCta() {
  const [side, setSide] = useState<Side>('learn');
  const [onScreen, setOnScreen] = useState(false);
  const card = useRef<HTMLElement>(null);
  const vids = useRef<Partial<Record<Side, HTMLVideoElement | null>>>({});

  // Only play while the card is on screen: saves battery and mobile data.
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {threshold: 0.2});
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    (Object.keys(sides) as Side[]).forEach(k => {
      const v = vids.current[k];
      if (!v) return;
      if (k === side && onScreen && !still) v.play().catch(() => undefined); else v.pause();
    });
  }, [side, onScreen]);

  const c = sides[side];
  return <section ref={card} className={s.card} aria-label="Get started">
    <div className={s.media} aria-hidden>
      {(Object.keys(sides) as Side[]).map(k => <video key={k} ref={el => { vids.current[k] = el; }} className={k === side ? s.videoOn : s.video}
        src={sides[k].video} muted loop playsInline preload="auto" />)}
    </div>
    <div className={s.shade} aria-hidden />
    <div className={s.content}>
      <div className={s.toggle} role="tablist" aria-label="I want to">
        <span className={s.thumb} data-side={side} aria-hidden />
        {(Object.keys(sides) as Side[]).map(k => <button key={k} role="tab" aria-selected={k === side} className={k === side ? s.tabOn : s.tab} onClick={() => setSide(k)}>{sides[k].tab}</button>)}
      </div>
      <div key={side} className={s.copy}>
        <h2>{c.title}</h2>
        <p>{c.text}</p>
        <Link href={c.href} className={s.cta}>{c.cta} <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.2} /></Link>
      </div>
    </div>
  </section>;
}
