import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import type {Course} from '../api/types';
import {formatNaira, formatNumber} from '../data/catalog';
import {colors, fonts, radius, spacing, type} from '../theme/tokens';
import {Icon, type IconName} from './Icon';

const font = {fontFamily: fonts.family};

export function SearchField({value, onChangeText, onSubmit, placeholder = 'Search courses', style}: {value: string; onChangeText: (text: string) => void; onSubmit?: () => void; placeholder?: string; style?: object}) {
  return <View style={[styles.search, style]}><Icon name="search" size={22} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} placeholder={placeholder} placeholderTextColor={colors.muted} returnKeyType="search" style={[styles.searchInput, font]} /></View>;
}

export function CategoryChips({items, active, onSelect}: {items: readonly string[]; active: string; onSelect: (item: string) => void}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{items.map(item => <Pressable key={item} onPress={() => onSelect(item)} style={({pressed}) => [styles.chip, active === item && styles.chipActive, pressed && styles.pressed]}><Text style={[styles.chipText, font, active === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>;
}

export function Stars({value = 0, size = 15}: {value?: number; size?: number}) {
  const full = Math.round(value);
  return <View style={styles.stars}>{[0, 1, 2, 3, 4].map(i => <Icon key={i} name={i < full ? 'starFilled' : 'star'} size={size} color={colors.star} />)}</View>;
}

export function Rating({value = 0, count, size = 15}: {value?: number; count?: number; size?: number}) {
  return <View style={styles.rating}><Text style={[styles.ratingValue, font, {fontSize: size}]}>{value.toFixed(1)}</Text><Stars value={value} size={size} />{count !== undefined && <Text style={[styles.ratingCount, font]}>({formatNumber(count)} ratings)</Text>}</View>;
}

// Abstract cover art in brand shapes, varied per course so cards don't look identical.
const artVariants = [
  {bg: colors.blue100, a: colors.marigold, b: colors.sky, c: colors.blue700},
  {bg: colors.white, a: colors.blue100, b: colors.marigold, c: colors.blue700},
  {bg: colors.blue100, a: colors.navy, b: colors.marigold, c: colors.sky},
  {bg: colors.sand, a: colors.sky, b: colors.marigold, c: colors.blue900},
];
export function CourseArt({index, size = 88}: {index: number; size?: number}) {
  const v = artVariants[index % artVariants.length]; const u = size / 64;
  return <View style={[styles.art, {width: size, height: size, backgroundColor: v.bg, borderRadius: 10 * u}]}><View style={{position: 'absolute', left: 8 * u, top: 12 * u, width: 18 * u, height: 22 * u, borderRadius: 4 * u, backgroundColor: v.a}} /><View style={{position: 'absolute', right: 6 * u, top: 10 * u, width: 32 * u, height: 32 * u, borderRadius: 16 * u, backgroundColor: v.b}} /><View style={{position: 'absolute', left: 14 * u, bottom: 12 * u, width: 16 * u, height: 12 * u, borderRadius: 6 * u, backgroundColor: v.c}} /></View>;
}

export function CourseCard({course, index, onPress}: {course: Course; index: number; onPress: () => void}) {
  return <Pressable onPress={onPress} style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
    <CourseArt index={index} />
    <View style={styles.cardCopy}>
      <Text style={[styles.cardTitle, font]} numberOfLines={2}>{course.title}</Text>
      <Text style={[styles.cardInstructor, font]} numberOfLines={1}>{course.instructorName}</Text>
      <View style={styles.cardFoot}><Rating value={course.rating} size={13} /><Text style={[styles.price, font]}>{formatNaira(course.price)}</Text></View>
    </View>
  </Pressable>;
}

export function RoundButton({icon, onPress, size = 44, color = colors.ink, style, label}: {icon: IconName; onPress?: () => void; size?: number; color?: string; style?: object; label?: string}) {
  return <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel={label} style={({pressed}) => [styles.round, {width: size, height: size, borderRadius: size / 2}, style, pressed && styles.pressed]}><Icon name={icon} size={size * 0.52} color={color} /></Pressable>;
}

export function EnrolBar({price, onEnrol}: {price?: number; onEnrol: () => void}) {
  return <View style={styles.enrolBar}><View><Text style={[styles.enrolLabel, font]}>Price</Text><Text style={[styles.enrolPrice, font]}>{formatNaira(price)}</Text></View><Pressable onPress={onEnrol} style={({pressed}) => [styles.enrolButton, pressed && styles.pressed]}><Text style={[styles.enrolText, font]}>Enrol now</Text></Pressable></View>;
}

export type TabItem<T extends string> = {key: T; label: string; icon: IconName};
export function TabBar<T extends string>({items, active, onSelect}: {items: TabItem<T>[]; active: T; onSelect: (key: T) => void}) {
  return <View style={styles.tabBar}>{items.map(item => { const on = item.key === active; return <Pressable key={item.key} onPress={() => onSelect(item.key)} style={styles.tab} accessibilityRole="tab" accessibilityState={{selected: on}}><View style={[styles.tabIcon, on && styles.tabIconOn]}><Icon name={item.icon} size={24} color={on ? colors.sky : colors.muted} strokeWidth={1.5} /></View><Text style={[styles.tabLabel, font, on && styles.tabLabelActive]}>{item.label}</Text></Pressable>; })}</View>;
}

const styles = StyleSheet.create({
  search: {flexGrow: 1, flexShrink: 1, height: 56, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 12},
  searchInput: {flex: 1, fontSize: type.body, color: colors.ink, paddingVertical: 0},
  chips: {gap: 10, paddingVertical: 4, paddingHorizontal: spacing.screen},
  chip: {height: 44, paddingHorizontal: 20, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, justifyContent: 'center'},
  chipActive: {backgroundColor: colors.sky, borderColor: colors.sky},
  chipText: {fontSize: type.label, color: colors.ink, fontWeight: '600'},
  chipTextActive: {color: colors.onSky},
  stars: {flexDirection: 'row', gap: 1},
  rating: {flexDirection: 'row', alignItems: 'center', gap: 6},
  ratingValue: {color: colors.ink, fontWeight: '700'},
  ratingCount: {fontSize: type.caption, color: colors.muted},
  art: {overflow: 'hidden'},
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 12, gap: spacing.gap, marginBottom: spacing.gap},
  cardPressed: {transform: [{scale: 0.985}], opacity: 0.92},
  pressed: {opacity: 0.8},
  cardCopy: {flex: 1},
  cardTitle: {fontSize: type.subheading - 1, lineHeight: 22, color: colors.ink, fontWeight: '800'},
  cardInstructor: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  cardFoot: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10},
  price: {fontSize: type.subheading - 1, color: colors.ink, fontWeight: '800'},
  round: {backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  enrolBar: {flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: spacing.screen, paddingVertical: 14, backgroundColor: colors.barBg, borderTopWidth: 1, borderTopColor: colors.line},
  enrolLabel: {fontSize: type.caption, color: colors.muted},
  enrolPrice: {fontSize: type.title, color: colors.ink, fontWeight: '800'},
  enrolButton: {flex: 1, height: spacing.button, borderRadius: radius.button, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  enrolText: {fontSize: type.subheading, color: colors.onSky, fontWeight: '700'},
  tabBar: {flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.sand, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, paddingBottom: 8},
  tab: {alignItems: 'center', minWidth: 64, gap: 4},
  tabIcon: {width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  tabIconOn: {},
  tabLabel: {fontSize: type.tab, color: colors.muted},
  tabLabelActive: {color: colors.sky, fontWeight: '700'},
});
