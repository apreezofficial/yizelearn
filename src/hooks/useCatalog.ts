import {useCallback, useEffect, useRef, useState} from 'react';
import {catalogApi} from '../api/endpoints';
import {toCourse} from '../api/mappers';
import type {Course} from '../api/types';
import {categories as sampleCategories, sampleCourses} from '../data/catalog';

export type Catalog = {courses: Course[]; categories: string[]; loading: boolean; source: 'api' | 'sample'; refresh: () => void};

/**
 * The courses people can browse: the API's published courses and categories. While the API has no courses yet (or can't be
 * reached) the sample catalogue stands in, so the app is never empty. `loading` is true until the first answer.
 */
export function useCatalog(): Catalog {
  const [state, setState] = useState<Omit<Catalog, 'refresh'>>({courses: [], categories: ['All'], loading: true, source: 'sample'});
  const alive = useRef(true);
  const load = useCallback(async () => {
    try {
      const [cats, list] = await Promise.all([catalogApi.categories(), catalogApi.courses({limit: 100, sort: 'popular'})]);
      if (!alive.current) return;
      if (!list.data.length) { setState({courses: sampleCourses, categories: [...sampleCategories], loading: false, source: 'sample'}); return; }
      const courses = list.data.map(c => toCourse(c));
      const names = cats.data.filter(c => c.courseCount > 0).map(c => c.name);
      setState({courses, categories: ['All', ...(names.length ? names : [...new Set(courses.map(c => c.category ?? ''))].filter(Boolean))], loading: false, source: 'api'});
    } catch {
      if (alive.current) setState({courses: sampleCourses, categories: [...sampleCategories], loading: false, source: 'sample'});
    }
  }, []);
  useEffect(() => { alive.current = true; void load(); return () => { alive.current = false; }; }, [load]);
  return {...state, refresh: () => { void load(); }};
}
