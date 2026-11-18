import type {Metadata} from 'next';
import pages from './page-info.json';
import snapshots from './og-snapshots.json';

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = new URL(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'https://yizelearn.com'));
const info = pages as Record<string, {title: string; description: string}>;
const images = snapshots as Record<string, string>;

/** Public previews are versioned, local assets, so crawlers never need to execute JS or call a screenshot service. */
export function pageMetadata(path: string, override: {title?: string; description?: string; imagePath?: string; noindex?: boolean; imageAlt?: string} = {}): Metadata {
  const entry = info[path] ?? info['/'];
  const title = override.title ?? entry.title;
  const description = override.description ?? entry.description;
  const privatePage = override.noindex ?? (path.startsWith('/dashboard') || ['/login', '/signup', '/certificates/preview', '/verify/DEMO'].includes(path));
  const image = override.imagePath ?? images[path] ?? (path.startsWith('/courses/') ? images['/courses'] : path.startsWith('/guides/') ? images['/guides'] : images['/']);
  const socialTitle = `${title} · yizelearn`;
  const alt = override.imageAlt ?? (path === '/' ? 'yizelearn — practical skills for your next chapter' : `${title} — yizelearn page preview`);
  return {
    title, description, alternates: {canonical: path},
    openGraph: {type: 'website', locale: 'en_US', siteName: 'yizelearn', title: socialTitle, description, url: path, images: [{url: image, width: 1200, height: 630, alt}]},
    twitter: {card: 'summary_large_image', title: socialTitle, description, images: [{url: image, alt}]},
    robots: privatePage ? {index: false, follow: false} : {index: true, follow: true},
  };
}
