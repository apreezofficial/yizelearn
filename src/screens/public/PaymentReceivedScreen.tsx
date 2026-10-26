import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {PrimaryAction} from '../../components/Layout';
import {formatNaira} from '../../data/catalog';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';
import type {Order} from './cart';

export function PaymentReceivedScreen({order, onStartLearning}: {order: Order; onStartLearning: () => void}) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.ring}><View style={styles.badge}><Icon name="check" size={40} color={colors.white} /></View></View>
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
  content: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.screen, paddingVertical: 24},
  ring: {alignSelf: 'center', width: 120, height: 120, borderRadius: 60, backgroundColor: '#D7EEE3', alignItems: 'center', justifyContent: 'center', marginBottom: 24},
  badge: {width: 88, height: 88, borderRadius: 44, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: type.title + 2, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  subtitle: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 28},
  card: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, padding: 18, gap: 16, marginBottom: 14},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  label: {fontSize: type.label, color: colors.muted},
  value: {fontSize: type.label, color: colors.ink, fontWeight: '800'},
});
