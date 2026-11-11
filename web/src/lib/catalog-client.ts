'use client';

import {useEffect, useState} from 'react';
import {categories as sampleCategories, courses as sampleCourses} from './courses';

// Browser-side reads of the catalogue, through the same-origin /yz proxy (the API itself sends no CORS headers).
export type NavCategory = {name: string; slug: string; topics: string[]};
export type Suggestion = {key: string; title: string; sub?: string; price?: number; href: string};

const fallbackCats: NavCategory[] = sampleCategories.map(c => ({name: c.name, slug: c.name.toLowerCase().replace(/\W+/g, '-'), topics: c.topics}));
let cats: NavCategory[] | null = null;
let pending: Promise<NavCategory[]> | null = null;

function loadCategories(): Promise<NavCategory[]> {
  pending ??= fetch('/yz/categories?limit=100')
    .then(r => (r.ok ? r.json() : Promise.reject(new Error('categories'))))
    .then((j: {data: {name: string; slug: string; courseCount: number}[]}) => {
      const live = j.data.filter(c => c.courseCount > 0).map(c => ({name: c.name, slug: c.slug, topics: []}));
      cats = live.length ? live : fallbackCats;
      return cats;
    })
    .catch(() => { cats = fallbackCats; return cats; });
  return pending;
}

/** Categories for menus: the API's, or our five while the API has none. */
export function useCategories(): NavCategory[] {
  const [list, setList] = useState<NavCategory[]>(cats ?? fallbackCats);
  useEffect(() => { let on = true; loadCategories().then(c => { if (on) setList(c); }); return () => { on = false; }; }, []);
  return list;
}

const local = (q: string): Suggestion[] => sampleCourses
  .filter(c => `${c.title} ${c.topic} ${c.instructor}`.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
  .map(c => ({key: c.id, title: c.title, sub: `${c.topic} · ${c.level} · ${c.instructor}`, price: c.price, href: `/courses/${c.id}`}));

/** Type-ahead results for the search box (API first; the sample courses when the API has nothing). */
export function useSuggestions(query: string): Suggestion[] {
  const q = query.trim();
  const [out, setOut] = useState<{q: string; items: Suggestion[]}>({q: '', items: []});
  useEffect(() => {
    if (q.length < 2) return;
    const ctl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/yz/courses/suggestions?q=${encodeURIComponent(q)}&limit=6`, {signal: ctl.signal});
        if (!r.ok) throw new Error('suggest');
        const j = (await r.json()) as {data: {text: string; kind: 'query' | 'course' | 'category'; id?: string}[]};
        const items = j.data.map((s, i): Suggestion => ({
          key: `${s.kind}-${s.id ?? i}`, title: s.text, sub: s.kind === 'category' ? 'Category' : s.kind === 'course' ? 'Course' : 'Search',
          href: s.kind === 'course' && s.id ? `/courses/${s.id}` : s.kind === 'category' ? `/courses?category=${encodeURIComponent(s.text)}` : `/courses?q=${encodeURIComponent(s.text)}`,
        }));
        setOut({q, items: items.length ? items : local(q)});
      } catch (e) { if ((e as Error).name !== 'AbortError') setOut({q, items: local(q)}); }
    }, 200);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q]);
  return q.length >= 2 && out.q === q ? out.items : q.length >= 2 ? local(q) : [];
}
