import React, {useState} from 'react';
import {LayoutAnimation, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Lesson, Module} from '../api/types';
import {colors, fonts, radius, type} from '../theme/tokens';
import {Icon} from './Icon';

const font = {fontFamily: fonts.family};

/** Expandable modules with their lessons; preview lessons are tappable before enrolling. */
export function ModuleList({modules, onPreview}: {modules: Module[]; onPreview: (lesson: Lesson) => void}) {
  const [open, setOpen] = useState<string | undefined>(modules[0]?.id);
  const toggle = (id: string) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpen(current => (current === id ? undefined : id)); };
  return <View>{modules.map(module => { const expanded = open === module.id; return <View key={module.id} style={[styles.module, expanded && styles.moduleOpen]}>
    <Pressable onPress={() => toggle(module.id)} style={styles.head} accessibilityRole="button" accessibilityState={{expanded}}>
      <Text style={[styles.title, font]}>{module.title}</Text>
      <Text style={[styles.count, font]}>{module.lessons.length} lessons</Text>
      <Icon name={expanded ? 'up' : 'down'} size={20} color={colors.muted} />
    </Pressable>
    {expanded && <View style={styles.lessons}>{module.lessons.map(lesson => <LessonRow key={lesson.id} lesson={lesson} onPreview={() => onPreview(lesson)} />)}</View>}
  </View>; })}</View>;
}

function LessonRow({lesson, onPreview}: {lesson: Lesson; onPreview: () => void}) {
  const isVideo = lesson.type === 'video';
  const detail = isVideo ? `Video · ${lesson.durationMinutes} min` : `Quiz · ${lesson.questionsCount} questions`;
  return <Pressable onPress={lesson.preview ? onPreview : undefined} style={({pressed}) => [styles.lesson, pressed && lesson.preview && styles.pressed]}>
    <View style={[styles.lessonIcon, !isVideo && styles.lessonIconLocked]}><Icon name={isVideo ? 'play' : 'lock'} size={16} color={isVideo ? colors.blue700 : colors.muted} /></View>
    <View style={styles.lessonCopy}><Text style={[styles.lessonTitle, font]}>{lesson.title}</Text><Text style={[styles.lessonDetail, font]}>{detail}</Text></View>
    {lesson.preview && <View style={styles.preview}><Text style={[styles.previewText, font]}>Preview</Text></View>}
  </Pressable>;
}

const styles = StyleSheet.create({
  module: {backgroundColor: colors.sand, borderRadius: radius.card, marginBottom: 12, overflow: 'hidden'},
  moduleOpen: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine},
  head: {flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingHorizontal: 16, gap: 10},
  title: {flex: 1, fontSize: type.body, color: colors.ink, fontWeight: '800'},
  count: {fontSize: type.caption, color: colors.muted},
  lessons: {paddingHorizontal: 16, paddingBottom: 8},
  lesson: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 60, borderTopWidth: 1, borderTopColor: colors.line},
  pressed: {opacity: 0.7},
  lessonIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  lessonIconLocked: {backgroundColor: colors.sand},
  lessonCopy: {flex: 1},
  lessonTitle: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  lessonDetail: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  preview: {backgroundColor: colors.blue100, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7},
  previewText: {fontSize: type.caption, color: colors.blue900, fontWeight: '700'},
});
