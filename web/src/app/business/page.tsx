import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowRight01Icon, BriefcaseBusinessIcon, ChartBarIncreasingIcon, CheckmarkCircle02Icon, CourseIcon, Presentation01Icon, ShieldUserIcon, UserGroupIcon} from '@hugeicons/core-free-icons';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import s from './page.module.css';

const features = [
  {icon: UserGroupIcon, title: 'Give every team a clear path', text: 'Assign practical learning by role, department or cohort—without the admin work.'},
  {icon: ChartBarIncreasingIcon, title: 'See progress without chasing updates', text: 'Keep a simple view of enrolment, completion and the skills your teams are building.'},
  {icon: ShieldUserIcon, title: 'Built for your organisation', text: 'Manage admins, cohorts and learner access from one calm, straightforward workspace.'},
];

export default function BusinessPage() { return <div className={s.page}>
  <OfferBar /><SiteNav />
  <main>
    <section className={s.hero}>
      <div className={s.heroCopy}><p className={s.eyebrow}>YIZELEARN FOR BUSINESS</p><h1>Give your people skills they can use <em>this week.</em></h1><p>Practical learning for ambitious teams. Build capability across your company, see what is landing, and help every person move forward.</p><div className={s.actions}><Link href="/signup" className={s.primary}>Talk to our team <HugeiconsIcon icon={ArrowRight01Icon} size={18} /></Link><a href="#how-it-works" className={s.secondary}>See how it works</a></div><small>No long contracts for small teams. Flexible plans as you grow.</small></div>
      <div className={s.heroVisual} aria-label="Example team learning dashboard">
        <div className={s.glow} /><div className={s.dashboardCard}><div className={s.dashTop}><span><i />Acme team</span><b>October</b></div><div className={s.dashHeading}><div><small>Team learning</small><strong>62% <em>completion</em></strong></div><span className={s.up}>↑ 18%</span></div><div className={s.bars}>{[44, 71, 56, 84, 62, 91, 75].map((height, index) => <i key={index} style={{height: `${height}%`}} />)}</div><div className={s.dashRows}><span><b>Sales onboarding</b><i><em style={{width: '78%'}} /></i><strong>78%</strong></span><span><b>Data foundations</b><i><em style={{width: '46%'}} /></i><strong>46%</strong></span></div></div>
        <div className={s.people}><span>MI</span><span>CE</span><span>AO</span><b>+46 learners</b></div><div className={s.floatingCard}><HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} /><span><strong>New milestone</strong><small>24 learners completed Python</small></span></div>
      </div>
    </section>

    <section className={s.trust}><p>Made for teams building real capability—not just collecting course completions.</p><div><span>ONBOARDING</span><span>MANAGERS</span><span>TECHNICAL TEAMS</span><span>GRADUATE PROGRAMMES</span></div></section>

    <section className={s.intro} id="how-it-works"><p className={s.eyebrow}>ONE PLACE. A WHOLE TEAM MOVING FORWARD.</p><h2>Learning that is easy to launch and even easier to follow through on.</h2></section>
    <section className={s.featureGrid}>{features.map(feature => <article key={feature.title}><span className={s.icon}><HugeiconsIcon icon={feature.icon} size={25} /></span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</section>

    <section className={s.split}><div><p className={s.eyebrow}>FROM FIRST DAY TO NEXT ROLE</p><h2>Training your people will actually finish.</h2><p>Build short, relevant pathways from yizelearn’s practical catalogue. Mix essential skills, manager picks and role-specific learning in one plan.</p><ul><li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />Create cohorts for teams, intakes or locations</li><li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />Assign courses with a deadline and simple reminders</li><li><HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />Celebrate completion with shareable certificates</li></ul><Link href="/signup" className={s.textLink}>Build a learning plan <HugeiconsIcon icon={ArrowRight01Icon} size={17} /></Link></div><div className={s.pathBoard}><div className={s.boardHead}><span><HugeiconsIcon icon={BriefcaseBusinessIcon} size={18} />Sales team, November</span><b>48 learners</b></div><div className={s.boardProgress}><span>Overall progress</span><strong>72%</strong><i><em /></i></div>{[['Welcome to the team', 'Complete'], ['Data analysis in Excel', 'In progress'], ['Business writing', 'Starts next']].map(([course, status], i) => <div className={s.boardRow} key={course}><span className={i === 0 ? s.finished : ''}>{i + 1}</span><b>{course}</b><small>{status}</small></div>)}<div className={s.boardFoot}><HugeiconsIcon icon={Presentation01Icon} size={18} />Learners see one clear path, not a pile of links.</div></div></section>

    <section className={s.bento}><div className={s.bentoCopy}><p className={s.eyebrow}>LEARNING THAT PROVES ITSELF</p><h2>Make the next skill visible.</h2><p>Give leaders a useful view of what their teams are learning, where they are stuck, and who is ready for more.</p><Link href="/signup" className={s.primary}>Get started for your team <HugeiconsIcon icon={ArrowRight01Icon} size={18} /></Link></div><div className={s.metric}><HugeiconsIcon icon={CourseIcon} size={26} /><strong>312</strong><span>practical courses across business and tech</span></div><div className={s.metric}><HugeiconsIcon icon={ChartBarIncreasingIcon} size={26} /><strong>5 days</strong><span>the average active learning streak</span></div></section>

    <section className={s.cta}><p className={s.eyebrow}>READY WHEN YOUR TEAM IS</p><h2>Give your people a better way to grow.</h2><p>Set up your first team learning space in minutes.</p><Link href="/signup" className={s.primary}>Talk to our team <HugeiconsIcon icon={ArrowRight01Icon} size={18} /></Link></section>
  </main><Footer />
</div>; }
