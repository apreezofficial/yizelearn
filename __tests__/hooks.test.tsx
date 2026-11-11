import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {useCatalog, type Catalog} from '../src/hooks/useCatalog';
import {useCourseDetail, type CourseDetail} from '../src/hooks/useCourseDetail';
import {useLearning, type Learning} from '../src/hooks/useLearning';
import {sampleCourses} from '../src/data/catalog';

const reply = (map: Record<string, unknown>) => {
  (globalThis as unknown as {fetch: unknown}).fetch = jest.fn(async (url: string) => {
    const path = url.replace(/^.*\/v1/, '').split('?')[0];
    if (!(path in map)) return {ok: false, status: 404, text: async () => JSON.stringify({code: 'not_found'})};
    return {ok: true, status: 200, text: async () => JSON.stringify(map[path])};
  });
};

// Renders a hook and returns its latest value after the pending requests settle.
async function run<T>(use: () => T): Promise<{value: () => T; unmount: () => void}> {
  let latest!: T;
  const Probe = () => { latest = use(); return null; };
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<Probe />); });
  await ReactTestRenderer.act(async () => { await new Promise<void>(r => setTimeout(r, 0)); });
  return {value: () => latest, unmount: () => ReactTestRenderer.act(() => tree.unmount())};
}

const page = {nextCursor: null, hasMore: false};
const card = (id: string, name: string) => ({id, title: `Course ${id}`, subtitle: null, instructor: {id: 'i', fullName: 'Ngozi A', initials: 'NA', avatarUrl: null}, ratingAvg: 4.5, ratingCount: 10,
  price: {amountMinor: 1000000, currency: 'NGN'}, listPrice: null, thumbnailUrl: null, level: 'beginner', category: {id: 'c', slug: 'data', name}, durationMin: 60, lessonCount: 4});

test('with no published courses the sample catalogue stands in', async () => {
  reply({'/categories': {data: [], page}, '/courses': {data: [], page}});
  const probe = await run<Catalog>(useCatalog);
  expect(probe.value().loading).toBe(false);
  expect(probe.value().source).toBe('sample');
  expect(probe.value().courses).toBe(sampleCourses);
  probe.unmount();
});

test('with courses on the server, they and their categories are used', async () => {
  reply({'/categories': {data: [{id: 'c', slug: 'data', name: 'Data', iconKey: null, courseCount: 2}, {id: 'd', slug: 'empty', name: 'Empty', iconKey: null, courseCount: 0}], page}, '/courses': {data: [card('a', 'Data'), card('b', 'Data')], page}});
  const probe = await run<Catalog>(useCatalog);
  expect(probe.value().source).toBe('api');
  expect(probe.value().categories).toEqual(['All', 'Data']);
  expect(probe.value().courses.map(c => c.id)).toEqual(['a', 'b']);
  expect(probe.value().courses[0]).toMatchObject({price: 10000, category: 'Data', level: 'Beginner'});
  probe.unmount();
});

test('when the server cannot be reached the sample catalogue is used', async () => {
  (globalThis as unknown as {fetch: unknown}).fetch = jest.fn(() => Promise.reject(new Error('offline')));
  const probe = await run<Catalog>(useCatalog);
  expect(probe.value()).toMatchObject({source: 'sample', loading: false});
  probe.unmount();
});

test('a real course page loads curriculum and written reviews', async () => {
  const id = '00000000-0000-4000-8000-000000000011';
  reply({
    [`/courses/${id}`]: {...card(id, 'Data'), about: 'Hello.\n\nMore.', learnPoints: ['Learn A'], moduleCount: 1, language: 'en', hasCertificate: true, inCart: false, previewLessonIds: []},
    [`/courses/${id}/curriculum`]: {courseId: id, moduleCount: 1, lessonCount: 1, durationMin: 5, modules: [{id: 'm', position: 1, title: 'Intro', lessonCount: 1, lessons: [{id: 'l', position: 1, title: 'Welcome', type: 'video', durationMin: 5, questionCount: null, isPreview: true, locked: false}]}]},
    [`/courses/${id}/reviews`]: {data: [{id: 'r1', rating: 5, comment: 'Great', author: {id: 'u', fullName: 'Tolu A', initials: 'TA', avatarUrl: null}, createdAt: new Date().toISOString(), isMine: false}, {id: 'r2', rating: 4, comment: null, author: {id: 'u2', fullName: 'Ife N', initials: 'IN', avatarUrl: null}, createdAt: new Date().toISOString(), isMine: false}], page, summary: {ratingAvg: 4.5, ratingCount: 2, distribution: {5: 1, 4: 1}}},
  });
  const probe = await run<CourseDetail>(() => useCourseDetail(id));
  const v = probe.value();
  expect(v.loading).toBe(false);
  expect(v.course).toMatchObject({title: `Course ${id}`, outcomes: ['Learn A'], summary: 'Hello.'});
  expect(v.modules[0].lessons[0]).toMatchObject({title: 'Welcome', preview: true});
  expect(v.reviews).toHaveLength(1); // the rating without a comment is not listed
  expect(v.breakdown).toEqual([0.5, 0.5, 0, 0, 0]);
  probe.unmount();
});

test('an unknown course reports not found, and sample ids use the sample data', async () => {
  reply({});
  const missing = await run<CourseDetail>(() => useCourseDetail('00000000-0000-4000-8000-0000000000ff'));
  expect(missing.value().notFound).toBe(true);
  missing.unmount();
  const sample = await run<CourseDetail>(() => useCourseDetail('excel'));
  expect(sample.value().modules.length).toBeGreaterThan(0);
  expect(sample.value().loading).toBe(false);
  sample.unmount();
});

test('a signed-in learner gets where they left off and their enrolments', async () => {
  const id = '00000000-0000-4000-8000-000000000011';
  reply({
    '/me/home': {greetingName: 'Chika', continueLearning: {enrollmentId: 'e', courseId: id, courseTitle: 'Python', displayTitle: 'Python basics', lessonId: 'l', lessonNumber: 3, lessonTotal: 9, lessonTitle: 'Loops', progressPct: 33, thumbnailUrl: null}, recommended: [card('r', 'Data')], categories: [], unreadNotifications: 2, hasUnread: true},
    '/me/enrollments': {data: [{id: 'e', course: card(id, 'Data'), status: 'in_progress', progressPct: 33, completedLessons: 3, totalLessons: 9, lastLessonId: 'l', availability: 'available'}, {id: 'e2', course: card('z', 'Data'), status: 'completed', progressPct: 100, completedLessons: 4, totalLessons: 4, lastLessonId: null, availability: 'available'}], page},
  });
  const probe = await run<Learning>(() => useLearning(true));
  const v = probe.value();
  expect(v).toMatchObject({loading: false, name: 'Chika', hasUnread: true, unread: 2});
  expect(v.continueLearning).toEqual({title: 'Python basics', lesson: 'Loops', lessonNumber: 3, lessonsTotal: 9, progress: 33});
  expect(v.enrolments.map(e => [e.status, e.progress])).toEqual([['in-progress', 33], ['completed', 100]]);
  expect(v.recommended).toHaveLength(1);
  probe.unmount();
});

test('nothing is loaded for a signed-out visitor', async () => {
  reply({});
  const probe = await run<Learning>(() => useLearning(false));
  expect((globalThis.fetch as jest.Mock).mock.calls).toHaveLength(0);
  probe.unmount();
});
