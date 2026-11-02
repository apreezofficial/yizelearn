'use client';

import {useEffect, useRef} from 'react';
import s from './Stack.module.css';

export type Panel = {label: string; text: string; tone: 'dark' | 'light'; art?: 'mission' | 'africa' | 'method'; size?: 'big' | 'body'; link?: {href: string; label: string}};

/**
 * Cencori's About layout: full-screen panels that pin and stack, each new one sliding up over the last.
 * While a panel is pinned its statement fills in word by word. Reduced motion: no pinning, text filled.
 */
export function StackPanels({panels}: {panels: Panel[]}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const wraps = [...el.querySelectorAll<HTMLElement>('[data-panel]')];
    const fill = (wrap: HTMLElement, f: number) => {
      const spans = wrap.querySelectorAll<HTMLSpanElement>('[data-w]');
      const lit = f * spans.length;
      spans.forEach((sp, i) => sp.style.setProperty('--p', String(Math.min(1, Math.max(0, lit - i)))));
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.dataset.still = 'true'; wraps.forEach(w => fill(w, 1)); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      // Fill between -10vh and 60vh of the pin; the next panel doesn't appear until 100vh, leaving time to read.
      wraps.forEach(w => fill(w, Math.min(1, Math.max(0, (-w.getBoundingClientRect().top + vh * 0.1) / (vh * 0.7)))));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', queue);
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(frame); };
  }, []);

  return <div ref={root} className={s.stack}>
    {panels.map((p, i) => <section key={p.label} data-panel className={s.wrap} style={{zIndex: i + 1}}>
      <div className={`${s.panel} ${p.tone === 'dark' ? s.dark : s.light} ${p.art ? s.withArt : ''}`}>
        <p className={s.label}>{p.label}</p>
        <div className={s.copy}>
          <p className={p.size === 'big' ? s.big : s.text}>
            <span className={s.srOnly}>{p.text}</span>
            {p.text.split(' ').map((w, j) => <span key={j} data-w aria-hidden>{w} </span>)}
          </p>
          {p.link && <a href={p.link.href} className={s.link}>{p.link.label}</a>}
        </div>
        {p.art && <div className={s.art}><Art kind={p.art} /></div>}
      </div>
    </section>)}
  </div>;
}

/** Drawn art panels in brand colours, standing in for Cencori's photographs. */
function Art({kind}: {kind: NonNullable<Panel['art']>}) {
  if (kind === 'mission') return <svg viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" aria-hidden>
    <defs><linearGradient id="am" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#17335A" /><stop offset="1" stopColor="#2F6DB5" /></linearGradient></defs>
    <rect width="400" height="460" fill="url(#am)" />
    {Array.from({length: 14}, (_, i) => <rect key={i} x={-60 + i * 36} y="-40" width="14" height="560" fill="#FFFFFF" opacity="0.06" transform="rotate(18 200 230)" />)}
    <circle cx="300" cy="120" r="70" fill="#F0B74A" opacity="0.9" />
    <path d="M40 360 C120 300 180 330 240 290 S350 250 380 230" stroke="#9CC6E0" strokeWidth="10" fill="none" strokeLinecap="round" />
    <text x="40" y="420" fill="#F5EFA8" fontSize="64" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="-2">learn</text>
  </svg>;
  if (kind === 'africa') return <svg viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" aria-hidden>
    <rect width="400" height="460" fill="#1C1F33" />
    {Array.from({length: 9}, (_, r) => Array.from({length: 8}, (_, c) => <circle key={`${r}-${c}`} cx={40 + c * 46} cy={40 + r * 46} r={4 + ((r * 3 + c * 5) % 7)} fill={(r + c) % 5 === 0 ? '#F0B74A' : (r + c) % 3 === 0 ? '#9CC6E0' : '#2F6DB5'} opacity={0.35 + ((r + c) % 4) * 0.15} />))}
    <rect x="30" y="330" width="340" height="100" rx="18" fill="#FDF8F1" />
    <text x="54" y="372" fill="#17335A" fontSize="22" fontWeight="700" fontFamily="system-ui, sans-serif">Built in Africa, for everyone</text>
    <text x="54" y="404" fill="#4A5468" fontSize="16" fontFamily="system-ui, sans-serif">Short lessons for busy lives</text>
  </svg>;
  return <svg viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" aria-hidden>
    <rect width="400" height="460" fill="#F5EFA8" />
    <rect x="40" y="60" width="320" height="200" rx="18" fill="#17335A" />
    <circle cx="200" cy="160" r="34" fill="#FDF8F1" /><path d="M192 144 L216 160 L192 176 Z" fill="#17335A" />
    {[0, 1, 2].map(i => <g key={i}><rect x="40" y={290 + i * 52} width="320" height="38" rx="10" fill="#FFFFFF" /><circle cx="64" cy={309 + i * 52} r="9" fill={i < 2 ? '#2E8B67' : '#C9D3E2'} /><rect x="84" y={303 + i * 52} width={160 - i * 30} height="12" rx="6" fill="#C9D3E2" /></g>)}
  </svg>;
}
