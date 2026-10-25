import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Course, Lesson, Module} from '../../api/types';
import {EnrolBar, RoundButton} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {formatDuration} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';

type Props = {course: Course; modules: Module[]; saved: boolean; onBack: () => void; onToggleSave: () => void; onPreview: (lesson: Lesson) => void; onEnrol: () => void};

export function CourseCurriculumScreen({course, modules, saved, onBack, onToggleSave, onPreview, onEnrol}: Props) {
  const [open, setOpen] = useState<string | undefined>(modules[0]?.id);
  return <View style={styles.screen}>
    <View style={styles.header}><RoundButton icon="back" onPress={onBack} style={styles.plain} /><Text style={[styles.title, font]}>Curriculum</Text><RoundButton icon={saved ? 'heartFilled' : 'heart'} color={saved ? colors.danger : colors.ink} onPress={onToggleSave} style={styles.plain} /></View>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.summary, font]}>{modules.length} modules, {course.lessonsCount} lessons, {formatDuration(course.durationMinutes)}</Text>
      {modules.map(module => { const expanded = open === module.id; return <View key={module.id}>
        <Pressable onPress={() => setOpen(expanded ? undefined : module.id)} style={styles.module} accessibilityState={{expanded}}><Text style={[styles.moduleTitle, font]}>{module.title}</Text><Text style={[styles.moduleCount, font]}>{module.lessons.length}</Text><Icon name={expanded ? 'up' : 'down'} size={18} color={colors.muted} /></Pressable>
        {expanded && <View style={styles.lessons}>{module.lessons.map(lesson => <LessonRow key={lesson.id} lesson={lesson} onPreview={() => onPreview(lesson)} />)}</View>}
      </View>; })}
    </ScrollView>
    <EnrolBar price={course.price} onEnrol={onEnrol} />
  </View>;
}

function LessonRow({lesson, onPreview}: {lesson: Lesson; onPreview: () => void}) {
  const isVideo = lesson.type === 'video';
  const detail = isVideo ? `Video, ${lesson.durationMinutes} min` : `Quiz, ${lesson.questionsCount} questions`;
  return <Pressable onPress={lesson.preview ? onPreview : undefined} style={styles.lesson}>
    {isVideo ? <View style={styles.play}><Icon name="play" size={12} color={colors.blue700} /></View> : <View style={styles.lockWrap}><Icon name="lock" size={16} color={colors.muted} /></View>}
    <View style={styles.lessonCopy}><Text style={[styles.lessonTitle, font]}>{lesson.title}</Text><Text style={[styles.lessonDetail, font]}>{detail}</Text></View>
    {lesson.preview && <View style={styles.preview}><Text style={[styles.previewText, font]}>Preview</Text></View>}
  </Pressable>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 8},
  plain: {backgroundColor: 'transparent'},
  title: {fontSize: 18, color: colors.ink, fontWeight: '800'},
  content: {paddingHorizontal: 16, paddingBottom: 24},
  summary: {fontSize: 12, color: colors.muted, marginTop: 4, marginBottom: 12},
  module: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sand, borderRadius: 10, minHeight: 52, paddingHorizontal: 12, marginBottom: 10, gap: 10},
  moduleTitle: {flex: 1, fontSize: 15, color: colors.ink, fontWeight: '800'},
  moduleCount: {fontSize: 12, color: colors.muted},
  lessons: {paddingHorizontal: 8, marginBottom: 6},
  lesson: {flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, marginBottom: 4},
  play: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  lockWrap: {width: 22, alignItems: 'center'},
  lessonCopy: {flex: 1},
  lessonTitle: {fontSize: 13, color: colors.ink, fontWeight: '700'},
  lessonDetail: {fontSize: 11, color: colors.muted, marginTop: 2},
  preview: {backgroundColor: colors.blue100, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5},
  previewText: {fontSize: 11, color: colors.blue900, fontWeight: '700'},
});
