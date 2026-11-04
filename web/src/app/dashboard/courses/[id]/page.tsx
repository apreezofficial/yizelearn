import Link from 'next/link';
import {notFound} from 'next/navigation';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon, PlayIcon} from '@hugeicons/core-free-icons';
import {Logo} from '@/components/Logo';
import {courses} from '@/lib/courses';
import s from '@/components/DashboardPage.module.css';

export function generateStaticParams() { return courses.map(course => ({id: course.id})); }

export default async function DashboardCoursePage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const course = courses.find(item => item.id === id);
  if (!course) notFound();
  const active = course.id === 'intro-prog';
  const progress = active ? 62 : 0;
  return <main className={s.page}>
    <header className={s.top}><Link href="/dashboard" className={s.brand}><Logo alt="yizelearn dashboard" width={104} height={40} priority /></Link><Link href="/dashboard" className={s.back}><HugeiconsIcon icon={ArrowLeft01Icon} size={18} />Dashboard</Link></header>
    <div className={s.shell}>
      <p className={s.eyebrow}>{course.category}</p><h1 className={s.title}>{course.title}</h1><p className={s.sub}>With {course.instructor} · {course.level} · {course.hours} hours</p>
      <section className={s.progressCard}><div className={s.progressHead}><span>Your progress</span><strong>{progress}%</strong></div><div className={s.bar}><span style={{width: `${progress}%`}} /></div></section>
      <h2 className={s.sectionTitle}>Course content</h2><div className={s.list}>
        {['Welcome and course setup', 'Core concepts', 'Practice with a real example', 'Put your skills to work'].map((lesson, index) => <div className={s.row} key={lesson}><span><strong>Module {index + 1}: {lesson}</strong><small>{index === 0 && active ? '8 of 12 lessons complete' : 'Lessons and practice'}</small></span><b className={index === 0 && active ? s.current : index < 1 && active ? s.done : ''}>{index === 0 && active ? 'Continue' : index < 1 && active ? 'Complete' : 'Locked'}</b></div>)}
      </div>
      <button className={s.button}>{active ? 'Resume lesson' : 'Start course'} <HugeiconsIcon icon={PlayIcon} size={17} fill="currentColor" /></button>
    </div>
  </main>;
}
