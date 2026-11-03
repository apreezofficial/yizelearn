'use client';

import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowUp02Icon, Cancel01Icon, PlusSignIcon} from '@hugeicons/core-free-icons';
import s from './Help.module.css';

type Msg = {me: boolean; text: string};

// Answers come from our help topics, matched by keywords. There is no AI behind this yet;
// anything it can't match is handed to the support team by email.
const topics: {q: string; keys: string[]; a: string}[] = [
  {q: 'How do I get my certificate?', keys: ['certificate', 'cert'], a: 'Finish every lesson and pass the final quiz. Your certificate appears under Account › Certificates, ready to download as a PDF or share to LinkedIn.'},
  {q: 'Can I pay by bank transfer?', keys: ['pay', 'bank', 'transfer', 'card', 'payment', 'naira'], a: 'Yes. At checkout pick Bank transfer and we show you the account to send to. Your course unlocks as soon as the transfer is confirmed, usually within minutes.'},
  {q: 'How do live classes work?', keys: ['live', 'class', 'zoom', 'session'], a: 'Live classes run every week. Join from the course page when it starts. If you miss one, the recording is added to the course the same day.'},
  {q: 'Do I keep access after I finish?', keys: ['access', 'forever', 'expire', 'keep', 'lifetime'], a: 'Yes. You pay once and keep the course, including any updates the instructor adds later.'},
  {q: "My course won't open", keys: ["won't", 'wont', 'open', 'load', 'error', 'stuck', 'broken'], a: 'Try signing out and back in, then check your connection. If it still won\'t open, use "Report a problem" in the app (or shake your phone) and include a screenshot. We reply within a day.'},
  {q: 'Can I get a refund?', keys: ['refund', 'money back', 'cancel'], a: 'If a course isn\'t right for you, ask within 14 days of buying and before finishing more than a quarter of it, and we\'ll refund you.'},
];
const SUPPORT_EMAIL = 'support@yizelearn.com';

function answer(text: string) {
  const t = text.toLowerCase();
  const hit = topics.find(x => x.q.toLowerCase() === t) ?? topics.find(x => x.keys.some(k => t.includes(k)));
  return hit?.a ?? `I don't have an answer for that yet. Email ${SUPPORT_EMAIL} and a person from our team will reply within a day.`;
}

/** "Need help?" pill fixed to the bottom-left, opening a chat-style panel with suggested questions. */
export function Help() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { list.current?.scrollTo({top: list.current.scrollHeight, behavior: 'smooth'}); }, [msgs, typing]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const ask = (q: string) => {
    const clean = q.trim();
    if (!clean || typing) return;
    setMsgs(m => [...m, {me: true, text: clean}]);
    setText('');
    setTyping(true);
    setTimeout(() => { setMsgs(m => [...m, {me: false, text: answer(clean)}]); setTyping(false); }, 700);
  };

  return <div className={s.root}>
    {open && <div className={s.panel} role="dialog" aria-label="yizelearn help">
      <div className={s.head}>
        <span className={s.orb} aria-hidden />
        <div className={s.title}><b>yizelearn help</b><span>Instant answers · team replies within a day</span></div>
        <button className={s.icon} onClick={() => setMsgs([])} aria-label="New conversation"><HugeiconsIcon icon={PlusSignIcon} size={16} /></button>
        <button className={s.icon} onClick={() => setOpen(false)} aria-label="Close help"><HugeiconsIcon icon={Cancel01Icon} size={16} /></button>
      </div>
      <div ref={list} className={s.body} aria-live="polite">
        <p className={s.greet}>Hi! What can we help with? Ask about courses, payments, certificates or live classes.</p>
        {msgs.length === 0 && <div className={s.suggest}>{topics.slice(0, 4).map(t => <button key={t.q} onClick={() => ask(t.q)}>{t.q}</button>)}</div>}
        {msgs.map((m, i) => <div key={i} className={m.me ? s.me : s.them}>{m.text}</div>)}
        {typing && <div className={`${s.them} ${s.typing}`} aria-label="Typing"><i /><i /><i /></div>}
      </div>
      <form className={s.composer} onSubmit={e => { e.preventDefault(); ask(text); }}>
        <input ref={input} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); ask(text); } }} placeholder="Type your question…" aria-label="Your question" />
        <button type="submit" disabled={!text.trim()} aria-label="Send"><HugeiconsIcon icon={ArrowUp02Icon} size={16} strokeWidth={2.4} /></button>
      </form>
      <p className={s.foot}>Don&apos;t share card numbers or passwords here.</p>
    </div>}
    <button className={open ? s.closeFab : s.fab} onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? 'Close help' : 'Need help?'}>
      {open ? <HugeiconsIcon icon={Cancel01Icon} size={18} /> : <><span className={s.orbSmall} aria-hidden />Need help?</>}
    </button>
  </div>;
}
