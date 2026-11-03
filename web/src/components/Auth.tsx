'use client';

import {Logo} from './Logo';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {AppleIcon, ArrowLeft01Icon, CheckmarkCircle02Icon, GoogleIcon} from '@hugeicons/core-free-icons';
import {EMAIL, requestCode, verifyCode} from '@/lib/session';
import s from './Auth.module.css';

const RESEND_SECONDS = 30;
type Step = 'form' | 'code' | 'done';

/**
 * Login and sign-up, laid out like the app's screens: centred logo, a title and line, big rounded fields,
 * a sky-blue primary button, the "or continue with" row, then the 6-digit code step.
 * `teach` is set by /signup?as=teach and only changes the copy.
 */
export function Auth({mode, teach}: {mode: 'login' | 'signup'; teach?: boolean}) {
  const signup = mode === 'signup';
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const [who, setWho] = useState('');
  const codeInput = useRef<HTMLInputElement>(null);

  const emailOk = EMAIL.test(email.trim());
  const emailError = touched && email.trim() && !emailOk ? 'Enter a full email address, like name@example.com' : '';
  const ready = emailOk && (!signup || name.trim().length > 1);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(w => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!ready || busy) return;
    setBusy(true); setError('');
    try {
      await requestCode(email.trim(), signup ? name.trim() : undefined);
      setStep('code'); setWait(RESEND_SECONDS); setCode('');
      setTimeout(() => codeInput.current?.focus(), 60);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const verify = async (value: string) => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const user = await verifyCode(email.trim(), value);
      setWho(signup && name.trim() ? name.trim().split(' ')[0] : user.name);
      setStep('done');
    } catch (err) { setError((err as Error).message); setCode(''); }
    finally { setBusy(false); }
  };

  const social = (p: string) => setNotice(`${p} sign-in is not connected yet. Use your email for now.`);

  return <main className={s.page}>
    <Link href="/" className={s.back} aria-label="Back to home"><HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} /></Link>
    <div className={s.card} key={step}>
      <Link href="/" className={s.logo}><Logo alt="yizelearn" width={132} height={41} priority /></Link>

      {step === 'form' && <form onSubmit={send} noValidate>
        <h1>{signup ? (teach ? 'Create your instructor account' : 'Create your account') : 'Welcome back'}</h1>
        <p className={s.sub}>{signup ? (teach ? 'Start teaching what you know' : 'Short courses that fit around your day') : 'Log in to keep learning'}</p>
        {error && <p className={s.error} role="alert">{error}</p>}
        {notice && <p className={s.notice} role="status">{notice}</p>}
        {signup && <div className={s.field}><label htmlFor="name">Full name</label><input id="name" autoComplete="name" autoFocus placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} /></div>}
        <div className={s.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" autoFocus={!signup} placeholder="name@example.com" value={email} className={emailError ? s.bad : undefined}
            onChange={e => { setEmail(e.target.value); setError(''); }} onBlur={() => setTouched(true)} aria-invalid={!!emailError} aria-describedby={emailError ? 'email-err' : undefined} />
          {emailError && <p id="email-err" className={s.fieldError}>{emailError}</p>}
        </div>
        <button className={s.primary} disabled={!ready || busy}>{busy ? <span className={s.spin} aria-label="Sending" /> : signup ? 'Create account' : 'Log in'}</button>

        <div className={s.divider}><span>{signup ? 'or sign up with' : 'or continue with'}</span></div>
        <div className={s.social}>
          <button type="button" onClick={() => social('Google')}><HugeiconsIcon icon={GoogleIcon} size={20} />Google</button>
          <button type="button" onClick={() => social('Apple')}><HugeiconsIcon icon={AppleIcon} size={20} />Apple</button>
        </div>
        <p className={s.foot}>{signup ? <>Already have an account? <Link href="/login">Log in</Link></> : <>New here? <Link href="/signup">Create an account</Link></>}</p>
        {signup && <p className={s.legal}>By creating an account you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>}
      </form>}

      {step === 'code' && <div>
        <h1>Enter the code</h1>
        <p className={s.sub}>We sent a 6-digit code to<br /><b>{email}</b></p>
        {error && <p className={s.error} role="alert">{error}</p>}
        <div className={s.codeRow} onClick={() => codeInput.current?.focus()}>
          {Array.from({length: 6}, (_, i) => <span key={i} className={`${s.box} ${i === code.length ? s.boxOn : ''}`}>{code[i] ?? ''}</span>)}
          <input ref={codeInput} className={s.hidden} inputMode="numeric" autoComplete="one-time-code" maxLength={6} aria-label="6-digit code" value={code}
            onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(0, 6); setCode(d); if (d.length === 6) verify(d); }} />
        </div>
        <button className={s.primary} disabled={code.length !== 6 || busy} onClick={() => verify(code)}>{busy ? <span className={s.spin} aria-label="Checking" /> : 'Verify'}</button>
        <div className={s.row}>
          <button type="button" className={s.link} onClick={() => { setStep('form'); setError(''); }}>Use another email</button>
          <button type="button" className={s.link} disabled={wait > 0} onClick={() => send()}>{wait > 0 ? `Resend in ${wait}s` : 'Resend code'}</button>
        </div>
      </div>}

      {step === 'done' && <div className={s.done}>
        <span className={s.check}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={34} /></span>
        <h1>You&apos;re in, {who}</h1>
        <p className={s.sub}>Your account is ready. Learning happens in the yizelearn app on iPhone and Android for now, and the web version is on its way.</p>
        <Link href="/" className={s.primary}>Back to home</Link>
      </div>}
    </div>
  </main>;
}

/** The sign-up page reads ?as=teach in the browser, so the page itself can still be built ahead of time. */
export function SignupFromUrl() {
  return <Auth mode="signup" teach={useSearchParams().get('as') === 'teach'} />;
}
