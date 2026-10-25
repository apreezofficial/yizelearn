import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {EnrolBar, Rating, RoundButton} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {formatDuration} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';

type Props = {course: Course; saved: boolean; onBack: () => void; onToggleSave: () => void; onCurriculum: () => void; onEnrol: () => void};
const tabs = ['Overview', 'Curriculum', 'Reviews'] as const;

export function CourseScreen({course, saved, onBack, onToggleSave, onCurriculum, onEnrol}: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview');
  const initials = (course.instructorName || '?').split(' ').map(p => p[0]).join('').slice(0, 2);
  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <View style={styles.square} /><View style={styles.dot} /><View style={styles.disc} />
        <RoundButton icon="back" onPress={onBack} style={styles.heroLeft} />
        <RoundButton icon={saved ? 'heartFilled' : 'heart'} color={saved ? colors.danger : colors.ink} onPress={onToggleSave} style={styles.heroRight} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, font]}>{course.title.replace(': ', ':\n')}</Text>
        <Rating value={course.rating} count={course.ratingsCount} />
        <View style={styles.instructor}><View style={styles.avatar}><Text style={[styles.avatarText, font]}>{initials}</Text></View><Text style={[styles.instructorName, font]}>{course.instructorName}</Text><Text style={[styles.facts, font]}>{formatDuration(course.durationMinutes)}, {course.lessonsCount} lessons</Text></View>
      </View>
      <View style={styles.tabs}>{tabs.map(t => <Pressable key={t} onPress={() => (t === 'Curriculum' ? onCurriculum() : setTab(t))} style={[styles.tab, tab === t && styles.tabActive]}><Text style={[styles.tabText, font, tab === t && styles.tabTextActive]}>{t}</Text></Pressable>)}</View>
      <View style={styles.body}>
        {tab === 'Overview' ? <>
          <Text style={[styles.heading, font]}>What you will learn</Text>
          {(course.outcomes || []).map(o => <View key={o} style={styles.outcome}><View style={styles.tick}><Icon name="check" size={12} color={colors.white} /></View><Text style={[styles.outcomeText, font]}>{o}</Text></View>)}
          <Text style={[styles.heading, styles.gap, font]}>About this course</Text>
          <Text style={[styles.about, font]}>{course.summary}</Text>
        </> : <>
          <Text style={[styles.heading, font]}>Reviews</Text>
          <Rating value={course.rating} count={course.ratingsCount} />
          <Text style={[styles.about, styles.gapSmall, font]}>Written reviews will show here once the reviews design is ready.</Text>
        </>}
      </View>
    </ScrollView>
    <EnrolBar price={course.price} onEnrol={onEnrol} />
  </View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  scroll: {paddingBottom: 24},
  hero: {height: 200, backgroundColor: colors.sky, overflow: 'hidden'},
  square: {position: 'absolute', left: 60, top: 64, width: 72, height: 66, borderRadius: 4, backgroundColor: colors.marigold},
  dot: {position: 'absolute', left: 104, top: 120, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blue700},
  disc: {position: 'absolute', right: 52, top: 66, width: 102, height: 102, borderRadius: 51, backgroundColor: colors.sand},
  heroLeft: {position: 'absolute', left: 14, top: 14},
  heroRight: {position: 'absolute', right: 14, top: 14},
  body: {paddingHorizontal: 16},
  title: {fontSize: 22, lineHeight: 28, color: colors.ink, fontWeight: '800', marginTop: 16, marginBottom: 8},
  instructor: {flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 10},
  avatar: {width: 30, height: 30, borderRadius: 15, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  avatarText: {fontSize: 11, color: colors.blue900, fontWeight: '700'},
  instructorName: {flex: 1, fontSize: 14, color: colors.ink, fontWeight: '700'},
  facts: {fontSize: 12, color: colors.muted},
  tabs: {flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line, marginTop: 16, marginBottom: 16, paddingHorizontal: 16, gap: 22},
  tab: {paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: colors.sky},
  tabText: {fontSize: 14, color: colors.muted},
  tabTextActive: {color: colors.ink, fontWeight: '700'},
  heading: {fontSize: 17, color: colors.ink, fontWeight: '800', marginBottom: 12},
  gap: {marginTop: 18},
  gapSmall: {marginTop: 10},
  outcome: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12},
  tick: {width: 18, height: 18, borderRadius: 9, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  outcomeText: {fontSize: 14, color: colors.ink},
  about: {fontSize: 13, lineHeight: 19, color: colors.ink},
});
