import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {CoursePage} from '@/components/CoursePage';
import {Footer} from '@/components/Footer';
import {getCatalog, getCourseView} from '@/lib/catalog';

export async function generateStaticParams() {
  const {courses} = await getCatalog();
  return courses.map(c => ({id: c.id}));
}

export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
  const view = await getCourseView((await params).id);
  return view ? {title: view.course.title, description: view.detail.sub || undefined} : {title: 'Course not found'};
}

async function Course({params}: {params: Promise<{id: string}>}) {
  const view = await getCourseView((await params).id);
  if (!view) notFound();
  return <CoursePage course={view.course} detail={view.detail} more={view.more} sample={view.source === 'sample'} />;
}

export default function Page({params}: {params: Promise<{id: string}>}) {
  return <>
    <OfferBar />
    <SiteNav />
    <Suspense fallback={<div style={{minHeight: '80vh'}} />}><Course params={params} /></Suspense>
    <Footer />
  </>;
}
