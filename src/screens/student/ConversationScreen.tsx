import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {TitleBar} from '../../components/Layout';
import {conversations, threads} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
type Message = {from: 'them' | 'me'; text: string; time: string};

export function ConversationScreen({conversationId, onBack}: {conversationId: string; onBack: () => void}) {
  const conversation = conversations.find(c => c.id === conversationId) ?? conversations[0];
  const [messages, setMessages] = useState<Message[]>(threads[conversation.id] ?? []);
  const [draft, setDraft] = useState('');
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(list => [...list, {from: 'me', text, time: 'Now'}]);
    setDraft('');
  };

  return <View style={styles.screen}>
    <TitleBar title={conversation.name} onBack={onBack} />
    <ScrollView contentContainerStyle={styles.thread} showsVerticalScrollIndicator={false}>
      {messages.length === 0 && <Text style={[styles.empty, font]}>No messages yet. Say hello.</Text>}
      {messages.map((m, i) => <View key={i} style={[styles.bubbleRow, m.from === 'me' && styles.bubbleRowMe]}>
        <View style={[styles.bubble, m.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, font, m.from === 'me' && styles.bubbleTextMe]}>{m.text}</Text>
          <Text style={[styles.time, font, m.from === 'me' && styles.timeMe]}>{m.time}</Text>
        </View>
      </View>)}
    </ScrollView>

    <View style={styles.composer}>
      <TextInput value={draft} onChangeText={setDraft} placeholder="Write a message" placeholderTextColor={colors.muted} onSubmitEditing={send} returnKeyType="send" style={[styles.input, font]} />
      <Pressable onPress={send} disabled={!draft.trim()} style={({pressed}) => [styles.send, !draft.trim() && styles.dim, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Send message">
        <Icon name="send" size={22} color={colors.onSky} />
      </Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  thread: {padding: spacing.screen, gap: 10, flexGrow: 1},
  empty: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 40},
  bubbleRow: {flexDirection: 'row'},
  bubbleRowMe: {justifyContent: 'flex-end'},
  bubble: {maxWidth: '78%', borderRadius: radius.card, paddingHorizontal: 14, paddingVertical: 10},
  bubbleThem: {backgroundColor: colors.sand, borderBottomLeftRadius: 4},
  bubbleMe: {backgroundColor: colors.sky, borderBottomRightRadius: 4},
  bubbleText: {fontSize: type.label, color: colors.ink, lineHeight: 21},
  bubbleTextMe: {color: colors.onSky},
  time: {fontSize: type.tab, color: colors.muted, marginTop: 4, alignSelf: 'flex-end'},
  timeMe: {color: colors.onSky},
  composer: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.screen, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.barBg},
  input: {flex: 1, height: 52, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 18, fontSize: type.body, color: colors.ink},
  send: {width: 52, height: 52, borderRadius: 26, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  dim: {opacity: 0.5},
  pressed: {opacity: 0.8},
});
