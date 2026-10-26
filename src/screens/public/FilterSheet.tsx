import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, Modal, PanResponder, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Course, CourseLevel} from '../../api/types';
import {Icon} from '../../components/Icon';
import {formatNaira, formatNumber, levels} from '../../data/catalog';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, fonts, motion, radius, spacing, type} from '../../theme/tokens';
import {defaultFilters, filterCourses, PRICE_BOUNDS, searchCourses, type Browse, type CourseFilters} from './browse';

type Props = {visible: boolean; courses: Course[]; browse: Browse; onApply: (filters: CourseFilters) => void; onClose: () => void};
const ratings = [{label: 'Any', value: 0}, {label: '4.0+', value: 4}, {label: '4.5+', value: 4.5}];

export function FilterSheet({visible, courses, browse, onApply, onClose}: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(browse.filters);
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (visible) setDraft(browse.filters); }, [visible, browse.filters]);
  // The backdrop fades while the panel rises on its own, with the launch intro's ease.
  useEffect(() => { if (!visible) return; rise.setValue(0); Animated.timing(rise, {toValue: 1, duration: motion.base + 80, easing: Easing.bezier(...motion.outExpo), useNativeDriver: true}).start(); }, [visible, rise]);
  const searched = useMemo(() => searchCourses(courses, browse), [courses, browse]);
  const matches = filterCourses(searched, draft).length;
  const levelCount = (level: CourseLevel) => filterCourses(searched, {...draft, levels: [level]}).length;
  const toggleLevel = (level: CourseLevel) => setDraft(d => ({...d, levels: d.levels.includes(level) ? d.levels.filter(l => l !== level) : [...d.levels, level]}));
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
    <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
    <Animated.View style={[styles.sheet, {paddingBottom: 24 + insets.bottom, transform: [{translateY: rise.interpolate({inputRange: [0, 1], outputRange: [520, 0]})}]}]}>
      <View style={styles.grabber} />
      <View style={styles.titleRow}><Text style={[styles.title, font]}>Filters</Text><Pressable onPress={() => setDraft(defaultFilters)} hitSlop={8}><Text style={[styles.clear, font]}>Clear all</Text></Pressable></View>
      <Text style={[styles.label, font]}>Rating</Text>
      <View style={styles.pills}>{ratings.map(r => <Pressable key={r.label} onPress={() => setDraft(d => ({...d, rating: r.value}))} style={[styles.pill, draft.rating === r.value && styles.pillActive]}><Text style={[styles.pillText, font, draft.rating === r.value && styles.pillTextActive]}>{r.label}</Text></Pressable>)}</View>
      <Text style={[styles.label, font]}>Level</Text>
      {levels.map(level => { const on = draft.levels.includes(level); return <Pressable key={level} onPress={() => toggleLevel(level)} style={styles.checkRow} accessibilityRole="checkbox" accessibilityState={{checked: on}}><View style={[styles.box, on && styles.boxOn]}>{on && <Icon name="check" size={18} color={colors.white} />}</View><Text style={[styles.checkText, font]}>{level} ({formatNumber(levelCount(level))})</Text></Pressable>; })}
      <View style={styles.priceRow}><Text style={[styles.label, font]}>Price</Text><Text style={[styles.priceValue, font]}>{formatNaira(draft.price[0])} to {formatNaira(draft.price[1])}</Text></View>
      <RangeSlider min={PRICE_BOUNDS[0]} max={PRICE_BOUNDS[1]} step={1000} value={draft.price} onChange={price => setDraft(d => ({...d, price}))} />
      <View style={styles.footer}><Pressable onPress={() => setDraft(defaultFilters)} style={({pressed}) => [styles.reset, pressed && styles.pressed]}><Text style={[styles.resetText, font]}>Reset</Text></Pressable><Pressable onPress={() => onApply(draft)} style={({pressed}) => [styles.show, pressed && styles.pressed]}><Text style={[styles.showText, font]}>Show {formatNumber(matches)} {matches === 1 ? 'course' : 'courses'}</Text></Pressable></View>
    </Animated.View>
  </Modal>;
}

const THUMB = 30;
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
  backdrop: {flex: 1, backgroundColor: 'rgba(36, 42, 54, 0.5)'},
  sheet: {backgroundColor: colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: spacing.screen},
  grabber: {alignSelf: 'center', width: 48, height: 5, borderRadius: 3, backgroundColor: colors.sandLine, marginTop: 12, marginBottom: 14},
  titleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  title: {fontSize: type.title, color: colors.ink, fontWeight: '800'},
  clear: {fontSize: type.label, color: colors.blue700, fontWeight: '700'},
  label: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 18, marginBottom: 12},
  pills: {flexDirection: 'row', gap: 10},
  pill: {height: 46, minWidth: 76, paddingHorizontal: 20, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  pillActive: {backgroundColor: colors.sky, borderColor: colors.sky},
  pillText: {fontSize: type.label, color: colors.ink, fontWeight: '600'},
  pillTextActive: {color: colors.white},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 48},
  box: {width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  boxOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  checkText: {fontSize: type.body, color: colors.ink},
  priceRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'},
  priceValue: {fontSize: type.label, color: colors.ink, fontWeight: '700', marginBottom: 12},
  slider: {height: THUMB + 12, justifyContent: 'center', marginBottom: 28},
  track: {position: 'absolute', left: THUMB / 2, right: THUMB / 2, height: 6, borderRadius: 3, backgroundColor: colors.sandLine},
  trackOn: {position: 'absolute', height: 6, backgroundColor: colors.sky},
  thumb: {position: 'absolute', width: THUMB, height: THUMB, borderRadius: THUMB / 2, borderWidth: 3, borderColor: colors.blue700, backgroundColor: colors.white},
  footer: {flexDirection: 'row', gap: 12},
  pressed: {opacity: 0.8},
  reset: {flex: 0.8, height: spacing.button, borderRadius: radius.button, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  resetText: {fontSize: type.body, color: colors.ink, fontWeight: '700'},
  show: {flex: 1.4, height: spacing.button, borderRadius: radius.button, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  showText: {fontSize: type.body, color: colors.white, fontWeight: '700'},
});
