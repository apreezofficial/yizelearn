 'use client';
import {useState} from 'react';
import Link from 'next/link';
import s from './PublicPages.module.css';
import {guides} from '@/lib/guide-data';
export function GuideLibrary(){const[filter,setFilter]=useState('All guides');const[query,setQuery]=useState('');const items=guides.filter(g=>(filter==='All guides'||g.category===filter)&&`${g.title} ${g.description}`.toLowerCase().includes(query.toLowerCase()));return <><div className={s.filters}>{['All guides','Getting started','Certificates','Teaching'].map(t=><button key={t} aria-pressed={filter===t} onClick={()=>setFilter(t)}>{t}</button>)}<input aria-label="Search guides" placeholder="Search guides…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className={s.grid}>{items.map(g=><Link className={s.card} key={g.slug} href={'/guides/'+g.slug}><span className={s.tag}>{g.category}</span><h2>{g.title}</h2><p>{g.description}</p><span>3 min read · Read guide ↗</span></Link>)}</div>{!items.length&&<p className={s.empty}>No guides found. Try a different search.</p>}</>}
