'use client';

import {useEffect, useState} from 'react';
import {findLang} from '@/lib/languages';
import {usePrefs} from '@/lib/prefs';
import s from './Translator.module.css';

// Translates what is on the page when a language other than English is chosen. Strings go to /api/translate
// (Google Cloud Translation, key kept on the server); the original English is kept so switching back is instant.
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'] as const;
const SKIP = 'script,style,noscript,code,kbd,textarea,svg,canvas,[translate="no"],[data-notranslate]';
const MAX_BATCH = 100, MAX_CHARS = 9000;

type Entry = {orig: string; out: string};
const text = new Map<Text, Entry>();
const attrs = new Map<Element, Map<string, Entry>>();
const memory = new Map<string, Map<string, string>>();
let titleOrig = '', titleOut = '';

const worth = (v: string) => /\p{L}{2,}/u.test(v) && !/^[A-Z0-9_\-·|/•:.,+%$€£₦ ]+$/.test(v.trim());

async function translate(strings: string[], lang: string, signal: AbortSignal): Promise<Map<string, string>> {
  const cache = memory.get(lang) ?? new Map<string, string>();
  memory.set(lang, cache);
  const todo = [...new Set(strings)].filter(v => !cache.has(v));
  const batches: string[][] = [];
  let cur: string[] = [], chars = 0;
  for (const v of todo) {
    if (cur.length >= MAX_BATCH || chars + v.length > MAX_CHARS) { batches.push(cur); cur = []; chars = 0; }
    cur.push(v); chars += v.length;
  }
  if (cur.length) batches.push(cur);
  for (const q of batches) {
    const res = await fetch('/api/translate', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({target: lang, q}), signal});
    if (!res.ok) { const e = (await res.json().catch(() => ({}))) as {error?: string}; throw new Error(e.error ?? 'failed'); }
    const {t} = (await res.json()) as {t: string[]};
    q.forEach((v, i) => cache.set(v, t[i] ?? v));
  }
  return cache;
}

function restore() {
  text.forEach((e, node) => { if (node.isConnected && node.nodeValue === e.out) node.nodeValue = e.orig; });
  attrs.forEach((map, el) => map.forEach((e, a) => { if (el.isConnected && el.getAttribute(a) === e.out) el.setAttribute(a, e.orig); }));
  text.clear(); attrs.clear();
  if (titleOrig && document.title === titleOut) document.title = titleOrig;
  titleOrig = titleOut = '';
}

/** Finds every piece of visible English on the page that is not translated yet. */
function collect() {
  const nodes: {node: Text; orig: string}[] = [];
  const els: {el: Element; attr: string; orig: string}[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const v = n.nodeValue ?? '';
    const known = text.get(n);
    if (known && v === known.out) continue;
    if (!worth(v) || n.parentElement?.closest(SKIP)) continue;
    nodes.push({node: n, orig: v});
  }
  document.body.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(el => {
    if (el.closest(SKIP)) return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v || !worth(v)) continue;
      const known = attrs.get(el)?.get(a);
      if (known && v === known.out) continue;
      els.push({el, attr: a, orig: v});
    }
  });
  return {nodes, els};
}

export function Translator() {
  const {language} = usePrefs();
  const [note, setNote] = useState('');

  useEffect(() => {
    const lang = findLang(language);
    document.documentElement.lang = lang.code === 'en' ? 'en' : lang.code;
    document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
    if (lang.code === 'en' || lang.ready === false) { restore(); return; }

    const ctl = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let busy = false, again = false, applying = false;
    const observer = new MutationObserver(() => { if (!applying) schedule(); });

    const apply = async () => {
      if (busy) { again = true; return; }
      busy = true;
      try {
        const {nodes, els} = collect();
        const title = document.title && document.title !== titleOut && worth(document.title) ? document.title : '';
        const all = [...nodes.map(x => x.orig.trim()), ...els.map(x => x.orig.trim()), ...(title ? [title] : [])];
        if (!all.length) return;
        const first = !memory.get(lang.code)?.size;
        if (first) setNote(`Translating to ${lang.name}…`);
        const cache = await translate(all, lang.code, ctl.signal);
        applying = true;
        for (const {node, orig} of nodes) {
          const out = cache.get(orig.trim());
          if (!out || !node.isConnected) continue;
          const lead = orig.match(/^\s*/)?.[0] ?? '', trail = orig.match(/\s*$/)?.[0] ?? '';
          const value = lead + out + trail;
          text.set(node, {orig, out: value}); node.nodeValue = value;
        }
        for (const {el, attr, orig} of els) {
          const out = cache.get(orig.trim());
          if (!out || !el.isConnected) continue;
          const map = attrs.get(el) ?? new Map<string, Entry>();
          map.set(attr, {orig, out}); attrs.set(el, map); el.setAttribute(attr, out);
        }
        if (title) { titleOrig = title; titleOut = cache.get(title) ?? title; document.title = titleOut; }
        observer.takeRecords();
        applying = false;
        setNote('');
      } catch (err) {
        applying = false;
        if ((err as Error).name === 'AbortError') return;
        restore();
        setNote((err as Error).message === 'not_configured' ? 'Translation is not set up on this server yet, so the page stays in English.' : 'We could not translate the page just now. It stays in English.');
        setTimeout(() => setNote(''), 5000);
        observer.disconnect();
      } finally {
        busy = false;
        if (again && !ctl.signal.aborted) { again = false; schedule(); }
      }
    };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(apply, 220); };

    observer.observe(document.body, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...ATTRS]});
    apply();
    return () => { ctl.abort(); clearTimeout(timer); observer.disconnect(); restore(); setNote(''); };
  }, [language]);

  return note ? <div className={s.toast} role="status" translate="no">{note}</div> : null;
}
