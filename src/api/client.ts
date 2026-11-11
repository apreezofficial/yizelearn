import {session} from './session';

// The yizelearn backend (contract: https://16-170-53-222.sslip.io/docs). All routes live under /v1.
export const API_BASE_URL = 'https://16-170-53-222.sslip.io/v1';

type FieldError = {field: string; code: string; message: string};
type Problem = {code?: string; title?: string; detail?: string; requestId?: string; errors?: FieldError[]};

// Plain-language messages for the error codes a learner can run into.
const FRIENDLY: Record<string, string> = {
  invalid_credentials: 'That email and password do not match.',
  email_not_verified: 'Please confirm your email first.',
  account_suspended: 'This account has been suspended. Contact support for help.',
  account_locked: 'Too many wrong attempts. Wait a few minutes and try again.',
  email_taken: 'An account with this email already exists. Log in instead.',
  code_invalid: 'That code is not right. Check it and try again.',
  link_expired: 'That code has expired. Ask for a new one.',
  weak_password: 'Choose a stronger password with at least 8 characters.',
  mfa_code_invalid: 'That code is not right. Check your authenticator app.',
  mfa_challenge_expired: 'That took too long. Log in again.',
  validation_failed: 'Please check the details and try again.',
  already_enrolled: 'You are already enrolled in this course.',
  course_unavailable: 'This course is not available right now.',
  session_expired: 'Your session ended. Log in again.',
  rate_limited: 'Too many tries. Wait a minute and try again.',
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string[]>;
  requestId?: string;
  constructor(message: string, status: number, problem?: Problem) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = problem?.code;
    this.requestId = problem?.requestId;
    if (problem?.errors?.length) {
      this.details = {};
      for (const e of problem.errors) (this.details[e.field] ??= []).push(e.message);
    }
  }
}

/** A key the server uses to ignore a repeated request (signup, orders and other writes that create things). */
export const idempotencyKey = () => `yz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}${Math.random().toString(36).slice(2, 8)}`;

export type RequestOptions = Omit<RequestInit, 'body'> & {body?: unknown; idempotent?: boolean; timeoutMs?: number; anonymous?: boolean};

async function send(path: string, options: RequestOptions, accessToken: string | null) {
  const {body: payload, idempotent, timeoutMs = 20000, anonymous, ...init} = options;
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (payload !== undefined) headers.set('Content-Type', 'application/json');
  if (idempotent && !headers.has('Idempotency-Key')) headers.set('Idempotency-Key', idempotencyKey());
  if (accessToken && !anonymous) headers.set('Authorization', `Bearer ${accessToken}`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${API_BASE_URL}${path}`, {...init, headers, body: payload === undefined ? undefined : JSON.stringify(payload), signal: controller.signal});
  } catch {
    throw new ApiError('Can\'t reach yizelearn right now. Check your connection and try again.', 0, {code: 'network'});
  } finally { clearTimeout(timer); }
}

// One refresh at a time: when several requests find the token expired together, they share the same refresh call.
let refreshing: Promise<boolean> | null = null;
function refresh(): Promise<boolean> {
  refreshing ??= (async () => {
    const current = session.get();
    if (!current) return false;
    try {
      const res = await send('/auth/refresh', {method: 'POST', body: {refreshToken: current.refreshToken}, anonymous: true}, null);
      if (!res.ok) { await session.clear(); return false; }
      await session.set(await res.json());
      return true;
    } catch { return false; } // offline: keep the session and try again next time
  })().finally(() => { refreshing = null; });
  return refreshing;
}

/** Calls the API. Adds the sign-in token, renews it when it has expired, and turns problem answers into ApiError. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let tokens = session.get();
  // Renew a token that is about to expire before using it.
  if (tokens && !options.anonymous && tokens.expiresAt - Date.now() < 30000 && !path.startsWith('/auth/')) { await refresh(); tokens = session.get(); }
  let response = await send(path, options, tokens?.accessToken ?? null);
  if (response.status === 401 && tokens && !options.anonymous && !path.startsWith('/auth/') && (await refresh())) {
    response = await send(path, options, session.get()?.accessToken ?? null);
  }
  const raw = await response.text();
  let body: unknown;
  try { body = raw ? JSON.parse(raw) : undefined; } catch { body = undefined; }
  if (!response.ok) {
    const problem = (body && typeof body === 'object' ? body : {}) as Problem;
    const message = FRIENDLY[problem.code ?? ''] ?? (response.status === 429 ? FRIENDLY.rate_limited : problem.detail || problem.title || `Request failed (${response.status})`);
    throw new ApiError(message, response.status, problem);
  }
  return body as T;
}
