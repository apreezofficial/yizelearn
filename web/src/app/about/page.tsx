import type {Metadata} from 'next';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {StackPanels, type Panel} from '@/components/Stack';
import {team} from '@/lib/team';
import s from './about.module.css';

export const metadata: Metadata = {title: 'About', description: 'yizelearn makes short, practical courses for people with busy lives.'};

// Layout after cencori.com/about: a dark intro, then stacked full-screen panels whose statements fill in on scroll.
const panels: Panel[] = [
  {label: 'Our mission', tone: 'light', art: 'mission', text: 'Make practical, career-changing skills easy to learn for everyone, everywhere, in minutes a day.'},
  {label: 'What this means for Africa... and the world', tone: 'dark', art: 'africa', text: 'Talent is everywhere, but good training has been expensive, slow and far away. We teach the skills people use on Monday, in short lessons that are light on data, from instructors who do the work. Learn anywhere. Grow everywhere.'},
  {label: 'How we teach', tone: 'light', size: 'big', link: {href: '/#courses', label: 'See the courses'}, text: 'Learning used to mean long lectures and longer certificates. It is becoming short lessons, real projects and live help when you are stuck. What you can do matters more than how long you sat in class. Short lessons. Real skills. Built on yizelearn.'},
];

export default function AboutPage() {
  return <div className={s.page}>
    <OfferBar />
    <SiteNav />
    <section className={s.intro}>
      <p className={s.kicker}>Company</p>
      <h1>yizelearn is a learning company building short, practical courses for people with busy lives.</h1>
    </section>
    <StackPanels panels={panels} />
    {team.length > 0 && <section className={s.team}>
      <p className={s.kicker}>Team</p>
      <div className={s.people}>
        {team.map(p => <div key={p.name} className={s.person}><span className={s.avatar} aria-hidden>{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span><b>{p.name}</b><span>{p.role}</span></div>)}
      </div>
    </section>}
    <Footer />
  </div>;
}
