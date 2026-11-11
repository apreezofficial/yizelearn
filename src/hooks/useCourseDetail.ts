import {useEffect, useState} from 'react';
import {catalogApi} from '../api/endpoints';
import {breakdown, toCourseDetail, toModules, toReview, type UiReview} from '../api/mappers';
import type {Course, Module} from '../api/types';
import {ratingBreakdown, sampleModules, sampleReviews} from '../data/catalog';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export type CourseDetail = {course?: Course; modules: Module[]; reviews: UiReview[]; breakdown: number[]; loading: boolean; notFound: boolean};

/** One course page: curriculum, reviews and the learning points, from the API. Sample course ids use the sample data. */
export function useCourseDetail(id: string | undefined): CourseDetail {
  const sample = !id || !UUID.test(id);
  const [data, setData] = useState<{id?: string; course?: Course; modules: Module[]; reviews: UiReview[]; breakdown: number[]; notFound: boolean}>({modules: [], reviews: [], breakdown: [], notFound: false});
  useEffect(() => {
    if (sample || !id) return;
    let live = true;
    (async () => {
      try {
        const [detail, curriculum, reviews] = await Promise.all([catalogApi.course(id), catalogApi.curriculum(id).catch(() => null), catalogApi.reviews(id, 10).catch(() => null)]);
        if (!live) return;
        setData({id, course: toCourseDetail(detail), modules: curriculum ? toModules(curriculum) : [], reviews: (reviews?.data ?? []).filter(r => r.comment).map(toReview), breakdown: reviews ? breakdown(reviews.summary.distribution, reviews.summary.ratingCount) : [], notFound: false});
      } catch (e) {
        if (live) setData({id, modules: [], reviews: [], breakdown: [], notFound: (e as {status?: number}).status === 404});
      }
    })();
    return () => { live = false; };
  }, [id, sample]);
  if (sample) return {modules: sampleModules, reviews: sampleReviews, breakdown: ratingBreakdown, loading: false, notFound: false};
  const ready = data.id === id;
  return {course: ready ? data.course : undefined, modules: ready ? data.modules : [], reviews: ready ? data.reviews : [], breakdown: ready ? data.breakdown : [], loading: !ready, notFound: ready && data.notFound};
}
