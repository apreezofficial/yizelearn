import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import type {Course} from '../../api/types';
import {CourseArt, CourseCard, Rating} from '../../components/Catalog';
import {Icon} from '../../components/Icon';
import {BottomButton, TitleBar} from '../../components/Layout';
import {EmptyState} from '../../components/States';
import {formatNaira, sampleCourses} from '../../data/catalog';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';
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
      {items.length === 0 ? <EmptyState icon="cart" title="Your cart is empty" message="Courses you add will wait here until you check out." actionLabel="Browse courses" onAction={onBrowse} /> : <>
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
    <Pressable onPress={onRemove} hitSlop={10} style={styles.remove} accessibilityLabel={`Remove ${course.title} from cart`}><Icon name="close" size={18} color={colors.muted} /></Pressable>
  </Pressable>;
}

function Line({label, value, strong}: {label: string; value: string; strong?: boolean}) {
  return <View style={styles.line}><Text style={[styles.lineLabel, font, strong && styles.strong]}>{label}</Text><Text style={[styles.lineValue, font, strong && styles.strong]}>{value}</Text></View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 28, flexGrow: 1},
  item: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 12, gap: spacing.gap, marginBottom: spacing.gap},
  itemCopy: {flex: 1, paddingRight: 22},
  itemTitle: {fontSize: type.subheading - 1, lineHeight: 22, color: colors.ink, fontWeight: '800'},
  itemInstructor: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  itemFoot: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10},
  itemPrice: {fontSize: type.subheading - 1, color: colors.ink, fontWeight: '800', marginRight: -22},
  remove: {position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  promo: {flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.field, backgroundColor: colors.white, paddingLeft: 16, paddingRight: 8, height: 62, marginTop: 6},
  promoInput: {flex: 1, fontSize: type.body, color: colors.ink, paddingVertical: 0},
  apply: {height: 46, paddingHorizontal: 22, borderRadius: radius.button - 2, borderWidth: 1.5, borderColor: colors.sky, justifyContent: 'center'},
  applyText: {fontSize: type.label, color: colors.blue700, fontWeight: '700'},
  promoApplied: {justifyContent: 'space-between', paddingRight: 16, backgroundColor: colors.blue50},
  promoAppliedText: {fontSize: type.body, color: colors.ink, fontWeight: '700'},
  promoRemove: {fontSize: type.label, color: colors.blue700, fontWeight: '700'},
  error: {fontSize: type.caption, color: colors.danger, marginTop: 8},
  summary: {backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 18, marginTop: 18, gap: 14},
  line: {flexDirection: 'row', justifyContent: 'space-between'},
  lineLabel: {fontSize: type.body, color: colors.ink},
  lineValue: {fontSize: type.body, color: colors.ink},
  strong: {fontWeight: '800', fontSize: type.subheading},
  section: {fontSize: type.heading, color: colors.ink, fontWeight: '800', marginTop: 30, marginBottom: 14},
});
