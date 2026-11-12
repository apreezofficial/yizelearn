import {useCallback, useEffect, useRef, useState} from 'react';
import {learningApi} from '../api/endpoints';
import {toCourse, toEnrolment, type EnrolmentView} from '../api/mappers';
import type {Course} from '../api/types';

export type ContinueCard = {title: string; lesson: string; lessonNumber: number; lessonsTotal: number; progress: number};
export type Learning = {
  loading: boolean; error?: string; name?: string; hasUnread: boolean; unread: number;
  continueLearning?: ContinueCard; recommended: Course[]; enrolments: EnrolmentView[]; refresh: () => void;
};

const empty = {loading: true, hasUnread: false, unread: 0, recommended: [] as Course[], enrolments: [] as EnrolmentView[]};

/** What a signed-in learner sees: where they left off, picks for them, and their enrolled courses. */
export function useLearning(enabled: boolean): Learning {
  const [state, setState] = useState<Omit<Learning, 'refresh'>>(empty);
  const alive = useRef(true);
  const load = useCallback(async () => {
    setState(s => ({...s, loading: true, error: undefined}));
    try {
      const [home, enrolments] = await Promise.all([learningApi.home(), learningApi.enrollments()]);
      if (!alive.current) return;
      const c = home.continueLearning as null | {displayTitle: string; courseTitle: string; lessonTitle: string; lessonNumber: number; lessonTotal: number; progressPct: number};
      setState({
        loading: false, name: home.greetingName, hasUnread: home.hasUnread, unread: home.unreadNotifications,
        continueLearning: c ? {title: c.displayTitle || c.courseTitle, lesson: c.lessonTitle, lessonNumber: c.lessonNumber, lessonsTotal: c.lessonTotal, progress: c.progressPct} : undefined,
        recommended: home.recommended.map(r => toCourse(r)), enrolments: enrolments.data.map(toEnrolment),
      });
    } catch (e) {
      if (alive.current) setState(s => ({...s, loading: false, error: (e as Error).message}));
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    if (enabled) void load(); else setState(empty);
    return () => { alive.current = false; };
  }, [enabled, load]);
  return {...state, refresh: () => { void load(); }};
}
