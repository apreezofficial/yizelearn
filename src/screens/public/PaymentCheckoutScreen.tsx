import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {BottomButton, TitleBar} from '../../components/Layout';
import {formatNaira} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';
import {cardErrors, digits, formatCardNumber, formatExpiry, type PaymentMethod} from './cart';

type Props = {courseCount: number; total: number; onBack: () => void; onPay: (method: PaymentMethod, cardNumber: string) => void};

export function PaymentCheckoutScreen({courseCount, total, onBack, onPay}: Props) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [card, setCard] = useState({number: '', expiry: '', cvv: ''});
  const [saveCard, setSaveCard] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const errors = method === 'card' ? cardErrors(card) : {};
  const pay = () => { setSubmitted(true); if (!Object.keys(errors).length) onPay(method, card.number); };
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
        <Pressable onPress={() => setSaveCard(v => !v)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{checked: saveCard}}><View style={[styles.box, saveCard && styles.boxOn]}>{saveCard && <Icon name="check" size={14} color={colors.white} />}</View><Text style={[styles.checkText, font]}>Save card for next time</Text></Pressable>
      </View> : <View style={styles.transfer}><Text style={[styles.transferText, font]}>After you tap Pay, you'll get the account details to transfer {formatNaira(total)} to. Your courses unlock once the transfer is confirmed.</Text></View>}
      <View style={styles.summary}><Text style={[styles.summaryTitle, font]}>Order summary</Text><View style={styles.summaryRow}><Text style={[styles.muted, font]}>{courseCount} {courseCount === 1 ? 'course' : 'courses'}</Text><Text style={[styles.summaryTotal, font]}>{formatNaira(total)}</Text></View></View>
    </ScrollView>
    <BottomButton label={`Pay ${formatNaira(total)}`} onPress={pay} />
  </View>;
}

function MethodOption({label, selected, onPress}: {label: string; selected: boolean; onPress: () => void}) {
  return <Pressable onPress={onPress} style={[styles.method, selected && styles.methodOn]} accessibilityRole="radio" accessibilityState={{selected}}><View style={[styles.radio, selected && styles.radioOn]}>{selected && <View style={styles.radioDot} />}</View><Text style={[styles.methodText, font]}>{label}</Text></Pressable>;
}

function Field({label, error, half, children}: {label: string; error?: string; half?: boolean; children: React.ReactNode}) {
  return <View style={[styles.field, half && styles.half]}><Text style={[styles.label, font]}>{label}</Text>{children}{!!error && <Text style={[styles.error, font]}>{error}</Text>}</View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: 16, paddingBottom: 24},
  heading: {fontSize: 15, color: colors.ink, fontWeight: '800', marginBottom: 12},
  method: {flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, borderRadius: 10, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 14, marginBottom: 12},
  methodOn: {backgroundColor: colors.blue50, borderColor: colors.sky, borderWidth: 1.5},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  radioOn: {borderColor: colors.blue700},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue700},
  methodText: {fontSize: 14, color: colors.ink, fontWeight: '700'},
  form: {marginTop: 12},
  field: {marginBottom: 14},
  half: {flex: 1},
  row: {flexDirection: 'row', gap: 12},
  label: {fontSize: 12, color: colors.ink, fontWeight: '600', marginBottom: 6},
  input: {height: 50, borderRadius: 10, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 12, fontSize: 15, color: colors.ink},
  inputError: {borderColor: colors.danger},
  error: {fontSize: 11, color: colors.danger, marginTop: 4},
  check: {flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40},
  box: {width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  boxOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  checkText: {fontSize: 13, color: colors.ink},
  transfer: {backgroundColor: colors.blue50, borderRadius: 10, padding: 14, marginTop: 4},
  transferText: {fontSize: 13, lineHeight: 19, color: colors.ink},
  summary: {backgroundColor: colors.sand, borderRadius: 12, padding: 14, marginTop: 20},
  summaryTitle: {fontSize: 13, color: colors.ink, fontWeight: '800', marginBottom: 8},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  muted: {fontSize: 12, color: colors.muted},
  summaryTotal: {fontSize: 14, color: colors.ink, fontWeight: '800'},
});
