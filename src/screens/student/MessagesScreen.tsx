import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {SearchField} from '../../components/Catalog';
import {conversations, type Conversation} from '../../data/learning';
import {colors, fonts, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

export function MessagesScreen({onOpen}: {onOpen: (id: string) => void}) {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => conversations.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return <View style={styles.screen}>
    <Text style={[styles.title, font]}>Messages</Text>
    <View style={styles.search}><SearchField value={query} onChangeText={setQuery} placeholder="Search messages" /></View>
    <FlatList data={rows} keyExtractor={c => c.id} contentContainerStyle={styles.list}
      renderItem={({item}) => <Row conversation={item} onPress={() => onOpen(item.id)} />} />
  </View>;
}

function Row({conversation, onPress}: {conversation: Conversation; onPress: () => void}) {
  return <Pressable onPress={onPress} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`${conversation.name}${conversation.unread ? ', unread' : ''}`}>
    <View style={styles.avatar}><Text style={[styles.avatarText, font]}>{conversation.initials}</Text></View>
    <View style={styles.copy}>
      <Text style={[styles.name, font, conversation.unread && styles.bold]} numberOfLines={1}>{conversation.name}</Text>
      <Text style={[styles.last, font, conversation.unread && styles.lastUnread]} numberOfLines={1}>{conversation.last}</Text>
    </View>
    <View style={styles.meta}>
      <Text style={[styles.time, font]}>{conversation.time}</Text>
      {conversation.unread && <View style={styles.dot} />}
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream, paddingTop: 12},
  title: {fontSize: type.display, color: colors.ink, fontWeight: '800', paddingHorizontal: spacing.screen, marginBottom: 16},
  search: {paddingHorizontal: spacing.screen, marginBottom: 12},
  list: {paddingHorizontal: spacing.screen, paddingBottom: 24},
  row: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 72, borderBottomWidth: 1, borderBottomColor: colors.line},
  pressed: {opacity: 0.7},
  avatar: {width: 48, height: 48, borderRadius: 24, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  avatarText: {fontSize: type.caption, color: colors.blue900, fontWeight: '800'},
  copy: {flex: 1},
  name: {fontSize: type.label, color: colors.ink, fontWeight: '600'},
  bold: {fontWeight: '800'},
  last: {fontSize: type.small, color: colors.muted, marginTop: 4},
  lastUnread: {color: colors.ink, fontWeight: '600'},
  meta: {alignItems: 'flex-end', gap: 8},
  time: {fontSize: type.caption, color: colors.muted},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue700},
});
