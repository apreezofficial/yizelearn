import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import type {Course} from '../api/types';
import {formatNaira, formatNumber} from '../data/catalog';
import {colors, fonts} from '../theme/tokens';
import {Icon, type IconName} from './Icon';

const font = {fontFamily: fonts.family};

export function SearchField({value, onChangeText, onSubmit, placeholder = 'Search courses', style}: {value: string; onChangeText: (text: string) => void; onSubmit?: () => void; placeholder?: string; style?: object}) {
  return <View style={[styles.search, style]}><Icon name="search" size={18} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} placeholder={placeholder} placeholderTextColor={colors.muted} returnKeyType="search" style={[styles.searchInput, font]} /></View>;
}

export function CategoryChips({items, active, onSelect}: {items: readonly string[]; active: string; onSelect: (item: string) => void}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{items.map(item => <Pressable key={item} onPress={() => onSelect(item)} style={[styles.chip, active === item && styles.chipActive]}><Text style={[styles.chipText, font, active === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>;
}

export function Rating({value = 0, count}: {value?: number; count?: number}) {
  return <View style={styles.rating}><Text style={[styles.ratingValue, font]}>{value.toFixed(1)}</Text><Text style={styles.stars}>{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</Text>{count !== undefined && <Text style={[styles.ratingCount, font]}>({formatNumber(count)} ratings)</Text>}</View>;
}

// Abstract cover art in brand shapes, varied per course so cards don't look identical.
const artVariants = [
  {bg: colors.blue100, a: colors.marigold, b: colors.sky, c: colors.blue700},
  {bg: colors.white, a: colors.blue100, b: colors.marigold, c: colors.blue700},
  {bg: colors.blue100, a: colors.navy, b: colors.marigold, c: colors.sky},
  {bg: colors.sand, a: colors.sky, b: colors.marigold, c: colors.blue900},
];
export function CourseArt({index, size = 64}: {index: number; size?: number}) {
  const v = artVariants[index % artVariants.length]; const u = size / 64;
  return <View style={[styles.art, {width: size, height: size, backgroundColor: v.bg, borderRadius: 8 * u}]}><View style={{position: 'absolute', left: 8 * u, top: 12 * u, width: 18 * u, height: 22 * u, borderRadius: 4 * u, backgroundColor: v.a}} /><View style={{position: 'absolute', right: 6 * u, top: 10 * u, width: 32 * u, height: 32 * u, borderRadius: 16 * u, backgroundColor: v.b}} /><View style={{position: 'absolute', left: 14 * u, bottom: 12 * u, width: 16 * u, height: 12 * u, borderRadius: 6 * u, backgroundColor: v.c}} /></View>;
}

export function CourseCard({course, index, onPress}: {course: Course; index: number; onPress: () => void}) {
  return <Pressable onPress={onPress} style={({pressed}) => [styles.card, pressed && styles.pressed]}><CourseArt index={index} /><View style={styles.cardCopy}><Text style={[styles.cardTitle, font]} numberOfLines={2}>{course.title}</Text><Text style={[styles.cardInstructor, font]}>{course.instructorName}</Text><View style={styles.cardFoot}><Rating value={course.rating} /><Text style={[styles.price, font]}>{formatNaira(course.price)}</Text></View></View></Pressable>;
}

export function RoundButton({icon, onPress, size = 40, color = colors.ink, style}: {icon: IconName; onPress?: () => void; size?: number; color?: string; style?: object}) {
  return <Pressable onPress={onPress} hitSlop={6} style={[styles.round, {width: size, height: size, borderRadius: size / 2}, style]}><Icon name={icon} size={size * 0.5} color={color} /></Pressable>;
}

export function EnrolBar({price, onEnrol}: {price?: number; onEnrol: () => void}) {
  return <View style={styles.enrolBar}><Text style={[styles.enrolPrice, font]}>{formatNaira(price)}</Text><Pressable onPress={onEnrol} style={({pressed}) => [styles.enrolButton, pressed && styles.pressed]}><Text style={[styles.enrolText, font]}>Enrol now</Text></Pressable></View>;
}

export type TabItem<T extends string> = {key: T; label: string; icon: IconName};
export function TabBar<T extends string>({items, active, onSelect}: {items: TabItem<T>[]; active: T; onSelect: (key: T) => void}) {
  return <View style={styles.tabBar}>{items.map(item => { const on = item.key === active; return <Pressable key={item.key} onPress={() => onSelect(item.key)} style={styles.tab}><Icon name={item.icon} size={22} color={on ? colors.sky : colors.muted} /><Text style={[styles.tabLabel, font, on && styles.tabLabelActive]}>{item.label}</Text></Pressable>; })}</View>;
}

const styles = StyleSheet.create({
  search: {flex: 1, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.cream, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10},
  searchInput: {flex: 1, fontSize: 15, color: colors.ink, paddingVertical: 0},
  chips: {gap: 8, paddingVertical: 4},
  chip: {height: 38, paddingHorizontal: 16, borderRadius: 19, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.cream, justifyContent: 'center'},
  chipActive: {backgroundColor: colors.sky, borderColor: colors.sky},
  chipText: {fontSize: 13, color: colors.ink, fontWeight: '600'},
  chipTextActive: {color: colors.white},
  rating: {flexDirection: 'row', alignItems: 'center', gap: 6},
  ratingValue: {fontSize: 12, color: colors.ink, fontWeight: '700'},
  stars: {fontSize: 12, color: colors.marigold, letterSpacing: 1},
  ratingCount: {fontSize: 12, color: colors.muted},
  art: {overflow: 'hidden'},
  card: {flexDirection: 'row', backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: 12, padding: 10, gap: 12, marginBottom: 12},
  pressed: {opacity: 0.85},
  cardCopy: {flex: 1},
  cardTitle: {fontSize: 15, lineHeight: 19, color: colors.ink, fontWeight: '800'},
  cardInstructor: {fontSize: 12, color: colors.muted, marginTop: 3},
  cardFoot: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8},
  price: {fontSize: 15, color: colors.ink, fontWeight: '800'},
  round: {backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  enrolBar: {flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: '#F7F6FA', borderTopWidth: 1, borderTopColor: colors.line},
  enrolPrice: {fontSize: 22, color: colors.ink, fontWeight: '800', minWidth: 96},
  enrolButton: {flex: 1, height: 52, borderRadius: 10, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  enrolText: {fontSize: 16, color: colors.white, fontWeight: '700'},
  tabBar: {flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.cream, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, paddingBottom: 12},
  tab: {alignItems: 'center', minWidth: 60, gap: 4},
  tabLabel: {fontSize: 11, color: colors.muted},
  tabLabelActive: {color: colors.sky, fontWeight: '700'},
});
