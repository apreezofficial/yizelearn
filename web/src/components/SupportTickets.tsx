'use client';

import Link from 'next/link';
import {useEffect, useState, type FormEvent} from 'react';
import {useSession} from '@/lib/session';
import {SUPPORT_TOPICS} from '@/lib/support';

type Ticket = {id: string; subject: string; topic: string; status: string; updatedAt: string};
type Load = {state: 'loading'} | {state: 'ready'; tickets: Ticket[]} | {state: 'unavailable'};

/** Signed-in support: lists the learner's tickets and opens a new one through the API (bearer auth via the /yz proxy). */
export function SupportTickets() {
  const session = useSession();
  const [load, setLoad] = useState<Load>({state: 'loading'});
  const [topic, setTopic] = useState<string>(SUPPORT_TOPICS[0].value);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const token = session?.accessToken;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetch('/yz/support/tickets', {headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}})
      .then(async r => {
        if (!r.ok) throw new Error(String(r.status));
        const body = (await r.json()) as {data: Ticket[]};
        if (!cancelled) setLoad({state: 'ready', tickets: body.data});
      })
      .catch(() => { if (!cancelled) setLoad({state: 'unavailable'}); });
    return () => { cancelled = true; };
  }, [token]);

  if (session === null) {
    return <main className="contact"><section className="contact-hero compact"><div>
      <p className="eyebrow">Support</p><h1>Log in to open a ticket</h1>
      <p className="lead">Tickets are tied to your account so we can follow your order and courses. <Link href="/login">Log in</Link> or use the <Link href="/contact/form">support form</Link>.</p>
    </div></section></main>;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    if (subject.trim().length < 4 || message.trim().length < 20) { setStatus('Add a subject and a few sentences about the problem.'); return; }
    setStatus('Sending…');
    try {
      const res = await fetch('/yz/support/tickets', {
        method: 'POST',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'Idempotency-Key': crypto.randomUUID()},
        body: JSON.stringify({topic, subject: subject.trim(), message: message.trim()}),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubject(''); setMessage(''); setStatus('Ticket sent. We will reply here and by email.');
      const list = await fetch('/yz/support/tickets', {headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}}).then(r => r.json()) as {data: Ticket[]};
      setLoad({state: 'ready', tickets: list.data});
    } catch {
      setStatus('We could not send your ticket. Try again in a few minutes.');
    }
  }

  return <main className="contact">
    <section className="contact-hero compact"><div>
      <p className="eyebrow">Your support</p><h1>Support tickets</h1>
      <p className="lead">Open a ticket and follow every reply from here.</p>
    </div></section>

    <section className="ticket-list" aria-label="Your tickets">
      {load.state === 'loading' && <p className="form-note">Loading your tickets…</p>}
      {load.state === 'unavailable' && <p className="form-note">Your tickets are not available right now. You can still open a new one below.</p>}
      {load.state === 'ready' && load.tickets.length === 0 && <p className="form-note">You have no tickets yet.</p>}
      {load.state === 'ready' && load.tickets.map(t => (
        <div className="ticket" key={t.id}>
          <strong>{t.subject}</strong>
          <span>{t.status} · updated {new Date(t.updatedAt).toLocaleDateString('en-GB')}</span>
        </div>
      ))}
    </section>

    <form className="support-form" onSubmit={submit}>
      <label>Topic
        <select value={topic} onChange={e => setTopic(e.target.value)}>
          {SUPPORT_TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>
      <label>Subject
        <input value={subject} onChange={e => setSubject(e.target.value)} />
      </label>
      <label>Message
        <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} />
      </label>
      <button type="submit" className="primary">Send ticket</button>
      {status && <p className="form-note">{status}</p>}
    </form>
  </main>;
}
