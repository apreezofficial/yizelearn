// Types for the parts of the yizelearn API the website reads, and a small server-side client.
// Contract: <API_URL>/docs (OpenAPI at /docs/openapi.json). Money is {amountMinor, currency}; ids are UUIDs.
export type Money = {amountMinor: number; currency: string};
export type UserRef = {id: string; fullName: string; initials: string; avatarUrl: string | null};
export type InstructorRef = UserRef & {headline?: string | null};
export type CategoryRef = {id: string; slug: string; name: string};
export type ApiCategory = {id: string; slug: string; name: string; iconKey: string | null; courseCount: number};
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type ApiCourseCard = {
  id: string; title: string; subtitle: string | null; instructor: InstructorRef; ratingAvg: number | null; ratingCount: number;
  price: Money; listPrice: Money | null; thumbnailUrl: string | null; level: CourseLevel; category: CategoryRef; durationMin: number | null; lessonCount: number;
};
export type PageInfo = {nextCursor: string | null; hasMore: boolean; total?: number | null};
export type ApiLesson = {id: string; position: number; title: string; type: string; durationMin: number | null; isPreview: boolean; locked: boolean};
export type ApiModule = {id: string; position: number; title: string; lessonCount: number; lessons: ApiLesson[]};
export type ApiCurriculum = {courseId: string; moduleCount: number; lessonCount: number; durationMin: number; modules: ApiModule[]};
export type ApiCourseDetail = ApiCourseCard & {about: string | null; learnPoints: string[]; moduleCount: number; tags: {id: string; slug: string; name: string}[]; language: string; publishedAt: string | null; hasCertificate: boolean; previewLessonIds: string[]};
export type ApiReview = {id: string; rating: number; comment: string | null; author: UserRef; createdAt: string};
export type ApiReviews = {data: ApiReview[]; page: PageInfo; summary: {ratingAvg: number | null; ratingCount: number; distribution: Record<string, number>}};

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

const BASE = process.env.API_URL ?? 'https://16-170-53-222.sslip.io';

/** GET on the API from the server. Throws ApiError on a problem+json answer and on network trouble. */
export async function apiGet<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const qs = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
  let res: Response;
  try { res = await fetch(`${BASE}/v1${path}${qs.size ? `?${qs}` : ''}`, {headers: {accept: 'application/json'}, signal: AbortSignal.timeout(8000)}); }
  catch { throw new ApiError(0, 'unreachable', 'The yizelearn API could not be reached'); }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {code?: string; title?: string};
    throw new ApiError(res.status, body.code ?? 'error', body.title ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
