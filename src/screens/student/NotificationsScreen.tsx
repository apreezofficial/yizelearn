import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {TitleBar} from '../../components/Layout';
import {Rise} from '../../components/Motion';
import {notices, type NotificationKind} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
type Filter = 'All' | 'Learning' | 'Messages';
const filters: Filter[] = ['All', 'Learning', 'Messages'];
const kindIcon: Record<NotificationKind, IconName> = {learning: 'book', messages: 'message', other: 'bell'};
const kindOf: Record<Filter, NotificationKind | undefined> = {All: undefined, Learning: 'learning', Messages: 'messages'};

export function NotificationsScreen({onBack}: {onBack: () => void}) {
  const [filter, setFilter] = useState<Filter>('All');
  const shown = notices.filter(n => !kindOf[filter] || n.kind === kindOf[filter]);
  return <View style={styles.screen}>
    <TitleBar title="Notifications" onBack={onBack} />
    <Rise style={styles.filters}>
      {filters.map(f => <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipOn]} accessibilityRole="tab" accessibilityState={{selected: filter === f}}>
        <Text style={[styles.chipText, font, filter === f && styles.chipTextOn]}>{f}</Text>
      </Pressable>)}
    </Rise>
    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
      {shown.length === 0 && <Text style={[styles.empty, font]}>You are all caught up.</Text>}
      {shown.map((n, i) => <Rise key={`${filter}-${n.id}`} delay={80 + i * 70} style={[styles.row, n.unread && styles.unread]} ><View accessible accessibilityLabel={`${n.title}${n.unread ? ', unread' : ''}`} style={styles.rowInner}>
        <View style={styles.icon}><Icon name={kindIcon[n.kind]} size={20} color={colors.blue700} /></View>
        <View style={styles.copy}>
          <Text style={[styles.title, font, n.unread && styles.bold]}>{n.title}</Text>
          <Text style={[styles.time, font]}>{n.time}</Text>
        </View>
        {n.unread && <View style={styles.dot} />}
      </View></Rise>)}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  filters: {flexDirection: 'row', gap: 10, paddingHorizontal: spacing.screen, marginVertical: 14},
  chip: {height: 40, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, justifyContent: 'center'},
  chipOn: {backgroundColor: colors.sky, borderColor: colors.sky},
  chipText: {fontSize: type.small, color: colors.ink, fontWeight: '600'},
  chipTextOn: {color: colors.onSky, fontWeight: '800'},
  list: {paddingHorizontal: spacing.screen, paddingBottom: 28},
  row: {borderRadius: radius.card, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, marginBottom: 10},
  unread: {backgroundColor: colors.blue50, borderColor: colors.blue100},
  rowInner: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 72, paddingHorizontal: 14},
  icon: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  copy: {flex: 1},
  title: {fontSize: type.label, color: colors.ink, lineHeight: 21},
  bold: {fontWeight: '800'},
  time: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue700},
  empty: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 48},
});
