import Link from 'next/link';
import s from './Footer.module.css';

const columns = [
  {title: 'Learn', links: ['Courses', 'Paths', 'Live classes', 'Certificates']},
  {title: 'Teach', links: ['Become an instructor', 'Instructor guide', 'Teams']},
  {title: 'Company', links: ['About', 'Careers', 'Press', 'Contact']},
  {title: 'Help', links: ['Help centre', 'Refunds', 'Privacy', 'Terms']},
];
const hrefFor = (l: string) => (l === 'About' ? '/about' : '#');

/** Dark footer after Cencori's: link columns, a small legal row and a giant faded wordmark. */
export function Footer() {
  return <footer className={s.footer}>
    <div className={s.inner}>
      <div className={s.cols}>
        {columns.map(c => <div key={c.title}>
          <p className={s.head}>{c.title}</p>
          <ul>{c.links.map(l => <li key={l}><Link href={hrefFor(l)}>{l}</Link></li>)}</ul>
        </div>)}
      </div>
      <div className={s.legal}><span>© 2026 yizelearn</span><span><Link href="#">Privacy</Link><Link href="#">Terms</Link></span></div>
    </div>
    {/* The logo's wordmark, huge and cut off by the page edge like pxxl's: "Yize" in sky, "learn" in yellow,
        a leaf for the i's dot and the swoosh under "ze". Stripes run through the letters. */}
    <div className={s.mark} aria-hidden>
      <span className={s.sky}>Y<span className={s.i}>ı<svg className={s.leaf} viewBox="0 0 40 52"><path d="M20 50 C4 38 2 16 18 2 C34 14 36 36 20 50 Z" /><path d="M20 48 C18 34 18 20 19 8" className={s.vein} /></svg></span>ze</span><span className={s.yellow}>learn</span>
      <svg className={s.swoosh} viewBox="0 0 600 120" preserveAspectRatio="none"><path d="M8 6 C60 120 380 130 592 14" /></svg>
    </div>
  </footer>;
}
