'use client';

import {useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon, ArrowRight01Icon, GridViewIcon, Search01Icon} from '@hugeicons/core-free-icons';
import {type Course} from '@/lib/courses';
import type {CatalogCategory} from '@/lib/catalog';
import {useMoney} from '@/lib/prefs';
import {CardSkeleton, CourseCard, iconFor} from './CourseCard';
import s from './Catalog.module.css';

type Tab = string;
type Data = {courses: Course[]; categories: CatalogCategory[]};
const levels = ['Any level', 'Beginner', 'Intermediate', 'Advanced'];
const prices = [0, 10000, 15000, 20000] as const;

function Row({title, sub, items, onMore}: {title: string; sub?: string; items: Course[]; onMore?: () => void}) {
  const rail = useRef<HTMLDivElement>(null);
  const go = (d: 1 | -1) => rail.current?.scrollBy({left: d * rail.current.clientWidth * 0.85, behavior: 'smooth'});
  return <section className={s.row}>
    <div className={s.rowHead}>
      <div>
        <h2>{onMore ? <button onClick={onMore}>{title}<span className={s.go}><HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.4} /></span></button> : title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <div className={s.arrows}>
        <button onClick={() => go(-1)} aria-label="Scroll left"><HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2.4} /></button>
        <button onClick={() => go(1)} aria-label="Scroll right"><HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.4} /></button>
      </div>
    </div>
    <div ref={rail} className={s.rail}>{items.map(c => <CourseCard key={c.id} course={c} wide />)}</div>
  </section>;
}

/**
 * The course catalogue after Airbnb's /homes: a tab bar with an icon per category, one big search pill
 * (What / Level / Price), then rows you scroll sideways. Everything shimmers for a moment while it "loads".
 */
/** Reads the URL and restarts the catalogue when it changes, so menu links like /courses?category=AI work while you are already here. */
export function Catalog(props: Data) {
  const params = useSearchParams();
  return <CatalogView key={params.toString()} {...props} />;
}

function CatalogView({courses, categories}: Data) {
  const money = useMoney();
  const params = useSearchParams();
  const cat = params.get('category');
  const [tab, setTabRaw] = useState<Tab>(categories.some(c => c.name === cat || c.slug === cat) ? (categories.find(c => c.name === cat || c.slug === cat)!.name) : 'All');
  const [q, setQRaw] = useState(params.get('q') ?? '');
  const [level, setLevelRaw] = useState(levels[0]);
  const [price, setPriceRaw] = useState(0);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // A short shimmer on first load and whenever the view changes, so the page never jumps.
  const shimmer = (ms: number) => { window.scrollTo({top: 0, behavior: 'instant'}); setLoading(true); clearTimeout(timer.current); timer.current = setTimeout(() => setLoading(false), ms); };
  useEffect(() => { timer.current = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(timer.current); }, []);
  const setTab = (v: Tab) => { setTabRaw(v); shimmer(450); };
  const setQ = (v: string) => { setQRaw(v); shimmer(450); };
  const setLevel = (v: string) => { setLevelRaw(v); shimmer(450); };
  const setPrice = (v: number) => { setPriceRaw(v); shimmer(450); };

  const needle = q.trim().toLowerCase();
  const filtered = courses.filter(c => (tab === 'All' || c.category === tab)
    && (level === levels[0] || c.level === level) && (!price || c.price <= price)
    && (!needle || `${c.title} ${c.topic} ${c.category} ${c.instructor}`.toLowerCase().includes(needle)));
  // The API already sorts by popularity; the sample courses carry Bestseller / New tags instead.
  const tagged = courses.filter(c => c.tag === 'Bestseller');
  const popular = tagged.length ? tagged : courses.slice(0, 8);
  const fresh = courses.filter(c => c.tag === 'New');
  const browsing = tab === 'All' && level === levels[0] && !price && !needle;
  const topicsOf = categories.find(c => c.name === tab)?.topics;

  return <div className={s.page}>
    <div className={s.tabsBar}>
      <div className={s.tabs} role="tablist" aria-label="Categories">
        {['All', ...categories.map(c => c.name)].map(t => <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? s.tabOn : s.tab} onClick={() => setTab(t)}>
          <HugeiconsIcon icon={t === 'All' ? GridViewIcon : iconFor(t)} size={28} strokeWidth={1.6} /><span>{t}</span>
        </button>)}
      </div>
    </div>

    <form className={s.pill} role="search" onSubmit={e => e.preventDefault()}>
      <label className={s.seg}><span>What</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search skills or topics" aria-label="Search courses" /></label>
      <label className={s.seg}><span>Level</span><select value={level} onChange={e => setLevel(e.target.value)}>{levels.map(l => <option key={l}>{l}</option>)}</select></label>
      <label className={s.seg}><span>Price</span><select value={price} onChange={e => setPrice(Number(e.target.value))}>{prices.map(v => <option key={v} value={v}>{v ? `Up to ${money(v)}` : 'Any price'}</option>)}</select></label>
      <button className={s.searchBtn} aria-label="Search"><HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={2.4} /></button>
    </form>

    <div className={s.content}>
      {loading ? <>
        <div className={s.rowHead}><div className={`${s.sk} ${s.skTitle}`} /></div>
        <div className={s.rail}>{Array.from({length: 7}, (_, i) => <CardSkeleton key={i} wide />)}</div>
        <div className={s.rowHead}><div className={`${s.sk} ${s.skTitle}`} /></div>
        <div className={s.rail}>{Array.from({length: 7}, (_, i) => <CardSkeleton key={i} wide />)}</div>
      </> : browsing ? <>
        {popular.length > 0 && <Row title="Popular right now" sub="The courses learners start most" items={popular} />}
        {fresh.length > 0 && <Row title="New this month" sub="Fresh courses from our instructors" items={fresh} />}
        {categories.map(c => <Row key={c.name} title={c.name} sub={c.topics.length ? c.topics.slice(0, 4).join(', ') + ' and more' : `${c.count} ${c.count === 1 ? 'course' : 'courses'}`} items={courses.filter(x => x.category === c.name)} onMore={() => { setTab(c.name); window.scrollTo({top: 0, behavior: 'smooth'}); }} />)}
      </> : <section className={s.results}>
        <div className={s.rowHead}><div><h2>{tab === 'All' ? 'Search results' : tab}</h2><p>{filtered.length} {filtered.length === 1 ? 'course' : 'courses'}{topicsOf ? ` · ${topicsOf.slice(0, 5).join(', ')}` : ''}</p></div></div>
        {filtered.length ? <div className={s.grid}>{filtered.map(c => <CourseCard key={c.id} course={c} />)}</div>
          : <div className={s.empty}><b>No courses match yet</b><p>Try another word, or clear the filters.</p><button onClick={() => { setQ(''); setLevel(levels[0]); setPrice(0); setTab('All'); }}>Clear filters</button></div>}
      </section>}
    </div>
  </div>;
}
