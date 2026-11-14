import React, {useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Lesson} from '../../api/types';
import {CourseArt, RoundButton} from '../../components/Catalog';
import {ChalkCard, ProgressBar} from '../../components/Chalkboard';
import {Icon} from '../../components/Icon';
import {PrimaryAction} from '../../components/Layout';
import {EmptyState, Notice} from '../../components/States';
import {haptic} from '../../theme/system';
import {currentLessonId, doneLessonIds, moduleTwo, playingLesson} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

type Tab = 'Lessons' | 'Discussion' | 'Resources';
const tabs: Tab[] = ['Lessons', 'Discussion', 'Resources'];
const font = {fontFamily: fonts.family};

type Props = {onBack: () => void; onQuiz: () => void; onReport: () => void};
// Lesson videos aren't hosted yet, so every play attempt ends in the could-not-load state.
const VIDEO_URL: string | undefined = undefined;

export function CoursePlayerScreen({onBack, onQuiz, onReport}: Props) {
  const [tab, setTab] = useState<Tab>('Lessons');
  const [video, setVideo] = useState<'idle' | 'loading' | 'failed'>('idle');
  const play = () => {
    setVideo('loading');
    setTimeout(() => { if (!VIDEO_URL) { haptic.warning(); setVideo('failed'); } }, 900);
  };
  const [completed, setCompleted] = useState(false);
  const lessonsDone = moduleTwo.lessons.filter(l => l.type !== 'quiz').every(l => doneLessonIds.includes(l.id));
  const statusOf = (lesson: Lesson) => {
    if (lesson.type === 'quiz') return lessonsDone ? 'open' : 'locked';
    if (doneLessonIds.includes(lesson.id)) return 'done';
    if (lesson.id === currentLessonId) return 'current';
    return 'upcoming';
  };

  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {video === 'failed' ? <View style={[styles.video, styles.videoFailed]}>
        <Pressable onPress={play} style={({pressed}) => [styles.retry, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Reload video"><Icon name="refresh" size={24} color={colors.onAccent} /></Pressable>
        <Text style={[font, styles.failedTitle]}>This video will not load</Text>
        <Text style={[font, styles.failedText]}>Check your connection and try again</Text>
        <RoundButton icon="back" onPress={onBack} label="Back" style={styles.back} />
      </View> : <View style={styles.video}>
        <CourseArt index={2} size={150} />
        <Pressable onPress={play} disabled={video === 'loading'} style={({pressed}) => [styles.playButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Play lesson">
          {video === 'loading' ? <ActivityIndicator color={colors.blue700} /> : <Icon name="play" size={26} color={colors.blue700} />}
        </Pressable>
        <RoundButton icon="back" onPress={onBack} label="Back" style={styles.back} />
        <View style={styles.timeBar}>
          <Text style={[font, styles.time]}>{playingLesson.elapsed} / {playingLesson.duration}</Text>
          <ProgressBar value={playingLesson.progress} track="rgba(254, 249, 242, 0.3)" fill={colors.sky} height={5} />
        </View>
      </View>}

      <View style={styles.body}>
        {video === 'failed' && <View style={styles.saved}><Notice tone="success" title="Your progress is saved" message={`You will resume at ${playingLesson.elapsed}.`} /></View>}
        <Text style={[font, styles.lessonTitle]}>{playingLesson.title}</Text>
        <Text style={[font, styles.meta]}>{playingLesson.moduleTitle} · Lesson {playingLesson.lessonNumber} of {playingLesson.lessonsTotal}</Text>

        {video === 'failed' && <View style={styles.failedActions}>
          <View style={styles.half}><PrimaryAction label="Reload video" onPress={play} /></View>
          <View style={styles.half}><PrimaryAction label="Report a problem" outline onPress={onReport} /></View>
        </View>}

        <ChalkCard style={styles.board}>
          <Text style={[font, styles.boardTitle]}>On the board</Text>
          {playingLesson.takeaways.map(point => <View key={point} style={styles.point}>
            <Icon name="check" size={18} color={colors.chalkText} />
            <Text style={[font, styles.pointText]}>{point}</Text>
          </View>)}
        </ChalkCard>

        <View style={styles.tabs}>
          {tabs.map(t => <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabOn]} accessibilityRole="tab" accessibilityState={{selected: tab === t}}>
            <Text style={[font, styles.tabText, tab === t && styles.tabTextOn]}>{t}</Text>
          </Pressable>)}
        </View>

        {tab === 'Lessons' ? moduleTwo.lessons.map(lesson => {
          const status = statusOf(lesson);
          const isQuiz = lesson.type === 'quiz';
          const detail = isQuiz ? `Quiz · ${lesson.questionsCount} questions` : `Video · ${lesson.durationMinutes} min`;
          return <Pressable key={lesson.id} disabled={status === 'locked'} onPress={() => (isQuiz ? onQuiz() : undefined)} style={styles.lesson} accessibilityRole="button" accessibilityState={{disabled: status === 'locked'}}>
            <View style={[styles.marker, status === 'done' && styles.markerDone, status === 'current' && styles.markerCurrent]}>
              {status === 'done' && <Icon name="check" size={16} color={colors.onSky} />}
              {status === 'current' && <Icon name="play" size={12} color={colors.blue700} />}
              {status === 'locked' && <Icon name="lock" size={16} color={colors.muted} />}
            </View>
            <View style={styles.lessonCopy}>
              <Text style={[font, styles.rowTitle]}>{lesson.title}</Text>
              <Text style={[font, styles.rowDetail]}>{detail}</Text>
            </View>
          </Pressable>;
        }) : <EmptyState title={tab === 'Discussion' ? 'No discussion yet' : 'No resources yet'} message="The instructor has not added anything here for this lesson." />}
      </View>
    </ScrollView>

    <View style={styles.footer}>
      <PrimaryAction label={completed ? 'Completed' : 'Mark as complete'} onPress={() => setCompleted(true)} />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {paddingBottom: 24},
  video: {height: 230, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  playButton: {position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingLeft: 4},
  back: {position: 'absolute', left: 14, top: 14, backgroundColor: colors.white},
  timeBar: {position: 'absolute', left: 16, right: 16, bottom: 14, gap: 8},
  time: {fontSize: type.caption, color: colors.chalkText, fontFamily: fonts.bold},
  pressed: {opacity: 0.85},
  videoFailed: {backgroundColor: colors.blue900, paddingHorizontal: 24},
  retry: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 255, 255, 0.16)', alignItems: 'center', justifyContent: 'center', marginBottom: 14},
  failedTitle: {fontSize: type.label, color: colors.chalkText, fontFamily: fonts.bold, textAlign: 'center'},
  failedText: {fontSize: type.caption, color: colors.chalkText, opacity: 0.8, marginTop: 4, textAlign: 'center'},
  saved: {marginBottom: 16},
  failedActions: {flexDirection: 'row', gap: 12, marginBottom: 22},
  half: {flex: 1},
  body: {paddingHorizontal: spacing.screen, paddingTop: 20},
  lessonTitle: {fontSize: type.title, color: colors.ink, fontFamily: fonts.bold},
  meta: {fontSize: type.small, color: colors.muted, marginTop: 6, marginBottom: 18},
  board: {marginBottom: 22},
  boardTitle: {fontSize: type.title, color: colors.chalkText, fontFamily: fonts.bold, marginBottom: 12},
  point: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10},
  pointText: {flex: 1, fontSize: type.label, color: colors.chalkText},
  tabs: {flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 12, gap: 22},
  tab: {paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent'},
  tabOn: {borderBottomColor: colors.sky},
  tabText: {fontSize: type.label, color: colors.muted, fontFamily: fonts.semibold},
  tabTextOn: {color: colors.ink, fontFamily: fonts.bold},
  lesson: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line},
  marker: {width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  markerDone: {backgroundColor: colors.sky, borderColor: colors.sky},
  markerCurrent: {borderColor: colors.blue700, borderWidth: 2},
  lessonCopy: {flex: 1},
  rowTitle: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  rowDetail: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  footer: {paddingHorizontal: spacing.screen, paddingVertical: 14, backgroundColor: colors.barBg, borderTopWidth: 1, borderTopColor: colors.line},
});
