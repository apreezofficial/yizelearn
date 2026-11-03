import type {Metadata} from 'next';
import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon} from '@hugeicons/core-free-icons';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {TeachHero, TeachWays} from '@/components/Teach';
import {categories} from '@/lib/courses';
import s from './teach.module.css';

export const metadata: Metadata = {title: 'Teach on yizelearn', description: 'Turn what you know into a short course, teach live classes and get paid in naira.'};

const steps = [
  {n: '01', title: 'Plan your course', text: 'Pick one skill and one clear result. Break it into short lessons that each take a few minutes to finish.'},
  {n: '02', title: 'Record your lessons', text: 'A phone, a quiet corner and your voice are enough. Add a quiz after each lesson so learners can check themselves.'},
  {n: '03', title: 'Publish and teach', text: 'Send your course for review, go live, and run live classes to answer questions and keep learners going.'},
];
const help = [
  {title: 'Instructor guide', text: 'Step-by-step help for planning, filming and publishing your first course.'},
  {title: 'Review before you publish', text: 'Our team checks every course for quality and gives feedback before learners see it.'},
  {title: 'Support when you need it', text: 'Message us from the app or by email and a person replies.'},
];
const topicCount = categories.reduce((n, c) => n + c.topics.length, 0);
const stats = [[String(categories.length), 'categories to teach in'], [`${topicCount}+`, 'topics learners ask for'], ['₦', 'priced and paid in naira'], ['Live', 'classes every week']];
const words = ['Teach what you know.', 'Teach what you know.', 'Teach what you know.'];

export default function TeachPage() {
  return <div className={s.page}>
    <OfferBar />
    <SiteNav />
    <TeachHero />

    <section className={s.ways}>
      <div className={s.head}><p className={s.kicker}>Why teach here</p><h2>One place to teach, reach learners and get rewarded.</h2></div>
      <TeachWays />
    </section>

    <section className={s.stepsSec}>
      <div className={s.head}><p className={s.kicker}>How to begin</p><h2>From idea to your first learners in three steps.</h2></div>
      <ol className={s.steps}>{steps.map((x, i) => <li key={x.n} style={{['--i' as string]: i}}><span>{x.n}</span><h3>{x.title}</h3><p>{x.text}</p></li>)}</ol>
    </section>

    <div className={s.big} aria-hidden><div className={s.bigTrack}>{[...words, ...words].map((w, i) => <span key={i}>{w}</span>)}</div></div>

    <section className={s.statsSec}>
      <div className={s.head}><p className={s.kicker}>The platform</p><h2>Built for people who learn in short bursts.</h2></div>
      <div className={s.stats}>{stats.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
    </section>

    <section className={s.cats}>
      <div className={s.head}><p className={s.kicker}>What you can teach</p><h2>Pick a category and start.</h2></div>
      <div className={s.catGrid}>{categories.map(c => <div key={c.name} className={s.cat}><h3>{c.name}</h3><div>{c.topics.map(t => <span key={t}>{t}</span>)}</div></div>)}</div>
    </section>

    <section className={s.helpSec}>
      <div className={s.head}><p className={s.kicker}>You are not alone</p><h2>We help you from first lesson to first learners.</h2></div>
      <div className={s.helpGrid}>{help.map(h => <div key={h.title}><h3>{h.title}</h3><p>{h.text}</p></div>)}</div>
    </section>

    <section className={s.cta}>
      <h2>Become an instructor today</h2>
      <p>Create your account, tell us what you want to teach and we will help you launch.</p>
      <Link href="/signup?as=teach" className={s.ctaBtn}>Start teaching <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.2} /></Link>
    </section>
    <Footer />
  </div>;
}
