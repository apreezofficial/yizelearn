import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon} from '@hugeicons/core-free-icons';
import {CourseCard} from '@/components/CourseCard';
import {Logo} from '@/components/Logo';
import {courses} from '@/lib/courses';
import s from '@/components/DashboardPage.module.css';
import grid from '@/components/LearnerDashboard.module.css';

export default function DashboardCoursesPage() { return <main className={s.page}>
  <header className={s.top}><Link href="/dashboard" className={s.brand}><Logo alt="yizelearn dashboard" width={104} height={40} priority /></Link><Link href="/dashboard" className={s.back}><HugeiconsIcon icon={ArrowLeft01Icon} size={18} />Dashboard</Link></header>
  <div className={s.shell}><p className={s.eyebrow}>YOUR LIBRARY</p><h1 className={s.title}>Explore courses</h1><p className={s.sub}>Choose a course and keep your learning in one place.</p><div className={grid.courseGrid}>{courses.map(course => <CourseCard key={course.id} course={course} href={`/dashboard/courses/${course.id}`} />)}</div></div>
</main>; }
