import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {HugeiconsIcon} from '@hugeicons/react';
import {Download01Icon} from '@hugeicons/core-free-icons';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Footer} from '@/components/Footer';
import {Swatches, type Swatch} from '@/components/Swatches';
import {SUPPORT_EMAIL} from '@/lib/faq';
import s from './brand.module.css';

export const metadata: Metadata = {title: 'Brand', description: 'The yizelearn logo, colours and how to use them.'};

const colours: Swatch[] = [
  {name: 'Logo navy', hex: '#1C1F33', note: 'The logo plate'},
  {name: 'Logo sky', hex: '#9CC6E0', note: '"Yize" and the swoosh', light: true},
  {name: 'Logo yellow', hex: '#F5EFA8', note: '"learn" and the leaf', light: true},
  {name: 'Deep blue', hex: '#17335A', note: 'Headings and dark panels'},
  {name: 'Brand blue', hex: '#2F6DB5', note: 'Buttons and links'},
  {name: 'Sky blue', hex: '#74A7E3', note: 'Primary button in the app', light: true},
  {name: 'Marigold', hex: '#F0B74A', note: 'Highlights and calls to action', light: true},
  {name: 'Cream', hex: '#FDF8F1', note: 'Page background', light: true},
];

const dos = ['Use the logo file from this page, unaltered.', 'Keep its navy plate around it.', 'Leave clear space around the logo, at least the height of the "l".', 'Use our colours from the palette above.'];
const donts = ['Don\'t stretch, rotate or rearrange it.', 'Don\'t recolour it or add shadows and effects.', 'Don\'t put it on a busy photo or pattern.', 'Don\'t combine it with other logos or marks.', 'Don\'t redraw it or set the name in another font.'];

export default function BrandPage() {
  return <div className={s.page}>
    <OfferBar />
    <SiteNav />
    <main className={s.main}>
      <h1 className={s.title}>Brand System</h1>

      <section>
        <h2>Preface</h2>
        <p>The yizelearn brand is our name, our logo and the standards that hold them together on every surface. It belongs to yizelearn.</p>
        <p>This page exists so learners, instructors, partners and the press can represent yizelearn accurately: keep the logo intact and make it clear who built what.</p>
        <p>If you need any help, <a href={`mailto:${SUPPORT_EMAIL}`}>contact us</a>.</p>
      </section>

      <section>
        <div className={s.headRow}>
          <h2>Logo</h2>
          <a className={s.download} href="/logo.png" download="yizelearn-logo.png"><HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={2} />Download assets</a>
        </div>
        <p>The yizelearn logo is the name written by hand, with a leaf over the &ldquo;i&rdquo; and a swoosh under &ldquo;ze&rdquo;. &ldquo;Yize&rdquo; is in sky blue and &ldquo;learn&rdquo; in soft yellow, set on a deep navy plate.</p>
        <p>It is how we sign our work across the app, the web and print. Use the artwork from this page and keep its geometry intact.</p>
        <div className={s.tiles}>
          <figure className={s.tileLight}><Image src="/logo.png" alt="yizelearn logo on a light background" width={288} height={90} /></figure>
          <figure className={s.tileDark}><Image src="/logo.png" alt="yizelearn logo on a dark background" width={288} height={90} /></figure>
        </div>
        <p className={s.small}>The file is 192 × 60 px. Need a larger version or a vector (SVG)? Email us and we will send one.</p>
      </section>

      <section>
        <h2>Colour</h2>
        <p>Two groups: the colours in the logo itself, and the blues and marigold we use in the app and on the web. Click a colour to copy its code.</p>
        <Swatches items={colours} />
      </section>

      <section>
        <h2>Type</h2>
        <p>On the web we set text and headlines in Inter. The apps use each phone&apos;s own system font, so text always feels at home. The logo is lettering and not a font, so never retype it.</p>
        <div className={s.type}><span className={s.aa}>Aa</span><div><b>Inter</b><span>Regular, Medium, Semibold, Bold</span></div></div>
      </section>

      <section>
        <h2>Usage</h2>
        <div className={s.rules}>
          <div><h3>Dos</h3><ul className={s.yes}>{dos.map(d => <li key={d}>{d}</li>)}</ul></div>
          <div><h3>Don&apos;ts</h3><ul className={s.no}>{donts.map(d => <li key={d}>{d}</li>)}</ul></div>
        </div>
      </section>

      <section>
        <h2>Press</h2>
        <p>When you write about yizelearn, describe us as a learning company building short, practical courses for people with busy lives. For articles and announcements you can use this boilerplate:</p>
        <blockquote>yizelearn is a learning company building short, practical courses with live classes and certificates for people with busy lives.</blockquote>
        <p>Refer to the company as yizelearn: one word, lowercase in running text. Don&apos;t abbreviate, pluralise or reword the name. If that doesn&apos;t fit your piece, contact us and we will agree on language that does.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about the brand, or need help with it? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Looking for something else? <Link href="/about">About us</Link>.</p>
      </section>
    </main>
    <Footer />
  </div>;
}
