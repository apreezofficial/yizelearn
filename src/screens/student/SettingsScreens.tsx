import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, type KeyboardTypeOptions} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {BottomButton, PrimaryAction, TitleBar} from '../../components/Layout';
import {Rise} from '../../components/Motion';
import {formatNaira} from '../../data/catalog';
import {learnerName} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

// Sample account data until the profile and payments APIs are connected.
const profileSeed = {name: `${learnerName} Nwachukwu`, email: 'sunday.n@unilag.edu.ng', phone: '+234 803 555 0142', school: 'University of Lagos', bio: 'Learning data analysis one pivot table at a time.'};
const receipts = [
  {id: 'YZ-10482', course: 'Data analysis in Excel', date: '12 Oct 2026', amount: 15000, method: 'Card •••• 4021'},
  {id: 'YZ-10311', course: 'UI design basics', date: '28 Sep 2026', amount: 12500, method: 'Bank transfer'},
  {id: 'YZ-10107', course: 'Intro to Python', date: '3 Sep 2026', amount: 18000, method: 'Card •••• 4021'},
];

function Section({title, delay, children}: {title: string; delay: number; children: React.ReactNode}) {
  return <Rise delay={delay}>
    <Text style={[styles.section, font]}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </Rise>;
}

function Field({label, value, onChangeText, keyboardType, multiline}: {label: string; value: string; onChangeText: (v: string) => void; keyboardType?: KeyboardTypeOptions; multiline?: boolean}) {
  const [focused, setFocused] = useState(false);
  return <View style={styles.fieldWrap}>
    <Text style={[styles.fieldLabel, font]}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} multiline={multiline} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={[styles.field, font, multiline && styles.fieldMulti, focused && styles.fieldFocused]} placeholderTextColor={colors.muted} textAlignVertical={multiline ? 'top' : 'center'} />
  </View>;
}

export function ProfileScreen({onBack}: {onBack: () => void}) {
  const [saved, setSaved] = useState(profileSeed);
  const [form, setForm] = useState(profileSeed);
  const set = (key: keyof typeof form) => (v: string) => setForm(f => ({...f, [key]: v}));
  const changed = JSON.stringify(form) !== JSON.stringify(saved);
  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return <View style={styles.screen}>
    <TitleBar title="Profile" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Rise style={styles.avatarBlock}>
        <View style={styles.avatar}><Text style={[styles.avatarText, font]}>{initials}</Text></View>
        <Pressable onPress={() => Alert.alert('Change photo', 'Photo uploads are not connected yet.')} style={({pressed}) => [styles.camera, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Change photo">
          <Icon name="upload" size={16} color={colors.white} />
        </Pressable>
        <Text style={[styles.avatarName, font]}>{form.name || 'Your name'}</Text>
        <Text style={[styles.avatarMeta, font]}>Learner · {form.school}</Text>
      </Rise>
      <Rise delay={90}>
        <Field label="Full name" value={form.name} onChangeText={set('name')} />
        <Field label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
        <Field label="Phone number" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
        <Field label="School or organisation" value={form.school} onChangeText={set('school')} />
        <Field label="About you" value={form.bio} onChangeText={set('bio')} multiline />
      </Rise>
    </ScrollView>
    <BottomButton label={changed ? 'Save changes' : 'Saved'} disabled={!changed || !form.name.trim()} onPress={() => { setSaved(form); Alert.alert('Profile saved', 'Your details are up to date.'); }} />
  </View>;
}

export function PaymentsScreen({onBack}: {onBack: () => void}) {
  const total = receipts.reduce((sum, r) => sum + r.amount, 0);
  return <View style={styles.screen}>
    <TitleBar title="Payments and receipts" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Rise style={styles.board}>
        <View style={styles.swirl} />
        <Text style={[styles.boardLabel, font]}>Total spent on learning</Text>
        <Text style={[styles.boardValue, font]}>{formatNaira(total)}</Text>
        <Text style={[styles.boardMeta, font]}>{receipts.length} courses paid for</Text>
      </Rise>

      <Section title="Payment method" delay={90}>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Icon name="card" size={20} color={colors.blue700} /></View>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, font]}>Visa •••• 4021</Text>
            <Text style={[styles.rowMeta, font]}>Expires 08/28</Text>
          </View>
          <View style={styles.pill}><Text style={[styles.pillText, font]}>Default</Text></View>
        </View>
      </Section>

      <Section title="Receipts" delay={180}>
        {receipts.map((r, i) => <Pressable key={r.id} onPress={() => Alert.alert(`Receipt ${r.id}`, `${r.course}\n${formatNaira(r.amount)} · ${r.method}\n${r.date}`)} style={({pressed}) => [styles.row, i > 0 && styles.rowLine, pressed && styles.rowPressed]} accessibilityRole="button">
          <View style={styles.rowIcon}><Icon name="book" size={20} color={colors.blue700} /></View>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, font]} numberOfLines={1}>{r.course}</Text>
            <Text style={[styles.rowMeta, font]}>{r.date} · {r.method}</Text>
          </View>
          <Text style={[styles.amount, font]}>{formatNaira(r.amount)}</Text>
        </Pressable>)}
      </Section>
    </ScrollView>
  </View>;
}

function ToggleRow({icon, title, detail, value, onChange, first}: {icon: IconName; title: string; detail: string; value: boolean; onChange: (v: boolean) => void; first?: boolean}) {
  return <View style={[styles.row, !first && styles.rowLine]}>
    <View style={styles.rowIcon}><Icon name={icon} size={20} color={colors.blue700} /></View>
    <View style={styles.rowCopy}>
      <Text style={[styles.rowTitle, font]}>{title}</Text>
      <Text style={[styles.rowMeta, font]}>{detail}</Text>
    </View>
    <Switch value={value} onValueChange={onChange} trackColor={{false: colors.sandLine, true: colors.blue700}} thumbColor={colors.white} ios_backgroundColor={colors.sandLine} accessibilityLabel={title} />
  </View>;
}

export function PrivacyScreen({onBack}: {onBack: () => void}) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(true);
  const [recommend, setRecommend] = useState(true);
  const [emails, setEmails] = useState(false);
  return <View style={styles.screen}>
    <TitleBar title="Privacy and data" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Rise style={styles.note}>
        <Icon name="shield" size={22} color={colors.blue700} />
        <Text style={[styles.noteText, font]}>You decide who sees your learning. We never sell your data.</Text>
      </Rise>
      <Section title="Visibility" delay={90}>
        <ToggleRow first icon="user" title="Show my profile to classmates" detail="Name and photo in course discussions" value={visible} onChange={setVisible} />
        <ToggleRow icon="target" title="Share progress with instructors" detail="Helps them support you" value={progress} onChange={setProgress} />
      </Section>
      <Section title="Personalisation" delay={180}>
        <ToggleRow first icon="star" title="Course recommendations" detail="Based on what you learn" value={recommend} onChange={setRecommend} />
        <ToggleRow icon="mail" title="Learning tips by email" detail="About once a week" value={emails} onChange={setEmails} />
      </Section>
      <Rise delay={270}>
        <Text style={[styles.section, font]}>Your data</Text>
        <PrimaryAction label="Download my data" outline onPress={() => Alert.alert('Download my data', 'We’ll email you a copy of your data within 48 hours.')} />
        <Pressable onPress={() => Alert.alert('Delete account?', 'This removes your courses, progress and certificates for good.', [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Request received', 'Our team will confirm by email before anything is deleted.')}])}
          style={({pressed}) => [styles.danger, pressed && styles.pressed]} accessibilityRole="button">
          <Text style={[styles.dangerText, font]}>Delete my account</Text>
        </Pressable>
      </Rise>
    </ScrollView>
  </View>;
}

const providers: {id: string; name: string; icon: IconName; detail: string}[] = [
  {id: 'google', name: 'Google', icon: 'google', detail: 'Sign in with your Google account'},
  {id: 'apple', name: 'Apple', icon: 'apple', detail: 'Sign in with Apple ID'},
  {id: 'school', name: 'School or work (SSO)', icon: 'school', detail: 'University of Lagos'},
];

export function ConnectedAccountsScreen({onBack}: {onBack: () => void}) {
  const [linked, setLinked] = useState<Record<string, boolean>>({google: true, apple: false, school: true});
  const toggle = (id: string, name: string) => {
    if (!linked[id]) { setLinked(l => ({...l, [id]: true})); return; }
    if (Object.values(linked).filter(Boolean).length === 1) { Alert.alert('Keep one sign-in', 'You need at least one way to sign in.'); return; }
    Alert.alert(`Disconnect ${name}?`, 'You won’t be able to sign in with it until you connect it again.', [{text: 'Cancel', style: 'cancel'}, {text: 'Disconnect', style: 'destructive', onPress: () => setLinked(l => ({...l, [id]: false}))}]);
  };
  return <View style={styles.screen}>
    <TitleBar title="Connected accounts" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Rise style={styles.note}>
        <Icon name="attach" size={22} color={colors.blue700} />
        <Text style={[styles.noteText, font]}>Connect accounts to sign in faster. Your password is never shared with us.</Text>
      </Rise>
      <Section title="Sign-in methods" delay={90}>
        {providers.map((p, i) => <View key={p.id} style={[styles.row, i > 0 && styles.rowLine]}>
          <View style={styles.rowIcon}><Icon name={p.icon} size={20} color={colors.ink} /></View>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, font]}>{p.name}</Text>
            <Text style={[styles.rowMeta, font]}>{linked[p.id] ? p.detail : 'Not connected'}</Text>
          </View>
          <Pressable onPress={() => toggle(p.id, p.name)} style={({pressed}) => [styles.linkButton, linked[p.id] && styles.linkButtonOn, pressed && styles.pressed]} accessibilityRole="button">
            <Text style={[styles.linkText, font, linked[p.id] && styles.linkTextOn]}>{linked[p.id] ? 'Disconnect' : 'Connect'}</Text>
          </Pressable>
        </View>)}
      </Section>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 32},
  section: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 24, marginBottom: 10},
  card: {backgroundColor: colors.white, borderRadius: radius.card, borderWidth: 1, borderColor: colors.sandLine, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 68, paddingHorizontal: 14, paddingVertical: 10},
  rowLine: {borderTopWidth: 1, borderTopColor: colors.line},
  rowPressed: {backgroundColor: colors.sand},
  rowIcon: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blue50, alignItems: 'center', justifyContent: 'center'},
  rowCopy: {flex: 1},
  rowTitle: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  rowMeta: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  amount: {fontSize: type.label, color: colors.ink, fontWeight: '800'},
  pill: {paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.blue100},
  pillText: {fontSize: type.caption, color: colors.blue900, fontWeight: '800'},
  pressed: {opacity: 0.8},
  avatarBlock: {alignItems: 'center', marginBottom: 12},
  avatar: {width: 96, height: 96, borderRadius: 48, backgroundColor: colors.blue100, borderWidth: 3, borderColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  avatarText: {fontSize: type.title, color: colors.blue900, fontWeight: '800'},
  camera: {position: 'absolute', top: 64, left: '57%', width: 34, height: 34, borderRadius: 17, backgroundColor: colors.blue700, borderWidth: 3, borderColor: colors.cream, alignItems: 'center', justifyContent: 'center'},
  avatarName: {fontSize: type.heading, color: colors.ink, fontWeight: '800', marginTop: 12},
  avatarMeta: {fontSize: type.small, color: colors.muted, marginTop: 4},
  fieldWrap: {marginTop: 14},
  fieldLabel: {fontSize: type.small, color: colors.ink, fontWeight: '700', marginBottom: 8},
  field: {height: 52, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, fontSize: type.body, color: colors.ink},
  fieldMulti: {height: 104, paddingTop: 14},
  fieldFocused: {borderColor: colors.blue700, borderWidth: 1.5},
  board: {backgroundColor: colors.chalk, borderRadius: radius.card, padding: 20, overflow: 'hidden'},
  swirl: {position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: 70, borderWidth: 1.5, borderColor: 'rgba(254, 249, 242, 0.12)'},
  boardLabel: {fontSize: type.small, color: colors.chalkText, opacity: 0.8},
  boardValue: {fontFamily: 'Caveat', fontSize: 44, lineHeight: 52, color: colors.chalkText, fontWeight: '700', marginTop: 4},
  boardMeta: {fontSize: type.caption, color: colors.marigold, fontWeight: '700', marginTop: 2},
  note: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: radius.card, backgroundColor: colors.blue50},
  noteText: {flex: 1, fontSize: type.small, color: colors.ink, lineHeight: 20},
  danger: {height: spacing.button, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center', marginTop: 10},
  dangerText: {fontSize: type.label, color: colors.danger, fontWeight: '800'},
  linkButton: {paddingHorizontal: 14, height: 36, borderRadius: radius.pill, backgroundColor: colors.blue700, justifyContent: 'center'},
  linkButtonOn: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine},
  linkText: {fontSize: type.caption, color: colors.white, fontWeight: '800'},
  linkTextOn: {color: colors.ink},
});
