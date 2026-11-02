// Sign-in on the web uses the same flow as the app: enter an email, get a 6-digit code, enter it. No passwords.
// With NEXT_PUBLIC_API_URL set it talks to the yizelearn API. Without it, `next dev` skips the server (any 6 digits work),
// and a production build refuses to sign anyone in rather than pretend.
const API = process.env.NEXT_PUBLIC_API_URL;
const MOCK = !API && process.env.NODE_ENV !== 'production';

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!API) throw new Error('Sign-in is not available on the web yet. Please use the yizelearn app.');
  const res = await fetch(`${API}${path}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Something went wrong. Try again.');
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function requestCode(email: string, name?: string) {
  if (MOCK) return;
  await post<void>('/auth/code/request', {email, name});
}

export async function verifyCode(email: string, code: string) {
  if (MOCK) return {name: email.split('@')[0]};
  const res = await post<{token: string; user: {name: string}}>('/auth/code/verify', {email, code});
  return {name: res.user.name};
}
