import Link from 'next/link';
import {SUPPORT_EMAIL} from '@/lib/faq';
import {FooterPrefs} from './FooterPrefs';
import s from './Footer.module.css';

const columns: {title: string; links: {label: string; href: string}[]}[] = [
  {title: 'Learn', links: [{label: 'Courses', href: '/courses'}, {label: 'How it works', href: '/#how-it-works'}, {label: 'FAQ', href: '/faq'}, {label: 'Create an account', href: '/signup'}]},
  {title: 'Teach', links: [{label: 'Become an instructor', href: '/teach'}]},
  {title: 'Company', links: [{label: 'About', href: '/about'}, {label: 'Brand', href: '/brand'}, {label: 'Contact', href: `mailto:${SUPPORT_EMAIL}`}]},
  {title: 'Legal', links: [{label: 'Terms of Service', href: '/terms'}, {label: 'Privacy Policy', href: '/privacy'}]},
];

/** Dark footer after Cencori's: link columns, a small legal row and a giant faded wordmark. */
export function Footer() {
  return <footer className={s.footer}>
    <div className={s.inner}>
      <div className={s.cols}>
        {columns.map(c => <div key={c.title}>
          <p className={s.head}>{c.title}</p>
          <ul>{c.links.map(l => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </div>)}
      </div>
      <div className={s.prefs}><FooterPrefs /></div>
      <div className={s.legal}><span>© 2026 yizelearn</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div>
    </div>
    {/* The logo's wordmark, huge and cut off by the page edge like pxxl's: "Yize" in sky, "learn" in yellow,
        a leaf for the i's dot and the swoosh under "ze". Stripes run through the letters. */}
    <div className={s.mark} aria-hidden>
      <span className={s.sky}>Y<span className={s.i}>ı<svg className={s.leaf} viewBox="0 0 40 52"><path d="M20 50 C4 38 2 16 18 2 C34 14 36 36 20 50 Z" /><path d="M20 48 C18 34 18 20 19 8" className={s.vein} /></svg></span>ze</span><span className={s.yellow}>learn</span>
      <svg className={s.swoosh} viewBox="0 0 600 120" preserveAspectRatio="none"><path d="M8 6 C60 120 380 130 592 14" /></svg>
    </div>
  </footer>;
}
