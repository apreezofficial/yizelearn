import {ApiError, request} from './client';
import type {ApiAuthResult, ApiCart, ApiCategory, ApiCourseCard, ApiCourseDetail, ApiCurriculum, ApiEnrollment, ApiHomeFeed, ApiReviews, ApiTokens, Page} from './contract';
import {session} from './session';
import {toUser} from './mappers';
import type {AssignmentSubmission, Course, DashboardSummary, Lesson, Module, Paginated, Payment, User} from './types';

const qs = (params: Record<string, string | number | boolean | undefined>) => {
  const parts = Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

// ---------------------------------------------------------------------------------------------------------------
// Account: email and password, an emailed 6-digit code to confirm a new email, two-step when it is on.
export type SignInResult = {status: 'signed-in'; user: User} | {status: 'two-step'; challengeToken: string};

async function finishAuth(result: ApiAuthResult): Promise<SignInResult> {
  if (result.status === 'mfa_required') return {status: 'two-step', challengeToken: result.mfa.challengeToken};
  await session.set(result.tokens);
  return {status: 'signed-in', user: toUser(result.tokens.user)};
}

export const authApi = {
  signUp: (v: {fullName: string; email: string; password: string; termsVersion?: string}) => request<{userId: string; emailVerificationRequired: boolean; sentTo: string; resendAvailableAt: string}>('/auth/signup', {
    method: 'POST', idempotent: true, anonymous: true,
    body: {fullName: v.fullName, email: v.email, password: v.password, termsAccepted: true, termsVersion: v.termsVersion ?? '1.0', locale: 'en'},
  }),
  logIn: async (email: string, password: string) => finishAuth(await request<ApiAuthResult>('/auth/login', {method: 'POST', anonymous: true, body: {email, password, deviceName: 'yizelearn app', platform: 'ios'}})),
  verifyEmail: async (email: string, code: string) => finishAuth(await request<ApiAuthResult>('/auth/verify-email', {method: 'POST', anonymous: true, body: {email, code}})),
  mfaVerify: async (challengeToken: string, code: string) => finishAuth(await request<ApiAuthResult>('/auth/mfa/verify', {method: 'POST', anonymous: true, body: {challengeToken, code}})),
  resendCode: (email: string) => request<void>('/auth/verify-email/resend', {method: 'POST', anonymous: true, body: {email}}),
  forgotPassword: (email: string) => request<void>('/auth/password/forgot', {method: 'POST', anonymous: true, body: {email}}),
  resetPassword: (email: string, code: string, newPassword: string) => request<void>('/auth/password/reset', {method: 'POST', anonymous: true, body: {email, code, newPassword}}),
  ssoDiscover: (email: string) => request<{available: boolean; connectionId?: string | null; name?: string | null; protocol?: string | null}>('/auth/sso/discover', {method: 'POST', anonymous: true, body: {email}}),
  me: async (): Promise<User> => {
    const m = await request<{id: string; fullName: string; email: string; role: 'learner' | 'instructor' | 'manager' | 'admin'; avatarUrl: string | null; emailVerified: boolean; landing?: string}>('/me');
    return toUser({...m, landing: m.landing ?? 'learner_home'});
  },
  logout: async () => {
    const tokens = session.get();
    try { if (tokens) await request<void>('/auth/logout', {method: 'POST', body: {refreshToken: tokens.refreshToken}}); } catch { /* signed out here either way */ }
    await session.clear();
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Catalogue (public: works signed out)
export type CourseQuery = {q?: string; category?: string; level?: string; ratingMin?: number; priceMin?: number; priceMax?: number; freeOnly?: boolean; sort?: 'popular' | 'newest' | 'rating' | 'price_asc' | 'price_desc'; limit?: number; cursor?: string};

export const catalogApi = {
  categories: () => request<Page<ApiCategory>>(`/categories${qs({limit: 100})}`, {anonymous: !session.isSignedIn()}),
  courses: (query: CourseQuery = {}) => request<Page<ApiCourseCard>>(`/courses${qs({limit: 50, ...query})}`),
  suggestions: (q: string) => request<Page<{text: string; kind: 'query' | 'course' | 'category'; id?: string}>>(`/courses/suggestions${qs({q, limit: 6})}`),
  course: (id: string) => request<ApiCourseDetail>(`/courses/${id}`),
  curriculum: (id: string) => request<ApiCurriculum>(`/courses/${id}/curriculum`),
  reviews: (id: string, limit = 10) => request<ApiReviews>(`/courses/${id}/reviews${qs({limit})}`),
  similar: (id: string) => request<Page<ApiCourseCard>>(`/courses/${id}/similar${qs({limit: 6})}`),
};

// ---------------------------------------------------------------------------------------------------------------
// Saved courses and the cart live on the server once you are signed in.
export const wishlistApi = {
  list: () => request<Page<ApiCourseCard>>(`/me/wishlist${qs({limit: 100})}`),
  add: (courseId: string) => request<void>(`/me/wishlist/${courseId}`, {method: 'PUT'}),
  remove: (courseId: string) => request<void>(`/me/wishlist/${courseId}`, {method: 'DELETE'}),
};

export const cartApi = {
  get: () => request<ApiCart>('/me/cart'),
  add: (courseId: string) => request<ApiCart>('/me/cart/items', {method: 'POST', body: {courseId}}),
  remove: (courseId: string) => request<ApiCart>(`/me/cart/items/${courseId}`, {method: 'DELETE'}),
  saveForLater: (courseId: string) => request<ApiCart>(`/me/cart/items/${courseId}/save-for-later`, {method: 'POST'}),
  moveToCart: (courseId: string) => request<ApiCart>(`/me/cart/saved/${courseId}/move-to-cart`, {method: 'POST'}),
  applyPromo: (code: string) => request<ApiCart>('/me/cart/promo', {method: 'POST', body: {code}}),
  removePromo: () => request<ApiCart>('/me/cart/promo', {method: 'DELETE'}),
  /** After signing in, fold the cart you built as a guest into your account. */
  merge: (courseIds: string[], savedCourseIds: string[] = [], promoCode?: string) => request<ApiCart>('/me/cart/merge', {method: 'POST', body: {courseIds, savedCourseIds, promoCode}}),
  /** Price a guest cart on the server (no account needed). */
  quote: (courseIds: string[], promoCode?: string) => request<{items: unknown[]; promo: ApiCart['promo']; subtotal: ApiCart['subtotal']; discount: ApiCart['discount']; total: ApiCart['total']}>('/cart/quote', {method: 'POST', anonymous: true, body: {courseIds, promoCode}}),
};

// ---------------------------------------------------------------------------------------------------------------
// Learning
export const learningApi = {
  home: () => request<ApiHomeFeed>('/me/home'),
  enrollments: (status?: 'in_progress' | 'completed') => request<Page<ApiEnrollment>>(`/me/enrollments${qs({limit: 100, status})}`),
  // Legacy names kept for the lesson screens that will be wired next.
  lesson: (_courseId: string, lessonId: string) => request<Lesson>(`/lessons/${lessonId}`),
  completeLesson: (_courseId: string, lessonId: string) => request<void>(`/lessons/${lessonId}/complete`, {method: 'POST'}),
};

// ---------------------------------------------------------------------------------------------------------------
// "Report app issue" sends general feedback. It needs an account; screenshots are not uploaded yet.
export type IssueReport = {message: string; screenshot?: string; page: string};
export const supportApi = {
  reportIssue: (report: IssueReport) => {
    if (!session.isSignedIn()) return Promise.reject(new ApiError('Log in to send a report, or email support.', 401));
    return request<void>('/feedback', {method: 'POST', body: {message: `[${report.page}] ${report.message}`.slice(0, 2000), category: 'bug', source: 'app_settings', contactOk: true}});
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Help centre, support tickets, privacy requests and receipts.
export type HelpCategory = {id: string; slug: string; name: string; iconKey: string | null; articleCount: number};
export type HelpArticleCard = {id: string; title: string; category?: {id: string; name: string}; readMinutes?: number; lead?: string | null};
export type HelpBlock = {type: string; text?: string | null; level?: number; items?: string[]; tone?: string};
export type HelpArticle = HelpArticleCard & {blocks: HelpBlock[]; shareUrl: string};
export type TicketTopic = 'payments' | 'account' | 'courses' | 'certificates' | 'quizzes_and_grades' | 'technical' | 'course_upload' | 'other';
export type OrderSummary = {id: string; number: number; status: string; itemCount: number; titles: string[]; total: {amountMinor: number; currency: string}; paymentMethod: string | null; cardLast4: string | null; createdAt: string; receiptAvailable: boolean};
export type PrivacyRequest = {id: string; type: 'data_export' | 'delete_account'; status: 'open' | 'done'; dueAt: string; downloadUrl: string | null};

export const helpApi = {
  categories: () => request<Page<HelpCategory>>(`/help/categories${qs({limit: 50, audience: 'learner'})}`, {anonymous: !session.isSignedIn()}),
  articles: (query: {q?: string; categoryId?: string} = {}) => request<Page<HelpArticleCard>>(query.categoryId ? `/help/categories/${query.categoryId}/articles${qs({limit: 50})}` : `/help/articles${qs({limit: 50, q: query.q, audience: 'learner'})}`, {anonymous: !session.isSignedIn()}),
  article: (id: string) => request<HelpArticle>(`/help/articles/${id}`, {anonymous: !session.isSignedIn()}),
  rate: (id: string, helpful: boolean) => request<void>(`/help/articles/${id}/feedback`, {method: 'POST', body: {helpful}}),
};
export const ticketsApi = {
  topics: () => request<Page<{key: TicketTopic; label: string}>>('/support/topics'),
  create: (v: {topic: TicketTopic; subject: string; message: string}) => request<{id: string; number: number}>('/support/tickets', {method: 'POST', idempotent: true, body: v}),
};
export const accountApi = {
  orders: () => request<Page<OrderSummary>>(`/me/orders${qs({limit: 50})}`),
  cards: () => request<Page<{id: string; brand: string; last4: string; expMonth: number; expYear: number; isDefault?: boolean}>>('/me/payment-methods'),
  receipt: (orderId: string) => request<{number: number; issuedAt: string; total: {amountMinor: number; currency: string}; method: string; cardLast4: string | null; pdfUrl: string | null}>(`/me/orders/${orderId}/receipt`),
  privacyRequest: (type: PrivacyRequest['type'], reason?: string) => request<PrivacyRequest>('/me/privacy-requests', {method: 'POST', idempotent: true, body: {type, reason}}),
};

// Paying for the cart. The server returns a hosted Paystack page; card details are entered there, never in the app.
export type OrderResult = {id: string; status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded'; payment?: {failureMessage?: string | null; next?: {authorizationUrl?: string | null} | null} | null};
export const ordersApi = {
  create: (promoCode?: string) => request<OrderResult>('/me/orders', {method: 'POST', idempotent: true, body: {paymentMethod: 'card', returnUrl: 'yizelearn://payment', promoCode}}),
  get: (id: string) => request<OrderResult>(`/me/orders/${id}`),
  /** Poll every 2 seconds, up to a minute, until the payment settles. */
  settle: async (id: string): Promise<OrderResult> => {
    for (let i = 0; i < 30; i++) {
      await new Promise<void>(r => setTimeout(() => r(), 2000));
      const o = await request<OrderResult>(`/me/orders/${id}`);
      if (o.status !== 'pending') return o;
    }
    return request<OrderResult>(`/me/orders/${id}`);
  },
};

// File uploads: ask for an upload slot, send the bytes to the signed address, then confirm. Files up to the single-upload limit.
export type PickedFile = {uri: string; name: string; type: string; size: number};
export const uploadsApi = {
  upload: async (file: PickedFile, purpose: 'avatar' | 'assignment_submission' | 'ticket_attachment'): Promise<string> => {
    const slot = await request<{id: string; mode: 'single' | 'multipart'; single?: {url: string; method: string; headers?: Record<string, string>}}>('/uploads', {method: 'POST', idempotent: true, body: {purpose, fileName: file.name, contentType: file.type, sizeBytes: file.size}});
    if (slot.mode !== 'single' || !slot.single) throw new ApiError('That file is too large to send from the app.', 413);
    const bytes = await (await fetch(file.uri)).blob();
    const put = await fetch(slot.single.url, {method: slot.single.method || 'PUT', headers: {'Content-Type': file.type, ...(slot.single.headers ?? {})}, body: bytes});
    if (!put.ok) throw new ApiError('The upload did not finish. Try again.', put.status);
    await request<unknown>(`/uploads/${slot.id}/complete`, {method: 'POST', body: {}});
    return slot.id;
  },
  setAvatar: (uploadId: string) => request<{avatarUrl: string | null}>('/me/avatar', {method: 'PUT', body: {uploadId}}),
};

// Instructor and admin placeholders, not wired to the new contract yet (they belong to the instructor and admin apps).
export type Organisation = {id: string; name: string; domain: string; kind: 'school' | 'work'; provider: string};
export const dashboardApi = { instructor: () => request<DashboardSummary>('/instructor/dashboard'), administrator: () => request<DashboardSummary>('/admin/dashboard') };
export const coursesApi = {
  list: (params?: {status?: string; page?: number}) => request<Paginated<Course>>(`/courses${params?.status ? `?status=${encodeURIComponent(params.status)}` : ''}`),
  get: (id: string) => request<Course>(`/courses/${id}`),
  modules: (id: string) => request<Module[]>(`/courses/${id}/modules`),
  create: (payload: Pick<Course, 'title'> & Partial<Course>) => request<Course>('/courses', {method: 'POST', body: payload}),
  update: (id: string, payload: Partial<Course>) => request<Course>(`/courses/${id}`, {method: 'PATCH', body: payload}),
};
export const gradingApi = { queue: () => request<Paginated<AssignmentSubmission>>('/grading/submissions'), get: (id: string) => request<AssignmentSubmission>(`/grading/submissions/${id}`), grade: (id: string, score: number, feedback: string) => request<AssignmentSubmission>(`/grading/submissions/${id}`, {method: 'POST', body: {score, feedback}}) };
export const usersApi = { list: (page = 1) => request<Paginated<User>>(`/users?page=${page}`), get: (id: string) => request<User>(`/users/${id}`), invite: (email: string, role: string) => request<void>('/users/invite', {method: 'POST', body: {email, role}}) };
export const paymentsApi = { list: () => request<Paginated<Payment>>('/payments'), checkout: (courseId: string, method: string) => request<{reference: string}>('/payments/checkout', {method: 'POST', body: {courseId, method}}) };
export const notificationsApi = { list: () => request<Paginated<{id: string; title: string; body: string; read: boolean}>>('/notifications'), markRead: (id: string) => request<void>(`/notifications/${id}/read`, {method: 'POST'}) };

export type {ApiTokens};
