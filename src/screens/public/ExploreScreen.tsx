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
    <FlatList data={results} keyExtractor={c => c.id} contentContainerStyle={styles.list} renderItem={({item}) => <CourseCard course={item} index={courses.indexOf(item)} onPress={() => onCourse(item)} />} ListEmptyComponent={<NoResults query={browse.query} courses={courses} onSearch={query => set({query})} onClear={() => onBrowse({...browse, query: '', category: 'All', filters: defaultFilters})} />} />
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

/** Edit distance, used to suggest the phrase a misspelt search was probably after. */
function distance(a: string, b: string) {
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) { const tmp = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = tmp; }
  }
  return row[b.length];
}

function suggest(query: string, courses: Course[]) {
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).length;
  const phrases = new Set<string>();
  courses.forEach(c => { const w = c.title.toLowerCase().split(/\s+/); for (let i = 0; i + words <= w.length; i++) phrases.add(w.slice(i, i + words).join(' ')); });
  let best = ''; let score = Infinity;
  phrases.forEach(p => { const d = distance(q, p); if (d < score) { score = d; best = p; } });
  return score > 0 && score <= Math.max(2, Math.floor(q.length / 4)) ? best : undefined;
}

function NoResults({query, courses, onSearch, onClear}: {query: string; courses: Course[]; onSearch: (q: string) => void; onClear: () => void}) {
  const q = query.trim();
  const hint = q ? suggest(q, courses) : undefined;
  if (!q) return <EmptyState icon="search" title="No courses found" message="Nothing matches these filters. Try loosening them." actionLabel="Clear filters" onAction={onClear} />;
  return <EmptyState icon="search" title={`No results for “${q}”`} message={`Check the spelling or try a broader word.${hint ? `\nDid you mean ${hint}?` : ''}`}
    actionLabel={hint ? `Search “${hint}”` : 'Clear search'} onAction={() => onSearch(hint ?? '')} secondaryLabel="Clear filters" onSecondary={onClear} />;
}
