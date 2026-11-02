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
 * Cencori-style pinned section: the statement fills in word by word, then shrinks up beside
 * the label, then the children (cards) slide up into place one after another, all while pinned.
 * Children set `--i` on each card; CSS turns `--enter` into a per-card slide.
 * With reduced motion everything shows at once and nothing pins.
 */
export function ScrollWords({label, text, accent = [], dark = false, children}: {label: string; text: string; accent?: string[]; dark?: boolean; children?: React.ReactNode}) {
  const wrap = useRef<HTMLDivElement>(null);
  const words = text.split(' ');
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLSpanElement>('[data-w]')];
    const set = (fill: number, lift: number, enter: number) => {
      const lit = fill * spans.length;
      spans.forEach((s, i) => s.style.setProperty('--p', String(Math.min(1, Math.max(0, lit - i)))));
      el.style.setProperty('--lift', lift.toFixed(3));
      el.style.setProperty('--enter', enter.toFixed(3));
    };
    if (reduced()) { el.dataset.still = 'true'; set(1, 1, 1); return; }
    const phase = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start while the section is still scrolling in (top at 60% of the screen) so the pinned stretch stays short.
      const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / Math.max(1, r.height - vh + vh * 0.6)));
      // Words fill over the first stretch, the statement lifts, then the cards come in.
      set(phase(p, 0, 0.42), phase(p, 0.42, 0.56), phase(p, 0.54, 0.92));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', queue);
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(frame); };
  }, [text]);
  return <section ref={wrap} className="scrollWords" data-dark={dark}>
    <div className="scrollWordsPin">
      <div className="scrollWordsHead">
        <p className="scrollWordsLabel">{label}</p>
        <p className="scrollWordsText">
          <span className="srOnly">{text}</span>
          {words.map((w, i) => <span key={i} data-w aria-hidden className={accent.includes(w.replace(/[^\w']/g, '')) ? 'accent' : undefined}>{w} </span>)}
        </p>
      </div>
      {children && <div className="scrollWordsBody">{children}</div>}
    </div>
  </section>;
}
