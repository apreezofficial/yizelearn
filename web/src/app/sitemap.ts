import type {MetadataRoute} from 'next';
import {cacheLife} from 'next/cache';
import {getCatalog} from '@/lib/catalog';
import {guides} from '@/lib/guide-data';
import {siteUrl} from '@/lib/metadata';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';
  cacheLife('hours');
  const {courses} = await getCatalog();
  const paths = ['/', '/courses', '/about', '/business', '/teach', '/contact', '/guides', '/faq', '/verify', '/status', '/brand', '/terms', '/privacy', ...guides.map(g => `/guides/${g.slug}`), ...courses.map(c => `/courses/${c.id}`)];
  return paths.map(path => ({url: new URL(path, siteUrl).href}));
}
