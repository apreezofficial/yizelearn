import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Modal, PanResponder, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Course, CourseLevel} from '../../api/types';
import {Icon} from '../../components/Icon';
import {formatNaira, formatNumber, levels} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';
import {defaultFilters, filterCourses, PRICE_BOUNDS, searchCourses, type Browse, type CourseFilters} from './browse';

type Props = {visible: boolean; courses: Course[]; browse: Browse; onApply: (filters: CourseFilters) => void; onClose: () => void};
const ratings = [{label: 'Any', value: 0}, {label: '4.0+', value: 4}, {label: '4.5+', value: 4.5}];

export function FilterSheet({visible, courses, browse, onApply, onClose}: Props) {
  const [draft, setDraft] = useState(browse.filters);
  useEffect(() => { if (visible) setDraft(browse.filters); }, [visible, browse.filters]);
  const searched = useMemo(() => searchCourses(courses, browse), [courses, browse]);
  const matches = filterCourses(searched, draft).length;
  const levelCount = (level: CourseLevel) => filterCourses(searched, {...draft, levels: [level]}).length;
  const toggleLevel = (level: CourseLevel) => setDraft(d => ({...d, levels: d.levels.includes(level) ? d.levels.filter(l => l !== level) : [...d.levels, level]}));
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
    <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
    <View style={styles.sheet}>
      <View style={styles.grabber} />
      <View style={styles.titleRow}><Text style={[styles.title, font]}>Filters</Text><Pressable onPress={() => setDraft(defaultFilters)} hitSlop={8}><Text style={[styles.clear, font]}>Clear all</Text></Pressable></View>
      <Text style={[styles.label, font]}>Rating</Text>
      <View style={styles.pills}>{ratings.map(r => <Pressable key={r.label} onPress={() => setDraft(d => ({...d, rating: r.value}))} style={[styles.pill, draft.rating === r.value && styles.pillActive]}><Text style={[styles.pillText, font, draft.rating === r.value && styles.pillTextActive]}>{r.label}</Text></Pressable>)}</View>
      <Text style={[styles.label, font]}>Level</Text>
      {levels.map(level => { const on = draft.levels.includes(level); return <Pressable key={level} onPress={() => toggleLevel(level)} style={styles.checkRow} accessibilityRole="checkbox" accessibilityState={{checked: on}}><View style={[styles.box, on && styles.boxOn]}>{on && <Icon name="check" size={16} color={colors.white} />}</View><Text style={[styles.checkText, font]}>{level} ({formatNumber(levelCount(level))})</Text></Pressable>; })}
      <View style={styles.priceRow}><Text style={[styles.label, font]}>Price</Text><Text style={[styles.priceValue, font]}>{formatNaira(draft.price[0])} to {formatNaira(draft.price[1])}</Text></View>
      <RangeSlider min={PRICE_BOUNDS[0]} max={PRICE_BOUNDS[1]} step={1000} value={draft.price} onChange={price => setDraft(d => ({...d, price}))} />
      <View style={styles.footer}><Pressable onPress={() => setDraft(defaultFilters)} style={styles.reset}><Text style={[styles.resetText, font]}>Reset</Text></Pressable><Pressable onPress={() => onApply(draft)} style={styles.show}><Text style={[styles.showText, font]}>Show {formatNumber(matches)} {matches === 1 ? 'course' : 'courses'}</Text></Pressable></View>
    </View>
  </Modal>;
}

const THUMB = 26;
function RangeSlider({min, max, step, value, onChange}: {min: number; max: number; step: number; value: [number, number]; onChange: (value: [number, number]) => void}) {
  const [width, setWidth] = useState(0);
  const live = useRef({width, value, onChange, start: 0}); live.current = {...live.current, width, value, onChange};
  const toX = (v: number, w: number) => ((v - min) / (max - min)) * w;
  const responders = useMemo(() => ([0, 1] as const).map(i => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { live.current.start = toX(live.current.value[i], live.current.width); },
    onPanResponderMove: (_, g) => {
      const {width: w, value: v, onChange: change} = live.current; if (!w) return;
      const x = Math.min(w, Math.max(0, live.current.start + g.dx));
      const raw = Math.round((min + (x / w) * (max - min)) / step) * step;
      const next: [number, number] = i === 0 ? [Math.min(raw, v[1] - step), v[1]] : [v[0], Math.max(raw, v[0] + step)];
      if (next[0] !== v[0] || next[1] !== v[1]) change(next);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [min, max, step]);
  const [a, b] = [toX(value[0], width), toX(value[1], width)];
  return <View style={styles.slider} onLayout={e => setWidth(e.nativeEvent.layout.width - THUMB)}>
    <View style={styles.track} /><View style={[styles.trackOn, {left: a + THUMB / 2, width: b - a}]} />
    {[a, b].map((x, i) => <View key={i} {...responders[i].panHandlers} hitSlop={12} style={[styles.thumb, {left: x}]} accessibilityLabel={i ? 'Maximum price' : 'Minimum price'} />)}
  </View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(36, 42, 54, 0.45)'},
  sheet: {backgroundColor: colors.cream, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingBottom: 24},
  grabber: {alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: colors.sandLine, marginTop: 10, marginBottom: 10},
  titleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  title: {fontSize: 20, color: colors.ink, fontWeight: '800'},
  clear: {fontSize: 13, color: colors.sky, fontWeight: '700'},
  label: {fontSize: 14, color: colors.ink, fontWeight: '700', marginTop: 12, marginBottom: 10},
  pills: {flexDirection: 'row', gap: 8},
  pill: {height: 40, minWidth: 64, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  pillActive: {backgroundColor: colors.sky, borderColor: colors.sky},
  pillText: {fontSize: 13, color: colors.ink, fontWeight: '600'},
  pillTextActive: {color: colors.white},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 40},
  box: {width: 24, height: 24, borderRadius: 4, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  boxOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  checkText: {fontSize: 14, color: colors.ink},
  priceRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'},
  priceValue: {fontSize: 13, color: colors.ink, fontWeight: '700', marginBottom: 10},
  slider: {height: THUMB + 8, justifyContent: 'center', marginBottom: 24},
  track: {position: 'absolute', left: THUMB / 2, right: THUMB / 2, height: 4, borderRadius: 2, backgroundColor: colors.sandLine},
  trackOn: {position: 'absolute', height: 4, backgroundColor: colors.blue100},
  thumb: {position: 'absolute', width: THUMB, height: THUMB, borderRadius: THUMB / 2, borderWidth: 2.5, borderColor: colors.blue700, backgroundColor: colors.white},
  footer: {flexDirection: 'row', gap: 12},
  reset: {flex: 0.8, height: 52, borderRadius: 10, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  resetText: {fontSize: 15, color: colors.ink, fontWeight: '700'},
  show: {flex: 1.4, height: 52, borderRadius: 10, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  showText: {fontSize: 15, color: colors.white, fontWeight: '700'},
});
