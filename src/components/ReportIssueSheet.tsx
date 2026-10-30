import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {supportApi} from '../api/endpoints';
import {colors, fonts, radius, spacing, type} from '../theme/tokens';
import {Icon} from './Icon';
import {Sheet} from './Sheet';

const font = {fontFamily: fonts.family};
const LIMIT = 2000;

type Props = {
  visible: boolean;
  screenshot?: string;
  page: string;
  shakeEnabled: boolean;
  onShakeEnabled: (on: boolean) => void;
  onContactSupport: () => void;
  onClose: () => void;
};

/** "Report app issue": what happened, an optional screenshot of the screen behind, and the shake-to-report setting. */
export function ReportIssueSheet({visible, screenshot, page, shakeEnabled, onShakeEnabled, onContactSupport, onClose}: Props) {
  const [message, setMessage] = useState('');
  const [withShot, setWithShot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Every report starts fresh.
  useEffect(() => { if (visible) { setMessage(''); setWithShot(!!screenshot); setSent(false); setError(''); } }, [visible, screenshot]);

  const send = async () => {
    if (!message.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      await supportApi.reportIssue({message: message.trim(), screenshot: withShot ? screenshot : undefined, page});
      setSent(true);
    } catch {
      setError('Couldn’t send that. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return <Sheet visible={visible} onClose={onClose} tall>
    <View style={styles.header}>
      <View style={styles.side} />
      <Text style={[styles.title, font]}>Report app issue</Text>
      <Pressable onPress={onClose} hitSlop={8} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
        <Icon name="close" size={22} color={colors.ink} />
      </Pressable>
    </View>

    {sent ? <View style={styles.done}>
      <View style={styles.doneRing}><View style={styles.doneBadge}><Icon name="check" size={34} color={colors.white} /></View></View>
      <Text style={[styles.doneTitle, font]}>Thanks for telling us</Text>
      <Text style={[styles.doneText, font]}>We read every report. If we need more detail, we’ll reach out by email.</Text>
      <Pressable onPress={onClose} style={({pressed}) => [styles.send, styles.doneButton, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.sendText, font]}>Done</Text>
      </Pressable>
    </View> : <>
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, font]}>What happened?</Text>
        <View style={styles.field}>
          <TextInput value={message} onChangeText={t => setMessage(t.slice(0, LIMIT))} multiline maxLength={LIMIT} placeholder="Tell us about the issue you ran into" placeholderTextColor={colors.muted} style={[styles.input, font]} textAlignVertical="top" />
          <Text style={[styles.count, font]}>{message.length} / {LIMIT}</Text>
        </View>
        <Text style={[styles.note, font]}>What you share may be reviewed to help improve yizelearn. Need a reply? <Text onPress={onContactSupport} style={styles.link}>Contact support</Text>.</Text>

        <View style={styles.row}>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, font]}>Include screenshot in report</Text>
            {!screenshot && <Text style={[styles.rowMeta, font]}>No screenshot available</Text>}
          </View>
          <Switch value={withShot} onValueChange={setWithShot} disabled={!screenshot} trackColor={{false: colors.sandLine, true: colors.blue700}} thumbColor={colors.white} ios_backgroundColor={colors.sandLine} accessibilityLabel="Include screenshot in report" />
        </View>
        {withShot && screenshot && <Image source={{uri: screenshot}} style={styles.shot} resizeMode="cover" accessibilityLabel="Screenshot to include" />}

        <View style={styles.row}>
          <View style={styles.rowCopy}>
            <Text style={[styles.rowTitle, font]}>Shake phone to report a bug</Text>
            <Text style={[styles.rowMeta, font]}>Toggle off to disable</Text>
          </View>
          <Switch value={shakeEnabled} onValueChange={onShakeEnabled} trackColor={{false: colors.sandLine, true: colors.blue700}} thumbColor={colors.white} ios_backgroundColor={colors.sandLine} accessibilityLabel="Shake phone to report a bug" />
        </View>
      </ScrollView>
      {!!error && <Text style={[styles.error, font]}>{error}</Text>}
      <Pressable onPress={send} disabled={!message.trim() || busy} style={({pressed}) => [styles.send, !message.trim() && styles.sendOff, pressed && styles.pressed]} accessibilityRole="button" accessibilityState={{disabled: !message.trim() || busy, busy}}>
        {busy ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.sendText, font]}>Send</Text>}
      </Pressable>
    </>}
  </Sheet>;
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  side: {width: 44},
  title: {flex: 1, fontSize: type.subheading, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  close: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, alignItems: 'center', justifyContent: 'center'},
  body: {paddingTop: 14, paddingBottom: 16},
  label: {fontSize: type.label, color: colors.ink, fontWeight: '800', marginBottom: 10},
  field: {borderRadius: radius.card, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, padding: 14},
  input: {minHeight: 150, fontSize: type.body, color: colors.ink, lineHeight: 22, padding: 0},
  count: {alignSelf: 'flex-end', fontSize: type.caption, color: colors.muted, marginTop: 8, fontVariant: ['tabular-nums']},
  note: {fontSize: type.caption, color: colors.muted, lineHeight: 19, marginTop: 14, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.line},
  link: {color: colors.blue700, fontWeight: '700'},
  row: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line},
  rowCopy: {flex: 1},
  rowTitle: {fontSize: type.label, color: colors.ink, fontWeight: '600'},
  rowMeta: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  shot: {width: 96, height: 200, borderRadius: 12, borderWidth: 1, borderColor: colors.sandLine, marginTop: 12, marginBottom: 4},
  error: {fontSize: type.caption, color: colors.danger, textAlign: 'center', marginBottom: 8},
  send: {height: spacing.button, borderRadius: radius.pill, backgroundColor: colors.blue700, alignItems: 'center', justifyContent: 'center'},
  sendOff: {backgroundColor: '#B9C3CF'},
  sendText: {fontSize: type.subheading, color: colors.white, fontWeight: '700'},
  pressed: {opacity: 0.8},
  done: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40},
  doneRing: {width: 110, height: 110, borderRadius: 55, backgroundColor: colors.blue50, alignItems: 'center', justifyContent: 'center', marginBottom: 20},
  doneBadge: {width: 70, height: 70, borderRadius: 35, backgroundColor: colors.blue700, alignItems: 'center', justifyContent: 'center'},
  doneTitle: {fontSize: type.heading + 2, color: colors.ink, fontWeight: '800'},
  doneText: {fontSize: type.label, color: colors.muted, textAlign: 'center', lineHeight: 22, marginTop: 8, paddingHorizontal: 16},
  doneButton: {alignSelf: 'stretch', marginTop: 28},
});
