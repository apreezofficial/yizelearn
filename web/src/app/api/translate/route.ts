import {NextResponse} from 'next/server';
import {translatable} from '@/lib/languages';

// Translates short page strings with the Google Cloud Translation API (v2). The API key stays on the server:
// set GOOGLE_TRANSLATE_API_KEY in the environment and restrict that key to the Cloud Translation API in Google Cloud.
const ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';
const MAX_STRINGS = 128, MAX_CHARS = 20000, MAX_EACH = 1200;

// Results are cached in memory so the same sentence is only paid for once per server instance.
const cache = new Map<string, string>();
const CACHE_LIMIT = 30000;

// A small per-address limit, so one visitor cannot run up the Google bill.
const hits = new Map<string, {n: number; reset: number}>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, {n: 1, reset: now + 60_000}); return false; }
  h.n += 1;
  return h.n > 90;
}

export async function POST(req: Request) {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) return NextResponse.json({error: 'not_configured'}, {status: 503});

  let body: {target?: unknown; q?: unknown};
  try { body = await req.json(); } catch { return NextResponse.json({error: 'bad_request'}, {status: 400}); }
  const target = typeof body.target === 'string' ? body.target : '';
  const q = Array.isArray(body.q) ? body.q : [];
  if (!translatable.has(target) || !q.length || q.length > MAX_STRINGS || !q.every(x => typeof x === 'string' && x.length <= MAX_EACH)
    || q.reduce((n: number, x: string) => n + x.length, 0) > MAX_CHARS) return NextResponse.json({error: 'bad_request'}, {status: 400});
  const strings = q as string[];

  const ip = (req.headers.get('x-forwarded-for') ?? 'local').split(',')[0].trim();
  if (limited(ip)) return NextResponse.json({error: 'rate_limited'}, {status: 429});

  const out: string[] = new Array(strings.length);
  const missing: number[] = [];
  strings.forEach((text, i) => { const hit = cache.get(`${target}\u0000${text}`); if (hit !== undefined) out[i] = hit; else missing.push(i); });

  if (missing.length) {
    let res: Response;
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-goog-api-key': key},
        body: JSON.stringify({q: missing.map(i => strings[i]), source: 'en', target, format: 'text'}),
      });
    } catch { return NextResponse.json({error: 'upstream_unreachable'}, {status: 502}); }
    if (!res.ok) return NextResponse.json({error: 'upstream_error'}, {status: 502});
    const data = (await res.json()) as {data?: {translations?: {translatedText?: string}[]}};
    const list = data.data?.translations ?? [];
    if (list.length !== missing.length) return NextResponse.json({error: 'upstream_error'}, {status: 502});
    if (cache.size > CACHE_LIMIT) cache.clear();
    missing.forEach((idx, j) => { const text = list[j].translatedText ?? strings[idx]; out[idx] = text; cache.set(`${target}\u0000${strings[idx]}`, text); });
  }
  return NextResponse.json({t: out});
}
