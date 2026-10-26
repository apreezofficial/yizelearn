import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View, type LayoutRectangle, type ScrollViewInstance} from 'react-native';
import type {Course, Lesson, Module} from '../../api/types';
import {EnrolBar, Rating, RoundButton, Stars} from '../../components/Catalog';
import {Icon, type IconName} from '../../components/Icon';
import {ModuleList} from '../../components/ModuleList';
import {formatDuration, formatNumber, ratingBreakdown, sampleReviews} from '../../data/catalog';
import {colors, fonts, motion, radius, spacing, type} from '../../theme/tokens';

type Props = {course: Course; modules: Module[]; saved: boolean; onBack: () => void; onToggleSave: () => void; onPreview: (lesson: Lesson) => void; onEnrol: () => void};
const tabs = ['Overview', 'Curriculum', 'Reviews'] as const;
type Tab = (typeof tabs)[number];
const outExpo = Easing.bezier(...motion.outExpo);

export function CourseScreen({course, modules, saved, onBack, onToggleSave, onPreview, onEnrol}: Props) {
  const [tab, setTab] = useState<Tab>('Overview');
  const [tabLayouts, setTabLayouts] = useState<Partial<Record<Tab, LayoutRectangle>>>({});
  const indicator = useRef({x: new Animated.Value(0), w: new Animated.Value(0)}).current;
  const content = useRef(new Animated.Value(1)).current;
  const hero = useRef(new Animated.Value(0)).current;
  const scroll = useRef<ScrollViewInstance>(null);
  const tabsY = useRef(0);
  const initials = (course.instructorName || '?').split(' ').map(p => p[0]).join('').slice(0, 2);
  const lessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  // Hero shapes settle into place when the page opens.
  useEffect(() => { Animated.timing(hero, {toValue: 1, duration: motion.slow, easing: outExpo, useNativeDriver: true}).start(); }, [hero]);

  // Slide the underline to the active tab once its position is known.
  useEffect(() => {
    const layout = tabLayouts[tab]; if (!layout) return;
    Animated.parallel([
      Animated.timing(indicator.x, {toValue: layout.x, duration: motion.base, easing: outExpo, useNativeDriver: false}),
      Animated.timing(indicator.w, {toValue: layout.width, duration: motion.base, easing: outExpo, useNativeDriver: false}),
    ]).start();
  }, [tab, tabLayouts, indicator]);

  const select = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    content.setValue(0);
    Animated.timing(content, {toValue: 1, duration: motion.base, easing: outExpo, useNativeDriver: true}).start();
    scroll.current?.scrollTo({y: Math.max(0, tabsY.current - 8), animated: true});
  };
  const shape = (delay: number, from: number) => ({
    opacity: hero.interpolate({inputRange: [0, delay, 1], outputRange: [0, 0, 1]}),
    transform: [{translateY: hero.interpolate({inputRange: [0, 1], outputRange: [from, 0]})}, {scale: hero.interpolate({inputRange: [0, 1], outputRange: [0.7, 1]})}],
  });

  return <View style={styles.screen}>
    <ScrollView ref={scroll} stickyHeaderIndices={[2]} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Animated.View style={[styles.square, shape(0, 30)]} />
        <Animated.View style={[styles.disc, shape(0.15, 40)]} />
        <Animated.View style={[styles.dot, shape(0.3, 50)]} />
        <RoundButton icon="back" onPress={onBack} style={styles.heroLeft} label="Back" />
        <RoundButton icon={saved ? 'heartFilled' : 'heart'} color={saved ? colors.danger : colors.ink} onPress={onToggleSave} style={styles.heroRight} label={saved ? 'Remove from wishlist' : 'Save to wishlist'} />
      </View>

      <View style={styles.head}>
        <Text style={[styles.title, font]}>{course.title}</Text>
        <Rating value={course.rating} count={course.ratingsCount} />
        <View style={styles.instructor}><View style={styles.avatar}><Text style={[styles.avatarText, font]}>{initials}</Text></View><Text style={[styles.instructorName, font]}>{course.instructorName}</Text><Text style={[styles.facts, font]}>{formatDuration(course.durationMinutes)} · {course.lessonsCount} lessons</Text></View>
      </View>

      <View style={styles.tabsWrap} onLayout={e => { tabsY.current = e.nativeEvent.layout.y; }}>
        <View style={styles.tabs}>
          {tabs.map(t => <Pressable key={t} onPress={() => select(t)} onLayout={e => { const l = e.nativeEvent.layout; setTabLayouts(prev => ({...prev, [t]: l})); }} style={styles.tab} accessibilityRole="tab" accessibilityState={{selected: tab === t}}><Text style={[styles.tabText, font, tab === t && styles.tabTextActive]}>{t}</Text></Pressable>)}
          <Animated.View style={[styles.indicator, {left: indicator.x, width: indicator.w}]} />
        </View>
      </View>

      <Animated.View style={[styles.body, {opacity: content, transform: [{translateY: content.interpolate({inputRange: [0, 1], outputRange: [14, 0]})}]}]}>
        {tab === 'Overview' && <>
          <Text style={[styles.heading, font]}>What you will learn</Text>
          {(course.outcomes || []).map(o => <View key={o} style={styles.outcome}><View style={styles.tick}><Icon name="check" size={14} color={colors.white} /></View><Text style={[styles.outcomeText, font]}>{o}</Text></View>)}
          <Text style={[styles.heading, styles.gap, font]}>This course includes</Text>
          <View style={styles.includes}>
            <Include icon="play" label={`${formatDuration(course.durationMinutes)} of video`} />
            <Include icon="book" label={`${course.lessonsCount} lessons in ${modules.length} modules`} />
            <Include icon="certificate" label="Certificate of completion" />
            <Include icon="infinity" label="Lifetime access" />
          </View>
          <Text style={[styles.heading, styles.gap, font]}>About this course</Text>
          <Text style={[styles.about, font]}>{course.summary}</Text>
          <Text style={[styles.heading, styles.gap, font]}>Your instructor</Text>
          <View style={styles.teacher}><View style={[styles.avatar, styles.avatarLarge]}><Text style={[styles.avatarText, styles.avatarTextLarge, font]}>{initials}</Text></View><View style={styles.teacherCopy}><Text style={[styles.teacherName, font]}>{course.instructorName}</Text><Text style={[styles.facts, font]}>{course.category} instructor · {formatNumber(course.ratingsCount)} learners</Text></View></View>
        </>}
        {tab === 'Curriculum' && <>
          <Text style={[styles.summary, font]}>{modules.length} modules · {lessons} lessons · {formatDuration(course.durationMinutes)}</Text>
          <ModuleList modules={modules} onPreview={onPreview} />
        </>}
        {tab === 'Reviews' && <>
          <View style={styles.score}>
            <View style={styles.scoreBig}><Text style={[styles.scoreValue, font]}>{(course.rating || 0).toFixed(1)}</Text><Stars value={course.rating} size={16} /><Text style={[styles.facts, font]}>{formatNumber(course.ratingsCount)} ratings</Text></View>
            <View style={styles.bars}>{ratingBreakdown.map((share, i) => <View key={i} style={styles.barRow}><Text style={[styles.barLabel, font]}>{5 - i}</Text><View style={styles.barTrack}><View style={[styles.barFill, {width: `${share * 100}%`}]} /></View></View>)}</View>
          </View>
          {sampleReviews.map(r => <View key={r.id} style={styles.review}>
            <View style={styles.reviewHead}><View style={styles.avatar}><Text style={[styles.avatarText, font]}>{r.name.split(' ').map(p => p[0]).join('')}</Text></View><View style={styles.teacherCopy}><Text style={[styles.reviewName, font]}>{r.name}</Text><View style={styles.reviewMeta}><Stars value={r.rating} size={13} /><Text style={[styles.facts, font]}>{r.when}</Text></View></View></View>
            <Text style={[styles.about, font]}>{r.text}</Text>
          </View>)}
        </>}
      </Animated.View>
    </ScrollView>
    <EnrolBar price={course.price} onEnrol={onEnrol} />
  </View>;
}

function Include({icon, label}: {icon: IconName; label: string}) {
  return <View style={styles.include}><Icon name={icon} size={20} color={colors.blue700} /><Text style={[styles.includeText, font]}>{label}</Text></View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  scroll: {paddingBottom: 32},
  hero: {height: 240, backgroundColor: colors.sky, overflow: 'hidden'},
  square: {position: 'absolute', left: '17%', top: 70, width: 92, height: 84, borderRadius: 6, backgroundColor: colors.marigold},
  disc: {position: 'absolute', right: '12%', top: 74, width: 128, height: 128, borderRadius: 64, backgroundColor: colors.sand},
  dot: {position: 'absolute', left: '30%', top: 140, width: 52, height: 52, borderRadius: 26, backgroundColor: colors.blue700},
  heroLeft: {position: 'absolute', left: 16, top: 16},
  heroRight: {position: 'absolute', right: 16, top: 16},
  head: {paddingHorizontal: spacing.screen, paddingTop: 20},
  title: {fontSize: type.title, lineHeight: 32, color: colors.ink, fontWeight: '800', marginBottom: 10},
  instructor: {flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 10},
  avatar: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  avatarLarge: {width: 56, height: 56, borderRadius: 28},
  avatarText: {fontSize: type.caption, color: colors.blue900, fontWeight: '800'},
  avatarTextLarge: {fontSize: type.subheading},
  instructorName: {flex: 1, fontSize: type.body, color: colors.ink, fontWeight: '700'},
  facts: {fontSize: type.caption, color: colors.muted},
  tabsWrap: {backgroundColor: colors.cream, paddingTop: 8},
  tabs: {flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line, paddingHorizontal: spacing.screen, gap: 28},
  tab: {paddingVertical: 14},
  tabText: {fontSize: type.body, color: colors.muted, fontWeight: '600'},
  tabTextActive: {color: colors.ink, fontWeight: '800'},
  indicator: {position: 'absolute', bottom: -1, height: 3, borderRadius: 2, backgroundColor: colors.sky},
  body: {paddingHorizontal: spacing.screen, paddingTop: 22},
  heading: {fontSize: type.heading, color: colors.ink, fontWeight: '800', marginBottom: 14},
  gap: {marginTop: 26},
  outcome: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14},
  tick: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  outcomeText: {flex: 1, fontSize: type.body, color: colors.ink},
  includes: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 16, gap: 14},
  include: {flexDirection: 'row', alignItems: 'center', gap: 12},
  includeText: {fontSize: type.label, color: colors.ink},
  about: {fontSize: type.body, lineHeight: 24, color: colors.ink},
  teacher: {flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.sand, borderRadius: radius.card, padding: 16},
  teacherCopy: {flex: 1},
  teacherName: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginBottom: 4},
  summary: {fontSize: type.small, color: colors.muted, marginBottom: 14},
  score: {flexDirection: 'row', gap: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 18, marginBottom: 18},
  scoreBig: {alignItems: 'center', gap: 6},
  scoreValue: {fontSize: 44, color: colors.ink, fontWeight: '800', lineHeight: 50},
  bars: {flex: 1, justifyContent: 'center', gap: 6},
  barRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  barLabel: {fontSize: type.caption, color: colors.muted, width: 10},
  barTrack: {flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.sand, overflow: 'hidden'},
  barFill: {height: '100%', borderRadius: 4, backgroundColor: colors.marigold},
  review: {borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 16},
  reviewHead: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10},
  reviewName: {fontSize: type.label, color: colors.ink, fontWeight: '700', marginBottom: 3},
  reviewMeta: {flexDirection: 'row', alignItems: 'center', gap: 8},
});
