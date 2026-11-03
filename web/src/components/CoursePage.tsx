'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Award01Icon, ArrowDown01Icon, Calendar03Icon, CheckmarkCircle02Icon, Clock01Icon, FavouriteIcon, Globe02Icon, InfinityIcon, PlayIcon, SmartPhone01Icon, StarIcon, Tick02Icon, VideoReplayIcon} from '@hugeicons/core-free-icons';
import {type Course} from '@/lib/courses';
import {useMoney} from '@/lib/prefs';
import {totalLectures, totalMinutes, type Detail} from '@/lib/courseDetail';
import {CourseCard, Heart, categoryIcon, useWish} from './CourseCard';
import s from './CoursePage.module.css';

const dur = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
const students = (c: Course) => (c.reviews * 8).toLocaleString();

function Stars({v}: {v: number}) {
  return <span className={s.stars} aria-label={`${v} out of 5`}>{[1, 2, 3, 4, 5].map(i => <HugeiconsIcon key={i} icon={StarIcon} size={14} className={i <= Math.round(v) ? s.starOn : s.starOff} />)}</span>;
}

/** Placeholder blocks that shimmer, shown for a moment so the page appears gradually. */
function Skeleton() {
  return <div className={s.sk} aria-hidden>
    <div className={s.skHead}><div className={`${s.b} ${s.shimmer}`} style={{width: '30%', height: 14}} /><div className={`${s.b} ${s.shimmer}`} style={{width: '70%', height: 38, marginTop: 20}} /><div className={`${s.b} ${s.shimmer}`} style={{width: '55%', height: 18, marginTop: 18}} /><div className={`${s.b} ${s.shimmer}`} style={{width: '40%', height: 14, marginTop: 18}} /></div>
    <div className={s.skBody}>
      <div className={`${s.b} ${s.shimmer}`} style={{height: 170}} />
      <div className={`${s.b} ${s.shimmer}`} style={{width: '45%', height: 24, marginTop: 36}} />
      {[0, 1, 2, 3].map(i => <div key={i} className={`${s.b} ${s.shimmer}`} style={{height: 54, marginTop: 10}} />)}
    </div>
  </div>;
}

/** Single course page after Udemy's: dark header, sticky purchase card, what you'll learn, content list, requirements, instructor. */
export function CoursePage({course: c, detail: d, more}: {course: Course; detail: Detail; more: Course[]}) {
  const money = useMoney();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number[]>([0]);
  const [bar, setBar] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wished, toggleWish] = useWish(c.id);
  const head = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => { const t = setTimeout(() => setReady(true), 800); return () => clearTimeout(t); }, []);

  // Slim bar with the title and price once the header has scrolled away; and a bottom bar on phones.
  useEffect(() => {
    if (!ready) return;
    const onScroll = () => setBar((head.current?.getBoundingClientRect().bottom ?? 1) < 80);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [ready]);
  useEffect(() => {
    document.documentElement.style.setProperty('--teach-bar', ready ? '76px' : '0px');
    return () => { document.documentElement.style.removeProperty('--teach-bar'); };
  }, [ready]);

  const lectures = totalLectures(d);
  const hours = Math.max(1, Math.round(totalMinutes(d) / 60));
  const off = c.was ? Math.round((1 - c.price / c.was) * 100) : 0;
  const allOpen = open.length === d.modules.length;
  const toggle = (i: number) => setOpen(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));
  const copyCode = async () => { try { await navigator.clipboard.writeText('WELCOME10'); } catch { /* shown anyway */ } setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const preview = () => { setPlaying(true); setTimeout(() => video.current?.play().catch(() => {}), 50); };

  if (!ready) return <Skeleton />;

  const card = <aside className={s.buy}>
    <div className={s.preview} data-tone={c.tone}>
      {playing ? <video ref={video} src="/video/learn.mp4" controls playsInline autoPlay muted /> : <button onClick={preview} aria-label="Preview this course">
        <HugeiconsIcon icon={categoryIcon[c.category]} size={72} strokeWidth={1.3} className={s.glyph} />
        <span className={s.play}><HugeiconsIcon icon={PlayIcon} size={26} /></span>
        <em>Preview this course</em>
      </button>}
    </div>
    <div className={s.buyBody}>
      <p className={s.price}><b>{money(c.price)}</b>{c.was && <><s>{money(c.was)}</s><span>{off}% off</span></>}</p>
      <Link href="/signup" className={s.enroll}>Enroll now</Link>
      <button className={s.wish} onClick={toggleWish} aria-pressed={wished}><HugeiconsIcon icon={wished ? Tick02Icon : FavouriteIcon} size={18} strokeWidth={2} />{wished ? 'Saved to wishlist' : 'Save to wishlist'}</button>
      <p className={s.fine}>Pay once, in the currency you choose. Keep access after you finish. <Link href="/terms">Refund policy</Link></p>
      <button className={s.code} onClick={copyCode}>Use code <b>WELCOME10</b> for 10% off your first course<span>{copied ? 'Copied' : 'Copy'}</span></button>
      <h4>This course includes</h4>
      <ul>
        <li><HugeiconsIcon icon={VideoReplayIcon} size={17} />{hours} {hours === 1 ? 'hour' : 'hours'} of short video lessons</li>
        <li><HugeiconsIcon icon={SmartPhone01Icon} size={17} />Learn on iPhone and Android</li>
        <li><HugeiconsIcon icon={InfinityIcon} size={17} />Keep access after you finish</li>
        <li><HugeiconsIcon icon={Award01Icon} size={17} />Certificate of completion</li>
      </ul>
    </div>
  </aside>;

  return <div className={s.page}>
    <div className={`${s.mini} ${bar ? s.miniOn : ''}`} aria-hidden={!bar}>
      <div className={s.miniIn}><div><b>{c.title}</b><span><HugeiconsIcon icon={StarIcon} size={13} />{c.rating.toFixed(1)} ({c.reviews.toLocaleString()} ratings) · {students(c)} learners</span></div>
        <p>{money(c.price)}</p><Link href="/signup" className={s.miniBtn} tabIndex={bar ? 0 : -1}>Enroll now</Link></div>
    </div>

    <header ref={head} className={s.header}>
      <div className={s.headIn}>
        <div className={s.headText}>
          <nav className={s.crumbs} aria-label="Breadcrumb"><Link href="/courses">Courses</Link><i>›</i><Link href={`/courses?category=${encodeURIComponent(c.category)}`}>{c.category}</Link><i>›</i><span>{c.topic}</span></nav>
          <h1>{c.title}</h1>
          <p className={s.sub}>{d.sub}</p>
          <div className={s.badges}>{c.tag && <span className={s.badge}>{c.tag === 'New' ? 'New' : 'Bestseller'}</span>}
            <span className={s.rate}><b>{c.rating.toFixed(1)}</b><Stars v={c.rating} /><u>({c.reviews.toLocaleString()} ratings)</u></span><span>{students(c)} learners</span></div>
          <p className={s.by}>Created by <a href="#instructor">{c.instructor}</a></p>
          <div className={s.meta}><span><HugeiconsIcon icon={Calendar03Icon} size={15} />Last updated 10/2026</span><span><HugeiconsIcon icon={Globe02Icon} size={15} />English</span><span><HugeiconsIcon icon={Clock01Icon} size={15} />{c.level}</span></div>
        </div>
      </div>
    </header>

    <div className={s.layout}>
      <div className={s.main}>
        <div className={s.mobileCard}>{card}</div>

        <section className={s.learn}>
          <h2>What you&apos;ll learn</h2>
          <ul>{d.learn.map(l => <li key={l}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />{l}</li>)}</ul>
        </section>

        <section className={s.topics}>
          <h2>Explore related topics</h2>
          <div>{[c.topic, c.category, c.level].map(t => <Link key={t} href={`/courses?q=${encodeURIComponent(t)}`}>{t}</Link>)}</div>
        </section>

        <section>
          <h2>Course content</h2>
          <div className={s.contentHead}>
            <span>{d.modules.length} sections · {lectures} lessons · {dur(totalMinutes(d))} total length</span>
            <button onClick={() => setOpen(allOpen ? [] : d.modules.map((_, i) => i))}>{allOpen ? 'Collapse all sections' : 'Expand all sections'}</button>
          </div>
          <div className={s.acc}>
            {d.modules.map((m, i) => <div key={m.title} className={s.mod}>
              <button aria-expanded={open.includes(i)} onClick={() => toggle(i)}>
                <HugeiconsIcon icon={ArrowDown01Icon} size={18} strokeWidth={2.2} className={open.includes(i) ? s.flip : ''} />
                <b>{m.title}</b><span>{m.lectures.length} lessons · {dur(m.lectures.reduce((a, l) => a + l.minutes, 0))}</span>
              </button>
              <div className={`${s.panel} ${open.includes(i) ? s.panelOpen : ''}`}><div><ul>
                {m.lectures.map(l => <li key={l.title}><HugeiconsIcon icon={VideoReplayIcon} size={16} /><span>{l.title}</span>{l.preview && <Link href="/signup" className={s.prev}>Preview</Link>}<em>{String(l.minutes).padStart(2, '0')}:00</em></li>)}
              </ul></div></div>
            </div>)}
          </div>
        </section>

        <section><h2>Requirements</h2><ul className={s.dots}>{d.needs.map(n => <li key={n}>{n}</li>)}</ul></section>
        <section><h2>Description</h2>{d.about.map(p => <p key={p} className={s.p}>{p}</p>)}</section>

        <section id="instructor">
          <h2>Instructor</h2>
          <div className={s.inst}>
            <i>{c.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}</i>
            <div><b>{c.instructor}</b><span>{c.category} instructor</span>
              <p><HugeiconsIcon icon={StarIcon} size={14} />{c.rating.toFixed(1)} instructor rating · {students(c)} learners</p>
              <p className={s.p}>{d.bio}</p></div>
          </div>
        </section>
      </div>
      <div className={s.side}>{card}</div>
    </div>

    {more.length > 0 && <section className={s.more}>
      <h2>More in {c.category}</h2>
      <div className={s.moreGrid}>{more.map(m => <CourseCard key={m.id} course={m} />)}</div>
    </section>}

    <div className={s.phoneBar}>
      <div><b>{money(c.price)}</b>{c.was && <s>{money(c.was)}</s>}</div>
      <Heart id={c.id} className={s.phoneHeart} />
      <Link href="/signup" className={s.phoneBtn}>Enroll now</Link>
    </div>
  </div>;
}
