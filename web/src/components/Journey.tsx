'use client';

import {useEffect, useRef, useState} from 'react';
import s from './Journey.module.css';

export type Step = {title: string; detail: string; kicker: string; screen: React.ReactNode};

/**
 * After pxxl.app's "From repo to production": a sticky numbered list on the left and a column of
 * product screens on the right. The list follows the screen in view; clicking a step scrolls to it.
 */
export function Journey({title, steps}: {title: string; steps: Step[]}) {
  const [active, setActive] = useState(0);
  const screens = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); });
    }, {rootMargin: '-45% 0px -45% 0px'});
    screens.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => screens.current[i]?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});

  return <section className={s.journey} id="how-it-works">
    <h2 className={s.title}>{title}</h2>
    <div className={s.grid}>
      <ol className={s.steps}>
        {steps.map((st, i) => <li key={st.title}>
          <button className={i === active ? s.stepOn : s.step} onClick={() => go(i)} aria-current={i === active ? 'step' : undefined}>
            <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
            <span className={s.stepCopy}><b>{st.title}</b><span className={s.detail}><span>{st.detail}</span></span></span>
            <span className={s.bar} aria-hidden />
          </button>
        </li>)}
      </ol>
      <div className={s.screens}>
        {steps.map((st, i) => <div key={st.title} ref={el => { screens.current[i] = el; }} data-i={i} className={`${s.slot} ${i === active ? s.slotOn : ''}`}>
          <div className={s.window}>
            <div className={s.windowHead}><span className={s.ring} aria-hidden /><span>Step {i + 1} of {steps.length} · <b>{st.kicker}</b></span></div>
            <p className={s.windowSub}>{st.detail}</p>
            <div className={s.windowBody}>{st.screen}</div>
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}
