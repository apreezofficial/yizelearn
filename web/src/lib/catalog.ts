import {cacheLife} from 'next/cache';
import {ApiError, apiGet, isUuid, type ApiCategory, type ApiCourseCard, type ApiCourseDetail, type ApiCurriculum, type ApiReviews, type Money, type PageInfo} from './api';
import {categories as sampleCategories, courses as sampleCourses, type Course} from './courses';
import {getDetail, related, type Detail} from './courseDetail';
import {currencies} from './currency';

// Where the website gets its courses: the yizelearn API. While the API is unreachable or has no published courses yet,
// the sample catalogue is used instead (source: 'sample') so the site is never empty.
export type CatalogCategory = {name: string; slug: string; topics: string[]; count: number};
export type CatalogData = {source: 'api' | 'sample'; courses: Course[]; categories: CatalogCategory[]};
export type CourseView = {source: 'api' | 'sample'; course: Course; detail: Detail; more: Course[]};

/** Prices in the app are held in naira; the API sends minor units (kobo) in the course's own currency. */
export function toNaira(m: Money): number {
  const major = m.amountMinor / 100;
  if (m.currency === 'NGN') return major;
  const per = currencies.find(c => c.code === m.currency)?.per;
  return per ? major / per : major;
}

const level = (l: string) => l.charAt(0).toUpperCase() + l.slice(1);
const toneOf = (id: string): Course['tone'] => (([...id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 5) as Course['tone']);

export function toCourse(c: ApiCourseCard): Course {
  return {
    id: c.id, title: c.title, subtitle: c.subtitle, instructor: c.instructor.fullName,
    rating: c.ratingAvg ?? 0, reviews: c.ratingCount, price: toNaira(c.price), was: c.listPrice && c.listPrice.amountMinor > c.price.amountMinor ? toNaira(c.listPrice) : undefined,
    hours: Math.max(1, Math.round((c.durationMin ?? 0) / 60)), level: level(c.level), category: c.category.name, topic: c.category.name,
    tone: toneOf(c.id), thumbnailUrl: c.thumbnailUrl ?? undefined,
  };
}

function sample(): CatalogData {
  return {source: 'sample', courses: sampleCourses, categories: sampleCategories.map(c => ({name: c.name, slug: c.name.toLowerCase().replace(/\W+/g, '-'), topics: c.topics, count: sampleCourses.filter(x => x.category === c.name).length}))};
}

/** Every published course (up to 100) and the categories, for the home page and /courses. */
export async function getCatalog(): Promise<CatalogData> {
  'use cache';
  cacheLife('minutes');
  try {
    const [cats, list] = await Promise.all([
      apiGet<{data: ApiCategory[]}>('/categories', {limit: 100}),
      apiGet<{data: ApiCourseCard[]; page: PageInfo}>('/courses', {limit: 100, sort: 'popular'}),
    ]);
    if (!list.data.length) return sample();
    const courses = list.data.map(toCourse);
    const categories = cats.data.filter(c => c.courseCount > 0 || courses.some(x => x.category === c.name)).map(c => ({name: c.name, slug: c.slug, topics: [], count: c.courseCount}));
    return {source: 'api', courses, categories};
  } catch { return sample(); }
}

const paragraphs = (s: string | null) => (s ?? '').split(/\n{2,}/).map(x => x.trim()).filter(Boolean);

/** One course page: detail, curriculum, reviews and similar courses. Non-UUID ids are the sample courses. */
export async function getCourseView(id: string): Promise<CourseView | null> {
  'use cache';
  cacheLife('minutes');
  if (!isUuid(id)) {
    const c = sampleCourses.find(x => x.id === id);
    return c ? {source: 'sample', course: c, detail: getDetail(c), more: related(c)} : null;
  }
  try {
    const [d, cur, rev, sim] = await Promise.all([
      apiGet<ApiCourseDetail>(`/courses/${id}`),
      apiGet<ApiCurriculum>(`/courses/${id}/curriculum`).catch(() => null),
      apiGet<ApiReviews>(`/courses/${id}/reviews`, {limit: 6}).catch(() => null),
      apiGet<{data: ApiCourseCard[]}>(`/courses/${id}/similar`, {limit: 4}).catch(() => null),
    ]);
    const course = {...toCourse(d), hours: Math.max(1, Math.round((cur?.durationMin ?? d.durationMin ?? 0) / 60))};
    const detail: Detail = {
      sub: d.subtitle ?? '', learn: d.learnPoints, needs: [], about: paragraphs(d.about), bio: d.instructor.headline ?? '',
      modules: (cur?.modules ?? []).map(m => ({title: m.title, lectures: m.lessons.map(l => ({title: l.title, minutes: l.durationMin ?? 0, preview: l.isPreview}))})),
      reviews: rev ? {avg: rev.summary.ratingAvg, count: rev.summary.ratingCount, items: rev.data.map(r => ({id: r.id, rating: r.rating, comment: r.comment, author: r.author.fullName, date: r.createdAt}))} : undefined,
    };
    return {source: 'api', course, detail, more: (sim?.data ?? []).map(toCourse)};
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
