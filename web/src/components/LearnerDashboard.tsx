'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Notification01Icon,
  PlayIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import {CourseCard} from './CourseCard';
import {Logo} from './Logo';
import {courses} from '@/lib/courses';
import s from './LearnerDashboard.module.css';

const filters = ['All', 'AI', 'Tech', 'Design', 'Programming', 'Database'] as const;
const matches: Record<(typeof filters)[number], string[] | undefined> = {
  All: undefined,
  AI: ['AI'],
  Tech: ['Programming', 'IT tech skills'],
  Design: ['Digital marketing'],
  Programming: ['Programming'],
  Database: ['Database'],
};

const activeCourse = {
  title: 'Data analysis in Excel',
  lesson: 'Sorting, filtering and tables',
  lessonNumber: 8,
  lessonsTotal: 24,
  progress: 62,
};

/** The learner home mirrors the native StudentHomeScreen: one active course, topic filters, then a recommendation rail. */
export function LearnerDashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const recommended = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return courses
      .filter(course => course.id !== 'intro-prog')
      .filter(course => !matches[filter] || matches[filter].includes(course.category))
      .filter(course => !needle || `${course.title} ${course.topic} ${course.instructor}`.toLowerCase().includes(needle));
  }, [filter, query]);

  return <main className={s.page}>
    <header className={s.top}>
      <Link href="/dashboard" className={s.brand}><Logo alt="yizelearn dashboard" width={104} height={40} priority /></Link>
      <div className={s.greeting}><p>Hi, Mercy</p><span>Ready for your next lesson?</span></div>
      <div className={s.topActions}>
        <Link href="/dashboard/notifications" className={s.bell} aria-label="Notifications, unread"><HugeiconsIcon icon={Notification01Icon} size={22} /><i /></Link>
        <Link href="/dashboard/account" className={s.avatar} aria-label="Open account menu">MI</Link>
      </div>
    </header>

    <div className={s.shell}>
      <label className={s.search}>
        <HugeiconsIcon icon={Search01Icon} size={20} />
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search for courses" aria-label="Search for courses" />
      </label>

      <section aria-labelledby="continue-title">
        <div className={s.sectionHead}><h1 id="continue-title">Continue learning</h1></div>
        <Link href="/dashboard/courses/intro-prog" className={s.continue} aria-label={`Continue ${activeCourse.title}, ${activeCourse.progress}% complete`}>
          <div className={s.book} aria-hidden><i /><b /><em /></div>
          <div className={s.continueCopy}>
            <span className={s.kicker}>IN PROGRESS</span>
            <h2>{activeCourse.title}</h2>
            <p>Lesson {activeCourse.lessonNumber} of {activeCourse.lessonsTotal}: {activeCourse.lesson}</p>
            <div className={s.progress} aria-label={`${activeCourse.progress}% complete`}><span style={{width: `${activeCourse.progress}%`}} /></div>
            <div className={s.continueFooter}><strong>{activeCourse.progress}% complete</strong><span className={s.resume}>Resume <HugeiconsIcon icon={PlayIcon} size={15} fill="currentColor" /></span></div>
          </div>
          <span className={s.chalkLines} aria-hidden />
        </Link>
      </section>

      <nav className={s.filters} aria-label="Course topics">
        {filters.map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={filter === item ? s.filterOn : s.filter}>{item}</button>)}
      </nav>

      <section aria-labelledby="recommended-title">
        <div className={s.sectionHead}>
          <h2 id="recommended-title">Recommended</h2>
          <Link href="/dashboard/courses" className={s.seeAll}>See all <HugeiconsIcon icon={ArrowRight01Icon} size={16} /></Link>
        </div>
        {recommended.length ? <div className={s.courseGrid}>{recommended.slice(0, 8).map(course => <CourseCard key={course.id} course={course} href={`/dashboard/courses/${course.id}`} />)}</div> : <div className={s.empty}><HugeiconsIcon icon={BookOpen01Icon} size={30} /><strong>No courses found</strong><span>Try another search or topic.</span></div>}
      </section>

      <section className={s.streak} aria-label="Learning streak">
        <div><span className={s.streakIcon}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={21} /></span><span><strong>5-day learning streak</strong><small>Keep it going with one short lesson today.</small></span></div>
        <b>5 days</b>
      </section>
    </div>
  </main>;
}
