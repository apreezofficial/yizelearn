import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {coursesApi} from '../../api/endpoints';
import {useApi} from '../../hooks/useApi';
import {ListRow, PrimaryButton, ScreenHeader} from '../../components/Primitives';
import {colors} from '../../theme/tokens';

export function CoursesScreen({onSetup}: {onSetup: () => void}) {
  const [filter, setFilter] = useState('All');
  const load = useCallback(() => coursesApi.list(filter === 'All' ? undefined : {status: filter.toLowerCase()}), [filter]);
  const api = useApi(load, false);
  const courses = api.data?.data || [{id: '1', title: 'Data analysis in Excel', lessonsCount: 24, status: 'published'}, {id: '2', title: 'Financial modelling', lessonsCount: 18, status: 'draft'}, {id: '3', title: 'Business writing', lessonsCount: 12, status: 'review'}, {id: '4', title: 'Intro to Python', lessonsCount: 30, status: 'published'}];
  return <ScrollView contentContainerStyle={styles.content}><ScreenHeader eyebrow="INSTRUCTOR" title="My courses" /><View style={styles.chips}>{['All', 'Published', 'Draft'].map(value => <Pressable key={value} onPress={() => setFilter(value)} style={[styles.chip, filter === value && styles.active]}><Text style={[styles.chipText, filter === value && styles.activeText]}>{value}</Text></Pressable>)}</View>{courses.map(course => <ListRow key={course.id} title={course.title} detail={`${course.lessonsCount} lessons`} badge={course.status} onPress={onSetup} />)}<PrimaryButton label="+ Create course" onPress={onSetup} /><PrimaryButton label="Refresh course list" outline onPress={() => void api.refresh()} /></ScrollView>;
}
const styles = StyleSheet.create({content: {padding: 16, paddingBottom: 32}, chips: {flexDirection: 'row', gap: 8, marginBottom: 16}, chip: {borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.white}, active: {backgroundColor: colors.ink, borderColor: colors.ink}, chipText: {fontSize: 12, color: colors.ink}, activeText: {color: colors.onAccent}});

