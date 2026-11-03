import type {Metadata} from 'next';
import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon} from '@hugeicons/core-free-icons';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {TeachBand, TeachBar, TeachHero, TeachWays} from '@/components/Teach';
import {categories} from '@/lib/courses';
import s from './teach.module.css';

export const metadata: Metadata = {title: 'Teach on yizelearn', description: 'Turn what you know into a short course and get paid in naira.'};

const steps = [
  {n: '01', title: 'Plan your course', text: 'Pick one skill and one clear result. Break it into short lessons that each take a few minutes to finish.'},
  {n: '02', title: 'Record your lessons', text: 'A phone, a quiet corner and your voice are enough. Add a quiz after each lesson so learners can check themselves.'},
  {n: '03', title: 'Publish your course', text: 'Send your course for review. Once it is approved, learners can find it and start.'},
];
const help = [
  {title: 'Instructor guide', text: 'Step-by-step help for planning, filming and publishing your first course.'},
  {title: 'Review before you publish', text: 'Our team checks every course for quality and gives feedback before learners see it.'},
  {title: 'Support when you need it', text: 'Message us from the app or by email and we will get back to you.'},
];
const topicCount = categories.reduce((n, c) => n + c.topics.length, 0);
const stats = [[String(categories.length), 'categories to teach in'], [`${topicCount}+`, 'topics learners ask for'], ['2', 'apps: iPhone and Android'], ['₦', 'priced and paid in naira']];

export default function TeachPage() {
  return <div className={s.page}>
    <OfferBar />
    <SiteNav />
    <TeachHero />
    <TeachBand />

    <section className={s.sec}>
      <div className={s.head}><h2>One place, every way to teach</h2><p>Choose how you want to share what you know. Everything runs through one account.</p></div>
      <TeachWays />
    </section>

    <section className={`${s.sec} ${s.tight}`}>
      <div className={s.head}><h2>From idea to first learners in three steps</h2></div>
      <ol className={s.steps}>{steps.map(x => <li key={x.n}><span>{x.n}</span><h3>{x.title}</h3><p>{x.text}</p></li>)}</ol>
    </section>

    <section className={s.dark}>
      <div className={s.stats}>{stats.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
    </section>

    <section className={s.sec}>
      <div className={s.head}><h2>What you can teach</h2><p>Pick a category and a topic. Do not see yours? Tell us when you sign up.</p></div>
      <div className={s.cats}>{categories.map(c => <div key={c.name} className={s.cat}><h3>{c.name}</h3><p>{c.topics.join(' · ')}</p></div>)}</div>
    </section>

    <section className={`${s.sec} ${s.tight}`}>
      <div className={s.head}><h2>You are not alone</h2><p>We help you from your first lesson to your first learners.</p></div>
      <div className={s.help}>{help.map(h => <div key={h.title}><h3>{h.title}</h3><p>{h.text}</p></div>)}</div>
    </section>

    <section className={s.cta}>
      <h2>Become an instructor today</h2>
      <p>Create your account, tell us what you want to teach and we will help you get started.</p>
      <Link href="/signup?as=teach" className={s.ctaBtn}>Start teaching <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.2} /></Link>
    </section>
    <Footer />
    <TeachBar />
  </div>;
}
