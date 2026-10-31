import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import type {Course} from '../../api/types';
import {SearchField} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {Rise} from '../../components/Motion';
import {formatNaira, sampleCourses} from '../../data/catalog';
import {continueLearning, learnerName} from '../../data/learning';
import {colors, fonts, spacing, type} from '../../theme/tokens';

type Props = {onResume: () => void; onCourse: (course: Course) => void; onNotifications: () => void};
const font = {fontFamily: fonts.family};
const chips = ['All', 'AI', 'Tech', 'Design', 'Programming', 'Database'];
// Courses that sit under each chip until the catalogue has these categories.
const chipCategory: Record<string, string[]> = {AI: ['Tech'], Tech: ['Tech'], Design: ['Design'], Programming: ['Tech'], Database: ['Business', 'Tech']};

/** Progress as the design draws it: a solid run for what is done, then chalk dots for what is left. */
function ChalkProgress({value}: {value: number}) {
  const grow = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(grow, {toValue: value, duration: 1000, delay: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false}).start(); }, [grow, value]);
  const dots = Math.round((100 - value) / 5);
  return <View style={styles.progressRow} accessibilityRole="progressbar" accessibilityValue={{min: 0, max: 100, now: value}}>
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, {width: grow.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']})}]} />
      <View style={[styles.dots, {left: `${value}%`}]}>{Array.from({length: dots}, (_, i) => <View key={i} style={styles.dot} />)}</View>
    </View>
    <Text style={[styles.percent, font]}>{value}%</Text>
  </View>;
}

/** The course "book" on the continue card: a framed page with the course shapes on it. */
function BookArt() {
  return <View style={styles.book}>
    <View style={styles.bookA} />
    <View style={styles.bookB} />
    <View style={styles.bookC} />
  </View>;
}

const tileArt: {bg: string; border: string; shapes: ViewStyle[]}[] = [
  {bg: colors.cream, border: colors.sandLine, shapes: [
    {left: '20%', top: '20%', width: '40%', height: '52%', borderRadius: 10, backgroundColor: '#A6C3EA'},
    {left: '56%', top: '28%', width: 52, height: 52, borderRadius: 26, backgroundColor: colors.marigold},
    {left: '50%', top: '66%', width: '30%', height: 22, borderRadius: 4, backgroundColor: '#3E6FB0'},
  ]},
  {bg: colors.blue100, border: colors.blue100, shapes: [
    {left: '16%', top: '18%', width: 88, height: 88, borderRadius: 44, backgroundColor: '#2D5089'},
    {left: '62%', top: '18%', width: '40%', height: 44, borderRadius: 6, backgroundColor: colors.marigold},
    {left: '56%', top: '56%', width: '38%', height: 20, borderRadius: 5, backgroundColor: '#7FA8E0'},
  ]},
];

function CourseTile({course, index, onPress}: {course: Course; index: number; onPress: () => void}) {
  const art = tileArt[index % tileArt.length];
  const scale = useRef(new Animated.Value(1)).current;
  const press = (to: number) => Animated.spring(scale, {toValue: to, friction: 6, useNativeDriver: true}).start();
  return <Rise delay={420 + index * 90}>
    <Animated.View style={{transform: [{scale}]}}>
      <Pressable onPress={onPress} onPressIn={() => press(0.97)} onPressOut={() => press(1)} style={styles.tile} accessibilityRole="button" accessibilityLabel={`${course.title}, ${course.instructorName}, ${formatNaira(course.price)}`}>
        <View style={[styles.tileArt, {backgroundColor: art.bg, borderColor: art.border}]}>
          {art.shapes.map((shape, i) => <View key={i} style={[styles.shape, shape]} />)}
        </View>
        <View style={styles.tileCopy}>
          <Text style={[styles.tileTitle, font]} numberOfLines={2}>{course.title}</Text>
          <Text style={[styles.tileMeta, font]} numberOfLines={1}>{course.instructorName}</Text>
          <Text style={[styles.tilePrice, font]}>{formatNaira(course.price)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  </Rise>;
}

export function StudentHomeScreen({onResume, onCourse, onNotifications}: Props) {
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All');
  const recommended = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleCourses
      .filter(c => c.id !== 'excel')
      .filter(c => (chip === 'All' || chipCategory[chip]?.includes(c.category ?? '')) && (!q || c.title.toLowerCase().includes(q)));
  }, [chip, query]);

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <Rise style={styles.header}>
      <Text style={[styles.hello, font]}>Hi,  {learnerName}</Text>
      <Pressable onPress={onNotifications} hitSlop={12} style={styles.bell} accessibilityRole="button" accessibilityLabel="Notifications, unread">
        <Icon name="bell" size={26} color={colors.ink} strokeWidth={1.6} />
        <View style={styles.unread} />
      </Pressable>
    </Rise>
    <Rise delay={60} style={styles.pad}><SearchField value={query} onChangeText={setQuery} placeholder="Search for courses" style={styles.search} /></Rise>

    <Rise delay={120} style={styles.pad}>
      <Text style={[styles.section, font]}>Continue learning</Text>
      <Pressable onPress={onResume} style={styles.frame} accessibilityRole="button" accessibilityLabel={`Continue ${continueLearning.title}, ${continueLearning.progress}% done`}>
        <View style={styles.board}>
          <View style={styles.swirlA} />
          <View style={styles.swirlB} />
          <BookArt />
          <View style={styles.boardCopy}>
            <Text style={styles.chalkTitle} numberOfLines={1} adjustsFontSizeToFit>{continueLearning.title}</Text>
            <Svg width={150} height={10} viewBox="0 0 150 10" style={styles.squiggle}>
              <Path d="M2 6 C 14 1, 22 1, 34 5 S 56 9, 68 5 S 90 1, 102 5 S 124 9, 136 5 S 146 3, 148 4" stroke={colors.chalkText} strokeWidth={2} fill="none" strokeLinecap="round" />
            </Svg>
            <Text style={[styles.chalkMeta, font]} numberOfLines={1}>Lesson {continueLearning.lessonNumber} of {continueLearning.lessonsTotal}: {continueLearning.lesson}</Text>
            <ChalkProgress value={continueLearning.progress} />
            <Pressable onPress={onResume} style={({pressed}) => [styles.resume, pressed && styles.pressed]} accessibilityRole="button">
              <Text style={[styles.resumeText, font]}>Resume</Text>
            </Pressable>
          </View>
          <View style={styles.eraser} />
        </View>
      </Pressable>
    </Rise>

    <Rise delay={240}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {chips.map(c => {
          const on = chip === c;
          return <Pressable key={c} onPress={() => setChip(c)} style={on ? styles.chipOn : styles.chip} accessibilityRole="tab" accessibilityState={{selected: on}}>
            <Text style={[on ? styles.chipTextOn : styles.chipText, font]}>{c}</Text>
            {!on && <View style={styles.chipLine} />}
          </Pressable>;
        })}
      </ScrollView>
    </Rise>

    <Rise delay={320} style={[styles.pad, styles.sectionRow]}>
      <Text style={[styles.section, styles.flat, font]}>Recommended</Text>
      <Pressable hitSlop={10} accessibilityRole="button"><Text style={[styles.link, font]}>See all</Text></Pressable>
    </Rise>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail} decelerationRate="fast" snapToInterval={TILE + 14}>
      {recommended.map((course, i) => <CourseTile key={`${chip}-${course.id}`} course={course} index={i} onPress={() => onCourse(course)} />)}
    </ScrollView>
    {recommended.length === 0 && <Text style={[styles.empty, font]}>No courses in this category yet.</Text>}
  </ScrollView>;
}

const TILE = 250;
const chalkBlue = '#A9C6EC';

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {paddingTop: 20, paddingBottom: 28},
  pad: {paddingHorizontal: spacing.screen},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.screen, marginBottom: 20},
  hello: {fontSize: 28, color: colors.ink, fontWeight: '800'},
  bell: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  unread: {position: 'absolute', top: 2, right: 3, width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5483B'},
  search: {backgroundColor: '#F8F8FC', height: 58},
  section: {fontSize: type.heading, color: colors.ink, fontWeight: '800', marginTop: 24, marginBottom: 12},
  flat: {marginTop: 0, marginBottom: 0},
  sectionRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 14},
  link: {fontSize: type.label, color: colors.blue700, fontWeight: '700'},
  frame: {borderRadius: 22, padding: 5, backgroundColor: '#E6DFD3'},
  board: {flexDirection: 'row', alignItems: 'center', gap: 18, borderRadius: 18, backgroundColor: colors.chalk, padding: 16, paddingRight: 14, overflow: 'hidden'},
  swirlA: {position: 'absolute', width: 320, height: 90, borderRadius: 60, backgroundColor: 'rgba(254, 249, 242, 0.05)', top: 4, right: -40, transform: [{rotate: '-8deg'}]},
  swirlB: {position: 'absolute', width: 300, height: 80, borderRadius: 50, backgroundColor: 'rgba(254, 249, 242, 0.04)', bottom: 6, left: -30, transform: [{rotate: '6deg'}]},
  book: {width: 100, height: 146, borderRadius: 10, borderWidth: 3, borderColor: '#3E6FB0', backgroundColor: colors.cream},
  bookA: {position: 'absolute', left: 14, top: 30, width: 36, height: 76, borderRadius: 8, backgroundColor: '#A6C3EA'},
  bookB: {position: 'absolute', left: 40, top: 38, width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8B85A'},
  bookC: {position: 'absolute', left: 50, top: 86, width: 28, height: 20, borderRadius: 4, backgroundColor: '#3E6FB0'},
  boardCopy: {flex: 1},
  chalkTitle: {fontFamily: 'Caveat', fontSize: 36, lineHeight: 42, color: colors.chalkText, fontWeight: '700'},
  squiggle: {marginTop: -2, marginBottom: 8},
  chalkMeta: {fontSize: type.small, color: chalkBlue, marginBottom: 12},
  progressRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14},
  progressTrack: {flex: 1, height: 6, justifyContent: 'center'},
  progressFill: {position: 'absolute', left: 0, height: 6, borderRadius: 3, backgroundColor: chalkBlue, zIndex: 1},
  dots: {position: 'absolute', right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 6},
  dot: {width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(254, 249, 242, 0.55)'},
  percent: {fontSize: type.small, color: colors.chalkText, fontWeight: '700'},
  resume: {alignSelf: 'flex-start', height: 42, minWidth: 140, paddingHorizontal: 26, borderRadius: 10, backgroundColor: '#F4F1EA', alignItems: 'center', justifyContent: 'center'},
  resumeText: {fontSize: type.label, color: colors.ink, fontWeight: '800'},
  eraser: {position: 'absolute', right: 18, bottom: 12, width: 38, height: 9, borderRadius: 5, backgroundColor: '#D9D6CC'},
  pressed: {opacity: 0.8},
  chips: {gap: 14, alignItems: 'center', paddingHorizontal: spacing.screen, paddingTop: 26},
  chip: {paddingVertical: 4},
  chipOn: {height: 44, paddingHorizontal: 22, borderRadius: 22, backgroundColor: '#3E6FB0', justifyContent: 'center'},
  chipText: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  chipTextOn: {fontSize: type.label, color: colors.white, fontWeight: '700'},
  chipLine: {height: 2, borderRadius: 1, backgroundColor: colors.marigold, marginTop: 2},
  rail: {gap: 14, paddingHorizontal: spacing.screen, paddingBottom: 6},
  tile: {width: TILE, backgroundColor: '#FBFAF8', borderWidth: 1, borderColor: colors.sandLine, borderRadius: 14, padding: 10},
  tileArt: {height: 148, borderRadius: 10, borderWidth: 1, overflow: 'hidden'},
  shape: {position: 'absolute'},
  tileCopy: {paddingHorizontal: 8, paddingTop: 14, paddingBottom: 6},
  tileTitle: {fontSize: 17, lineHeight: 23, color: colors.ink, fontWeight: '800', minHeight: 46},
  tileMeta: {fontSize: type.small, color: colors.muted, marginTop: 8},
  tilePrice: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 14},
  empty: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 24},
});
