import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {conversations, threads} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
const doodles = require('../../assets/chat-doodles.png');
type Message = {from: 'them' | 'me'; text: string; time: string};

/** A bubble that rises in from its own side as it arrives. */
function Bubble({message, delay}: {message: Message; delay: number}) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(t, {toValue: 1, duration: 380, delay, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true}).start(); }, [delay, t]);
  const me = message.from === 'me';
  return <Animated.View style={[styles.bubbleRow, me && styles.bubbleRowMe, {opacity: t, transform: [
    {translateY: t.interpolate({inputRange: [0, 1], outputRange: [12, 0]})},
    {scale: t.interpolate({inputRange: [0, 1], outputRange: [0.92, 1]})},
  ]}]}>
    <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleThem]}>
      <Text style={[styles.bubbleText, font, me && styles.bubbleTextMe]}>{message.text}</Text>
    </View>
  </Animated.View>;
}

export function ConversationScreen({conversationId, onBack}: {conversationId: string; onBack: () => void}) {
  const conversation = conversations.find(c => c.id === conversationId) ?? conversations[0];
  const [messages, setMessages] = useState<Message[]>(threads[conversation.id] ?? []);
  const [draft, setDraft] = useState('');
  const initial = useRef(messages.length).current;
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(list => [...list, {from: 'me', text, time: 'Now'}]);
    setDraft('');
  };

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image source={doodles} resizeMode="cover" blurRadius={0.6} style={styles.doodles} />
    </View>
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="Back">
        <Icon name="back" size={24} color={colors.ink} />
      </Pressable>
      <View style={styles.titleRow}>
        <Text style={[styles.title, font]} numberOfLines={1}>{conversation.name}</Text>
        {conversation.verified && <View accessibilityLabel="Verified"><Icon name="verified" size={19} color={colors.blue700} /></View>}
      </View>
      <Pressable hitSlop={12} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="More options">
        <Icon name="more" size={22} color={colors.ink} />
      </Pressable>
    </View>
    <ScrollView ref={scroll} contentContainerStyle={styles.thread} showsVerticalScrollIndicator={false} onContentSizeChange={() => scroll.current?.scrollToEnd({animated: true})}>
      {messages.length === 0 && <Text style={[styles.empty, font]}>No messages yet. Say hello.</Text>}
      {messages.map((m, i) => <Bubble key={i} message={m} delay={i < initial ? 100 + i * 90 : 0} />)}
    </ScrollView>
    <View style={styles.composer}>
      <TextInput value={draft} onChangeText={setDraft} placeholder="Write a message" placeholderTextColor={colors.muted} onSubmitEditing={send} returnKeyType="send" style={[styles.input, font]} />
      <Pressable onPress={send} disabled={!draft.trim()} style={({pressed}) => [styles.send, !draft.trim() && styles.dim, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Send message">
        <Icon name="send" size={20} color={colors.white} />
      </Pressable>
    </View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  // One tile drawn large, as in the design: about two and a half bubbles across the screen.
  doodles: {position: 'absolute', top: -60, left: -150, width: 920, height: 920, opacity: 0.22, mixBlendMode: 'multiply'},
  header: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 14},
  headerButton: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  titleRow: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6},
  title: {flexShrink: 1, fontSize: type.heading, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  thread: {paddingHorizontal: spacing.screen, paddingTop: 4, paddingBottom: 16, gap: 18, flexGrow: 1},
  empty: {fontSize: type.label, color: colors.muted, textAlign: 'center', marginTop: 40},
  bubbleRow: {flexDirection: 'row'},
  bubbleRowMe: {justifyContent: 'flex-end'},
  bubble: {maxWidth: '76%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16},
  bubbleThem: {backgroundColor: '#F1EEE8'},
  bubbleMe: {backgroundColor: '#3E6FB0'},
  bubbleText: {fontSize: type.label, lineHeight: 22, color: colors.ink},
  bubbleTextMe: {color: colors.white},
  composer: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.screen, paddingTop: 16, paddingBottom: 18, backgroundColor: colors.sand},
  input: {flex: 1, height: 54, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: '#FBFAF8', paddingHorizontal: 24, fontSize: type.body, color: colors.ink},
  send: {width: 54, height: 54, borderRadius: 27, backgroundColor: '#3E6FB0', alignItems: 'center', justifyContent: 'center'},
  dim: {backgroundColor: '#8DB0E3'},
  pressed: {opacity: 0.8},
});
