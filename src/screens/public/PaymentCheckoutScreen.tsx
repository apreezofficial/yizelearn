import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {BottomButton, PrimaryAction, TitleBar} from '../../components/Layout';
import {Sheet} from '../../components/Sheet';
import {haptic} from '../../theme/system';
import {formatNaira} from '../../data/catalog';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';
import {cardErrors, digits, formatCardNumber, formatExpiry, type PaymentMethod} from './cart';

// onPay returns false when the payment did not go through.
type Props = {courseCount: number; total: number; onBack: () => void; onPay: (method: PaymentMethod, cardNumber: string) => boolean; onSupport: () => void};

export function PaymentCheckoutScreen({courseCount, total, onBack, onPay, onSupport}: Props) {
  const [failed, setFailed] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [card, setCard] = useState({number: '', expiry: '', cvv: ''});
  const [saveCard, setSaveCard] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const errors = method === 'card' ? cardErrors(card) : {};
  const pay = () => {
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    if (!onPay(method, card.number)) { haptic.warning(); setFailed(true); }
  };
  const shown = submitted ? errors : {};
  return <View style={styles.screen}>
    <TitleBar title="Checkout" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[styles.heading, font]}>Payment method</Text>
      <MethodOption label="Card" selected={method === 'card'} onPress={() => setMethod('card')} />
      <MethodOption label="Bank transfer" selected={method === 'transfer'} onPress={() => setMethod('transfer')} />
      {method === 'card' ? <View style={styles.form}>
        <Field label="Card number" error={shown.number}><TextInput value={card.number} onChangeText={v => setCard(c => ({...c, number: formatCardNumber(v)}))} placeholder="0000 0000 0000 0000" placeholderTextColor={colors.muted} keyboardType="number-pad" autoComplete="cc-number" textContentType="creditCardNumber" style={[styles.input, font, shown.number && styles.inputError]} /></Field>
        <View style={styles.row}>
          <Field label="Expiry" error={shown.expiry} half><TextInput value={card.expiry} onChangeText={v => setCard(c => ({...c, expiry: formatExpiry(v)}))} placeholder="MM / YY" placeholderTextColor={colors.muted} keyboardType="number-pad" autoComplete="cc-exp" style={[styles.input, font, shown.expiry && styles.inputError]} /></Field>
          <Field label="CVV" error={shown.cvv} half><TextInput value={card.cvv} onChangeText={v => setCard(c => ({...c, cvv: digits(v).slice(0, 4)}))} placeholder="123" placeholderTextColor={colors.muted} keyboardType="number-pad" secureTextEntry autoComplete="cc-csc" style={[styles.input, font, shown.cvv && styles.inputError]} /></Field>
        </View>
        <Pressable onPress={() => setSaveCard(v => !v)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{checked: saveCard}}><View style={[styles.box, saveCard && styles.boxOn]}>{saveCard && <Icon name="check" size={18} color={colors.onSky} />}</View><Text style={[styles.checkText, font]}>Save card for next time</Text></Pressable>
      </View> : <View style={styles.transfer}><Icon name="bank" size={22} color={colors.blue700} /><Text style={[styles.transferText, font]}>After you tap Pay, you'll get the account details to transfer {formatNaira(total)} to. Your courses unlock once the transfer is confirmed.</Text></View>}
      <View style={styles.summary}><Text style={[styles.summaryTitle, font]}>Order summary</Text><View style={styles.summaryRow}><Text style={[styles.muted, font]}>{courseCount} {courseCount === 1 ? 'course' : 'courses'}</Text><Text style={[styles.summaryTotal, font]}>{formatNaira(total)}</Text></View></View>
    </ScrollView>
    <BottomButton label={`Pay ${formatNaira(total)}`} onPress={pay} />
    <Sheet visible={failed} onClose={() => setFailed(false)}>
      <View style={styles.failed}>
        <View style={styles.failedIcon}><Icon name="card" size={26} color={colors.danger} /></View>
        <Text style={[styles.failedTitle, font]} accessibilityRole="header">Payment did not go through</Text>
        <Text style={[styles.failedText, font]}>Your bank declined the card. No money was taken.</Text>
        <View style={styles.failedActions}>
          <PrimaryAction label="Try again" onPress={() => { setFailed(false); setTimeout(pay, 300); }} />
          <PrimaryAction label="Use another method" outline onPress={() => { setFailed(false); setMethod(method === 'card' ? 'transfer' : 'card'); }} />
        </View>
        <Pressable onPress={() => { setFailed(false); onSupport(); }} hitSlop={10} style={styles.support} accessibilityRole="button"><Text style={[styles.supportText, font]}>Contact support</Text></Pressable>
      </View>
    </Sheet>
  </View>;
}

function MethodOption({label, selected, onPress}: {label: string; selected: boolean; onPress: () => void}) {
  return <Pressable onPress={onPress} style={[styles.method, selected && styles.methodOn]} accessibilityRole="radio" accessibilityState={{selected}}><View style={[styles.radio, selected && styles.radioOn]}>{selected && <View style={styles.radioDot} />}</View><Text style={[styles.methodText, font]}>{label}</Text><Icon name={label === 'Card' ? 'card' : 'bank'} size={22} color={selected ? colors.blue700 : colors.muted} /></Pressable>;
}

function Field({label, error, half, children}: {label: string; error?: string; half?: boolean; children: React.ReactNode}) {
  return <View style={[styles.field, half && styles.half]}><Text style={[styles.label, font]}>{label}</Text>{children}{!!error && <Text style={[styles.error, font]}>{error}</Text>}</View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 28},
  heading: {fontSize: type.heading, color: colors.ink, fontWeight: '800', marginBottom: 14},
  method: {flexDirection: 'row', alignItems: 'center', gap: 14, height: 64, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 18, marginBottom: 12},
  methodOn: {backgroundColor: colors.blue50, borderColor: colors.sky, borderWidth: 1.5},
  radio: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  radioOn: {borderColor: colors.blue700},
  radioDot: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.blue700},
  methodText: {flex: 1, fontSize: type.body, color: colors.ink, fontWeight: '700'},
  form: {marginTop: 16},
  field: {marginBottom: 16},
  half: {flex: 1},
  row: {flexDirection: 'row', gap: 12},
  label: {fontSize: type.small, color: colors.ink, fontWeight: '700', marginBottom: 8},
  input: {height: 56, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: type.body, color: colors.ink},
  inputError: {borderColor: colors.danger},
  error: {fontSize: type.caption, color: colors.danger, marginTop: 6},
  check: {flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48},
  box: {width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  boxOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  checkText: {fontSize: type.label, color: colors.ink},
  transfer: {flexDirection: 'row', gap: 12, backgroundColor: colors.blue50, borderRadius: radius.field, padding: 16, marginTop: 6},
  transferText: {flex: 1, fontSize: type.label, lineHeight: 22, color: colors.ink},
  summary: {backgroundColor: colors.sand, borderRadius: radius.card, padding: 18, marginTop: 22},
  summaryTitle: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginBottom: 10},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  muted: {fontSize: type.label, color: colors.muted},
  failed: {alignItems: 'center', paddingTop: 14, paddingBottom: 6},
  failedIcon: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16},
  failedTitle: {fontSize: type.heading, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  failedText: {fontSize: type.small, color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20},
  failedActions: {alignSelf: 'stretch', gap: 12, marginTop: 22},
  support: {padding: 12, marginTop: 6},
  supportText: {fontSize: type.small, color: colors.blue700, fontWeight: '700'},
  summaryTotal: {fontSize: type.heading, color: colors.ink, fontWeight: '800'},
});
