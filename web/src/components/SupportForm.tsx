'use client';

import {useState, type FormEvent} from 'react';
import {EMAIL} from '@/lib/session';
import {SUPPORT_EMAIL, SUPPORT_TOPICS} from '@/lib/support';

/** Public support form. There is no logged-out support route on the API, so it writes an email to the support mailbox. */
export function SupportForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string>(SUPPORT_TOPICS[0].value);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tell us your name.';
    if (!EMAIL.test(email.trim())) next.email = 'Enter an email we can reply to.';
    if (subject.trim().length < 4) next.subject = 'Add a short subject.';
    if (message.trim().length < 20) next.message = 'Describe the problem in a few sentences.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const label = SUPPORT_TOPICS.find(t => t.value === topic)?.label ?? topic;
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${label}\n\n${message.trim()}`;
    const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`[${label}] ${subject.trim()}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
    window.location.href = href;
  }

  return <form className="support-form" onSubmit={submit} noValidate>
    <div className="field-row">
      <label>Your name
        <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>
      <label>Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.email} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>
    </div>
    <label>Topic
      <select value={topic} onChange={e => setTopic(e.target.value)}>
        {SUPPORT_TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
    </label>
    <label>Subject
      <input value={subject} onChange={e => setSubject(e.target.value)} aria-invalid={!!errors.subject} />
      {errors.subject && <span className="field-error">{errors.subject}</span>}
    </label>
    <label>Message
      <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} aria-invalid={!!errors.message} />
      {errors.message && <span className="field-error">{errors.message}</span>}
    </label>
    <button type="submit" className="primary">Open email to support</button>
    {opened && <p className="form-note">Your email app should open with the message filled in. If it does not, write to {SUPPORT_EMAIL} directly.</p>}
  </form>;
}
