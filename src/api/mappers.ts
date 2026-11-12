import type {ApiAuthUser, ApiCart, ApiCourseCard, ApiCourseDetail, ApiCurriculum, ApiEnrollment, ApiReview, Money} from './contract';
import type {Course, CourseLevel, Lesson, Module, Role, User} from './types';

/** Prices in the app are whole naira. The API sends minor units (kobo for NGN). */
export const naira = (m: Money | null | undefined) => (m ? Math.round(m.amountMinor / 100) : 0);

const level = (l: string): CourseLevel => (l.charAt(0).toUpperCase() + l.slice(1)) as CourseLevel;

export function toCourse(c: ApiCourseCard, extra: Partial<Course> = {}): Course {
  return {
    id: c.id, title: c.title, summary: c.subtitle ?? undefined, status: c.availability === 'unpublished' ? 'draft' : 'published',
    lessonsCount: c.lessonCount, price: naira(c.price), instructorName: c.instructor.fullName, category: c.category.name, level: level(c.level),
    rating: c.ratingAvg ?? undefined, ratingsCount: c.ratingCount, durationMinutes: c.durationMin ?? undefined, thumbnailUrl: c.thumbnailUrl ?? undefined, ...extra,
  };
}

/** The course page needs the learning points and the long description as well. */
export const toCourseDetail = (d: ApiCourseDetail): Course => toCourse(d, {outcomes: d.learnPoints, summary: d.about?.split(/\n{2,}/)[0] || d.subtitle || undefined});

export function toModules(c: ApiCurriculum): Module[] {
  return c.modules.map(m => ({
    id: m.id, title: m.title,
    lessons: m.lessons.map((l): Lesson => ({id: l.id, title: l.title, type: l.type, durationMinutes: l.durationMin ?? undefined, preview: l.isPreview, questionsCount: l.questionCount ?? undefined, completed: l.state === 'completed'})),
  }));
}

export type UiReview = {id: string; name: string; rating: number; when: string; text: string};
const ago = (iso: string) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days < 1) return 'Today';
  if (days < 14) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
};
export const toReview = (r: ApiReview): UiReview => ({id: r.id, name: r.author.fullName, rating: r.rating, when: ago(r.createdAt), text: r.comment ?? ''});

/** Share of ratings at 5, 4, 3, 2 and 1 stars, as the course page draws them. */
export function breakdown(distribution: Record<string, number>, total: number) {
  return [5, 4, 3, 2, 1].map(star => (total > 0 ? (distribution[String(star)] ?? 0) / total : 0));
}

const roles: Record<ApiAuthUser['role'], Role> = {learner: 'student', instructor: 'instructor', manager: 'manager', admin: 'administrator'};
export const toUser = (u: ApiAuthUser): User => ({id: u.id, name: u.fullName, email: u.email, role: roles[u.role], avatarUrl: u.avatarUrl ?? undefined});

export type CartView = {items: Course[]; savedForLater: Course[]; promo?: string; subtotal: number; discount: number; total: number};
export const toCart = (c: ApiCart): CartView => ({
  items: c.items.map(l => toCourse(l.course, {price: naira(l.price)})),
  savedForLater: c.savedForLater.map(l => toCourse(l.course, {price: naira(l.price)})),
  promo: c.promo?.valid ? c.promo.code : undefined, subtotal: naira(c.subtotal), discount: naira(c.discount), total: naira(c.total),
});

export type EnrolmentView = {id: string; course: Course; progress: number; status: 'in-progress' | 'completed'; lastLessonId?: string; completedLessons: number; totalLessons: number};
export const toEnrolment = (e: ApiEnrollment): EnrolmentView => ({
  id: e.id, course: toCourse(e.course), progress: e.progressPct, status: e.status === 'completed' ? 'completed' : 'in-progress',
  lastLessonId: e.lastLessonId ?? undefined, completedLessons: e.completedLessons, totalLessons: e.totalLessons,
});
