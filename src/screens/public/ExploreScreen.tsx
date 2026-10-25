import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {CategoryChips, CourseCard, SearchField} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {EmptyState} from '../../components/States';
import {categories, formatNumber} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';
import {activeFilterCount, browseCourses, defaultFilters, nextSort, sortLabels, type Browse} from './browse';
import {FilterSheet} from './FilterSheet';

type Props = {courses: Course[]; browse: Browse; onBrowse: (browse: Browse) => void; onCourse: (course: Course) => void};

export function ExploreScreen({courses, browse, onBrowse, onCourse}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const results = useMemo(() => browseCourses(courses, browse), [courses, browse]);
  const filterCount = activeFilterCount(browse.filters);
  const set = (patch: Partial<Browse>) => onBrowse({...browse, ...patch});
  return <View style={styles.screen}>
    <View style={styles.head}>
      <View style={styles.searchRow}><SearchField value={browse.query} onChangeText={query => set({query})} /><Pressable onPress={() => setFiltersOpen(true)} style={styles.filterButton} accessibilityLabel="Filters"><Icon name="filter" size={22} />{filterCount > 0 && <View style={styles.filterDot}><Text style={styles.filterDotText}>{filterCount}</Text></View>}</Pressable></View>
      <CategoryChips items={categories} active={browse.category} onSelect={category => set({category})} />
      <View style={styles.meta}><Text style={[styles.count, font]}>{formatNumber(results.length)} {results.length === 1 ? 'course' : 'courses'}</Text><Pressable onPress={() => set({sort: nextSort[browse.sort]})} hitSlop={8}><Text style={[styles.sort, font]}>{sortLabels[browse.sort]}</Text></Pressable></View>
    </View>
    <FlatList data={results} keyExtractor={c => c.id} contentContainerStyle={styles.list} renderItem={({item}) => <CourseCard course={item} index={courses.indexOf(item)} onPress={() => onCourse(item)} />} ListEmptyComponent={<EmptyState title="No courses found" message="Try another search or clear your filters." actionLabel="Clear filters" onAction={() => onBrowse({...browse, query: '', category: 'All', filters: defaultFilters})} />} />
    <FilterSheet visible={filtersOpen} courses={courses} browse={browse} onApply={filters => {set({filters}); setFiltersOpen(false);}} onClose={() => setFiltersOpen(false)} />
  </View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  head: {paddingHorizontal: 16, paddingTop: 16},
  searchRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12},
  filterButton: {width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.sandLine, alignItems: 'center', justifyContent: 'center'},
  filterDot: {position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3},
  filterDotText: {fontSize: 10, color: colors.white, fontWeight: '800'},
  meta: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12},
  count: {fontSize: 13, color: colors.muted},
  sort: {fontSize: 13, color: colors.sky, fontWeight: '700'},
  list: {paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1},
});
