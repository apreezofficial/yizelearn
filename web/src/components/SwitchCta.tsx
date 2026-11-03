'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Add01Icon, ArrowRight01Icon, Award01Icon, CheckmarkCircle02Icon, FireIcon, PlayIcon, UserAdd01Icon, Video01Icon} from '@hugeicons/core-free-icons';
import s from './SwitchCta.module.css';

type Side = 'learn' | 'teach';
const sides: Record<Side, {tab: string; title: string; text: string; cta: string; href: string; video: string}> = {
  learn: {tab: 'Learn', title: 'Learn the skills your next role needs', text: 'Short, practical courses from people who do the work. Pay once, keep access, and finish with a certificate you can show.', cta: 'Start learning', href: '#', video: '/video/learn.mp4'},
  teach: {tab: 'Teach', title: 'Teach what you know, to people who need it', text: 'Turn your experience into a course. We help with the outline, filming tips and getting your first learners.', cta: 'Become an instructor', href: '#', video: '/video/teach.mp4'},
};

/**
 * Closing call to action after Upwork's hero: a dark rounded card with a full-bleed looping video and a
 * Learn / Teach switch that swaps the copy, button and video. If a video file is missing, the brand
 * gradient behind it shows instead. Reduced motion: videos stay paused on their first frame.
 */
export function SwitchCta() {
  const [side, setSide] = useState<Side>('learn');
  const vids = useRef<Partial<Record<Side, HTMLVideoElement | null>>>({});

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    (Object.keys(sides) as Side[]).forEach(k => {
      const v = vids.current[k];
      if (!v) return;
      if (k === side && !still) v.play().catch(() => undefined); else v.pause();
    });
  }, [side]);

  const c = sides[side];
  return <section className={s.card} aria-label="Get started">
    <div className={s.media} aria-hidden>
      {(Object.keys(sides) as Side[]).map(k => <video key={k} ref={el => { vids.current[k] = el; }} className={k === side ? s.videoOn : s.video}
        src={sides[k].video} muted loop playsInline preload={k === 'learn' ? 'auto' : 'metadata'} />)}
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
    {/* Floating product moments on the right; they swap with the switch and sit over the video when there is one */}
    <div key={`art-${side}`} className={s.stage} aria-hidden>
      {side === 'learn' ? <>
        <div className={`${s.float} ${s.main}`}>
          <div className={s.cover}><span className={s.play}><HugeiconsIcon icon={PlayIcon} size={18} /></span><b>Excel</b></div>
          <div className={s.mainBody}>
            <strong>Data analysis in Excel</strong>
            <span>Module 2 · Lookup functions</span>
            <div className={s.track}><i style={{width: '68%'}} /></div>
            <small>68% complete · 12 min left today</small>
          </div>
        </div>
        <div className={`${s.float} ${s.chip} ${s.chipTop}`}><span className={s.chipIcon} data-tone="gold"><HugeiconsIcon icon={FireIcon} size={16} /></span><div><b>5-day streak</b><span>Keep it going</span></div></div>
        <div className={`${s.float} ${s.chip} ${s.chipBottom}`}><span className={s.chipIcon} data-tone="green"><HugeiconsIcon icon={Award01Icon} size={16} /></span><div><b>Certificate earned</b><span>Business writing</span></div></div>
      </> : <>
        <div className={`${s.float} ${s.main}`}>
          <div className={s.builderHead}><strong>Your course</strong><span>Draft</span></div>
          {['Welcome and setup', 'Formulas that matter', 'Lookups in practice'].map((t, i) => <div key={t} className={s.lesson}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} /><span>{t}</span><em>{6 + i * 2} min</em></div>)}
          <div className={s.addLesson}><HugeiconsIcon icon={Add01Icon} size={16} />Add a lesson</div>
        </div>
        <div className={`${s.float} ${s.chip} ${s.chipTop}`}><span className={s.chipIcon} data-tone="sky"><HugeiconsIcon icon={UserAdd01Icon} size={16} /></span><div><b>New learner enrolled</b><span>Just now</span></div></div>
        <div className={`${s.float} ${s.chip} ${s.chipBottom}`}><span className={s.chipIcon} data-tone="red"><HugeiconsIcon icon={Video01Icon} size={16} /></span><div><b>Your live class</b><span>Thursday, 6:00 PM</span></div></div>
      </>}
    </div>
  </section>;
}
