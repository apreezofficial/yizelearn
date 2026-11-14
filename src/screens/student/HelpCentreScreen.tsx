import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {TitleBar} from '../../components/Layout';
import {Rise} from '../../components/Motion';
import {helpApi, ticketsApi, type HelpArticle, type HelpArticleCard, type HelpCategory, type TicketTopic} from '../../api/endpoints';
import {session} from '../../api/session';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
const iconFor = (key: string | null, name: string): IconName => {
  const k = `${key ?? ''} ${name}`.toLowerCase();
  return k.includes('pay') ? 'card' : k.includes('cert') ? 'award' : k.includes('course') ? 'book' : 'user';
};
const topicFor = (name: string): TicketTopic => {
  const n = name.toLowerCase();
  return n.includes('pay') ? 'payments' : n.includes('cert') ? 'certificates' : n.includes('course') ? 'courses' : n.includes('account') ? 'account' : 'other';
};
const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong.');

export function HelpCentreScreen({onBack}: {onBack: () => void}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<HelpCategory | null>(null);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<HelpArticleCard[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [open, setOpen] = useState<HelpArticle | null>(null);
  const [contact, setContact] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    try {
      const [c, a] = await Promise.all([helpApi.categories(), helpApi.articles({q: query.trim() || undefined, categoryId: category?.id})]);
      setCategories(c.data); setArticles(a.data); setState('ready');
    } catch (e) { setError(message(e)); setState('error'); }
  }, [query, category]);
  useEffect(() => { const t = setTimeout(load, query ? 350 : 0); return () => clearTimeout(t); }, [load, query]);

  const show = async (id: string) => { try { setOpen(await helpApi.article(id)); } catch (e) { Alert.alert('Could not open the article', message(e)); } };

  if (contact) return <ContactForm onBack={() => setContact(false)} defaultTopic={category ? topicFor(category.name) : 'other'} />;
  if (open) return <ArticleView article={open} onBack={() => setOpen(null)} onContact={() => { setOpen(null); setContact(true); }} />;

  return <View style={styles.screen}>
    <TitleBar title="Help centre" onBack={category ? () => setCategory(null) : onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Rise style={styles.search}>
        <Icon name="search" size={20} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search for help" placeholderTextColor={colors.muted} style={[font, styles.input]} />
      </Rise>

      {!category && categories.length > 0 && <Rise delay={80} style={styles.topics}>
        {categories.map(t => <Pressable key={t.id} onPress={() => setCategory(t)} style={({pressed}) => [styles.topic, pressed && styles.pressed]} accessibilityRole="button">
          <View style={styles.topicIcon}><Icon name={iconFor(t.iconKey, t.name)} size={22} color={colors.blue700} /></View>
          <Text style={[font, styles.topicText]}>{t.name}</Text>
        </Pressable>)}
      </Rise>}

      <Rise delay={160}><Text style={[font, styles.section]}>{category ? category.name : query ? 'Results' : 'Popular articles'}</Text></Rise>
      {state === 'loading' && <ActivityIndicator color={colors.blue700} style={{marginTop: 20}} />}
      {state === 'error' && <View><Text style={[font, styles.empty]}>{error}</Text><Pressable onPress={load} accessibilityRole="button"><Text style={[font, styles.retry]}>Try again</Text></Pressable></View>}
      {state === 'ready' && articles.map(a => <Pressable key={a.id} onPress={() => show(a.id)} style={({pressed}) => [styles.article, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[font, styles.articleText]}>{a.title}</Text>
        <Icon name="next" size={18} color={colors.muted} />
      </Pressable>)}
      {state === 'ready' && articles.length === 0 && <Text style={[font, styles.empty]}>{query ? 'No articles match that search. Try contacting support.' : 'No help articles are published yet. Contact support and we will help you directly.'}</Text>}

      <Pressable onPress={() => session.isSignedIn() ? setContact(true) : Alert.alert('Log in to contact support', 'Support tickets are tied to your account, so log in first.')} style={({pressed}) => [styles.contact, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[font, styles.contactText]}>Contact support</Text>
      </Pressable>
    </ScrollView>
  </View>;
}

function ArticleView({article, onBack, onContact}: {article: HelpArticle; onBack: () => void; onContact: () => void}) {
  const [rated, setRated] = useState(false);
  const rate = (helpful: boolean) => { setRated(true); helpApi.rate(article.id, helpful).catch(() => undefined); };
  return <View style={styles.screen}>
    <TitleBar title="Help article" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[font, styles.articleTitle]}>{article.title}</Text>
      {article.lead ? <Text style={[font, styles.lead]}>{article.lead}</Text> : null}
      {article.blocks.map((b, i) => b.type.startsWith('heading') ? <Text key={i} style={[font, styles.blockHeading]}>{b.text}</Text>
        : b.items?.length ? <View key={i} style={styles.list}>{b.items.map((it, j) => <Text key={j} style={[font, styles.body]}>{'•  '}{it}</Text>)}</View>
        : <Text key={i} style={[font, styles.body]}>{b.text}</Text>)}
      <View style={styles.rate}>
        <Text style={[font, styles.rateText]}>{rated ? 'Thanks for the feedback.' : 'Was this helpful?'}</Text>
        {!rated && <View style={styles.rateRow}>
          <Pressable onPress={() => rate(true)} style={styles.rateBtn} accessibilityRole="button"><Text style={[font, styles.rateBtnText]}>Yes</Text></Pressable>
          <Pressable onPress={() => rate(false)} style={styles.rateBtn} accessibilityRole="button"><Text style={[font, styles.rateBtnText]}>No</Text></Pressable>
        </View>}
      </View>
      <Pressable onPress={() => Share.share({message: `${article.title}\n${article.shareUrl}`})} style={({pressed}) => [styles.contact, pressed && styles.pressed]} accessibilityRole="button"><Text style={[font, styles.contactText]}>Share this article</Text></Pressable>
      <Pressable onPress={onContact} style={({pressed}) => [styles.link, pressed && styles.pressed]} accessibilityRole="button"><Text style={[font, styles.retry]}>Still stuck? Contact support</Text></Pressable>
    </ScrollView>
  </View>;
}

const topics: {key: TicketTopic; label: string}[] = [{key: 'account', label: 'Account'}, {key: 'payments', label: 'Payments'}, {key: 'courses', label: 'Courses'}, {key: 'certificates', label: 'Certificates'}, {key: 'technical', label: 'Technical'}, {key: 'other', label: 'Other'}];

function ContactForm({onBack, defaultTopic}: {onBack: () => void; defaultTopic: TicketTopic}) {
  const [topic, setTopic] = useState<TicketTopic>(defaultTopic);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const ready = subject.trim().length >= 3 && body.trim().length >= 10 && !busy;
  const send = async () => {
    setBusy(true);
    try { const t = await ticketsApi.create({topic, subject: subject.trim(), message: body.trim()}); Alert.alert('Message sent', `Your ticket number is #${t.number}. We reply by email and in your notifications.`, [{text: 'OK', onPress: onBack}]); }
    catch (e) { Alert.alert('Could not send', message(e)); } finally { setBusy(false); }
  };
  return <View style={styles.screen}>
    <TitleBar title="Contact support" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={[font, styles.label]}>Topic</Text>
      <View style={styles.chips}>{topics.map(t => <Pressable key={t.key} onPress={() => setTopic(t.key)} style={[styles.chip, topic === t.key && styles.chipOn]} accessibilityRole="button" accessibilityState={{selected: topic === t.key}}><Text style={[font, styles.chipText, topic === t.key && styles.chipTextOn]}>{t.label}</Text></Pressable>)}</View>
      <Text style={[font, styles.label]}>Subject</Text>
      <TextInput value={subject} onChangeText={setSubject} placeholder="What do you need help with?" placeholderTextColor={colors.muted} style={[font, styles.field]} />
      <Text style={[font, styles.label]}>Message</Text>
      <TextInput value={body} onChangeText={setBody} placeholder="Tell us what happened (at least a sentence)" placeholderTextColor={colors.muted} multiline style={[font, styles.field, styles.area]} />
      <Pressable onPress={send} disabled={!ready} style={({pressed}) => [styles.send, !ready && styles.disabled, pressed && styles.pressed]} accessibilityRole="button" accessibilityState={{disabled: !ready}}>
        {busy ? <ActivityIndicator color={colors.white} /> : <Text style={[font, styles.sendText]}>Send message</Text>}
      </Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  search: {flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 18},
  input: {flex: 1, fontSize: type.body, color: colors.ink, paddingVertical: 0},
  topics: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginTop: 18},
  topic: {width: '48%', minHeight: 96, borderRadius: radius.card, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, padding: 16, justifyContent: 'space-between'},
  topicIcon: {width: 42, height: 42, borderRadius: 21, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  topicText: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold, marginTop: 10},
  section: {fontSize: type.subheading, color: colors.ink, fontFamily: fonts.display, marginTop: 26, marginBottom: 6},
  article: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.line},
  articleText: {flex: 1, fontSize: type.label, color: colors.ink, paddingRight: 12},
  empty: {fontSize: type.label, color: colors.muted, marginTop: 16},
  contact: {height: spacing.button, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.blue700, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 28},
  contactText: {fontSize: type.subheading, color: colors.blue700, fontFamily: fonts.bold},
  pressed: {opacity: 0.8},
  retry: {fontSize: type.label, color: colors.blue700, fontFamily: fonts.bold, marginTop: 10},
  link: {alignItems: 'center', paddingVertical: 18},
  articleTitle: {fontSize: type.title, color: colors.ink, fontFamily: fonts.display},
  lead: {fontSize: type.body, color: colors.muted, marginTop: 10, lineHeight: 24},
  blockHeading: {fontSize: type.subheading, color: colors.ink, fontFamily: fonts.display, marginTop: 22},
  body: {fontSize: type.body, color: colors.ink, lineHeight: 24, marginTop: 12},
  list: {marginTop: 4},
  rate: {marginTop: 28, padding: 16, borderRadius: radius.card, backgroundColor: colors.blue50},
  rateText: {fontSize: type.label, color: colors.ink, fontFamily: fonts.semibold},
  rateRow: {flexDirection: 'row', gap: 10, marginTop: 12},
  rateBtn: {minWidth: 72, height: 44, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  rateBtnText: {fontSize: type.label, color: colors.ink, fontFamily: fonts.semibold},
  label: {fontSize: type.small, color: colors.ink, fontFamily: fonts.bold, marginTop: 18, marginBottom: 8},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {height: 40, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, justifyContent: 'center'},
  chipOn: {backgroundColor: colors.blue700, borderColor: colors.blue700},
  chipText: {fontSize: type.small, color: colors.ink, fontFamily: fonts.medium},
  chipTextOn: {color: colors.white, fontFamily: fonts.semibold},
  field: {minHeight: 52, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: type.body, color: colors.ink},
  area: {minHeight: 140, paddingTop: 14, textAlignVertical: 'top'},
  send: {height: spacing.button, borderRadius: radius.button, backgroundColor: colors.blue700, alignItems: 'center', justifyContent: 'center', marginTop: 24},
  sendText: {fontSize: type.subheading, color: colors.white, fontFamily: fonts.bold},
  disabled: {opacity: 0.5},
});
