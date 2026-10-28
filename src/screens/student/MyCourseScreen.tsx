import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {CourseArt} from '../../components/Catalog';
import {ProgressBar} from '../../components/Chalkboard';
import {EmptyState} from '../../components/States';
import {sampleCourses} from '../../data/catalog';
import {enrolments} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

type Tab = 'In progress' | 'Completed' | 'Wishlist';
const tabs: Tab[] = ['In progress', 'Completed', 'Wishlist'];
const font = {fontFamily: fonts.family};

type Props = {saved: string[]; onOpen: (course: Course) => void};

export function MyCourseScreen({saved, onOpen}: Props) {
  const [tab, setTab] = useState<Tab>('In progress');
  const rows = useMemo(() => {
    const byId = (id: string) => sampleCourses.find(c => c.id === id);
    if (tab === 'Wishlist') return saved.map(byId).filter((c): c is Course => !!c).map(course => ({course, progress: undefined as number | undefined}));
    const status = tab === 'In progress' ? 'in-progress' : 'completed';
    return enrolments.filter(e => e.status === status).map(e => ({course: byId(e.courseId), progress: e.progress})).filter((r): r is {course: Course; progress: number} => !!r.course);
  }, [tab, saved]);

  return <View style={styles.screen}>
    <Text style={[styles.title, font]}>My Course</Text>
    <View style={styles.segments}>
      {tabs.map(t => <Pressable key={t} onPress={() => setTab(t)} style={[styles.segment, tab === t && styles.segmentOn]} accessibilityRole="tab" accessibilityState={{selected: tab === t}}>
        <Text style={[styles.segmentText, font, tab === t && styles.segmentTextOn]}>{t}</Text>
      </Pressable>)}
    </View>
    <FlatList data={rows} keyExtractor={r => r.course.id} contentContainerStyle={styles.list}
      ListEmptyComponent={<EmptyState title={tab === 'Wishlist' ? 'Nothing saved yet' : `No ${tab.toLowerCase()} courses`} message={tab === 'Wishlist' ? 'Tap the heart on a course to save it here.' : 'Courses you enrol in will show here.'} />}
      renderItem={({item, index}) => <Pressable onPress={() => onOpen(item.course)} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
        <CourseArt index={index} size={84} />
        <View style={styles.copy}>
          <Text style={[styles.rowTitle, font]} numberOfLines={2}>{item.course.title}</Text>
          <Text style={[styles.rowMeta, font]} numberOfLines={1}>{item.course.instructorName}</Text>
          {item.progress !== undefined && <View style={styles.progressRow}>
            <View style={styles.bar}><ProgressBar value={item.progress} track={colors.sand} fill={colors.blue600} height={6} /></View>
            <Text style={[styles.percent, font]}>{item.progress}%</Text>
          </View>}
        </View>
      </Pressable>} />
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream, paddingTop: 12},
  title: {fontSize: type.display, color: colors.ink, fontWeight: '800', paddingHorizontal: spacing.screen, marginBottom: 18},
  segments: {flexDirection: 'row', gap: 10, paddingHorizontal: spacing.screen, marginBottom: 18},
  segment: {height: 44, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, justifyContent: 'center'},
  segmentOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  segmentText: {fontSize: type.label, color: colors.ink, fontWeight: '600'},
  segmentTextOn: {color: colors.onSky, fontWeight: '800'},
  list: {paddingHorizontal: spacing.screen, paddingBottom: 28, flexGrow: 1},
  row: {flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 12, marginBottom: 12},
  pressed: {opacity: 0.85},
  copy: {flex: 1},
  rowTitle: {fontSize: type.small, color: colors.ink, fontWeight: '800', lineHeight: 19},
  rowMeta: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  progressRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12},
  bar: {flex: 1},
  percent: {fontSize: type.caption, color: colors.ink, fontWeight: '700', width: 40, textAlign: 'right'},
});
