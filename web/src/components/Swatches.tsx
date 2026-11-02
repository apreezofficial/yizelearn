'use client';

import {useState} from 'react';
import {HugeiconsIcon} from '@hugeicons/react';
import {Copy01Icon, Tick02Icon} from '@hugeicons/core-free-icons';
import s from '@/app/brand/brand.module.css';

export type Swatch = {name: string; hex: string; note: string; light?: boolean};

/** Click a colour to copy its hex code. */
export function Swatches({items}: {items: Swatch[]}) {
  const [copied, setCopied] = useState('');
  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); } catch { /* ignore: the label still confirms the colour */ }
    setCopied(hex);
    setTimeout(() => setCopied(c => (c === hex ? '' : c)), 1600);
  };
  return <ul className={s.swatches}>
    {items.map(c => <li key={c.hex}>
      <button onClick={() => copy(c.hex)} aria-label={`Copy ${c.name} ${c.hex}`}>
        <span className={s.chip} style={{background: c.hex, color: c.light ? '#17335A' : '#fff'}}>
          <HugeiconsIcon icon={copied === c.hex ? Tick02Icon : Copy01Icon} size={16} strokeWidth={2} />
          <i>{copied === c.hex ? 'Copied' : 'Copy'}</i>
        </span>
        <b>{c.name}</b><code>{c.hex}</code><span>{c.note}</span>
      </button>
    </li>)}
  </ul>;
}
