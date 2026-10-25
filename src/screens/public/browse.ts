import type {Course, CourseLevel} from '../../api/types';

export const PRICE_BOUNDS: [number, number] = [1000, 30000];
export type CourseFilters = {rating: number; levels: CourseLevel[]; price: [number, number]};
export type Sort = 'popular' | 'rating' | 'price';
export type Browse = {query: string; category: string; filters: CourseFilters; sort: Sort};

export const defaultFilters: CourseFilters = {rating: 0, levels: [], price: PRICE_BOUNDS};
export const defaultBrowse: Browse = {query: '', category: 'All', filters: defaultFilters, sort: 'popular'};
export const sortLabels: Record<Sort, string> = {popular: 'Most popular', rating: 'Highest rated', price: 'Lowest price'};
export const nextSort: Record<Sort, Sort> = {popular: 'rating', rating: 'price', price: 'popular'};

export function activeFilterCount(f: CourseFilters) { return (f.rating ? 1 : 0) + f.levels.length + (f.price[0] !== PRICE_BOUNDS[0] || f.price[1] !== PRICE_BOUNDS[1] ? 1 : 0); }

// Everything except filters, so the filter sheet can count what each option would show.
export function searchCourses(courses: Course[], {query, category}: Pick<Browse, 'query' | 'category'>) {
  const q = query.trim().toLowerCase();
  return courses.filter(c => (category === 'All' || c.category === category) && (!q || c.title.toLowerCase().includes(q) || (c.instructorName || '').toLowerCase().includes(q)));
}

export function filterCourses(courses: Course[], f: CourseFilters) {
  return courses.filter(c => (c.rating || 0) >= f.rating && (!f.levels.length || (c.level && f.levels.includes(c.level))) && (c.price || 0) >= f.price[0] && (c.price || 0) <= f.price[1]);
}

export function browseCourses(courses: Course[], b: Browse) {
  const list = filterCourses(searchCourses(courses, b), b.filters);
  const by = {popular: (c: Course) => -(c.ratingsCount || 0), rating: (c: Course) => -(c.rating || 0), price: (c: Course) => c.price || 0}[b.sort];
  return [...list].sort((a, z) => by(a) - by(z));
}
