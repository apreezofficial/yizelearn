'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, CheckmarkCircle02Icon} from '@hugeicons/core-free-icons';
import s from './Teach.module.css';

/** Dark hero after Lifted's: big headline, two buttons, and a video card with a floating panel. */
export function TeachHero() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <section className={s.hero}>
    <div className={s.heroText}>
      <p className={s.kicker}>Teach on yizelearn</p>
      <h1>Come teach with us</h1>
      <p className={s.lead}>Turn what you know into a short course, teach live classes and get paid in naira. Reach learners who want practical skills.</p>
      <div className={s.btns}>
        <Link href="/signup?as=teach" className={s.primary}>Start teaching <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.2} /></Link>
        <a href="#how" className={s.ghost} onClick={e => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({behavior: 'smooth'}); }}>See how it works</a>
      </div>
    </div>
    <div className={s.heroMedia}>
      <video ref={video} src="/video/teach.mp4" muted loop playsInline preload="metadata" aria-hidden />
      <div className={s.float}>
        <p>Your first course</p>
        {['Plan the lessons', 'Record on your phone', 'Add quizzes', 'Publish'].map((t, i) => <div key={t} className={s.fRow} style={{['--i' as string]: i}}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />{t}</div>)}
        <div className={s.fBar}><i /></div>
      </div>
    </div>
  </section>;
}

const ways = [
  {tab: 'Teach your way', title: 'Teach your way', text: 'Publish the course you want. Short lessons, your voice, your pace. You decide what to teach and how.', stat: '3-8 min', statText: 'typical lesson length', ui: ['Lesson 1 · Welcome', 'Lesson 2 · The basics', 'Lesson 3 · Your first project']},
  {tab: 'Inspire learners', title: 'Inspire learners', text: 'Teach what you know. Learners follow along, take quizzes, join your live classes and earn a certificate with your name on the course.', stat: 'Live', statText: 'classes to answer questions', ui: ['Live class · Friday 6pm', 'Quiz · 5 questions', 'Certificate on finish']},
  {tab: 'Get rewarded', title: 'Get rewarded', text: 'Learners pay once in naira by card or bank transfer. Expand your reach and earn from every course you publish.', stat: '₦', statText: 'every course priced in naira', ui: ['Card or bank transfer', 'Priced in naira', 'Earnings in your dashboard']},
];

/** Vertical tab list on the left and a big card on the right, like Lifted's engagement-model section. */
export function TeachWays() {
  const [on, setOn] = useState(0);
  const w = ways[on];
  return <div className={s.ways} id="how">
    <div className={s.tabs} role="tablist" aria-label="Why teach">
      {ways.map((x, i) => <button key={x.tab} role="tab" aria-selected={i === on} className={i === on ? s.tabOn : s.tab} onClick={() => setOn(i)}><span>0{i + 1}</span>{x.tab}</button>)}
    </div>
    <div className={s.panel} key={on} role="tabpanel">
      <div className={s.panelText}><h3>{w.title}</h3><p>{w.text}</p></div>
      <div className={s.mock}>
        {w.ui.map((u, i) => <div key={u} className={s.mockRow} style={{['--i' as string]: i}}><i />{u}</div>)}
        <div className={s.callout}><b>{w.stat}</b><span>{w.statText}</span></div>
      </div>
    </div>
  </div>;
}
