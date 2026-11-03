import Image from 'next/image';
import s from './page.module.css';

// Placeholder until the web designs land; it only proves the brand setup (colours, logo, dark mode).
export default function Home() {
  return <main className={s.page}>
    <Image src="/logo.png" alt="yizelearn" width={160} height={64} priority className={s.logo} />
    <h1 className={s.title}>yizelearn on the web</h1>
    <p className={s.sub}>Coming soon.</p>
  </main>;
}
