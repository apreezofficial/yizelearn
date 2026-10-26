import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {PrimaryAction} from '../../components/Layout';
import {formatNaira} from '../../data/catalog';
import {colors, fonts} from '../../theme/tokens';
import type {Order} from './cart';

export function PaymentReceivedScreen({order, onStartLearning}: {order: Order; onStartLearning: () => void}) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.ring}><View style={styles.badge}><Icon name="check" size={30} color={colors.white} /></View></View>
    <Text style={[styles.title, font]}>Payment received</Text>
    <Text style={[styles.subtitle, font]}>A receipt was sent to your email</Text>
    <View style={styles.card}>
      <Row label="Order" value={`#${order.id}`} />
      <Row label="Date" value={order.date} />
      <Row label="Method" value={order.method} />
      <Row label="Total" value={formatNaira(order.total)} />
    </View>
    <PrimaryAction label="Start learning" onPress={onStartLearning} />
    {/* A real PDF needs the payments API; until then the button explains why it can't download yet. */}
    <PrimaryAction label="Download receipt" outline onPress={() => Alert.alert('Receipt', 'Receipt downloads will work once payments are connected. A copy was sent to your email.')} />
  </ScrollView>;
}

function Row({label, value}: {label: string; value: string}) {
  return <View style={styles.row}><Text style={[styles.label, font]}>{label}</Text><Text style={[styles.value, font]}>{value}</Text></View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {flexGrow: 1, justifyContent: 'center', padding: 16},
  ring: {alignSelf: 'center', width: 96, height: 96, borderRadius: 48, backgroundColor: '#D7EEE3', alignItems: 'center', justifyContent: 'center', marginBottom: 20},
  badge: {width: 72, height: 72, borderRadius: 36, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 24, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  subtitle: {fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: 24},
  card: {backgroundColor: '#F7F6FA', borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 14, gap: 14, marginBottom: 12},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  label: {fontSize: 12, color: colors.muted},
  value: {fontSize: 12, color: colors.ink, fontWeight: '800'},
});
