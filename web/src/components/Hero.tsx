'use client';

import Link from 'next/link';
import {useEffect, useRef} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, Award01Icon, BookOpen01Icon, UserGroupIcon, Video01Icon} from '@hugeicons/core-free-icons';
import {Ticker} from './Live';
import s from './Hero.module.css';

/** Layered mountain ridges in brand blues with snow caps; drawn here so the hero needs no stock photo. */
function Mountains() {
  return <svg className={s.mountains} viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax slice" aria-hidden>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFD6F2" /><stop offset="0.6" stopColor="#E6EFFA" /><stop offset="1" stopColor="#FFFFFF" /></linearGradient>
      <linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FB3E0" /><stop offset="1" stopColor="#D7E5F6" /></linearGradient>
      <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4F7FBF" /><stop offset="1" stopColor="#A9C4E6" /></linearGradient>
      <linearGradient id="near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24508F" /><stop offset="1" stopColor="#7DA2D3" /></linearGradient>
      <radialGradient id="sun" cx="0.72" cy="0.18" r="0.35"><stop offset="0" stopColor="#F0B74A" stopOpacity="0.55" /><stop offset="1" stopColor="#F0B74A" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="1440" height="560" fill="url(#sky)" />
    <rect width="1440" height="560" fill="url(#sun)" />
    <g data-layer="far">
      <path d="M0 330 L120 250 L220 300 L360 180 L470 260 L600 150 L740 270 L860 200 L980 280 L1120 160 L1250 250 L1440 190 L1440 560 L0 560 Z" fill="url(#far)" />
      <path d="M360 180 L392 205 L372 203 L352 214 L338 196 Z M600 150 L636 178 L612 176 L590 190 L574 168 Z M1120 160 L1152 186 L1130 184 L1108 196 L1094 176 Z" fill="#FFFFFF" opacity="0.85" />
    </g>
    <g data-layer="mid">
      <path d="M0 400 L140 300 L260 360 L420 230 L540 330 L700 240 L820 340 L960 260 L1080 350 L1220 250 L1340 320 L1440 280 L1440 560 L0 560 Z" fill="url(#mid)" />
      <path d="M420 230 L462 264 L436 260 L414 276 L396 254 Z M700 240 L744 276 L716 270 L694 288 L676 262 Z M1220 250 L1258 280 L1234 276 L1212 292 L1196 270 Z" fill="#FFFFFF" opacity="0.9" />
    </g>
    <g data-layer="near">
      <path d="M0 470 L180 360 L320 440 L500 330 L640 430 L800 350 L960 450 L1120 340 L1280 430 L1440 370 L1440 560 L0 560 Z" fill="url(#near)" />
      <path d="M500 330 L548 368 L518 362 L494 382 L472 356 Z M1120 340 L1166 376 L1138 370 L1114 388 L1094 364 Z M180 360 L218 390 L194 386 L174 400 L158 380 Z" fill="#FFFFFF" />
    </g>
  </svg>;
}

const stats = [
  {icon: BookOpen01Icon, value: '312', label: 'Courses', detail: 'Business to tech'},
  {icon: UserGroupIcon, value: '12K+', label: 'Learners', detail: 'Across Africa'},
  {icon: Video01Icon, value: '40+', label: 'Live classes', detail: 'Every month'},
  {icon: Award01Icon, value: '8K+', label: 'Certificates', detail: 'Earned and shared'},
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Ridges drift at different speeds as the pointer moves and the page scrolls, for a little depth.
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let px = 0, frame = 0;
    const apply = () => {
      frame = 0;
      const scroll = Math.min(window.scrollY, 600);
      el.style.setProperty('--mx', String(px));
      el.style.setProperty('--sy', String(scroll));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(apply); };
    const onMove = (e: PointerEvent) => { px = (e.clientX / window.innerWidth - 0.5) * 2; queue(); };
    window.addEventListener('pointermove', onMove, {passive: true});
    window.addEventListener('scroll', queue, {passive: true});
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', queue); cancelAnimationFrame(frame); };
  }, []);

  return <section ref={ref} className={s.hero}>
    <div className={s.scene} aria-hidden>
      <Mountains />
      <span className={s.mist} /><span className={`${s.mist} ${s.mist2}`} />
    </div>
    <div className={s.frame}>
      <div className={s.copy}>
        <p className={s.live}><i className={s.dot} />Lessons finished today <b><Ticker start={48213} perSecond={0.9} /></b></p>
        <h1>Practical skills that move{' '}<br />your career <mark>forward, faster</mark></h1>
        <p className={s.lede}>Short courses from people who do the work. Learn in minutes a day, join live classes, and finish with a certificate you can show. Keep access after you finish.</p>
        <div className={s.ctas}>
          <Link href="/signup" className={s.primary}>Start learning <span className={s.avatar} aria-hidden>Y</span></Link>
          <Link href="/#courses" className={s.secondary}>Browse courses <HugeiconsIcon icon={ArrowRight01Icon} size={16} /></Link>
        </div>
      </div>
      <div className={s.statsWrap}>
        <p className={s.statsTitle}>Learning that people<br />actually finish</p>
        <div className={s.stats}>
          {stats.map((x, i) => <div key={x.label} className={s.stat} style={{animationDelay: `${500 + i * 90}ms`}}>
            <span className={s.statIcon}><HugeiconsIcon icon={x.icon} size={16} /></span>
            <div><b>{x.value} {x.label}</b><span>{x.detail}</span></div>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
