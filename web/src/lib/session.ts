'use client';

import {useSyncExternalStore} from 'react';

// Talks to the yizelearn auth API through the same-origin /yz proxy and keeps the signed-in session in this browser.
// The session is strictly necessary for being signed in, so it is stored without asking for cookie consent.
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type SessionUser = {id: string; fullName: string; email: string; role: 'learner' | 'instructor' | 'manager' | 'admin'; avatarUrl: string | null; landing: string; emailVerified: boolean};
export type Session = {accessToken: string; refreshToken: string; expiresAt: number; user: SessionUser};
type Tokens = {accessToken: string; refreshToken: string; expiresIn: number; user: SessionUser};
export type AuthResult = {status: 'authenticated'; user: SessionUser} | {status: 'mfa_required'; challengeToken: string};

/** An API error with a message safe to show to the visitor, the stable code, and per-field messages. */
export class ApiProblem extends Error {
  constructor(public status: number, public code: string, message: string, public fields: Record<string, string> = {}) { super(message); }
}

const FRIENDLY: Record<string, string> = {
  invalid_credentials: 'That email and password do not match.',
  email_not_verified: 'Please confirm your email first. We can send the code again.',
  account_suspended: 'This account has been suspended. Contact support for help.',
  account_locked: 'Too many wrong attempts. Wait a few minutes and try again.',
  email_taken: 'An account with this email already exists. Log in instead.',
  code_invalid: 'That code is not right. Check it and try again.',
  link_expired: 'That code has expired. Ask for a new one.',
  weak_password: 'Choose a stronger password with at least 8 characters.',
  mfa_code_invalid: 'That code is not right. Check your authenticator app.',
  mfa_challenge_expired: 'That took too long. Log in again.',
  validation_failed: 'Please check the highlighted details and try again.',
};

async function call<T>(path: string, init: {method?: string; body?: unknown; token?: string; idempotent?: boolean} = {}): Promise<T> {
  const headers: Record<string, string> = {Accept: 'application/json'};
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (init.token) headers.Authorization = `Bearer ${init.token}`;
  if (init.idempotent) headers['Idempotency-Key'] = crypto.randomUUID();
  let res: Response;
  try { res = await fetch(`/yz${path}`, {method: init.method ?? 'POST', headers, body: init.body !== undefined ? JSON.stringify(init.body) : undefined}); }
  catch { throw new ApiProblem(0, 'network', 'We could not reach yizelearn. Check your connection and try again.'); }
  const json = res.headers.get('content-type')?.includes('json') ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const p = json as {code?: string; title?: string; errors?: {field: string; message: string}[]};
    const fields = Object.fromEntries((p.errors ?? []).map(e => [e.field, e.message]));
    const message = FRIENDLY[p.code ?? ''] ?? (res.status === 429 ? 'Too many tries. Wait a minute and try again.' : 'Something went wrong. Please try again.');
    throw new ApiProblem(res.status, p.code ?? 'error', message, fields);
  }
  return json as T;
}

// ---- the stored session
const KEY = 'yz-session';
const listeners = new Set<() => void>();
let snap: Session | null = null;
let lastRaw: string | null = null;

function read(): Session | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { /* storage blocked: keep the in-memory session */ return snap; }
  if (raw !== lastRaw) { lastRaw = raw; try { snap = raw ? (JSON.parse(raw) as Session) : null; } catch { snap = null; } }
  return snap;
}
const subscribe = (fn: () => void) => { listeners.add(fn); window.addEventListener('storage', fn); return () => { listeners.delete(fn); window.removeEventListener('storage', fn); }; };
function write(s: Session | null) {
  snap = s; lastRaw = s ? JSON.stringify(s) : null;
  try { if (s) localStorage.setItem(KEY, lastRaw!); else localStorage.removeItem(KEY); } catch { /* this visit only */ }
  listeners.forEach(fn => fn());
}
export const useSession = () => useSyncExternalStore(subscribe, read, () => null);

const keep = (t: Tokens): SessionUser => {
  write({accessToken: t.accessToken, refreshToken: t.refreshToken, expiresAt: Date.now() + t.expiresIn * 1000, user: t.user});
  return t.user;
};
const finish = (r: {status: string; tokens?: Tokens; mfa?: {challengeToken: string}}): AuthResult =>
  r.status === 'mfa_required' && r.mfa ? {status: 'mfa_required', challengeToken: r.mfa.challengeToken} : {status: 'authenticated', user: keep(r.tokens!)};

// ---- calls
let termsVersion: string | null = null;
async function currentTermsVersion() {
  if (termsVersion) return termsVersion;
  try { termsVersion = (await call<{termsVersion: string}>('/config', {method: 'GET'})).termsVersion; } catch { termsVersion = '1.0'; }
  return termsVersion;
}

export async function signUp(v: {fullName: string; email: string; password: string}) {
  return call<{userId: string; emailVerificationRequired: boolean; sentTo: string; resendAvailableAt: string}>('/auth/signup', {
    body: {...v, termsAccepted: true, termsVersion: await currentTermsVersion(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, locale: navigator.language.match(/^[a-z]{2}(-[A-Z]{2})?$/) ? navigator.language : 'en'},
    idempotent: true,
  });
}
export const logIn = async (email: string, password: string) => finish(await call('/auth/login', {body: {email, password, deviceName: 'Web browser', platform: 'web'}}));
export const verifyEmail = async (email: string, code: string) => finish(await call('/auth/verify-email', {body: {email, code}}));
export const mfaVerify = async (challengeToken: string, code: string) => finish(await call('/auth/mfa/verify', {body: {challengeToken, code}}));
export const resendCode = (email: string) => call<void>('/auth/verify-email/resend', {body: {email}});
export const forgotPassword = (email: string) => call<void>('/auth/password/forgot', {body: {email}});
export const resetPassword = (email: string, code: string, newPassword: string) => call<void>('/auth/password/reset', {body: {email, code, newPassword}});

export async function logOut() {
  const s = read();
  write(null);
  if (s) { try { await call<void>('/auth/logout', {token: s.accessToken, body: {refreshToken: s.refreshToken}}); } catch { /* already signed out here */ } }
}
