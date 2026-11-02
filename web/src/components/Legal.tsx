'use client';

import {useEffect, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Link01Icon, Tick02Icon} from '@hugeicons/core-free-icons';
import type {LegalDoc} from '@/lib/legal';
import s from './Legal.module.css';

/** Isometric stack of pages in brand colours, standing in for pxxl's header illustration. */
function Pages() {
  return <svg viewBox="0 0 220 160" className={s.art} aria-hidden>
    <g transform="translate(110 90) scale(1 0.58) rotate(45)">
      <rect x="-52" y="-52" width="104" height="104" rx="6" fill="#DFEBF9" transform="translate(0 22)" />
      <rect x="-52" y="-52" width="104" height="104" rx="6" fill="#9CC6E0" transform="translate(0 11)" />
      <rect x="-52" y="-52" width="104" height="104" rx="6" fill="#FFFFFF" stroke="#2F6DB5" strokeWidth="2" />
      <rect x="-36" y="-34" width="52" height="7" rx="3" fill="#2F6DB5" />
      {[-18, -6, 6, 18, 30].map(y => <rect key={y} x="-36" y={y} width={y === 30 ? 34 : 72} height="5" rx="2.5" fill="#C9D3E2" />)}
      <circle cx="30" cy="30" r="9" fill="#F0B74A" />
    </g>
    <g className={s.flag}><path d="M20 20 V70" stroke="#17335A" strokeWidth="2.5" /><rect x="20" y="20" width="62" height="22" rx="4" fill="#17335A" /><rect x="28" y="28" width="30" height="5" rx="2.5" fill="#F5EFA8" /></g>
  </svg>;
}

/**
 * Legal page after pxxl's terms and policy: a header band with the title, version and dates, then numbered
 * sections with copy-link buttons, and a sticky "On this page" list that follows your scroll.
 */
export function LegalPage({doc}: {doc: LegalDoc}) {
  const [active, setActive] = useState(doc.sections[0].id);
  const [copied, setCopied] = useState('');

  // Active section = the last one whose top has scrolled past the sticky header.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = doc.sections[0].id;
      for (const sec of doc.sections) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= 140) current = sec.id;
      }
      setActive(current);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, {passive: true});
    return () => { window.removeEventListener('scroll', queue); cancelAnimationFrame(frame); };
  }, [doc]);

  const copy = async (id: string) => {
    const url = `${location.origin}${location.pathname}#${id}`;
    try { await navigator.clipboard.writeText(url); } catch { /* the hash still changes below */ }
    history.replaceState(null, '', `#${id}`);
    setCopied(id);
    setTimeout(() => setCopied(c => (c === id ? '' : c)), 1800);
  };

  return <div className={s.wrap}>
    <header className={s.head}>
      <div className={s.artBox}><Pages /></div>
      <div className={s.title}>
        <p className={s.kicker}>{doc.kicker}</p>
        <h1>{doc.title}</h1>
        <p className={s.meta}><span>Version {doc.version}</span><span>Last updated: {doc.updated}</span><span>Effective: {doc.effective}</span></p>
      </div>
    </header>
    <div className={s.body}>
      <article className={s.doc}>
        {doc.sections.map((sec, i) => <section key={sec.id} id={sec.id} className={s.section}>
          <h2><span className={s.num}>{String(i + 1).padStart(2, '0')}</span>{sec.title}
            <button className={s.copy} onClick={() => copy(sec.id)} aria-label={`Copy link to ${sec.title}`}>
              <HugeiconsIcon icon={copied === sec.id ? Tick02Icon : Link01Icon} size={14} strokeWidth={2} />{copied === sec.id ? 'Copied' : 'Copy link'}
            </button>
          </h2>
          {sec.body.map((b, j) => typeof b === 'string' ? <p key={j}>{b}</p> : <ul key={j}>{b.map(li => <li key={li}>{li}</li>)}</ul>)}
        </section>)}
      </article>
      <aside className={s.toc} aria-label="On this page">
        <p>On this page</p>
        <ol>{doc.sections.map(sec => <li key={sec.id}><a href={`#${sec.id}`} className={sec.id === active ? s.tocOn : undefined} aria-current={sec.id === active ? 'location' : undefined}>{sec.title}</a></li>)}</ol>
      </aside>
    </div>
  </div>;
}
