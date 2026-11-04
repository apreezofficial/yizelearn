import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon, BookOpen01Icon, CheckmarkCircle02Icon, Notification01Icon} from '@hugeicons/core-free-icons';
import {Logo} from '@/components/Logo';
import s from '@/components/DashboardPage.module.css';

const notices = [
  {title: 'Your next lesson is ready', text: 'Continue Intro to programming: think like a developer.', time: 'Just now', icon: BookOpen01Icon},
  {title: 'You are on a 5-day streak', text: 'One short lesson today will keep it going.', time: 'Today', icon: CheckmarkCircle02Icon},
  {title: 'New course recommendation', text: 'Python programming: from first line to real projects was picked for you.', time: 'Yesterday', icon: Notification01Icon},
];

export default function NotificationsPage() { return <main className={s.page}>
  <header className={s.top}><Link href="/dashboard" className={s.brand}><Logo alt="yizelearn dashboard" width={104} height={40} priority /></Link><Link href="/dashboard" className={s.back}><HugeiconsIcon icon={ArrowLeft01Icon} size={18} />Dashboard</Link></header>
  <div className={s.shell}><p className={s.eyebrow}>UPDATES</p><h1 className={s.title}>Notifications</h1><p className={s.sub}>Everything you need to pick up where you left off.</p><section className={s.list}>{notices.map(item => <article className={s.notice} key={item.title}><span className={s.noticeIcon}><HugeiconsIcon icon={item.icon} size={20} /></span><div><strong>{item.title}</strong><p>{item.text}</p><time>{item.time}</time></div></article>)}</section></div>
</main>; }
