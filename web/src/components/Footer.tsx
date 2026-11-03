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
    <p className={s.wordmark} aria-hidden>yizelearn</p>
  </footer>;
}
