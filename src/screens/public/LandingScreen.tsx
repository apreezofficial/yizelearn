import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {CategoryChips, CourseCard, SearchField} from '../../components/Catalog';
import {categories} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';

type Props = {courses: Course[]; onLogin: () => void; onSearch: (query: string) => void; onCategory: (category: string) => void; onSeeAll: () => void; onCourse: (course: Course) => void};

export function LandingScreen({courses, onLogin, onSearch, onCategory, onSeeAll, onCourse}: Props) {
  const [query, setQuery] = useState('');
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.top}><View style={styles.logo}><Text style={[styles.logoText, font]}>CE</Text></View><Pressable onPress={onLogin} style={styles.login}><Text style={[styles.loginText, font]}>Log in</Text></Pressable></View>
    <View style={styles.hero}>
      <View style={[styles.circle, styles.bigCircle]} /><View style={[styles.circle, styles.greyDot]} /><View style={[styles.circle, styles.yellowDot]} />
      <Text style={[styles.heroTitle, font]}>Learn something{'\n'}Gain real skill</Text>
      <Text style={[styles.heroCopy, font]}>Short, practical courses from instructors you can trust.</Text>
      <SearchField value={query} onChangeText={setQuery} onSubmit={() => onSearch(query)} placeholder="What do you want to learn?" style={styles.heroSearch} />
    </View>
    <CategoryChips items={categories} active="All" onSelect={item => (item === 'All' ? onSeeAll() : onCategory(item))} />
    <View style={styles.section}><Text style={[styles.sectionTitle, font]}>Top courses</Text><Pressable onPress={onSeeAll} hitSlop={8}><Text style={[styles.link, font]}>See all</Text></Pressable></View>
    {courses.slice(0, 3).map((course, i) => <CourseCard key={course.id} course={course} index={i} onPress={() => onCourse(course)} />)}
  </ScrollView>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: 16, paddingBottom: 24},
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18},
  logo: {width: 40, height: 40, borderRadius: 8, backgroundColor: colors.blue700, alignItems: 'center', justifyContent: 'center'},
  logoText: {color: colors.white, fontWeight: '800', fontSize: 13},
  login: {height: 44, paddingHorizontal: 22, borderRadius: 12, borderWidth: 1.5, borderColor: colors.sky, justifyContent: 'center'},
  loginText: {fontSize: 16, color: colors.blue700, fontWeight: '700'},
  hero: {backgroundColor: colors.sky, borderRadius: 16, padding: 16, paddingTop: 22, marginBottom: 16, overflow: 'hidden'},
  circle: {position: 'absolute', borderRadius: 999},
  bigCircle: {width: 92, height: 92, right: -14, top: -8, backgroundColor: colors.blue100},
  greyDot: {width: 18, height: 18, right: 64, top: 72, backgroundColor: colors.sandLine},
  yellowDot: {width: 26, height: 26, right: 14, top: 84, backgroundColor: colors.marigold},
  heroTitle: {fontSize: 26, lineHeight: 32, color: colors.heroText, fontWeight: '800', marginBottom: 8, maxWidth: '78%'},
  heroCopy: {fontSize: 13, lineHeight: 18, color: colors.heroText, marginBottom: 18, maxWidth: '72%'},
  heroSearch: {flex: 0},
  section: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 12},
  sectionTitle: {fontSize: 18, color: colors.ink, fontWeight: '800'},
  link: {fontSize: 13, color: colors.blue600, fontWeight: '700'},
});
