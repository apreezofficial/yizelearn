'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, Cancel01Icon, CheckmarkCircle02Icon} from '@hugeicons/core-free-icons';
import {categories} from '@/lib/courses';
import s from './Teach.module.css';

/** Plays a muted background video only while it is on screen, and not at all with reduced motion. */
function useVisiblePlay(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, [ref]);
}

/** One background video per panel, so it restarts when the panel changes. */
function Bg({src, className}: {src: string; className?: string}) {
  const ref = useRef<HTMLVideoElement>(null);
  useVisiblePlay(ref);
  return <video ref={ref} className={className} src={src} muted loop playsInline preload="auto" aria-hidden />;
}

const arrow = <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.2} />;

/** Full-bleed video hero after Lifted's: text on the left over the footage, white UI cards floating on the right. */
export function TeachHero() {
  return <section className={s.hero}>
    <Bg className={s.bg} src="/video/teach.mp4" />
    <div className={s.scrim} />
    <div className={s.heroInner}>
      <div className={s.heroText}>
        <h1>Teach what you know and get paid for it</h1>
        <p>Turn your skill into a short course. Record lessons on your phone, add quizzes, and reach learners who want practical skills.</p>
        <div className={s.btns}>
          <Link href="/signup?as=teach" className={s.primary}>Start teaching {arrow}</Link>
          <a href="#ways" className={s.ghost}>See how it works</a>
        </div>
      </div>
      <div className={s.floats} aria-hidden>
        <div className={`${s.card} ${s.cardA}`}>
          <b>Your course</b>
          {['Welcome', 'The basics', 'First project'].map((t, i) => <div key={t} className={s.cRow} style={{['--i' as string]: i}}><span>{t}</span><em>{i < 2 ? 'Published' : 'Draft'}</em></div>)}
        </div>
        <div className={`${s.card} ${s.cardB}`}>
          <div className={s.who}><i>A</i><span><b>Adaeze O.</b>Instructor</span></div>
          <div className={s.kv}><span>Category</span><b>Database</b></div>
          <div className={s.kv}><span>Status</span><b className={s.ok}>Approved</b></div>
        </div>
      </div>
    </div>
  </section>;
}

/** Dark band under the hero: small caption, scrolling stat cards, then a row of topic wordmarks. */
export function TeachBand() {
  const cards = categories.map(c => ({n: String(c.topics.length), l: 'topics', name: c.name, d: `${c.name}: ${c.topics.slice(0, 3).join(', ')} and more`}));
  const topics = ['Python', 'React', 'SQL', 'AI agents', 'SEO', 'TikTok', 'PostgreSQL', 'TypeScript'];
  return <section className={s.band} aria-label="What you can teach">
    <p className={s.cap}>Categories you can teach in</p>
    <div className={s.cards}><div className={s.cardsTrack}>{[...cards, ...cards].map((c, i) => <Link key={i} href="/signup?as=teach" className={s.stat} aria-hidden={i >= cards.length} tabIndex={i >= cards.length ? -1 : 0}>
      <span className={s.statNum}><b>{c.n}</b><i>{c.l}</i></span>
      <span className={s.statText}>{c.d}</span>
      <span className={s.statGo}>{arrow}</span>
    </Link>)}</div></div>
    <div className={s.words}>{topics.map((t, i) => <span key={t} data-w={i % 3}>{t}</span>)}</div>
  </section>;
}

const ways = [
  {tab: 'Teach short courses', title: 'Teach short courses', video: '/video/teach.mp4', text: 'Break what you know into short lessons. Record on your phone, add a quiz after each lesson and publish when you are ready.', cta: 'Start a course', note: ['Short lessons', 'Learners can finish one in a few minutes.']},
  {tab: 'Reach learners', title: 'Reach learners', video: '/video/learn.mp4', text: 'Learners take your course in the yizelearn app on iPhone and Android, follow their progress and earn a certificate when they finish.', cta: 'Become an instructor', note: ['iPhone and Android', 'Learners follow your course in the app.']},
  {tab: 'Get paid in naira', title: 'Get paid in naira', video: '', text: 'Learners pay once in naira, by card or bank transfer. You choose the price of your course.', cta: 'Set up your account', note: ['Priced in naira', 'Card or bank transfer at checkout.']},
];

/** Sticky option list on the left and a big photo card on the right, like Lifted's "One supplier, every model". */
export function TeachWays() {
  const [on, setOn] = useState(0);
  const w = ways[on];
  return <div className={s.ways} id="ways">
    <div className={s.opts} role="tablist" aria-label="Ways to teach">
      {ways.map((x, i) => <button key={x.tab} role="tab" aria-selected={i === on} className={i === on ? s.optOn : s.opt} onClick={() => setOn(i)}>{x.tab}</button>)}
    </div>
    <div className={s.stage} key={on} role="tabpanel">
      <div className={`${s.media} ${w.video ? '' : s.mediaDark}`}>
        {w.video && <Bg src={w.video} />}
        {on === 0 && <div className={`${s.card} ${s.mA}`} aria-hidden><b>Lesson 3 · First project</b><div className={s.cRow}><span>Quiz added</span><em>5 questions</em></div></div>}
        {on === 1 && <><div className={`${s.card} ${s.mA}`} aria-hidden><b>Progress</b><div className={s.bar}><i /></div><div className={s.cRow}><span>Intro to databases</span><em>72%</em></div></div>
          <div className={`${s.card} ${s.mB}`} aria-hidden><div className={s.cert}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />Certificate earned</div></div></>}
        {on === 2 && <><div className={`${s.card} ${s.mC}`} aria-hidden><b>Checkout</b><div className={s.kv}><span>Course</span><b>₦15,000</b></div><div className={s.kv}><span>Pay with</span><b>Card or transfer</b></div><div className={s.payBtn}>Pay ₦15,000</div></div></>}
      </div>
      <div className={s.under}>
        <div><p>{w.text}</p><Link href="/signup?as=teach" className={s.black}>{w.cta} {arrow}</Link></div>
        <div className={s.note}><b>{w.note[0]}</b><span>{w.note[1]}</span></div>
      </div>
    </div>
  </div>;
}

/** Bottom announcement bar after Lifted's: black badge, one line, arrow, and a close button. */
export function TeachBar() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    document.documentElement.style.setProperty('--teach-bar', open ? '56px' : '0px');
    return () => { document.documentElement.style.removeProperty('--teach-bar'); };
  }, [open]);
  if (!open) return null;
  return <div className={s.announce} role="region" aria-label="Announcement">
    <Link href="/signup?as=teach"><span className={s.badge}>For instructors</span><span className={s.annText}>Apply to teach on yizelearn</span>{arrow}</Link>
    <button aria-label="Close announcement" onClick={() => setOpen(false)}><HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} /></button>
  </div>;
}
