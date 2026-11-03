import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {categories} from '@/lib/courses';
import {SUPPORT_EMAIL} from '@/lib/faq';
import {socials} from '@/lib/social';
import {FooterPrefs} from './FooterPrefs';
import {Logo} from './Logo';
import s from './Footer.module.css';

type Col = {title: string; links: {label: string; href: string}[]};
const columns: Col[] = [
  {title: 'Categories', links: [...categories.map(c => ({label: c.name, href: `/courses?category=${encodeURIComponent(c.name)}`})), {label: 'All courses', href: '/courses'}]},
  {title: 'For Learners', links: [{label: 'How yizelearn works', href: '/#how-it-works'}, {label: 'Courses', href: '/courses'}, {label: 'Create an account', href: '/signup'}, {label: 'Log in', href: '/login'}, {label: 'FAQ', href: '/faq'}]},
  {title: 'For Instructors', links: [{label: 'Become an instructor', href: '/teach'}, {label: 'Start teaching', href: '/signup?as=teach'}]},
  {title: 'Support', links: [{label: 'Help and FAQ', href: '/faq'}, {label: 'Contact support', href: `mailto:${SUPPORT_EMAIL}`}]},
  {title: 'Company', links: [{label: 'About yizelearn', href: '/about'}, {label: 'Brand', href: '/brand'}, {label: 'Terms of Service', href: '/terms'}, {label: 'Privacy Policy', href: '/privacy'}]},
];

/** Footer laid out like Fiverr's: five link columns, then one bar with the logo and copyright on the left and, on the right, social icons, language, currency and the cookie button. */
export function Footer() {
  const links = socials.filter(x => x.href);
  return <footer className={s.footer}>
    <div className={s.inner}>
      <div className={s.cols}>
        {columns.map(c => <nav key={c.title} aria-label={c.title}>
          <h2>{c.title}</h2>
          <ul>{c.links.map(l => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </nav>)}
      </div>
      <div className={s.bar}>
        <div className={s.left}><Link href="/" aria-label="yizelearn home"><Logo alt="yizelearn" width={92} height={29} /></Link><span>© yizelearn 2026</span></div>
        <div className={s.right}>
          {links.length > 0 && <ul className={s.social}>{links.map(x => <li key={x.name}><a href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.name}><HugeiconsIcon icon={x.icon} size={18} strokeWidth={1.8} /></a></li>)}</ul>}
          <FooterPrefs />
        </div>
      </div>
    </div>
  </footer>;
}
