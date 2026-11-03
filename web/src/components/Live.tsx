'use client';

import {useEffect, useRef, useState} from 'react';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A number that keeps ticking up, like Stripe's live GDP counter. Sample rate until the API reports real totals. */
export function Ticker({start, perSecond}: {start: number; perSecond: number}) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    if (reduced()) return;
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => { setValue(start + ((now - began) / 1000) * perSecond); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, perSecond]);
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{Math.floor(value).toLocaleString('en-NG')}</span>;
}

/** Counts up once when scrolled into view. */
export function CountUp({to, suffix = ''}: {to: number; suffix?: string}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const ms = reduced() ? 0 : 1400;
      const began = performance.now();
      const tick = (now: number) => {
        const t = ms ? Math.min(1, (now - began) / ms) : 1;
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, {threshold: 0.4});
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [to]);
  return <span ref={ref} style={{fontVariantNumeric: 'tabular-nums'}}>{value.toLocaleString('en-NG')}{suffix}</span>;
}

/** Fades and lifts children in as they scroll into view. */
export function Reveal({children, delay = 0, className}: {children: React.ReactNode; delay?: number; className?: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } }, {threshold: 0.15});
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className} data-shown={shown} style={{transitionDelay: `${delay}ms`}}>{children}</div>;
}

/** Quiz mock that cycles through picking an answer and showing it correct. */
export function QuizDemo() {
  const options = ['VLOOKUP', 'XLOOKUP', 'HLOOKUP'];
  const [step, setStep] = useState(0);
  useEffect(() => {
    // With reduced motion it jumps to the answered state and stays there.
    if (reduced()) { const t = setTimeout(() => setStep(2), 0); return () => clearTimeout(t); }
    const id = setInterval(() => setStep(s => (s + 1) % 4), 1300);
    return () => clearInterval(id);
  }, []);
  return <div className="quizDemo">
    <small>Question 3 of 10</small>
    <div className="quizBar"><span style={{width: `${30 + Math.min(step, 2) * 5}%`}} /></div>
    <strong>Which function can search any column?</strong>
    {options.map(o => {
      const picked = step >= 1 && o === 'XLOOKUP';
      const right = step >= 2 && o === 'XLOOKUP';
      return <div key={o} className={`quizOpt ${picked ? 'picked' : ''} ${right ? 'right' : ''}`}><i />{o}{right && <b>Correct</b>}</div>;
    })}
  </div>;
}

/**
 * A pinned statement whose words fill in from pale to full colour as you scroll through it,
 * after Cencori's "For developers" section. `accent` words fill in brand blue instead of navy.
 * With reduced motion it renders fully filled and doesn't pin.
 */
export function ScrollWords({label, text, accent = [], dark = false}: {label: string; text: string; accent?: string[]; dark?: boolean}) {
  const wrap = useRef<HTMLDivElement>(null);
  const words = text.split(' ');
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLSpanElement>('[data-w]')];
    if (reduced()) { el.dataset.still = 'true'; spans.forEach(s => s.style.setProperty('--p', '1')); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // 0 when the block reaches the top, 1 when its pinned stretch is used up; finish a little early so the last words settle.
      const progress = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight) * 1.15));
      const lit = progress * spans.length;
      spans.forEach((s, i) => s.style.setProperty('--p', String(Math.min(1, Math.max(0, lit - i)))));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', queue);
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(frame); };
  }, [text]);
  return <div ref={wrap} className="scrollWords" data-dark={dark}>
    <div className="scrollWordsPin">
      <p className="scrollWordsLabel">{label}</p>
      <p className="scrollWordsText">
        <span className="srOnly">{text}</span>
        {words.map((w, i) => <span key={i} data-w aria-hidden className={accent.includes(w.replace(/[^\w']/g, '')) ? 'accent' : undefined}>{w} </span>)}
      </p>
    </div>
  </div>;
}
