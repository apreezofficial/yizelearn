import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import type {Course} from '../../api/types';
import {CourseArt, CourseCard, Rating} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {BottomButton, TitleBar} from '../../components/Layout';
import {EmptyState} from '../../components/States';
import {formatNaira, sampleCourses} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';
import {cartTotals, isValidPromo, normalisePromo} from './cart';

type Props = {items: Course[]; savedForLater: Course[]; promo?: string; onPromo: (code?: string) => void; onRemove: (course: Course) => void; onCourse: (course: Course) => void; onCheckout: () => void; onBrowse: () => void; onBack?: () => void};

export function CartScreen({items, savedForLater, promo, onPromo, onRemove, onCourse, onCheckout, onBrowse, onBack}: Props) {
  const [code, setCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const totals = cartTotals(items, promo);
  const apply = () => { if (isValidPromo(code)) { onPromo(normalisePromo(code)); setCode(''); setPromoError(''); } else setPromoError(code.trim() ? 'That promo code is not valid.' : 'Enter a promo code.'); };
  return <View style={styles.screen}>
    <TitleBar title={items.length ? `Cart (${items.length})` : 'Cart'} onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {items.length === 0 ? <EmptyState title="Your cart is empty" message="Courses you choose to enrol in will show here." actionLabel="Browse courses" onAction={onBrowse} /> : <>
        {items.map(course => <CartItem key={course.id} course={course} onPress={() => onCourse(course)} onRemove={() => onRemove(course)} />)}
        {promo ? <View style={[styles.promo, styles.promoApplied]}><Text style={[styles.promoAppliedText, font]}>{promo} applied</Text><Pressable onPress={() => onPromo(undefined)} hitSlop={8}><Text style={[styles.promoRemove, font]}>Remove</Text></Pressable></View>
          : <View style={styles.promo}><TextInput value={code} onChangeText={text => { setCode(text); setPromoError(''); }} onSubmitEditing={apply} placeholder="Promo code" placeholderTextColor={colors.muted} autoCapitalize="characters" autoCorrect={false} style={[styles.promoInput, font]} /><Pressable onPress={apply} style={styles.apply}><Text style={[styles.applyText, font]}>Apply</Text></Pressable></View>}
        {!!promoError && <Text style={[styles.error, font]}>{promoError}</Text>}
        <View style={styles.summary}>
          <Line label="Subtotal" value={formatNaira(totals.subtotal)} />
          <Line label="Discount" value={`${totals.discount ? '-' : ''}${formatNaira(totals.discount)}`} />
          <Line label="Total" value={formatNaira(totals.total)} strong />
        </View>
      </>}
      {savedForLater.length > 0 && <><Text style={[styles.section, font]}>Saved for later</Text>{savedForLater.map(course => <CourseCard key={course.id} course={course} index={sampleCourses.indexOf(course)} onPress={() => onCourse(course)} />)}</>}
    </ScrollView>
    {items.length > 0 && <BottomButton label={`Checkout ${formatNaira(totals.total)}`} onPress={onCheckout} />}
  </View>;
}

function CartItem({course, onPress, onRemove}: {course: Course; onPress: () => void; onRemove: () => void}) {
  return <Pressable onPress={onPress} style={styles.item}>
    <CourseArt index={sampleCourses.indexOf(course)} />
    <View style={styles.itemCopy}><Text style={[styles.itemTitle, font]} numberOfLines={2}>{course.title}</Text><Text style={[styles.itemInstructor, font]}>{course.instructorName}</Text><View style={styles.itemFoot}><Rating value={course.rating} /><Text style={[styles.itemPrice, font]}>{formatNaira(course.price)}</Text></View></View>
    <Pressable onPress={onRemove} hitSlop={10} style={styles.remove} accessibilityLabel={`Remove ${course.title} from cart`}><Icon name="close" size={14} color={colors.muted} /></Pressable>
  </Pressable>;
}

function Line({label, value, strong}: {label: string; value: string; strong?: boolean}) {
  return <View style={styles.line}><Text style={[styles.lineLabel, font, strong && styles.strong]}>{label}</Text><Text style={[styles.lineValue, font, strong && styles.strong]}>{value}</Text></View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: 16, paddingBottom: 24, flexGrow: 1},
  item: {flexDirection: 'row', backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: 12, padding: 10, gap: 12, marginBottom: 12},
  itemCopy: {flex: 1, paddingRight: 14},
  itemTitle: {fontSize: 14, lineHeight: 18, color: colors.ink, fontWeight: '800'},
  itemInstructor: {fontSize: 11, color: colors.muted, marginTop: 3},
  itemFoot: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8},
  itemPrice: {fontSize: 14, color: colors.ink, fontWeight: '800', marginRight: -14},
  remove: {position: 'absolute', top: 8, right: 8},
  promo: {flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.sandLine, borderRadius: 10, backgroundColor: colors.white, paddingLeft: 12, paddingRight: 6, height: 54, marginTop: 4},
  promoInput: {flex: 1, fontSize: 14, color: colors.ink, paddingVertical: 0},
  apply: {height: 40, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1.5, borderColor: colors.sky, justifyContent: 'center'},
  applyText: {fontSize: 14, color: colors.blue700, fontWeight: '700'},
  promoApplied: {justifyContent: 'space-between', paddingRight: 14, backgroundColor: colors.blue50},
  promoAppliedText: {fontSize: 14, color: colors.ink, fontWeight: '700'},
  promoRemove: {fontSize: 13, color: colors.blue700, fontWeight: '700'},
  error: {fontSize: 12, color: colors.danger, marginTop: 6},
  summary: {backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: 12, padding: 14, marginTop: 16, gap: 12},
  line: {flexDirection: 'row', justifyContent: 'space-between'},
  lineLabel: {fontSize: 13, color: colors.ink},
  lineValue: {fontSize: 13, color: colors.ink},
  strong: {fontWeight: '800'},
  section: {fontSize: 16, color: colors.ink, fontWeight: '800', marginTop: 24, marginBottom: 12},
});
