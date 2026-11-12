import {ApiError, request} from '../src/api/client';
import {authApi, cartApi, catalogApi} from '../src/api/endpoints';
import {breakdown, naira, toCart, toCourse, toModules, toUser} from '../src/api/mappers';
import type {ApiCourseCard, ApiCurriculum} from '../src/api/contract';
import {session} from '../src/api/session';

type Reply = {status?: number; body?: unknown};
const calls: {url: string; init: RequestInit & {headers: Headers}}[] = [];
let replies: Reply[] = [];

beforeEach(async () => {
  calls.length = 0;
  replies = [];
  await session.clear();
  (globalThis as unknown as {fetch: unknown}).fetch = jest.fn(async (url: string, init: RequestInit & {headers: Headers}) => {
    calls.push({url, init});
    const r = replies.shift() ?? {status: 200, body: {}};
    const status = r.status ?? 200;
    return {ok: status < 400, status, text: async () => (r.body === undefined ? '' : JSON.stringify(r.body)), json: async () => r.body};
  });
});

const card = (over: Partial<ApiCourseCard> = {}): ApiCourseCard => ({
  id: '00000000-0000-4000-8000-000000000011', title: 'Python for everyday work', subtitle: 'Learn it by doing', instructor: {id: 'i1', fullName: 'Ngozi Adeyemi', initials: 'NA', avatarUrl: null},
  ratingAvg: 4.7, ratingCount: 312, price: {amountMinor: 1500000, currency: 'NGN'}, listPrice: {amountMinor: 2200000, currency: 'NGN'}, thumbnailUrl: null, level: 'beginner',
  category: {id: 'c1', slug: 'programming', name: 'Programming'}, durationMin: 380, lessonCount: 9, ...over,
});

describe('request', () => {
  test('sends the token, and an idempotency key when asked', async () => {
    await session.set({accessToken: 'at-1', refreshToken: 'rt-1', expiresIn: 900});
    await request('/me/cart/items', {method: 'POST', idempotent: true, body: {courseId: 'x'}});
    const {init} = calls[0];
    expect(init.headers.get('Authorization')).toBe('Bearer at-1');
    expect(init.headers.get('Idempotency-Key')).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
    expect(init.headers.get('Content-Type')).toBe('application/json');
  });

  test('anonymous calls carry no token', async () => {
    await session.set({accessToken: 'at-1', refreshToken: 'rt-1', expiresIn: 900});
    await request('/auth/login', {method: 'POST', anonymous: true, body: {}});
    expect(calls[0].init.headers.get('Authorization')).toBeNull();
  });

  test('turns problem answers into friendly ApiErrors with field details', async () => {
    replies = [{status: 401, body: {code: 'invalid_credentials', title: 'Invalid credentials'}}];
    await expect(request('/auth/login', {method: 'POST', anonymous: true, body: {}})).rejects.toMatchObject({status: 401, code: 'invalid_credentials', message: 'That email and password do not match.'});
    replies = [{status: 422, body: {code: 'validation_failed', errors: [{field: 'email', code: 'invalid_email', message: 'bad email'}, {field: 'password', code: 'too_short', message: 'too short'}]}}];
    const err = (await request('/auth/signup', {method: 'POST', anonymous: true, body: {}}).catch(e => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.details).toEqual({email: ['bad email'], password: ['too short']});
  });

  test('a network failure becomes a clear error', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    await expect(request('/courses')).rejects.toMatchObject({status: 0, code: 'network'});
  });

  test('an expired token is renewed once and the call is retried', async () => {
    await session.set({accessToken: 'old', refreshToken: 'rt-1', expiresIn: 900});
    replies = [
      {status: 401, body: {code: 'unauthorized'}},
      {status: 200, body: {accessToken: 'new', idToken: 'id', refreshToken: 'rt-2', tokenType: 'Bearer', expiresIn: 900}},
      {status: 200, body: {ok: true}},
    ];
    await expect(request('/me')).resolves.toEqual({ok: true});
    expect(calls.map(c => c.url.replace(/^.*\/v1/, ''))).toEqual(['/me', '/auth/refresh', '/me']);
    expect(calls[2].init.headers.get('Authorization')).toBe('Bearer new');
    expect(session.get()?.refreshToken).toBe('rt-2');
  });

  test('when renewing fails, the session is cleared', async () => {
    await session.set({accessToken: 'old', refreshToken: 'rt-1', expiresIn: 900});
    const seen: boolean[] = [];
    const off = session.subscribe(v => seen.push(v));
    replies = [{status: 401, body: {code: 'unauthorized'}}, {status: 401, body: {code: 'session_expired'}}];
    await expect(request('/me')).rejects.toMatchObject({status: 401});
    off();
    expect(session.isSignedIn()).toBe(false);
    expect(seen).toContain(false);
  });
});

describe('auth', () => {
  const tokens = {accessToken: 'at', idToken: 'id', refreshToken: 'rt', tokenType: 'Bearer', expiresIn: 900, user: {id: 'u1', fullName: 'Chika Obi', email: 'chika@example.com', role: 'learner', avatarUrl: null, emailVerified: true, landing: 'learner_home'}};

  test('logging in stores the session and maps the user', async () => {
    replies = [{body: {status: 'authenticated', tokens}}];
    const result = await authApi.logIn('chika@example.com', 'secret-pass-1');
    expect(result).toEqual({status: 'signed-in', user: {id: 'u1', name: 'Chika Obi', email: 'chika@example.com', role: 'student', avatarUrl: undefined}});
    expect(session.get()?.accessToken).toBe('at');
    expect(JSON.parse(calls[0].init.body as string)).toMatchObject({email: 'chika@example.com', password: 'secret-pass-1', platform: 'ios'});
  });

  test('two-step accounts get a challenge instead of tokens', async () => {
    replies = [{body: {status: 'mfa_required', mfa: {challengeToken: 'ch-1', method: 'totp', expiresInSeconds: 300}}}];
    expect(await authApi.logIn('a@b.co', 'pw')).toEqual({status: 'two-step', challengeToken: 'ch-1'});
    expect(session.isSignedIn()).toBe(false);
  });

  test('sign up sends the terms and an idempotency key', async () => {
    replies = [{status: 201, body: {userId: 'u1', emailVerificationRequired: true, sentTo: 'a@b.co', resendAvailableAt: ''}}];
    await authApi.signUp({fullName: 'Chika Obi', email: 'a@b.co', password: 'secret-pass-1'});
    expect(calls[0].init.headers.get('Idempotency-Key')).toBeTruthy();
    expect(JSON.parse(calls[0].init.body as string)).toMatchObject({termsAccepted: true, fullName: 'Chika Obi'});
  });

  test('logging out clears the session even when the call fails', async () => {
    await session.set({accessToken: 'at', refreshToken: 'rt', expiresIn: 900});
    replies = [{status: 500, body: {}}];
    await authApi.logout();
    expect(session.isSignedIn()).toBe(false);
  });

  test('instructor and admin roles map to the app roles', () => {
    expect(toUser({...tokens.user, role: 'instructor'} as never).role).toBe('instructor');
    expect(toUser({...tokens.user, role: 'admin'} as never).role).toBe('administrator');
  });
});

describe('catalogue and cart', () => {
  test('course queries are built from the filters', async () => {
    replies = [{body: {data: [], page: {nextCursor: null, hasMore: false}}}];
    await catalogApi.courses({q: 'sql', level: 'beginner', ratingMin: 4, sort: 'rating'});
    expect(calls[0].url).toContain('/courses?limit=50&q=sql&level=beginner&ratingMin=4&sort=rating');
  });

  test('prices convert from kobo to whole naira', () => {
    expect(naira({amountMinor: 1500000, currency: 'NGN'})).toBe(15000);
    expect(naira(null)).toBe(0);
  });

  test('an API course becomes a screen course', () => {
    expect(toCourse(card())).toMatchObject({id: '00000000-0000-4000-8000-000000000011', title: 'Python for everyday work', summary: 'Learn it by doing', status: 'published', lessonsCount: 9, price: 15000, instructorName: 'Ngozi Adeyemi', category: 'Programming', level: 'Beginner', rating: 4.7, ratingsCount: 312, durationMinutes: 380});
    expect(toCourse(card({availability: 'unpublished', ratingAvg: null})).status).toBe('draft');
  });

  test('a curriculum becomes modules with lessons', () => {
    const curriculum: ApiCurriculum = {courseId: 'c', moduleCount: 1, lessonCount: 2, durationMin: 20, modules: [{id: 'm1', position: 1, title: 'Getting started', lessonCount: 2, lessons: [
      {id: 'l1', position: 1, title: 'Welcome', type: 'video', durationMin: 4, questionCount: null, isPreview: true, locked: false},
      {id: 'l2', position: 2, title: 'Quiz', type: 'quiz', durationMin: null, questionCount: 6, isPreview: false, locked: true},
    ]}]};
    expect(toModules(curriculum)).toEqual([{id: 'm1', title: 'Getting started', lessons: [
      {id: 'l1', title: 'Welcome', type: 'video', durationMinutes: 4, preview: true, questionsCount: undefined, completed: false},
      {id: 'l2', title: 'Quiz', type: 'quiz', durationMinutes: undefined, preview: false, questionsCount: 6, completed: false},
    ]}]);
  });

  test('rating breakdown is a share per star, 5 to 1', () => {
    expect(breakdown({5: 50, 4: 30, 3: 10, 2: 5, 1: 5}, 100)).toEqual([0.5, 0.3, 0.1, 0.05, 0.05]);
    expect(breakdown({}, 0)).toEqual([0, 0, 0, 0, 0]);
  });

  test('the server cart maps to the cart screen, with a valid promo only', async () => {
    const money = (n: number) => ({amountMinor: n, currency: 'NGN'});
    const line = {course: card(), price: money(1500000), listPrice: null, addedAt: '', available: true};
    const cart = {id: 'c', items: [line], savedForLater: [], promo: {code: 'WELCOME10', percent: 10, valid: true, discount: money(150000)}, subtotal: money(1500000), discount: money(150000), total: money(1350000), itemCount: 1};
    expect(toCart(cart)).toMatchObject({promo: 'WELCOME10', subtotal: 15000, discount: 1500, total: 13500});
    expect(toCart({...cart, promo: {...cart.promo, valid: false}}).promo).toBeUndefined();
    replies = [{body: cart}];
    await cartApi.applyPromo('WELCOME10');
    expect(JSON.parse(calls[0].init.body as string)).toEqual({code: 'WELCOME10'});
  });
});
