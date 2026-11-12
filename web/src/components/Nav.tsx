'use client';

import {openPrefs} from './FooterPrefs';
import {Logo} from './Logo';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createPortal} from 'react-dom';
import {useEffect, useRef, useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {ArrowDown01Icon, ArrowRight01Icon, Cancel01Icon, Globe02Icon, Menu01Icon, Search01Icon} from '@hugeicons/core-free-icons';
import {useCategories, useSuggestions} from '@/lib/catalog-client';
import {findLang} from '@/lib/languages';
import {useMoney, usePrefs} from '@/lib/prefs';
import s from './Nav.module.css';

const links = [{label: 'Courses', href: '/courses'}, {label: 'FAQ', href: '/faq'}, {label: 'Teach', href: '/teach'}, {label: 'About', href: '/about'}];
const topics = ['Python', 'React', 'SQL', 'AI agents', 'SEO', 'TikTok', 'PostgreSQL', 'Computer technician'];

/**
 * Top bar after Udemy, Coursera and Skillshare: logo, an Explore menu, a wide grey search bar with live
 * suggestions, a few links and Log in / Sign up. On phones it collapses to a search button and a slide-in menu.
 * There is no course page on the web yet, so picking a suggestion goes to sign-up.
 */
export function SiteNav() {
  const router = useRouter();
  const money = useMoney();
  const lang = findLang(usePrefs().language);
  const short = lang.code.split('-')[0].toUpperCase();
  const [scrolled, setScrolled] = useState(false);
  const [explore, setExplore] = useState(false);
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const categories = useCategories();
  const results = useSuggestions(query);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on outside click or Escape; "/" jumps to the search bar like on most sites.
  useEffect(() => {
    const down = (e: MouseEvent) => { if (bar.current && !bar.current.contains(e.target as Node)) { setExplore(false); setFocus(false); } };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setExplore(false); setFocus(false); setDrawer(false); setPhoneSearch(false); input.current?.blur(); }
      const t = e.target;
      const typing = t instanceof Element && t.closest('input, textarea, select, [contenteditable]');
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.current?.focus(); }
    };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, []);

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  const go = (href: string) => { setExplore(false); setFocus(false); setDrawer(false); setPhoneSearch(false); setQuery(''); router.push(href); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (q) go(`/courses?q=${encodeURIComponent(query.trim())}`); };

  const suggestions = <div className={s.suggest} role="listbox" aria-label="Suggestions">
    {q ? (results.length ? results.map(c => <button key={c.key} role="option" aria-selected={false} onMouseDown={e => e.preventDefault()} onClick={() => go(c.href)}>
      <span className={s.sIcon}><HugeiconsIcon icon={Search01Icon} size={16} /></span>
      <span className={s.sText}><b>{c.title}</b>{c.sub && <i>{c.sub}</i>}</span>
      {c.price !== undefined && <em>{money(c.price)}</em>}
    </button>) : <p className={s.none}>No courses match &ldquo;{query}&rdquo; yet. Try Python, SQL or SEO.</p>)
      : <div className={s.popular}><p>Popular right now</p><div>{topics.map(t => <button key={t} onMouseDown={e => e.preventDefault()} onClick={() => { setQuery(t); (phoneSearch ? phoneInput : input).current?.focus(); }}>{t}</button>)}</div></div>}
  </div>;

  const searchBox = (ref: React.RefObject<HTMLInputElement | null>, id: string) => <form className={s.search} onSubmit={submit} role="search">
    <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={2} className={s.sMag} />
    <input ref={ref} id={id} value={query} onChange={e => setQuery(e.target.value)} onFocus={() => { setFocus(true); setExplore(false); }} placeholder="Search for anything" aria-label="Search courses" autoComplete="off" />
    {query ? <button type="button" className={s.clear} aria-label="Clear search" onClick={() => { setQuery(''); ref.current?.focus(); }}><HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2.4} /></button> : <kbd className={s.kbd} aria-hidden>/</kbd>}
    {focus && suggestions}
  </form>;

  return <header ref={bar} className={`${s.bar} ${scrolled ? s.scrolled : ''}`}>
    <div className={s.inner}>
      <Link href="/" className={s.brand}><Logo alt="yizelearn home" width={104} height={40} priority /></Link>

      <button className={`${s.exploreBtn} ${explore ? s.exploreOn : ''}`} aria-expanded={explore} aria-haspopup="true" onClick={() => { setExplore(v => !v); setFocus(false); }}>
        Explore <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2.2} className={s.caret} />
      </button>

      <div className={s.searchWrap}>{searchBox(input, 'nav-search')}</div>

      <nav className={s.links} aria-label="Main">{links.map(l => <Link key={l.label} href={l.href}>{l.label}</Link>)}</nav>
      <button className={s.lang} onClick={() => openPrefs('language')} aria-label={`Language: ${lang.name}. Change language`}><HugeiconsIcon icon={Globe02Icon} size={18} strokeWidth={1.8} /><span translate="no">{short}</span></button>
      <div className={s.actions}>
        <Link href="/login" className={s.login}>Log in</Link>
        <Link href="/signup" className={s.signup}>Sign up</Link>
      </div>

      {/* Phones */}
      <div className={s.phone}>
        <button className={s.iconBtn} aria-label="Search" aria-expanded={phoneSearch} onClick={() => { setPhoneSearch(v => !v); setTimeout(() => phoneInput.current?.focus(), 60); }}><HugeiconsIcon icon={phoneSearch ? Cancel01Icon : Search01Icon} size={22} strokeWidth={2} /></button>
        <Link href="/signup" className={s.signup}>Sign up</Link>
        <button className={s.iconBtn} aria-label="Open menu" onClick={() => setDrawer(true)}><HugeiconsIcon icon={Menu01Icon} size={24} strokeWidth={2} /></button>
      </div>
    </div>

    {phoneSearch && <div className={s.phoneSearch}>{searchBox(phoneInput, 'nav-search-phone')}</div>}

    {explore && <div className={s.mega}>
      <div className={s.megaInner}>
        <div>
          <p className={s.megaHead}>Categories</p>
          {categories.map(g => <button key={g.name} className={s.goal} onClick={() => go(`/courses?category=${encodeURIComponent(g.name)}`)}><span><b>{g.name}</b><i>{g.topics.length ? `${g.topics.slice(0, 4).join(', ')} and more` : 'Browse courses'}</i></span><HugeiconsIcon icon={ArrowRight01Icon} size={16} /></button>)}
        </div>
        <div>
          <p className={s.megaHead}>Popular topics</p>
          <div className={s.chips}>{topics.map(t => <button key={t} onClick={() => go(`/courses?q=${encodeURIComponent(t)}`)}>{t}</button>)}</div>
          <Link href="/courses" className={s.all} onClick={() => setExplore(false)}>Browse all courses <HugeiconsIcon icon={ArrowRight01Icon} size={16} /></Link>
        </div>
      </div>
    </div>}

    {/* Rendered on the page body, not inside the bar: the bar's blur makes iPhone Safari trap fixed children inside it. */}
    {drawer && createPortal(<div className={s.drawerWrap} role="dialog" aria-modal aria-label="Menu">
      <button className={s.scrim} aria-label="Close menu" onClick={() => setDrawer(false)} />
      <div className={s.drawer}>
        <div className={s.drawerHead}><Logo alt="yizelearn" width={96} height={37} /><button className={s.iconBtn} aria-label="Close menu" onClick={() => setDrawer(false)}><HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={2} /></button></div>
        <nav aria-label="Menu">
          {links.map(l => <Link key={l.label} href={l.href} onClick={() => setDrawer(false)}>{l.label}<HugeiconsIcon icon={ArrowRight01Icon} size={16} /></Link>)}
        </nav>
        <p className={s.megaHead}>Categories</p>
        <div className={s.chips}>{categories.map(g => <button key={g.name} onClick={() => go(`/courses?category=${encodeURIComponent(g.name)}`)}>{g.name}</button>)}</div>
        <button className={s.drawerLang} onClick={() => { setDrawer(false); openPrefs('language'); }}><HugeiconsIcon icon={Globe02Icon} size={20} strokeWidth={1.8} /><span translate="no">{lang.name}</span><HugeiconsIcon icon={ArrowRight01Icon} size={16} /></button>
        <div className={s.drawerActions}>
          <Link href="/login" className={s.login} onClick={() => setDrawer(false)}>Log in</Link>
          <Link href="/signup" className={s.signup} onClick={() => setDrawer(false)}>Sign up</Link>
        </div>
      </div>
    </div>, document.body)}
  </header>;
}
