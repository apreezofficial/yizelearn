'use client';

import Link from 'next/link';
import {useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon, ArrowRight01Icon, Clock01Icon, StarIcon} from '@hugeicons/core-free-icons';
import {courses, goals, naira, type Course, type Goal} from '@/lib/courses';
import s from './Explore.module.css';

/** Pick a goal, slide through matching courses. Arrows scroll the rail; on phones it's a swipeable row. */
export function GoalCourses() {
  const [goal, setGoal] = useState<Goal>(goals[0]);
  const rail = useRef<HTMLDivElement>(null);
  const shown = courses.filter(c => c.goal === goal);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth'});
  return <div>
    <div className={s.tabs} role="tablist" aria-label="Goals" style={{['--i' as string]: 0}}>
      {goals.map(g => <button key={g} role="tab" aria-selected={g === goal} className={g === goal ? s.tabOn : s.tab} onClick={() => { setGoal(g); rail.current?.scrollTo({left: 0}); }}>{g}</button>)}
    </div>
    <div className={s.railWrap}>
      <div ref={rail} className={s.rail} key={goal}>
        {shown.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
        <Link href="/signup" className={s.more} style={{['--i' as string]: shown.length + 1}}>See all {goal.toLowerCase()} courses <HugeiconsIcon icon={ArrowRight01Icon} size={16} /></Link>
      </div>
      <button className={`${s.nav} ${s.prev}`} onClick={() => scroll(-1)} aria-label="Previous courses"><HugeiconsIcon icon={ArrowLeft01Icon} size={18} /></button>
      <button className={`${s.nav} ${s.next}`} onClick={() => scroll(1)} aria-label="More courses"><HugeiconsIcon icon={ArrowRight01Icon} size={18} /></button>
    </div>
  </div>;
}

function CourseCard({course: c, index}: {course: Course; index: number}) {
  return <Link href="/signup" className={s.card} style={{['--i' as string]: index + 1}}>
    <div className={s.thumb} data-tone={c.tone}>
      <span className={s.topic}>{c.topic}</span>
      {c.tag && <span className={c.tag === 'New' ? s.tagNew : s.tag}>{c.tag}</span>}
    </div>
    <div className={s.body}>
      <h3>{c.title}</h3>
      <p>{c.instructor}</p>
      <div className={s.meta}>
        <span className={s.rating}><b>{c.rating.toFixed(1)}</b><HugeiconsIcon icon={StarIcon} size={13} /> ({c.reviews.toLocaleString()})</span>
        <span><HugeiconsIcon icon={Clock01Icon} size={13} />{c.hours}h · {c.level}</span>
      </div>
      <div className={s.price}><b>{naira(c.price)}</b>{c.was && <s>{naira(c.was)}</s>}</div>
    </div>
  </Link>;
}
