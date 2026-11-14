import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ColorValue} from 'react-native';
import type {Course} from '../api/types';
import {formatNaira, formatNumber} from '../data/catalog';
import {colors, fonts, radius, spacing, type} from '../theme/tokens';
import {LiquidGlassView} from '@callstack/liquid-glass';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {haptic, useGlass} from '../theme/system';
import {Icon, type IconName} from './Icon';

const font = {fontFamily: fonts.family};

export function SearchField({value, onChangeText, onSubmit, placeholder = 'Search courses', style}: {value: string; onChangeText: (text: string) => void; onSubmit?: () => void; placeholder?: string; style?: object}) {
  return <View style={[styles.search, style]}><Icon name="search" size={22} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} placeholder={placeholder} placeholderTextColor={colors.muted} returnKeyType="search" style={[font, styles.searchInput]} /></View>;
}

export function CategoryChips({items, active, onSelect}: {items: readonly string[]; active: string; onSelect: (item: string) => void}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{items.map(item => <Pressable key={item} onPress={() => onSelect(item)} style={({pressed}) => [styles.chip, active === item && styles.chipActive, pressed && styles.pressed]}><Text style={[font, styles.chipText, active === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>;
}

export function Stars({value = 0, size = 15}: {value?: number; size?: number}) {
  const full = Math.round(value);
  return <View style={styles.stars}>{[0, 1, 2, 3, 4].map(i => <Icon key={i} name={i < full ? 'starFilled' : 'star'} size={size} color={colors.star} />)}</View>;
}

export function Rating({value = 0, count, size = 15}: {value?: number; count?: number; size?: number}) {
  return <View style={styles.rating}><Text style={[font, styles.ratingValue, {fontSize: size}]}>{value.toFixed(1)}</Text><Stars value={value} size={size} />{count !== undefined && <Text style={[font, styles.ratingCount]}>({formatNumber(count)} ratings)</Text>}</View>;
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
      <Text style={[font, styles.cardTitle]} numberOfLines={2}>{course.title}</Text>
      <Text style={[font, styles.cardInstructor]} numberOfLines={1}>{course.instructorName}</Text>
      <View style={styles.cardFoot}><Rating value={course.rating} size={13} /><Text style={[font, styles.price]}>{formatNaira(course.price)}</Text></View>
    </View>
  </Pressable>;
}

export function RoundButton({icon, onPress, size = 44, color = colors.ink, style, label}: {icon: IconName; onPress?: () => void; size?: number; color?: ColorValue; style?: object; label?: string}) {
  return <Pressable onPress={onPress} onPressIn={onPress ? haptic.tap : undefined} hitSlop={8} accessibilityRole="button" accessibilityLabel={label} style={({pressed}) => [styles.round, {width: size, height: size, borderRadius: size / 2}, style, pressed && styles.pressed]}><Icon name={icon} size={size * 0.52} color={color} /></Pressable>;
}

export function EnrolBar({price, onEnrol}: {price?: number; onEnrol: () => void}) {
  return <View style={styles.enrolBar}><View><Text style={[font, styles.enrolLabel]}>Price</Text><Text style={[font, styles.enrolPrice]}>{formatNaira(price)}</Text></View><Pressable onPress={onEnrol} style={({pressed}) => [styles.enrolButton, pressed && styles.pressed]}><Text style={[font, styles.enrolText]}>Enrol now</Text></Pressable></View>;
}

export type TabItem<T extends string> = {key: T; label: string; icon: IconName};
export function TabBar<T extends string>({items, active, onSelect}: {items: TabItem<T>[]; active: T; onSelect: (key: T) => void}) {
  const glass = useGlass();
  const {bottom} = useSafeAreaInsets();
  const select = (key: T) => { if (key !== active) haptic.select(); onSelect(key); };
  const tabs = items.map(item => { const on = item.key === active; return <Pressable key={item.key} onPress={() => select(item.key)} style={glass ? styles.glassTab : styles.tab} accessibilityRole="tab" accessibilityState={{selected: on}} accessibilityLabel={item.label}>
    {glass && on && <View style={styles.glassActive} />}
    <View style={[styles.tabIcon, glass && styles.glassIcon]}><Icon name={item.icon} size={glass ? 23 : 24} color={on ? (glass ? colors.blue700 : colors.sky) : glass ? colors.ink : colors.muted} strokeWidth={on ? 1.9 : 1.5} /></View>
    <Text style={[font, styles.tabLabel, glass && styles.glassLabel, on && (glass ? styles.glassLabelActive : styles.tabLabelActive)]} numberOfLines={1} maxFontSizeMultiplier={1.3}>{item.label}</Text>
  </Pressable>; });
  // iOS 26: a floating Liquid Glass capsule that the page scrolls underneath. Elsewhere, the solid sand bar.
  if (glass) return <View style={[styles.glassWrap, {bottom: Math.max(bottom - 6, 10)}]} pointerEvents="box-none">
    <LiquidGlassView interactive effect="regular" style={styles.glassBar}>{tabs}</LiquidGlassView>
  </View>;
  return <View style={styles.tabBar}>{tabs}</View>;
}

/** Room at the end of a tab page so its last row can scroll clear of the floating glass bar. */
export const GLASS_BAR_SPACE = 96;
export function TabBarSpacer() {
  const {bottom} = useSafeAreaInsets();
  return useGlass() ? <View style={{height: GLASS_BAR_SPACE + bottom}} /> : null;
}

const styles = StyleSheet.create({
  search: {flexGrow: 1, flexShrink: 1, height: 56, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 12},
  searchInput: {flex: 1, fontSize: type.body, color: colors.ink, paddingVertical: 0},
  chips: {gap: 10, paddingVertical: 4, paddingHorizontal: spacing.screen},
  chip: {height: 44, paddingHorizontal: 20, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, justifyContent: 'center'},
  chipActive: {backgroundColor: colors.sky, borderColor: colors.sky},
  chipText: {fontSize: type.label, color: colors.ink, fontFamily: fonts.semibold},
  chipTextActive: {color: colors.onSky},
  stars: {flexDirection: 'row', gap: 1},
  rating: {flexDirection: 'row', alignItems: 'center', gap: 6},
  ratingValue: {color: colors.ink, fontFamily: fonts.bold},
  ratingCount: {fontSize: type.caption, color: colors.muted},
  art: {overflow: 'hidden'},
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 12, gap: spacing.gap, marginBottom: spacing.gap},
  cardPressed: {transform: [{scale: 0.985}], opacity: 0.92},
  pressed: {opacity: 0.8},
  cardCopy: {flex: 1},
  cardTitle: {fontSize: type.subheading - 1, lineHeight: 22, color: colors.ink, fontFamily: fonts.bold},
  cardInstructor: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  cardFoot: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10},
  price: {fontSize: type.subheading - 1, color: colors.ink, fontFamily: fonts.bold},
  round: {backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  enrolBar: {flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: spacing.screen, paddingVertical: 14, backgroundColor: colors.barBg, borderTopWidth: 1, borderTopColor: colors.line},
  enrolLabel: {fontSize: type.caption, color: colors.muted},
  enrolPrice: {fontSize: type.title, color: colors.ink, fontFamily: fonts.bold},
  enrolButton: {flex: 1, height: spacing.button, borderRadius: radius.button, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  enrolText: {fontSize: type.subheading, color: colors.onSky, fontFamily: fonts.bold},
  tabBar: {flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.sand, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, paddingBottom: 8},
  tab: {alignItems: 'center', minWidth: 64, gap: 4},
  tabIcon: {width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  tabIconOn: {},
  tabLabel: {fontSize: type.tab, color: colors.muted},
  tabLabelActive: {color: colors.sky, fontFamily: fonts.bold},
  glassWrap: {position: 'absolute', left: 14, right: 14},
  glassBar: {flexDirection: 'row', height: 66, borderRadius: 33, paddingHorizontal: 6, alignItems: 'center'},
  glassTab: {flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', gap: 2},
  glassActive: {position: 'absolute', top: 0, bottom: 0, left: 2, right: 2, borderRadius: 28, backgroundColor: colors.blue100, opacity: 0.85},
  glassIcon: {width: 40, height: 28},
  glassLabel: {fontSize: 11, color: colors.ink, fontFamily: fonts.semibold},
  glassLabelActive: {color: colors.blue700, fontFamily: fonts.bold},
});
