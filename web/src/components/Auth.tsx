'use client';

import {Logo} from './Logo';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon, CheckmarkCircle02Icon, ViewIcon, ViewOffSlashIcon} from '@hugeicons/core-free-icons';
import {ApiProblem, EMAIL, forgotPassword, logIn, mfaVerify, resendCode, resetPassword, signUp, verifyEmail, type AuthResult, type SessionUser} from '@/lib/session';
import {AppleMark, GoogleMark} from './SocialIcons';
import s from './Auth.module.css';

const RESEND_SECONDS = 30;

/** Six boxes backed by one hidden input, so paste and one-time-code autofill both work. */
function CodeBoxes({code, onChange, label}: {code: string; onChange: (value: string) => void; label: string}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return <div className={s.codeRow} onClick={() => ref.current?.focus()}>
    {Array.from({length: 6}, (_, i) => <span key={i} className={`${s.box} ${i === code.length ? s.boxOn : ''}`}>{code[i] ?? ''}</span>)}
    <input ref={ref} className={s.hidden} inputMode="numeric" autoComplete="one-time-code" maxLength={6} aria-label={label} value={code} onChange={e => onChange(e.target.value)} />
  </div>;
}
type Step = 'form' | 'verify' | 'mfa' | 'forgot' | 'reset' | 'done';

/**
 * Login and sign-up against the yizelearn API: email and password, an emailed 6-digit code to confirm a new email,
 * the authenticator code when two-step is on, and a password reset by emailed code.
 * `teach` is set by /signup?as=teach and only changes the copy.
 */
export function Auth({mode, teach}: {mode: 'login' | 'signup'; teach?: boolean}) {
  const router = useRouter();
  const signup = mode === 'signup';
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [challenge, setChallenge] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const [who, setWho] = useState<SessionUser | null>(null);

  const emailOk = EMAIL.test(email.trim());
  const emailError = touched && email.trim() && !emailOk ? 'Enter a full email address, like name@example.com' : '';
  const pwOk = password.length >= 8 && password.trim().toLowerCase() !== email.trim().toLowerCase();
  const ready = emailOk && (signup ? name.trim().length > 1 && pwOk && agree : password.length > 0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(w => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const go = (next: Step, resend = false) => {
    setStep(next); setError(''); setNotice(''); setCode(''); setFields({});
    if (resend) setWait(RESEND_SECONDS);
  };
  const run = async (job: () => Promise<void>) => {
    if (busy) return;
    setBusy(true); setError('');
    try { await job(); }
    catch (err) {
      const p = err as ApiProblem;
      setError(p.message ?? 'Something went wrong. Please try again.');
      setFields(p.fields ?? {});
      if (p.code === 'email_not_verified') { resendCode(email.trim()).catch(() => {}); go('verify', true); setError(p.message); }
      if (p.code === 'code_invalid' || p.code === 'mfa_code_invalid') setCode('');
    }
    finally { setBusy(false); }
  };
  const signedIn = (r: AuthResult) => {
    if (r.status === 'mfa_required') { setChallenge(r.challengeToken); go('mfa'); return; }
    if (r.user.landing === 'learner_home') { router.replace('/dashboard'); return; }
    setWho(r.user); go('done');
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!ready) return;
    run(async () => {
      if (signup) { await signUp({fullName: name.trim(), email: email.trim(), password}); go('verify', true); }
      else signedIn(await logIn(email.trim(), password));
    });
  };
  const confirm = (value: string) => run(async () => signedIn(await verifyEmail(email.trim(), value)));
  const mfa = (value: string) => run(async () => signedIn(await mfaVerify(challenge, value)));
  const resend = () => run(async () => { await resendCode(email.trim()); setWait(RESEND_SECONDS); setNotice('We sent a new code.'); });
  const sendReset = (e?: React.FormEvent) => {
    e?.preventDefault(); setTouched(true);
    if (!emailOk) return;
    run(async () => { await forgotPassword(email.trim()); go('reset', true); setNotice('If that email has an account, we sent a code to it.'); });
  };
  const finishReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6 || newPassword.length < 8) return;
    run(async () => { await resetPassword(email.trim(), code, newPassword); setPassword(''); setNewPassword(''); go('form'); setNotice('Password changed. Log in with your new password.'); });
  };

  const social = (p: string) => setNotice(`${p} sign-in is not connected yet. Use your email for now.`);
  const digits = (v: string, after: (d: string) => void) => { const d = v.replace(/\D/g, '').slice(0, 6); setCode(d); if (d.length === 6) after(d); };
  return <main className={s.page}>
    <Link href="/" className={s.back} aria-label="Back to home"><HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} /></Link>
    <div className={s.card} key={step}>
      <Link href="/" className={s.logo}><Logo alt="yizelearn" width={132} height={41} priority /></Link>

      {step === 'form' && <form onSubmit={submit} noValidate>
        <h1>{signup ? (teach ? 'Create your instructor account' : 'Create your account') : 'Welcome back'}</h1>
        <p className={s.sub}>{signup ? (teach ? 'Start teaching what you know' : 'Short courses that fit around your day') : 'Log in to keep learning'}</p>
        {error && <p className={s.error} role="alert">{error}</p>}
        {notice && <p className={s.notice} role="status">{notice}</p>}
        {signup && <div className={s.field}><label htmlFor="name">Full name</label><input id="name" autoComplete="name" autoFocus placeholder="Your full name" value={name} className={fields.fullName ? s.bad : undefined} onChange={e => setName(e.target.value)} />{fields.fullName && <p className={s.fieldError}>{fields.fullName}</p>}</div>}
        <div className={s.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" autoFocus={!signup} placeholder="name@example.com" value={email} className={emailError || fields.email ? s.bad : undefined}
            onChange={e => { setEmail(e.target.value); setError(''); }} onBlur={() => setTouched(true)} aria-invalid={!!emailError} aria-describedby={emailError ? 'email-err' : undefined} />
          {(emailError || fields.email) && <p id="email-err" className={s.fieldError}>{emailError || fields.email}</p>}
        </div>
        <div className={s.field}>
          <label htmlFor="password">Password</label>
          <div className={s.pw}>
            <input id="password" type={show ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'At least 8 characters' : 'Your password'} value={password} className={fields.password ? s.bad : undefined} onChange={e => { setPassword(e.target.value); setError(''); }} />
            <button type="button" className={s.eye} onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}><HugeiconsIcon icon={show ? ViewOffSlashIcon : ViewIcon} size={20} /></button>
          </div>
          {fields.password && <p className={s.fieldError}>{fields.password}</p>}
          {signup && password && !pwOk && <p className={s.fieldError}>Use at least 8 characters, and not your email address.</p>}
        </div>
        {signup && <label className={s.terms}><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /><span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</span></label>}
        <button className={s.primary} disabled={!ready || busy}>{busy ? <span className={s.spin} aria-label="Please wait" /> : signup ? 'Create account' : 'Log in'}</button>
        {!signup && <p className={s.forgot}><button type="button" className={s.link} onClick={() => go('forgot')}>Forgot password?</button></p>}

        <div className={s.divider}><span>{signup ? 'or sign up with' : 'or continue with'}</span></div>
        <div className={s.social}>
          <button type="button" onClick={() => social('Google')}><GoogleMark />Google</button>
          <button type="button" onClick={() => social('Apple')}><AppleMark />Apple</button>
        </div>
        <p className={s.foot}>{signup ? <>Already have an account? <Link href="/login">Log in</Link></> : <>New here? <Link href="/signup">Create an account</Link></>}</p>
      </form>}

      {step === 'verify' && <div>
        <h1>Check your email</h1>
        <p className={s.sub}>We sent a 6-digit code to<br /><b>{email}</b></p>
        {error && <p className={s.error} role="alert">{error}</p>}
        {notice && <p className={s.notice} role="status">{notice}</p>}
        <CodeBoxes code={code} label="6-digit code from your email" onChange={v => digits(v, confirm)} />
        <button className={s.primary} disabled={code.length !== 6 || busy} onClick={() => confirm(code)}>{busy ? <span className={s.spin} aria-label="Checking" /> : 'Confirm email'}</button>
        <div className={s.row}>
          <button type="button" className={s.link} onClick={() => go('form')}>Use another email</button>
          <button type="button" className={s.link} disabled={wait > 0 || busy} onClick={resend}>{wait > 0 ? `Resend in ${wait}s` : 'Resend code'}</button>
        </div>
      </div>}

      {step === 'mfa' && <div>
        <h1>Two-step check</h1>
        <p className={s.sub}>Open your authenticator app and enter the 6-digit code.</p>
        {error && <p className={s.error} role="alert">{error}</p>}
        <CodeBoxes code={code} label="6-digit authenticator code" onChange={v => digits(v, mfa)} />
        <button className={s.primary} disabled={code.length !== 6 || busy} onClick={() => mfa(code)}>{busy ? <span className={s.spin} aria-label="Checking" /> : 'Verify'}</button>
        <div className={s.row}><button type="button" className={s.link} onClick={() => go('form')}>Back to log in</button></div>
      </div>}

      {step === 'forgot' && <form onSubmit={sendReset} noValidate>
        <h1>Reset your password</h1>
        <p className={s.sub}>Enter your email and we will send you a code.</p>
        {error && <p className={s.error} role="alert">{error}</p>}
        <div className={s.field}><label htmlFor="femail">Email</label><input id="femail" type="email" autoComplete="email" autoFocus placeholder="name@example.com" value={email} className={emailError ? s.bad : undefined} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)} />{emailError && <p className={s.fieldError}>{emailError}</p>}</div>
        <button className={s.primary} disabled={!emailOk || busy}>{busy ? <span className={s.spin} aria-label="Sending" /> : 'Send code'}</button>
        <div className={s.row}><button type="button" className={s.link} onClick={() => go('form')}>Back to log in</button></div>
      </form>}

      {step === 'reset' && <form onSubmit={finishReset} noValidate>
        <h1>Choose a new password</h1>
        <p className={s.sub}>Enter the code we sent to<br /><b>{email}</b></p>
        {notice && <p className={s.notice} role="status">{notice}</p>}
        {error && <p className={s.error} role="alert">{error}</p>}
        <CodeBoxes code={code} label="6-digit code from your email" onChange={v => digits(v, () => {})} />
        <div className={s.field}><label htmlFor="npw">New password</label>
          <div className={s.pw}><input id="npw" type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button type="button" className={s.eye} onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}><HugeiconsIcon icon={show ? ViewOffSlashIcon : ViewIcon} size={20} /></button></div></div>
        <button className={s.primary} disabled={code.length !== 6 || newPassword.length < 8 || busy}>{busy ? <span className={s.spin} aria-label="Saving" /> : 'Change password'}</button>
        <div className={s.row}>
          <button type="button" className={s.link} onClick={() => go('form')}>Back to log in</button>
          <button type="button" className={s.link} disabled={wait > 0 || busy} onClick={() => run(async () => { await forgotPassword(email.trim()); setWait(RESEND_SECONDS); setNotice('We sent a new code.'); })}>{wait > 0 ? `Resend in ${wait}s` : 'Resend code'}</button>
        </div>
      </form>}

      {step === 'done' && <div className={s.done}>
        <span className={s.check}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={34} /></span>
        <h1>You&apos;re signed in{who ? `, ${who.fullName.split(' ')[0]}` : ''}</h1>
        <p className={s.sub}>{who?.role === 'admin' || who?.role === 'manager' ? 'Admin tools are in the yizelearn admin app.' : 'Your instructor tools are in the yizelearn instructor app.'}</p>
        <Link href="/" className={s.primary}>Back to home</Link>
      </div>}
    </div>
  </main>;
}

/** The sign-up page reads ?as=teach in the browser, so the page itself can still be built ahead of time. */
export function SignupFromUrl() {
  return <Auth mode="signup" teach={useSearchParams().get('as') === 'teach'} />;
}
