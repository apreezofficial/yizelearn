import Image from 'next/image';
import s from './Logo.module.css';

/** The logo without its dark pill in light mode (letters recoloured to stay readable), the original in dark mode. */
export function Logo({width, height, alt, priority}: {width: number; height: number; alt: string; priority?: boolean}) {
  return <span className={s.logo}>
    <Image className={s.light} src="/logo-light.png" alt={alt} width={width} height={height} priority={priority} />
    <Image className={s.dark} src="/logo.png" alt="" aria-hidden width={width} height={height} priority={priority} />
  </span>;
}
