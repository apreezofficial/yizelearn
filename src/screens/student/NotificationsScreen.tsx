import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {TitleBar} from '../../components/Layout';
import {notices, type NotificationKind} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
type Filter = 'All' | 'Learning' | 'Messages';
const filters: Filter[] = ['All', 'Learning', 'Messages'];
const kindOf: Record<Filter, NotificationKind | undefined> = {All: undefined, Learning: 'learning', Messages: 'messages'};

export function NotificationsScreen({onBack}: {onBack: () => void}) {
  const [filter, setFilter] = useState<Filter>('All');
  const shown = notices.filter(n => !kindOf[filter] || n.kind === kindOf[filter]);
  return <View style={styles.screen}>
    <TitleBar title="Notifications" onBack={onBack} />
    <View style={styles.filters}>
      {filters.map(f => <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipOn]} accessibilityRole="tab" accessibilityState={{selected: filter === f}}>
        <Text style={[styles.chipText, font, filter === f && styles.chipTextOn]}>{f}</Text>
      </Pressable>)}
    </View>
    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
      {shown.length === 0 && <Text style={[styles.empty, font]}>You are all caught up.</Text>}
      {shown.map(n => <View key={n.id} style={styles.row} accessibilityLabel={`${n.title}${n.unread ? ', unread' : ''}`}>
        <View style={styles.icon}><Icon name="bell" size={20} color={colors.blue700} /></View>
        <View style={styles.copy}>
          <Text style={[styles.title, font, n.unread && styles.bold]}>{n.title}</Text>
          <Text style={[styles.time, font]}>{n.time}</Text>
        </View>
        {n.unread && <View style={styles.dot} />}
      </View>)}
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
  row: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 72, borderBottomWidth: 1, borderBottomColor: colors.line},
  icon: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  copy: {flex: 1},
  title: {fontSize: type.label, color: colors.ink, lineHeight: 21},
  bold: {fontWeight: '800'},
  time: {fontSize: type.caption, color: colors.muted, marginTop: 4},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue700},
  empty: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 48},
});
