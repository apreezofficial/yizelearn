'use client';

import {useState} from 'react';
import Link from 'next/link';
import s from './preview.module.css';

export default function CertificatePreview() {
  const [design, setDesign] = useState('gold');
  const [name, setName] = useState('Sunday Nwachukwu');
  const [course, setCourse] = useState('Web design');
  const [hours, setHours] = useState('12.5');
  const [date, setDate] = useState('2026-11-18');
  const formattedDate = date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : '';
  const lines = [`This is to certify that ${name}`, `successfully completed ${hours} total hours of`, `${course} online course on`, formattedDate];
  return <main className={s.main}>
    <header className={s.header}><Link href="/">yizelearn</Link><span>Certificate preview · Sample details</span></header>
    <div className={s.layout}>
      <aside className={s.controls}>
        <h1>Certificate templates</h1><p>Your gold and yellow ribbon designs.</p>
        <fieldset><legend>Design</legend><div className={s.choices}>{['gold', 'yellow'].map(d => <button key={d} type="button" aria-pressed={design === d} onClick={() => setDesign(d)}>{d === 'gold' ? 'Gold ribbon' : 'Yellow ribbon'}</button>)}</div></fieldset>
        <label>Learner name<input value={name} maxLength={80} onChange={e => setName(e.target.value)} /></label>
        <label>Course<input value={course} maxLength={100} onChange={e => setCourse(e.target.value)} /></label>
        <label>Total hours<input type="number" min="0" step="0.5" value={hours} onChange={e => setHours(e.target.value)} /></label>
        <label>Completion date<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      </aside>
      <section className={s.preview} aria-label="Certificate preview">
        <svg viewBox="0 0 1080 816" role="img" aria-label={`Sample certificate for ${name}, ${course}`}>
          <image href={`/certificates/${design}.jpeg`} width="1080" height="816" />
          <rect x="158" y="242" width="766" height="164" rx="2" fill="#fcfefe" />
          {lines.map((line, i) => <text key={i} x="540" y={281 + i * 38} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize={Math.min(34, 1210 / Math.max(line.length, 1))} fill="#151515">{line}</text>)}
          <text x="348" y="516" textAnchor="middle" fontFamily="Georgia, serif" fontSize="19" fill="#252a36">Course instructor</text>
          <text x="733" y="516" textAnchor="middle" fontFamily="Georgia, serif" fontSize="19" fill="#252a36">yizelearn representative</text>
        </svg>
      </section>
    </div>
  </main>;
}
