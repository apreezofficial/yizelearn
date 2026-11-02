import Image from 'next/image';
import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, Award01Icon, CheckmarkCircle02Icon, Mic01Icon, PlayIcon, SentIcon, Video01Icon} from '@hugeicons/core-free-icons';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Hero} from '@/components/Hero';
import {Faq} from '@/components/Faq';
import {OfferBanner} from '@/components/OfferBanner';
import {GoalCourses} from '@/components/Explore';
import {Journey} from '@/components/Journey';
import {SwitchCta} from '@/components/SwitchCta';
import {Footer} from '@/components/Footer';
import {QuizDemo, ScrollWords} from '@/components/Live';
import {paths} from '@/lib/courses';
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

    {/* Course browser: the statement fills in, lifts, then the goal tabs and course cards slide up beneath it */}
    <div id="courses"><ScrollWords label="Find your next course" text="Pick a goal and we line up short, practical courses that get you there, taught by people who do the work every day." accent={['goal', 'practical']}>
      <GoalCourses />
    </ScrollWords></div>

    {/* Product walk-through after pxxl.app: sticky numbered steps on the left, the matching screen on the right */}
    <Journey title="One place to learn, practise and prove it." steps={[
      {kicker: 'Lessons', title: 'Learn from short lessons', detail: 'Bite-size videos from people who do the work.', screen: <div className={s.appFrame}>
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
      </div>},
      {kicker: 'Quizzes', title: 'Check yourself as you go', detail: 'A short quiz after every module, marked instantly.', screen: <div className={`${s.appFrame} ${s.quizWrap}`}><QuizDemo /></div>},
      {kicker: 'Live classes', title: 'Ask the instructor, live', detail: 'Weekly live classes with Q&A, recorded if you miss one.', screen: <div className={s.appFrame}>
        <div className={s.liveClass}>
          <div className={s.ring} aria-hidden />
          <div className={s.bubbleThem}>How do I lock a cell in a formula?</div>
          <div className={s.bubbleMe}>Press F4 on the reference. It adds the $ signs for you.</div>
          <div className={s.liveTag}><HugeiconsIcon icon={Video01Icon} size={14} /> Live · 214 watching <HugeiconsIcon icon={Mic01Icon} size={14} /></div>
          <div className={s.composer}>Type a question<HugeiconsIcon icon={SentIcon} size={14} /></div>
        </div>
      </div>},
      {kicker: 'Checkout', title: 'Pay once in naira', detail: 'Card or bank transfer. Keep access after you finish.', screen: <div className={s.appFrame}>
        <div className={s.checkout}>
          <div className={s.coRow}><span>Data analysis in Excel</span><b>₦15,000</b></div>
          <div className={s.coRow}><span>Promo WELCOME10</span><b className={s.green}>−₦1,500</b></div>
          <div className={`${s.coRow} ${s.coTotal}`}><span>Total</span><b>₦13,500</b></div>
          <div className={s.coMethods}><span className={s.on}>Card</span><span>Bank transfer</span></div>
          <div className={s.coPay}>Pay ₦13,500</div>
        </div>
      </div>},
      {kicker: 'Progress', title: 'Keep going every day', detail: 'Progress bars and streaks that make finishing easy.', screen: <div className={s.appFrame}>
        <div className={s.progress}>
          {[['Data analysis in Excel', 72], ['Business writing', 40], ['Intro to Python', 18]].map(([t, p], i) => <div key={t as string} className={s.pRow}>
            <span>{t}</span><div className={s.pTrack}><i style={{width: `${p}%`, animationDelay: `${i * 150}ms`}} /></div><b>{p}%</b>
          </div>)}
          <div className={s.streak}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className={i < 5 ? s.lit : ''} style={{animationDelay: `${i * 90}ms`}}>{d}</span>)}<em>5-day streak</em></div>
        </div>
      </div>},
      {kicker: 'Certificate', title: 'Finish with a certificate', detail: 'Share it to LinkedIn or download the PDF.', screen: <div className={`${s.appFrame} ${s.certFrame}`}>
        <div className={s.certStage}>
          <div className={s.cert}>
            <small>Certificate of completion</small>
            <strong>Mercy Ibe</strong>
            <span>has completed <b>Data analysis in Excel</b></span>
            <div className={s.certFoot}><Image src="/logo.png" alt="" width={64} height={25} /><i><HugeiconsIcon icon={Award01Icon} size={18} /></i></div>
          </div>
          <div className={s.share}><span>Share to</span><b>LinkedIn</b><b>Download PDF</b></div>
        </div>
      </div>},
    ]} />

    {/* Career paths: same pinned sequence, on navy */}
    <div className={s.wordsGap} />
    <ScrollWords dark label="Paths" text="Follow a path, not a pile of courses. Each one lines up the right courses in the right order, with a project at the end you can show." accent={['path', 'project']}>
      <div className={s.paths}>
        {paths.map((p, i) => <Link key={p.title} href="/signup" className={`${s.path} ${p.light ? s.pathLight : ''}`} style={{['--from' as string]: p.from, ['--to' as string]: p.to, ['--i' as string]: i}}>
          <span className={s.pathGlow} aria-hidden />
          <h3>{p.title}</h3>
          <p>{p.outcome}</p>
          <ul>{p.skills.map(k => <li key={k}>{k}</li>)}</ul>
          <div className={s.pathFoot}><span>{p.courses} courses · {p.hours}h</span><Arrow /></div>
        </Link>)}
      </div>
    </ScrollWords>

    <OfferBanner />

    <Faq />

    {/* Closing call to action: Upwork-style card with a Learn / Teach switch over video */}
    <SwitchCta />

    <Footer />
  </div>;
}

