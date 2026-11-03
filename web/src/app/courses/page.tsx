import type {Metadata} from 'next';
import {Suspense} from 'react';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Catalog} from '@/components/Catalog';
import {Footer} from '@/components/Footer';

export const metadata: Metadata = {title: 'Courses', description: 'Browse short, practical courses in programming, AI, digital marketing, databases and IT skills.'};

export default function CoursesPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <Suspense fallback={<div style={{minHeight: '70vh'}} />}><Catalog /></Suspense>
    <Footer />
  </>;
}
