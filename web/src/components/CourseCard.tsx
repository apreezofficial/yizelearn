'use client';

import Link from 'next/link';
import {useSyncExternalStore} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {AiBrain01Icon, ComputerSettingsIcon, DatabaseIcon, FavouriteIcon, Megaphone01Icon, SourceCodeIcon, StarIcon} from '@hugeicons/core-free-icons';
import {naira, type Category, type Course} from '@/lib/courses';
import s from './CourseCard.module.css';

export const categoryIcon: Record<Category, typeof SourceCodeIcon> = {
  Programming: SourceCodeIcon, AI: AiBrain01Icon, 'Digital marketing': Megaphone01Icon, Database: DatabaseIcon, 'IT tech skills': ComputerSettingsIcon,
};

const KEY = 'yz-wish';
const listeners = new Set<() => void>();
const read = (): string => { try { return localStorage.getItem(KEY) ?? '[]'; } catch { return '[]'; } };
const subscribe = (fn: () => void) => { listeners.add(fn); window.addEventListener('storage', fn); return () => { listeners.delete(fn); window.removeEventListener('storage', fn); }; };

/** Saved courses live in this browser only (no account needed). */
export function useWish(id: string) {
  const saved = useSyncExternalStore(subscribe, read, () => '[]');
  const on = (JSON.parse(saved) as string[]).includes(id);
  const toggle = () => {
    const list = JSON.parse(read()) as string[];
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: nothing is kept */ }
    listeners.forEach(fn => fn());
  };
  return [on, toggle] as const;
}

export function Heart({id, className}: {id: string; className?: string}) {
  const [on, toggle] = useWish(id);
  return <button className={`${s.heart} ${on ? s.hearted : ''} ${className ?? ''}`} aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={on}
    onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(); }}>
    <HugeiconsIcon icon={FavouriteIcon} size={22} strokeWidth={2} />
  </button>;
}

const Stars = ({v}: {v: number}) => <span className={s.stars} aria-hidden>{[1, 2, 3, 4, 5].map(i => <HugeiconsIcon key={i} icon={StarIcon} size={12} className={i <= Math.round(v) ? s.starOn : s.starOff} />)}</span>;

/** Udemy-style card: wide picture, bold two-line title, instructor, rating with stars, then price and a badge. */
export function CourseCard({course: c, wide}: {course: Course; wide?: boolean}) {
  return <Link href={`/courses/${c.id}`} className={`${s.card} ${wide ? s.wide : ''}`}>
    <div className={s.art} data-tone={c.tone}>
      <HugeiconsIcon icon={categoryIcon[c.category]} size={56} strokeWidth={1.4} className={s.glyph} />
      <span className={s.topic}>{c.topic}</span>
      <Heart id={c.id} />
    </div>
    <h3>{c.title}</h3>
    <p className={s.by}>{c.instructor}</p>
    <p className={s.rate}><b>{c.rating.toFixed(1)}</b><Stars v={c.rating} /><i>({c.reviews.toLocaleString()})</i></p>
    <p className={s.meta}><b>{naira(c.price)}</b>{c.was && <s>{naira(c.was)}</s>}</p>
    {c.tag && <span className={s.chip}>{c.tag === 'New' ? 'New' : 'Bestseller'}</span>}
  </Link>;
}

/** Placeholder with the same shape as a card, shimmering while the list "loads". */
export function CardSkeleton({wide}: {wide?: boolean}) {
  return <div className={`${s.card} ${wide ? s.wide : ''}`} aria-hidden>
    <div className={`${s.art} ${s.shimmer}`} />
    <div className={`${s.line} ${s.shimmer}`} style={{width: '86%'}} />
    <div className={`${s.line} ${s.shimmer}`} style={{width: '58%'}} />
    <div className={`${s.line} ${s.shimmer}`} style={{width: '42%'}} />
  </div>;
}
