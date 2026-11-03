import Image from 'next/image';
import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, Award01Icon, CheckmarkCircle02Icon, Clock01Icon, Maximize02Icon, Mic01Icon, PlayIcon, SentIcon, UserGroupIcon, Video01Icon} from '@hugeicons/core-free-icons';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Hero} from '@/components/Hero';
import {GoalCourses} from '@/components/Explore';
import {CountUp, QuizDemo, Reveal} from '@/components/Live';
import {paths, stories} from '@/lib/courses';
import s from './page.module.css';

const topics = ['Excel', 'Financial modelling', 'Python', 'Business writing', 'Design basics', 'Data analysis', 'Public speaking', 'Project management', 'Macros', 'Healthy habits'];

const Arrow = () => <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.4} className={s.arrow} />;

export default function Home() {
  return <div className={s.page}>
    <OfferBar />
    <SiteNav />
    <Hero />

    {/* Topic marquee */}
    <div className={s.marquee} aria-label="Popular topics">
      <div className={s.track}>{[...topics, ...topics].map((t, i) => <span key={i} aria-hidden={i >= topics.length}>{t}</span>)}</div>
    </div>

    {/* Course browser by goal */}
    <section className={s.section}>
      <Reveal className={s.reveal}>
        <p className={s.kicker}>Find your next course</p>
        <h2 className={s.h2}>What do you want to get better at?</h2>
      </Reveal>
      <GoalCourses />
    </section>

    {/* Bento of product moments */}
    <section className={s.section} id="courses">
      <Reveal className={s.reveal}><h2 className={s.h2}>One place to learn, practise and prove it.</h2></Reveal>
      <div className={s.bento}>
        <Reveal className={`${s.card} ${s.wide} ${s.reveal}`}>
          <CardHead title="Learn from short, sharp lessons" />
          <div className={s.player}>
            <div className={s.video}>
              <span className={s.play}><HugeiconsIcon icon={PlayIcon} size={22} /></span>
              <div className={s.videoBar}><span /></div>
            </div>
            <div className={s.lessons}>
              <small>Module 2 · Formulas</small>
              {[['Cell references', true], ['SUMIF and COUNTIF', true], ['Lookup functions', false], ['Text functions', false]].map(([t, done], i) => <div key={t as string} className={`${s.lesson} ${i === 2 ? s.now : ''}`}>
                <i className={done ? s.done : ''}>{done ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} /> : i + 1}</i>{t}<em>{8 + i} min</em>
              </div>)}
            </div>
          </div>
        </Reveal>

        <Reveal className={`${s.card} ${s.reveal}`} delay={80}>
          <CardHead title="Check yourself as you go" />
          <div className={s.quizWrap}><QuizDemo /></div>
        </Reveal>

        <Reveal className={`${s.card} ${s.reveal}`}>
          <CardHead title="Ask the instructor, live" />
          <div className={s.liveClass}>
            <div className={s.ring} aria-hidden />
            <div className={s.bubbleThem}>How do I lock a cell in a formula?</div>
            <div className={s.bubbleMe}>Press F4 on the reference. It adds the $ signs for you.</div>
            <div className={s.liveTag}><HugeiconsIcon icon={Video01Icon} size={14} /> Live · 214 watching <HugeiconsIcon icon={Mic01Icon} size={14} /></div>
            <div className={s.composer}>Type a question<HugeiconsIcon icon={SentIcon} size={14} /></div>
          </div>
        </Reveal>

        <Reveal className={`${s.card} ${s.wide} ${s.reveal}`} delay={80}>
          <CardHead title="Finish with a certificate worth sharing" />
          <div className={s.certStage}>
            <div className={s.cert}>
              <small>Certificate of completion</small>
              <strong>Mercy Ibe</strong>
              <span>has completed <b>Data analysis in Excel</b></span>
              <div className={s.certFoot}><Image src="/logo.png" alt="" width={64} height={25} /><i><HugeiconsIcon icon={Award01Icon} size={18} /></i></div>
            </div>
            <div className={s.share}><span>Share to</span><b>LinkedIn</b><b>Download PDF</b></div>
          </div>
        </Reveal>

        <Reveal className={`${s.card} ${s.reveal}`}>
          <CardHead title="Pay once in naira" />
          <div className={s.checkout}>
            <div className={s.coRow}><span>Data analysis in Excel</span><b>₦15,000</b></div>
            <div className={s.coRow}><span>Promo WELCOME10</span><b className={s.green}>−₦1,500</b></div>
            <div className={`${s.coRow} ${s.coTotal}`}><span>Total</span><b>₦13,500</b></div>
            <div className={s.coMethods}><span className={s.on}>Card</span><span>Bank transfer</span></div>
            <div className={s.coPay}>Pay ₦13,500</div>
          </div>
        </Reveal>

        <Reveal className={`${s.card} ${s.wide} ${s.reveal}`} delay={80}>
          <CardHead title="Keep going with streaks and progress" />
          <div className={s.progress}>
            {[['Data analysis in Excel', 72], ['Business writing', 40], ['Intro to Python', 18]].map(([t, p], i) => <div key={t as string} className={s.pRow}>
              <span>{t}</span><div className={s.pTrack}><i style={{width: `${p}%`, animationDelay: `${i * 150}ms`}} /></div><b>{p}%</b>
            </div>)}
            <div className={s.streak}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className={i < 5 ? s.lit : ''} style={{animationDelay: `${i * 90}ms`}}>{d}</span>)}<em>5-day streak</em></div>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Career paths */}
    <section className={s.section}>
      <Reveal className={s.reveal}>
        <p className={s.kicker}>Paths</p>
        <h2 className={s.h2}>Follow a path, not a pile of courses.</h2>
        <p className={s.sub}>Each path lines up the right courses in the right order, with a project at the end you can show.</p>
      </Reveal>
      <div className={s.paths}>
        {paths.map((p, i) => <Reveal key={p.title} delay={i * 80} className={s.reveal}>
          <Link href="#" className={`${s.path} ${p.light ? s.pathLight : ''}`} style={{['--from' as string]: p.from, ['--to' as string]: p.to}}>
            <span className={s.pathGlow} aria-hidden />
            <h3>{p.title}</h3>
            <p>{p.outcome}</p>
            <ul>{p.skills.map(k => <li key={k}>{k}</li>)}</ul>
            <div className={s.pathFoot}><span>{p.courses} courses · {p.hours}h</span><Arrow /></div>
          </Link>
        </Reveal>)}
      </div>
    </section>

    {/* Dark numbers section */}
    <section className={s.dark}>
      <div className={s.darkInner}>
        <Reveal className={s.reveal}>
          <p className={s.eyebrow}>Built for busy people</p>
          <h2 className={s.h2}>Learning that fits around work, family and data plans.</h2>
          <p className={s.darkLede}>Lessons are short and light on data. Download them on Wi-Fi and watch offline on the bus.</p>
        </Reveal>
        <div className={s.stats}>
          {[{v: 12480, suf: '+', l: 'learners'}, {v: 312, suf: '', l: 'courses'}, {v: 94, suf: '%', l: 'finish what they start'}, {v: 40, suf: '+', l: 'live classes a month'}].map((x, i) => <Reveal key={x.l} className={`${s.stat} ${s.reveal}`} delay={i * 80}>
            <strong><CountUp to={x.v} suffix={x.suf} /></strong><span>{x.l}</span>
          </Reveal>)}
        </div>
      </div>
    </section>

    {/* Learner stories */}
    <section className={s.section}>
      <Reveal className={s.reveal}>
        <p className={s.kicker}>Learner stories</p>
        <h2 className={s.h2}>People moving forward, one short lesson at a time.</h2>
      </Reveal>
      <div className={s.stories}>
        {stories.map((t, i) => <Reveal key={t.name} delay={i * 90} className={`${s.story} ${s.reveal}`}>
          <span className={s.quoteMark} aria-hidden>“</span>
          <blockquote>{t.quote}</blockquote>
          <div className={s.who}><span className={s.avatar} aria-hidden>{t.name[0]}</span><div><b>{t.name}</b><span>{t.role}</span></div></div>
          <small>Took: {t.course}</small>
        </Reveal>)}
      </div>
    </section>

    {/* Teach and teams */}
    <section className={`${s.section} ${s.pair}`}>
      <Reveal className={`${s.pairCard} ${s.reveal}`}>
        <span className={s.pairIcon}><HugeiconsIcon icon={Mic01Icon} size={22} /></span>
        <h3>Teach what you know</h3>
        <p>Turn your experience into a course. We help with the outline, filming tips and getting your first learners.</p>
        <Link href="#" className={s.textLink}>Become an instructor <Arrow /></Link>
      </Reveal>
      <Reveal className={`${s.pairCard} ${s.pairDark} ${s.reveal}`} delay={80}>
        <span className={s.pairIcon}><HugeiconsIcon icon={UserGroupIcon} size={22} /></span>
        <h3>Train your whole team</h3>
        <p>Give your staff the same courses, track progress in one dashboard and pay on one invoice.</p>
        <Link href="#" className={s.textLink}>Talk to us about teams <Arrow /></Link>
      </Reveal>
    </section>

    {/* Closing call to action */}
    <section className={s.section}>
      <Reveal className={`${s.closing} ${s.reveal}`}>
        <div className={s.closingRibbon} aria-hidden><span /><span /></div>
        <h2 className={s.h2}>Ready to start?</h2>
        <p>Pick a course, learn at your pace, and keep access after you finish.</p>
        <div className={s.ctas}>
          <Link href="#" className={s.primary}>Start learning <Arrow /></Link>
          <Link href="#" className={s.secondary}><HugeiconsIcon icon={Clock01Icon} size={16} /> See this week&apos;s live classes</Link>
        </div>
      </Reveal>
    </section>

    <footer className={s.footer}>
      <Image src="/logo.png" alt="yizelearn" width={96} height={38} />
      <nav aria-label="Footer">{['Courses', 'Live classes', 'Teach', 'Help centre', 'Privacy', 'Terms'].map(n => <Link key={n} href="#">{n}</Link>)}</nav>
      <span>© 2026 yizelearn</span>
    </footer>
  </div>;
}

function CardHead({title}: {title: string}) {
  return <div className={s.cardHead}><h3>{title}</h3><span className={s.expand} aria-hidden><HugeiconsIcon icon={Maximize02Icon} size={16} /></span></div>;
}
