import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {CategoryChips, CourseCard, SearchField} from '../../components/Catalog';
import {categories} from '../../data/catalog';
import {colors, fonts, motion, radius, spacing, type} from '../../theme/tokens';

type Props = {courses: Course[]; onLogin: () => void; onSearch: (query: string) => void; onCategory: (category: string) => void; onSeeAll: () => void; onCourse: (course: Course) => void};
const outExpo = Easing.bezier(...motion.outExpo);

export function LandingScreen({courses, onLogin, onSearch, onCategory, onSeeAll, onCourse}: Props) {
  const [query, setQuery] = useState('');
  const bubbles = useRef(new Animated.Value(0)).current;
  // Hero circles drift in from the corner, echoing the launch intro's ease.
  useEffect(() => { Animated.timing(bubbles, {toValue: 1, duration: motion.slow * 1.4, easing: outExpo, useNativeDriver: true}).start(); }, [bubbles]);
  const drift = (dx: number, dy: number) => ({opacity: bubbles, transform: [{translateX: bubbles.interpolate({inputRange: [0, 1], outputRange: [dx, 0]})}, {translateY: bubbles.interpolate({inputRange: [0, 1], outputRange: [dy, 0]})}]});

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.top}>
      <View style={styles.logo}><Text style={styles.logoText}>yizelearn</Text></View>
      <Pressable onPress={onLogin} style={({pressed}) => [styles.login, pressed && styles.pressed]} accessibilityRole="button"><Text style={[styles.loginText, font]}>Log in</Text></Pressable>
    </View>
    <View style={styles.hero}>
      <Animated.View style={[styles.circle, styles.bigCircle, drift(40, -30)]} />
      <Animated.View style={[styles.circle, styles.greyDot, drift(30, -10)]} />
      <Animated.View style={[styles.circle, styles.yellowDot, drift(20, 20)]} />
      <Text style={[styles.heroTitle, font]}>Learn something.{'\n'}Gain real skill.</Text>
      <Text style={[styles.heroCopy, font]}>Short, practical courses from instructors you can trust.</Text>
      <SearchField value={query} onChangeText={setQuery} onSubmit={() => onSearch(query)} placeholder="What do you want to learn?" style={styles.heroSearch} />
    </View>
    <View style={styles.bleed}><CategoryChips items={categories} active="All" onSelect={item => (item === 'All' ? onSeeAll() : onCategory(item))} /></View>
    <View style={styles.section}><Text style={[styles.sectionTitle, font]}>Top courses</Text><Pressable onPress={onSeeAll} hitSlop={10}><Text style={[styles.link, font]}>See all</Text></Pressable></View>
    {courses.slice(0, 3).map((course, i) => <CourseCard key={course.id} course={course} index={i} onPress={() => onCourse(course)} />)}
  </ScrollView>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {paddingHorizontal: spacing.screen, paddingTop: 12, paddingBottom: 28},
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20},
  logo: {height: 60, justifyContent: 'center'},
  logoText: {fontFamily: 'Charmonman-Regular', fontSize: 38, lineHeight: 60, color: colors.blue700, includeFontPadding: false},
  login: {height: 48, paddingHorizontal: 24, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.sky, justifyContent: 'center'},
  loginText: {fontSize: type.body, color: colors.blue700, fontWeight: '700'},
  pressed: {opacity: 0.75},
  hero: {backgroundColor: colors.sky, borderRadius: 22, padding: 20, paddingTop: 28, overflow: 'hidden'},
  circle: {position: 'absolute', borderRadius: radius.pill},
  bigCircle: {width: 120, height: 120, right: -24, top: -14, backgroundColor: colors.blue100},
  greyDot: {width: 22, height: 22, right: 86, top: 96, backgroundColor: colors.sandLine},
  yellowDot: {width: 34, height: 34, right: 22, top: 112, backgroundColor: colors.marigold},
  heroTitle: {fontSize: type.display - 2, lineHeight: 38, color: colors.onSky, fontWeight: '800', marginBottom: 10, maxWidth: '80%'},
  heroCopy: {fontSize: type.label, lineHeight: 21, color: colors.onSky, marginBottom: 22, maxWidth: '74%'},
  heroSearch: {flex: 0},
  bleed: {marginHorizontal: -spacing.screen, marginTop: 20},
  section: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 14},
  sectionTitle: {fontSize: type.heading + 2, color: colors.ink, fontWeight: '800'},
  link: {fontSize: type.label, color: colors.blue600, fontWeight: '700'},
});
