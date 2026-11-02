'use client';

import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Add01Icon, ArrowRight01Icon} from '@hugeicons/core-free-icons';
import {faqs} from '@/lib/faq';
import {Reveal} from './Live';
import s from './Faq.module.css';

/** Hairline-framed FAQ after the Journey section's style: heading on the left, accordion on the right. One answer open at a time. */
export function Faq() {
  const [open, setOpen] = useState(0);
  return <section className={s.faq} id="faq" aria-labelledby="faq-title">
    <Reveal className={s.head}>
      <p className={s.kicker}>FAQ</p>
      <h2 id="faq-title">Questions, answered.</h2>
      <p className={s.sub}>The things people ask before they pay. Don&apos;t see yours? Ask us.</p>
      <button className={s.ask} onClick={() => window.dispatchEvent(new Event('yz-help-open'))}>Ask in chat <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.2} /></button>
    </Reveal>
    <ul className={s.list}>
      {faqs.map((f, i) => {
        const on = i === open;
        return <li key={f.q} className={on ? s.itemOn : s.item}>
          <h3>
            <button id={`faq-q-${i}`} aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
              <span>{f.q}</span>
              <span className={s.plus} aria-hidden><HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={2} /></span>
            </button>
          </h3>
          <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={s.panel}><div><p>{f.a}</p></div></div>
        </li>;
      })}
    </ul>
  </section>;
}
