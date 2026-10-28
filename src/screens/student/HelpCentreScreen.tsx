import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {TitleBar} from '../../components/Layout';
import {helpArticles} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
const topics: {label: string; icon: IconName}[] = [
  {label: 'Account', icon: 'user'},
  {label: 'Payments', icon: 'card'},
  {label: 'Courses', icon: 'book'},
  {label: 'Certificates', icon: 'award'},
];

export function HelpCentreScreen({onBack}: {onBack: () => void}) {
  const [query, setQuery] = useState('');
  const articles = helpArticles.filter(a => a.toLowerCase().includes(query.trim().toLowerCase()));
  return <View style={styles.screen}>
    <TitleBar title="Help centre" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.search}>
        <Icon name="search" size={20} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search for help" placeholderTextColor={colors.muted} style={[styles.input, font]} />
      </View>

      <View style={styles.topics}>
        {topics.map(t => <Pressable key={t.label} onPress={() => Alert.alert(t.label, 'Browse this topic is not set up yet.')} style={({pressed}) => [styles.topic, pressed && styles.pressed]} accessibilityRole="button">
          <View style={styles.topicIcon}><Icon name={t.icon} size={22} color={colors.blue700} /></View>
          <Text style={[styles.topicText, font]}>{t.label}</Text>
        </Pressable>)}
      </View>

      <Text style={[styles.section, font]}>Popular articles</Text>
      {articles.map(a => <Pressable key={a} onPress={() => Alert.alert('Help article', 'Articles are not published yet.')} style={({pressed}) => [styles.article, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.articleText, font]}>{a}</Text>
        <Icon name="next" size={18} color={colors.muted} />
      </Pressable>)}
      {articles.length === 0 && <Text style={[styles.empty, font]}>No articles match that search. Try contacting support.</Text>}

      <Pressable onPress={() => Alert.alert('Contact support', 'Support messages are not connected yet.')} style={({pressed}) => [styles.contact, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.contactText, font]}>Contact support</Text>
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
  topicText: {fontSize: type.label, color: colors.ink, fontWeight: '700', marginTop: 10},
  section: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 26, marginBottom: 6},
  article: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.line},
  articleText: {flex: 1, fontSize: type.label, color: colors.ink, paddingRight: 12},
  empty: {fontSize: type.label, color: colors.muted, marginTop: 16},
  contact: {height: spacing.button, borderRadius: radius.button, borderWidth: 1.5, borderColor: colors.blue700, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 28},
  contactText: {fontSize: type.subheading, color: colors.blue700, fontWeight: '700'},
  pressed: {opacity: 0.8},
});
