import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {CategoryChips, CourseArt, RoundButton, SearchField} from '../../components/Catalog';
import {ChalkCard, ProgressBar} from '../../components/Chalkboard';
import {categories, formatNaira, sampleCourses} from '../../data/catalog';
import {continueLearning, learnerName} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

type Props = {onResume: () => void; onCourse: (course: Course) => void; onNotifications: () => void};
const font = {fontFamily: fonts.family};

export function StudentHomeScreen({onResume, onCourse, onNotifications}: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const recommended = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleCourses
      .filter(c => (category === 'All' || c.category === category) && (!q || c.title.toLowerCase().includes(q)))
      .slice(0, 4);
  }, [category, query]);

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <Text style={[styles.hello, font]}>Hi, {learnerName}</Text>
      <RoundButton icon="bell" onPress={onNotifications} label="Notifications" />
    </View>
    <View style={styles.pad}><SearchField value={query} onChangeText={setQuery} placeholder="Search for courses" /></View>

    <View style={styles.pad}>
      <Text style={[styles.section, font]}>Continue learning</Text>
      <ChalkCard>
        <View style={styles.continueRow}>
          <View style={styles.continueCopy}>
            <Text style={[styles.chalkTitle, font]}>{continueLearning.title}</Text>
            <Text style={[styles.chalkMeta, font]}>Lesson {continueLearning.lessonNumber} of {continueLearning.lessonsTotal} · {continueLearning.progress}%</Text>
            <View style={styles.continueBar}><ProgressBar value={continueLearning.progress} track="rgba(254, 249, 242, 0.25)" fill={colors.sky} /></View>
            <Pressable onPress={onResume} style={({pressed}) => [styles.resume, pressed && styles.pressed]} accessibilityRole="button">
              <Text style={[styles.resumeText, font]}>Resume</Text>
            </Pressable>
          </View>
          <CourseArt index={0} size={92} />
        </View>
      </ChalkCard>
    </View>

    <View style={styles.chipsWrap}><CategoryChips items={categories} active={category} onSelect={setCategory} /></View>

    <View style={[styles.pad, styles.sectionRow]}>
      <Text style={[styles.section, font]}>Recommended</Text>
      <Text style={[styles.link, font]}>See all</Text>
    </View>
    <View style={styles.grid}>
      {recommended.map((course, i) => <Pressable key={course.id} onPress={() => onCourse(course)} style={({pressed}) => [styles.tile, pressed && styles.pressed]} accessibilityRole="button">
        <View style={styles.tileArt}><CourseArt index={i} size={92} /></View>
        <Text style={[styles.tileTitle, font]} numberOfLines={2}>{course.title}</Text>
        <Text style={[styles.tileMeta, font]} numberOfLines={1}>{course.instructorName}</Text>
        <Text style={[styles.tilePrice, font]}>{formatNaira(course.price)}</Text>
      </Pressable>)}
    </View>
    {recommended.length === 0 && <Text style={[styles.empty, font]}>No courses in this category yet.</Text>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {paddingTop: 12, paddingBottom: 28},
  pad: {paddingHorizontal: spacing.screen},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.screen, marginBottom: 16},
  hello: {fontSize: type.display, color: colors.ink, fontWeight: '800'},
  section: {fontSize: type.heading + 2, color: colors.ink, fontWeight: '800', marginTop: 24, marginBottom: 12},
  sectionRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  link: {fontSize: type.label, color: colors.blue700, fontWeight: '700', marginTop: 24, marginBottom: 12},
  continueRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  continueCopy: {flex: 1},
  chalkTitle: {fontSize: type.title, color: colors.chalkText, fontWeight: '800', marginBottom: 6},
  chalkMeta: {fontSize: type.small, color: colors.chalkText, opacity: 0.85, marginBottom: 14},
  continueBar: {marginBottom: 16},
  resume: {alignSelf: 'flex-start', height: 44, paddingHorizontal: 26, borderRadius: radius.pill, backgroundColor: colors.chalkText, justifyContent: 'center'},
  resumeText: {fontSize: type.label, color: colors.chalk, fontWeight: '700'},
  pressed: {opacity: 0.8},
  chipsWrap: {marginTop: 18, marginHorizontal: -spacing.screen},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: spacing.screen, rowGap: 14},
  tile: {width: '48%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 10},
  tileArt: {height: 112, borderRadius: radius.field, backgroundColor: colors.blue50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 10},
  tileTitle: {fontSize: type.small, color: colors.ink, fontWeight: '800', lineHeight: 19, minHeight: 38},
  tileMeta: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  tilePrice: {fontSize: type.label, color: colors.ink, fontWeight: '800', marginTop: 8},
  empty: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 24},
});
