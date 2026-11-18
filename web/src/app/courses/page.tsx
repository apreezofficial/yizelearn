import {pageMetadata} from '@/lib/metadata';
import {Suspense} from 'react';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {Catalog} from '@/components/Catalog';
import {Footer} from '@/components/Footer';
import {getCatalog} from '@/lib/catalog';

export const metadata = pageMetadata("/courses");

async function Courses() {
  const {courses, categories} = await getCatalog();
  return <Catalog courses={courses} categories={categories} />;
}

export default function CoursesPage() {
  return <>
    <OfferBar />
    <SiteNav />
    <Suspense fallback={<div style={{minHeight: '70vh'}} />}><Courses /></Suspense>
    <Footer />
  </>;
}
