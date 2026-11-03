import Image from 'next/image';
import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, ArrowUpRight01Icon, Award01Icon, BookOpen01Icon, Calendar01Icon, CheckmarkCircle02Icon, Clock01Icon, Globe02Icon, LaptopIcon, UserGroupIcon} from '@hugeicons/core-free-icons';
import {Balloon, Ball, Learner, Pinwheel, Plane, Scribble, Squiggle, Sun, Target} from '@/components/Art';
import s from './page.module.css';

const tracks = [
  {title: 'Spreadsheet skills that pay', color: s.orange, look: {skin: '#8D5A3B', hair: '#1E2530', top: '#FDF8F1', hairStyle: 'puff', glasses: true, prop: 'books'} as const},
  {title: 'Ideas you can ship', color: s.green, look: {skin: '#E9B48C', hair: '#6B3E26', top: '#FDF8F1', hairStyle: 'short', prop: 'laptop'} as const},
  {title: 'Grow into your next role', color: s.blue, look: {skin: '#C68B5E', hair: '#2B1B12', top: '#24508F', hairStyle: 'bun', prop: 'cert'} as const},
];

const categories = [
  {title: 'Business', detail: 'Excel, finance and writing', bg: '#74A7E3', look: {skin: '#8D5A3B', hair: '#1E2530', top: '#F0B74A', hairStyle: 'braids', prop: 'books'} as const},
  {title: 'Tech', detail: 'Python and automation', bg: '#E86A4A', look: {skin: '#E9B48C', hair: '#3A2418', top: '#2F6DB5', hairStyle: 'long', glasses: true, prop: 'laptop'} as const},
  {title: 'Design', detail: 'Slides, posters, social', bg: '#2E8B67', look: {skin: '#C68B5E', hair: '#1E2530', top: '#FDF8F1', hairStyle: 'short', prop: 'tablet'} as const},
  {title: 'Health', detail: 'Habits for busy people', bg: '#F0B74A', look: {skin: '#A86B45', hair: '#2B1B12', top: '#B53A3A', hairStyle: 'puff', prop: 'none'} as const},
];

const nav = ['Courses', 'How it works', 'Pricing', 'Teach on yizelearn'];

export default function Home() {
  return <div className={s.page}>
    <header className={s.nav}>
      <Link href="/" className={s.brand}><Image src="/logo.png" alt="yizelearn" width={112} height={44} priority /></Link>
      <nav className={s.links} aria-label="Main">{nav.map(n => <Link key={n} href={`#${n.toLowerCase().replace(/\s+/g, '-')}`}>{n}</Link>)}</nav>
      <Link href="#start" className={s.navCta}>Get started</Link>
    </header>

    <main>
      {/* Hero */}
      <section className={s.hero}>
        <span className={`${s.float} ${s.balloon}`}><Balloon /></span>
        <span className={`${s.float} ${s.ball}`}><Ball /></span>
        <h1 className={s.display}>Putting your <em>skills</em> on a <span className={s.accent}>faster track</span></h1>
        <ul className={s.checks}>
          {['Pay once, keep access', 'Certificate on every course', 'Live classes each week'].map(c => <li key={c}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />{c}</li>)}
        </ul>
        <div className={s.heroRow}>
          <figure className={`${s.portrait} ${s.portraitLeft}`}>
            <span className={`${s.blob} ${s.blobGreen}`} />
            <span className={s.target}><Target /></span>
            <Learner skin="#8D5A3B" hair="#1E2530" top="#2E8B67" hairStyle="puff" prop="books" />
          </figure>
          <div className={s.heroMid}>
            <Link href="#start" className={s.primary}>Start learning <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} /></Link>
            <p>Short, practical lessons from people who do the work, so you use it on Monday.</p>
            <div className={s.scribble}><Scribble /></div>
          </div>
          <figure className={`${s.portrait} ${s.portraitRight}`}>
            <span className={`${s.blob} ${s.blobGold}`} />
            <Learner skin="#E9B48C" hair="#6B3E26" top="#B53A3A" hairStyle="long" prop="laptop" />
          </figure>
        </div>
      </section>

      {/* Stats band */}
      <section className={s.stats} aria-label="yizelearn in numbers">
        {[
          {icon: BookOpen01Icon, value: '300+', label: 'Courses across business, tech, design and health', tone: s.toneRed},
          {icon: UserGroupIcon, value: '12K+', label: 'Learners growing their careers with us', tone: s.toneGold},
          {icon: Award01Icon, value: '8K+', label: 'Certificates earned and shared', tone: s.toneGreen},
        ].map(x => <div key={x.value} className={s.stat}>
          <span className={`${s.statIcon} ${x.tone}`}><HugeiconsIcon icon={x.icon} size={18} /></span>
          <div><strong>{x.value}</strong><p>{x.label}</p></div>
        </div>)}
        <span className={s.plane}><Plane color="#74A7E3" /></span>
      </section>

      {/* Tracks */}
      <section className={s.section} id="courses">
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Smart, practical skills <br />ready to <span className={s.accent}>take you far!</span></h2>
          <p>Learn with us in short lessons. One clear skill per lesson, at your own pace.</p>
          <Link href="#start" className={s.ghost}>Enrol now <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} /></Link>
        </div>
        <div className={s.tracks}>
          {tracks.map(t => <article key={t.title} className={`${s.track} ${t.color}`}>
            <span className={s.squiggle}><Squiggle /></span>
            <h3>{t.title}</h3>
            <div className={s.trackArt}><Learner {...t.look} /></div>
          </article>)}
        </div>
      </section>

      {/* Categories */}
      <section className={s.section} id="how-it-works">
        <p className={s.kicker}>Every course, one focused skill</p>
        <h2 className={`${s.h2} ${s.center}`}><span className={s.sun}><Sun /></span>Shaping the <span className={s.accent}>future</span> of work</h2>
        <div className={s.cats}>
          {categories.map(c => <Link key={c.title} href="#courses" className={s.cat}>
            <span className={s.catArt}><span className={s.catBlob} style={{background: c.bg}} /><Learner {...c.look} /></span>
            <strong>{c.title}</strong><span>{c.detail}</span>
          </Link>)}
        </div>
      </section>

      {/* Promo pair */}
      <section className={`${s.section} ${s.promos}`}>
        <article className={`${s.promo} ${s.promoGold}`}>
          <div>
            <h3>Confidence that builds a brighter career.</h3>
            <p>Quizzes, projects and feedback that prove what you can do.</p>
            <Link href="#start" className={s.small}>Browse courses <HugeiconsIcon icon={ArrowRight01Icon} size={14} /></Link>
          </div>
          <div className={s.promoArt}><Learner skin="#C68B5E" hair="#1E2530" top="#74A7E3" hairStyle="short" glasses prop="books" /></div>
        </article>
        <article className={`${s.promo} ${s.promoOrange}`}>
          <div>
            <h3>Helping you shoot for your goals.</h3>
            <p>Track progress and earn a certificate you can share.</p>
            <Link href="#start" className={s.small}>Learn more <HugeiconsIcon icon={ArrowRight01Icon} size={14} /></Link>
          </div>
          <span className={s.pinwheel}><Pinwheel /></span>
        </article>
      </section>

      {/* Empower */}
      <section className={`${s.section} ${s.empower}`}>
        <div>
          <span className={s.tag}>Enrolment is open</span>
          <h2 className={s.h2}>Empower your career to think <span className={s.accent}>smarter</span> and sharper</h2>
          <p>Hands-on lessons, real projects and an instructor who answers your questions.</p>
          <Link href="#start" className={s.primary}>Get started <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} /></Link>
        </div>
        <div className={s.empowerArt}>
          <span className={`${s.blob} ${s.blobBlue}`} />
          <Learner skin="#A86B45" hair="#2B1B12" top="#F0B74A" hairStyle="braids" prop="cert" />
          <div className={s.proof}>
            <span><HugeiconsIcon icon={Globe02Icon} size={18} /><b>12K+</b>learners across Africa</span>
            <span><HugeiconsIcon icon={LaptopIcon} size={18} /><b>40+</b>live classes a month</span>
          </div>
        </div>
      </section>

      {/* Live class */}
      <section className={s.section} id="start">
        <article className={s.event}>
          <div className={s.eventArt}><Learner skin="#E9B48C" hair="#3A2418" top="#2E8B67" hairStyle="long" glasses prop="laptop" /></div>
          <div className={s.eventCopy}>
            <span className={s.tag}>Next live class</span>
            <h3>Build your first dashboard, one step at a time</h3>
            <p>Adaeze Okafor walks through a real sales sheet, live, with Q&amp;A at the end.</p>
            <div className={s.eventMeta}><span><HugeiconsIcon icon={Calendar01Icon} size={16} />14 Nov 2026</span><span><HugeiconsIcon icon={Clock01Icon} size={16} />6:00 PM WAT</span></div>
          </div>
        </article>
      </section>
    </main>

    <footer className={s.footer} id="pricing">
      <Image src="/logo.png" alt="yizelearn" width={96} height={38} />
      <p>Short, practical courses for people with busy lives.</p>
      <span>© 2026 yizelearn</span>
    </footer>
  </div>;
}
