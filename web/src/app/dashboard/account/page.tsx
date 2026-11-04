import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowLeft01Icon} from '@hugeicons/core-free-icons';
import {Logo} from '@/components/Logo';
import s from '@/components/DashboardPage.module.css';

export default function AccountPage() { return <main className={s.page}>
  <header className={s.top}><Link href="/dashboard" className={s.brand}><Logo alt="yizelearn dashboard" width={104} height={40} priority /></Link><Link href="/dashboard" className={s.back}><HugeiconsIcon icon={ArrowLeft01Icon} size={18} />Dashboard</Link></header>
  <div className={s.shell}><p className={s.eyebrow}>ACCOUNT</p><h1 className={s.title}>Profile</h1><p className={s.sub}>Your learner account and preferences.</p><section className={s.account}><span className={s.avatar}>MI</span><div><h2>Mercy Ibe</h2><p>mercy@example.com</p></div></section><section className={s.list} style={{marginTop: 26}}><div className={s.accountRow}><span>Learning goal</span><strong>Become a web developer</strong></div><div className={s.accountRow}><span>Joined</span><strong>November 2026</strong></div><div className={s.accountRow}><span>Email notifications</span><strong>Enabled</strong></div></section></div>
</main>; }
