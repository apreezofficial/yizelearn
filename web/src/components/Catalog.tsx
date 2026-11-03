'use client';

import {useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon, ArrowRight01Icon, GridViewIcon, Search01Icon} from '@hugeicons/core-free-icons';
import {categories, courses, type Category, type Course} from '@/lib/courses';
import {CardSkeleton, CourseCard, categoryIcon} from './CourseCard';
import s from './Catalog.module.css';

type Tab = 'All' | Category;
const levels = ['Any level', 'Beginner', 'Intermediate', 'Advanced'];
const prices = [['Any price', 0], ['Up to ₦10,000', 10000], ['Up to ₦15,000', 15000], ['Up to ₦20,000', 20000]] as const;

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
export function Catalog() {
  const params = useSearchParams();
  const cat = params.get('category');
  const [tab, setTabRaw] = useState<Tab>(categories.some(c => c.name === cat) ? (cat as Category) : 'All');
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
  const browsing = tab === 'All' && level === levels[0] && !price && !needle;
  const topicsOf = categories.find(c => c.name === tab)?.topics;

  return <div className={s.page}>
    <div className={s.tabsBar}>
      <div className={s.tabs} role="tablist" aria-label="Categories">
        {(['All', ...categories.map(c => c.name)] as Tab[]).map(t => <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? s.tabOn : s.tab} onClick={() => setTab(t)}>
          <HugeiconsIcon icon={t === 'All' ? GridViewIcon : categoryIcon[t]} size={28} strokeWidth={1.6} /><span>{t}</span>
        </button>)}
      </div>
    </div>

    <form className={s.pill} role="search" onSubmit={e => e.preventDefault()}>
      <label className={s.seg}><span>What</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search skills or topics" aria-label="Search courses" /></label>
      <label className={s.seg}><span>Level</span><select value={level} onChange={e => setLevel(e.target.value)}>{levels.map(l => <option key={l}>{l}</option>)}</select></label>
      <label className={s.seg}><span>Price</span><select value={price} onChange={e => setPrice(Number(e.target.value))}>{prices.map(([l, v]) => <option key={l} value={v}>{l}</option>)}</select></label>
      <button className={s.searchBtn} aria-label="Search"><HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={2.4} /></button>
    </form>

    <div className={s.content}>
      {loading ? <>
        <div className={s.rowHead}><div className={`${s.sk} ${s.skTitle}`} /></div>
        <div className={s.rail}>{Array.from({length: 7}, (_, i) => <CardSkeleton key={i} wide />)}</div>
        <div className={s.rowHead}><div className={`${s.sk} ${s.skTitle}`} /></div>
        <div className={s.rail}>{Array.from({length: 7}, (_, i) => <CardSkeleton key={i} wide />)}</div>
      </> : browsing ? <>
        <Row title="Popular right now" sub="The courses learners start most" items={courses.filter(c => c.tag === 'Bestseller')} />
        <Row title="New this month" sub="Fresh courses from our instructors" items={courses.filter(c => c.tag === 'New')} />
        {categories.map(c => <Row key={c.name} title={c.name} sub={c.topics.slice(0, 4).join(', ') + ' and more'} items={courses.filter(x => x.category === c.name)} onMore={() => { setTab(c.name); window.scrollTo({top: 0, behavior: 'smooth'}); }} />)}
      </> : <section className={s.results}>
        <div className={s.rowHead}><div><h2>{tab === 'All' ? 'Search results' : tab}</h2><p>{filtered.length} {filtered.length === 1 ? 'course' : 'courses'}{topicsOf ? ` · ${topicsOf.slice(0, 5).join(', ')}` : ''}</p></div></div>
        {filtered.length ? <div className={s.grid}>{filtered.map(c => <CourseCard key={c.id} course={c} />)}</div>
          : <div className={s.empty}><b>No courses match yet</b><p>Try another word, or clear the filters.</p><button onClick={() => { setQ(''); setLevel(levels[0]); setPrice(0); setTab('All'); }}>Clear filters</button></div>}
      </section>}
    </div>
  </div>;
}
