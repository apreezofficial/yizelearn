import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {PrimaryAction, TitleBar} from '../../components/Layout';
import {assessment} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

// Picking files needs a document picker library, which isn't installed yet.
const FILE_PICKER_READY = false;

export function AssessmentScreen({onBack}: {onBack: () => void}) {
  const [file, setFile] = useState<string>();
  const [note, setNote] = useState('');

  const pick = () => {
    if (!FILE_PICKER_READY) {
      Alert.alert('Uploads', 'File upload is not connected yet.');
      return;
    }
    setFile(undefined);
  };

  return <View style={styles.screen}>
    <TitleBar title="Assessment" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, font]}>{assessment.title}</Text>
      <View style={styles.meta}>
        <View style={styles.pill}><Icon name="clock" size={14} color={colors.ink} /><Text style={[styles.pillText, font]}>{assessment.due}</Text></View>
        <View style={styles.pill}><Text style={[styles.pillText, font]}>{assessment.attempts}</Text></View>
      </View>
      <Text style={[styles.body, font]}>{assessment.instructions}</Text>

      <Text style={[styles.section, font]}>Your submission</Text>
      <Pressable onPress={pick} style={({pressed}) => [styles.drop, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Upload your file">
        <View style={styles.dropIcon}><Icon name="upload" size={24} color={colors.blue700} /></View>
        <Text style={[styles.dropTitle, font]}>{file ?? 'Tap to upload a file'}</Text>
        <Text style={[styles.dropHint, font]}>{assessment.formats}</Text>
      </Pressable>

      <Text style={[styles.label, font]}>Note to instructor (optional)</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="Add a note" placeholderTextColor={colors.muted} multiline style={[styles.note, font]} />

      <PrimaryAction label="Submit assessment" disabled />
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  title: {fontSize: type.title, color: colors.ink, fontWeight: '800'},
  meta: {flexDirection: 'row', gap: 8, marginTop: 12},
  pill: {flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.star, opacity: 0.9},
  pillText: {fontSize: type.caption, color: colors.ink, fontWeight: '700'},
  body: {fontSize: type.label, color: colors.ink, lineHeight: 22, marginTop: 14},
  section: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 24, marginBottom: 12},
  drop: {alignItems: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.blue600, borderRadius: radius.card, backgroundColor: colors.white, paddingVertical: 28, paddingHorizontal: 16, gap: 8},
  dropIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  dropTitle: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  dropHint: {fontSize: type.caption, color: colors.muted, textAlign: 'center'},
  pressed: {opacity: 0.85},
  label: {fontSize: type.small, color: colors.ink, fontWeight: '700', marginTop: 22, marginBottom: 8},
  note: {minHeight: 56, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 14, fontSize: type.body, color: colors.ink, textAlignVertical: 'top'},
});
