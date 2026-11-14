import React, {useState} from 'react';
import {Alert, LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {errorCodes, isErrorWithCode, pick as pickFile, types} from '@react-native-documents/picker';
import {Icon} from '../../components/Icon';
import {haptic} from '../../theme/system';
import {PrimaryAction, TitleBar} from '../../components/Layout';
import {assessment} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

const MAX_MB = 25;
type Picked = {name: string; mb: number};
const sizeLabel = (mb: number) => (mb < 1 ? `${Math.max(1, Math.round(mb * 1024))} KB` : `${Math.round(mb)} MB`);
const tips = ['Save the sheet without images or macros', 'Compress it into a ZIP file', 'Share a link instead, in the note'];

export function AssessmentScreen({onBack}: {onBack: () => void}) {
  const [file, setFile] = useState<Picked>();
  const [note, setNote] = useState('');
  const tooBig = !!file && file.mb > MAX_MB;

  const pick = async () => {
    try {
      const [res] = await pickFile({type: [types.xlsx, types.xls, types.pdf, types.csv, types.zip]});
      LayoutAnimation.easeInEaseOut();
      const picked = {name: res.name ?? 'File', mb: (res.size ?? 0) / 1024 / 1024};
      if (picked.mb > MAX_MB) haptic.warning(); else haptic.success();
      setFile(picked);
    } catch (e) {
      if (!(isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED)) Alert.alert('Could not open the file', 'Try choosing it again.');
    }
  };
  const remove = () => { LayoutAnimation.easeInEaseOut(); setFile(undefined); };
  // Sending files to the server waits on the assignments API.
  const submit = () => Alert.alert('Submit assignment', 'Submitting is not connected yet.');

  return <View style={styles.screen}>
    <TitleBar title="Assignment" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={[font, styles.title]}>{assessment.title}</Text>
      <View style={styles.meta}>
        <View style={styles.pill}><Icon name="clock" size={14} color={colors.ink} /><Text style={[font, styles.pillText]}>{assessment.due}</Text></View>
        <View style={styles.pill}><Text style={[font, styles.pillText]}>{assessment.attempts}</Text></View>
      </View>
      <Text style={[font, styles.body]}>{assessment.instructions}</Text>

      <Text style={[font, styles.section]}>Your submission</Text>
      {file ? <View style={[styles.file, tooBig && styles.fileFailed]}>
        <View style={styles.fileRow}>
          <View style={styles.fileIcon}><Icon name="file" size={20} color={tooBig ? colors.danger : colors.blue700} /></View>
          <View style={styles.fileCopy}>
            <Text style={[font, styles.fileName]} numberOfLines={1}>{file.name}</Text>
            <Text style={[font, styles.fileSize]}>{sizeLabel(file.mb)}</Text>
          </View>
          <Pressable onPress={remove} hitSlop={12} accessibilityRole="button" accessibilityLabel="Remove file"><Icon name="close" size={18} color={colors.muted} /></Pressable>
        </View>
        {tooBig && <View style={styles.fileError} accessibilityRole="alert"><Icon name="alert" size={16} color={colors.danger} /><Text style={[font, styles.fileErrorText]}>Upload failed. The file is over the {MAX_MB} MB limit.</Text></View>}
      </View> : <Pressable onPress={pick} style={({pressed}) => [styles.drop, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Upload your file">
        <View style={styles.dropIcon}><Icon name="upload" size={24} color={colors.blue700} /></View>
        <Text style={[font, styles.dropTitle]}>Tap to upload a file</Text>
        <Text style={[font, styles.dropHint]}>{assessment.formats}</Text>
      </Pressable>}

      {tooBig && <>
        <Text style={[font, styles.tryTitle]}>Try this</Text>
        {tips.map(tip => <View key={tip} style={styles.tip}><View style={styles.bullet} /><Text style={[font, styles.tipText]}>{tip}</Text></View>)}
        <View style={styles.smaller}><PrimaryAction label="Choose a smaller file" outline onPress={pick} /></View>
      </>}

      <Text style={[font, styles.label]}>Note to instructor (optional)</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="Add a note" placeholderTextColor={colors.muted} multiline style={[font, styles.note]} />

      <PrimaryAction label="Submit assignment" disabled={!file || tooBig} onPress={submit} />
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  title: {fontSize: type.title, color: colors.ink, fontFamily: fonts.display},
  meta: {flexDirection: 'row', gap: 8, marginTop: 12},
  pill: {flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.star, opacity: 0.9},
  pillText: {fontSize: type.caption, color: colors.ink, fontFamily: fonts.bold},
  body: {fontSize: type.label, color: colors.ink, lineHeight: 22, marginTop: 14},
  section: {fontSize: type.subheading, color: colors.ink, fontFamily: fonts.display, marginTop: 24, marginBottom: 12},
  drop: {alignItems: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.blue600, borderRadius: radius.card, backgroundColor: colors.white, paddingVertical: 28, paddingHorizontal: 16, gap: 8},
  dropIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  dropTitle: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  dropHint: {fontSize: type.caption, color: colors.muted, textAlign: 'center'},
  pressed: {opacity: 0.85},
  file: {borderWidth: 1, borderColor: colors.sandLine, borderRadius: radius.card, backgroundColor: colors.white, padding: 14},
  fileFailed: {borderColor: colors.danger, backgroundColor: colors.dangerSoft},
  fileRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  fileIcon: {width: 40, height: 40, borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, alignItems: 'center', justifyContent: 'center'},
  fileCopy: {flex: 1},
  fileName: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  fileSize: {fontSize: type.caption, color: colors.muted, marginTop: 2},
  fileError: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12},
  fileErrorText: {flex: 1, fontSize: type.caption, color: colors.danger, fontFamily: fonts.semibold},
  tryTitle: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold, marginTop: 20, marginBottom: 8},
  tip: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6},
  bullet: {width: 5, height: 5, borderRadius: 3, backgroundColor: colors.ink},
  tipText: {flex: 1, fontSize: type.small, color: colors.ink},
  smaller: {marginTop: 14},
  label: {fontSize: type.small, color: colors.ink, fontFamily: fonts.bold, marginTop: 22, marginBottom: 8},
  note: {minHeight: 56, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 14, fontSize: type.body, color: colors.ink, textAlignVertical: 'top'},
});
