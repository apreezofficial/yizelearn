import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {ChalkCard, ProgressBar} from '../../components/Chalkboard';
import {TitleBar} from '../../components/Layout';
import {Rise} from '../../components/Motion';
import {gradeCourse, gradeItems, gradeOverall} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

export function GradesScreen({onBack, onAssessment}: {onBack: () => void; onAssessment: () => void}) {
  return <View style={styles.screen}>
    <TitleBar title="Grades" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* A course picker is needed once learners have more than one course with grades. */}
      <View style={styles.picker}>
        <Text style={[styles.pickerText, font]} numberOfLines={1}>{gradeCourse}</Text>
        <Icon name="down" size={18} color={colors.ink} />
      </View>

      <Rise delay={80}><ChalkCard style={styles.overall}>
        <Text style={[styles.overallLabel, font]}>Overall grade</Text>
        <Text style={[styles.overallValue, font]}>{gradeOverall}%</Text>
        <ProgressBar value={gradeOverall} track="rgba(254, 249, 242, 0.25)" fill={colors.sky} height={8} />
      </ChalkCard></Rise>

      <Rise delay={160}><Text style={[styles.section, font]}>Breakdown</Text></Rise>
      {gradeItems.map((item, i) => {
        const pending = item.score === 'Pending';
        const row = <>
          <View style={styles.copy}>
            <Text style={[styles.rowTitle, font]}>{item.title}</Text>
            <Text style={[styles.rowKind, font]}>{item.kind}</Text>
          </View>
          <Text style={[styles.score, font, pending && styles.scorePending]}>{item.score}</Text>
          {item.kind === 'Assignment' && <Icon name="next" size={18} color={colors.muted} />}
        </>;
        return <Rise key={item.id} delay={220 + i * 70}>{item.kind === 'Assignment'
          ? <Pressable key={item.id} onPress={onAssessment} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">{row}</Pressable>
          : <View key={item.id} style={styles.row}>{row}</View>}</Rise>;
      })}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  picker: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, marginBottom: 16},
  pickerText: {flex: 1, fontSize: type.label, color: colors.ink, fontWeight: '700', marginRight: 8},
  overall: {marginBottom: 6},
  overallLabel: {fontSize: type.small, color: colors.chalkText, opacity: 0.85},
  overallValue: {fontSize: 52, color: colors.chalkText, fontWeight: '800', marginVertical: 6, marginBottom: 14},
  section: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 22, marginBottom: 8},
  row: {flexDirection: 'row', alignItems: 'center', minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 12},
  pressed: {opacity: 0.7},
  copy: {flex: 1},
  rowTitle: {fontSize: type.label, color: colors.ink, fontWeight: '700'},
  rowKind: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  score: {fontSize: type.label, color: colors.ink, fontWeight: '800'},
  scorePending: {color: colors.muted},
});
