import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Course} from '../../api/types';
import {CategoryChips, CourseCard, SearchField} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {EmptyState} from '../../components/States';
import {categories, formatNumber} from '../../data/catalog';
import {colors, fonts, spacing, type} from '../../theme/tokens';
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
      <View style={styles.searchRow}><SearchField value={browse.query} onChangeText={query => set({query})} /><Pressable onPress={() => setFiltersOpen(true)} style={styles.filterButton} accessibilityLabel="Filters"><Icon name="filter" size={24} />{filterCount > 0 && <View style={styles.filterDot}><Text style={styles.filterDotText}>{filterCount}</Text></View>}</Pressable></View>
      <View style={styles.bleed}><CategoryChips items={categories} active={browse.category} onSelect={category => set({category})} /></View>
      <View style={styles.meta}><Text style={[styles.count, font]}>{formatNumber(results.length)} {results.length === 1 ? 'course' : 'courses'}</Text><Pressable onPress={() => set({sort: nextSort[browse.sort]})} hitSlop={10} style={styles.sortButton}><Icon name="sort" size={18} color={colors.blue700} /><Text style={[styles.sort, font]}>{sortLabels[browse.sort]}</Text></Pressable></View>
    </View>
    <FlatList data={results} keyExtractor={c => c.id} contentContainerStyle={styles.list} renderItem={({item}) => <CourseCard course={item} index={courses.indexOf(item)} onPress={() => onCourse(item)} />} ListEmptyComponent={<EmptyState title="No courses found" message="Try another search or clear your filters." actionLabel="Clear filters" onAction={() => onBrowse({...browse, query: '', category: 'All', filters: defaultFilters})} />} />
    <FilterSheet visible={filtersOpen} courses={courses} browse={browse} onApply={filters => {set({filters}); setFiltersOpen(false);}} onClose={() => setFiltersOpen(false)} />
  </View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  head: {paddingHorizontal: spacing.screen, paddingTop: 14},
  searchRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16},
  filterButton: {width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  filterDot: {position: 'absolute', top: 6, right: 6, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.blue700, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4},
  filterDotText: {fontSize: type.tab, color: colors.white, fontWeight: '800'},
  bleed: {marginHorizontal: -spacing.screen},
  meta: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 14},
  count: {fontSize: type.small, color: colors.muted},
  sortButton: {flexDirection: 'row', alignItems: 'center', gap: 6},
  sort: {fontSize: type.small, color: colors.blue700, fontWeight: '700'},
  list: {paddingHorizontal: spacing.screen, paddingBottom: 28, flexGrow: 1},
});
