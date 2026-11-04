'use client';

import Link from 'next/link';
import {useSyncExternalStore} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {AiBrain01Icon, ComputerSettingsIcon, DatabaseIcon, FavouriteIcon, Megaphone01Icon, SourceCodeIcon, StarIcon} from '@hugeicons/core-free-icons';
import {type Category, type Course} from '@/lib/courses';
import {preferencesAllowed} from '@/lib/consent';
import {useMoney} from '@/lib/prefs';
import s from './CourseCard.module.css';

export const categoryIcon: Record<Category, typeof SourceCodeIcon> = {
  Programming: SourceCodeIcon, AI: AiBrain01Icon, 'Digital marketing': Megaphone01Icon, Database: DatabaseIcon, 'IT tech skills': ComputerSettingsIcon,
};

const KEY = 'yz-wish';
const listeners = new Set<() => void>();
let memory = '[]'; // this visit's list; written to localStorage only after Preferences cookies are accepted
const read = (): string => { try { return localStorage.getItem(KEY) ?? memory; } catch { return memory; } };
const persist = () => { try { if (memory !== '[]' && preferencesAllowed()) localStorage.setItem(KEY, memory); } catch { /* ignore */ } };
const subscribe = (fn: () => void) => { listeners.add(fn); window.addEventListener('storage', fn); window.addEventListener('yz-consent', persist); return () => { listeners.delete(fn); window.removeEventListener('storage', fn); window.removeEventListener('yz-consent', persist); }; };

/** Saved courses live in this browser only (no account needed). */
export function useWish(id: string) {
  const saved = useSyncExternalStore(subscribe, read, () => '[]');
  const on = (JSON.parse(saved) as string[]).includes(id);
  const toggle = () => {
    const list = JSON.parse(read()) as string[];
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    memory = JSON.stringify(next);
    try { if (preferencesAllowed()) localStorage.setItem(KEY, memory); } catch { /* private mode: nothing is kept */ }
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

/** Udemy home-page card: bordered box, inset picture, bold title, instructor, badge and rating pills, price and a button. */
export function CourseCard({course: c, wide, href = `/courses/${c.id}`}: {course: Course; wide?: boolean; href?: string}) {
  const money = useMoney();
  return <Link href={href} className={`${s.card} ${wide ? s.wide : ''}`}>
    <div className={s.art} data-tone={c.tone}>
      <HugeiconsIcon icon={categoryIcon[c.category]} size={56} strokeWidth={1.4} className={s.glyph} />
      <span className={s.topic}>{c.topic}</span>
      <Heart id={c.id} />
    </div>
    <div className={s.body}>
      <h3>{c.title}</h3>
      <p className={s.by}>{c.instructor}</p>
      <div className={s.pills}>
        {c.tag && <span className={s.chip}>{c.tag === 'New' ? 'New' : 'Bestseller'}</span>}
        <span className={s.pill}><HugeiconsIcon icon={StarIcon} size={11} className={s.starOn} /><b>{c.rating.toFixed(1)}</b></span>
        <span className={s.pill}>{c.reviews.toLocaleString()} ratings</span>
      </div>
      <div className={s.foot}>
        <p className={s.meta}><b>{money(c.price)}</b>{c.was && <s>{money(c.was)}</s>}</p>
        <span className={s.btn}>View course</span>
      </div>
    </div>
  </Link>;
}

/** Placeholder with the same shape as a card, shimmering while the list "loads". */
export function CardSkeleton({wide}: {wide?: boolean}) {
  return <div className={`${s.card} ${wide ? s.wide : ''}`} aria-hidden>
    <div className={`${s.art} ${s.shimmer}`} />
    <div className={s.body}>
      <div className={`${s.line} ${s.shimmer}`} style={{width: '90%'}} />
      <div className={`${s.line} ${s.shimmer}`} style={{width: '60%'}} />
      <div className={`${s.line} ${s.shimmer}`} style={{width: '70%', marginTop: 18}} />
      <div className={`${s.line} ${s.shimmer}`} style={{width: '40%'}} />
    </div>
  </div>;
}
