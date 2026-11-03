import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {OfferBar, SiteNav} from '@/components/Chrome';
import {CoursePage} from '@/components/CoursePage';
import {Footer} from '@/components/Footer';
import {courses} from '@/lib/courses';
import {getCourse, getDetail, related} from '@/lib/courseDetail';

export function generateStaticParams() { return courses.map(c => ({id: c.id})); }

export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
  const c = getCourse((await params).id);
  return c ? {title: c.title, description: getDetail(c).sub} : {title: 'Course not found'};
}

async function Course({params}: {params: Promise<{id: string}>}) {
  const c = getCourse((await params).id);
  if (!c) notFound();
  return <CoursePage course={c} detail={getDetail(c)} more={related(c)} />;
}

export default function Page({params}: {params: Promise<{id: string}>}) {
  return <>
    <OfferBar />
    <SiteNav />
    <Suspense fallback={<div style={{minHeight: '80vh'}} />}><Course params={params} /></Suspense>
    <Footer />
  </>;
}
