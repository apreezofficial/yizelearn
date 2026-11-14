import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {ChalkCard, ProgressBar} from '../../components/Chalkboard';
import {TitleBar} from '../../components/Layout';
import {Rise} from '../../components/Motion';
import {EmptyState} from '../../components/States';
import {gradeCourse, gradeItems, gradeOverall} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

export function GradesScreen({onBack, onAssessment, onCourses}: {onBack: () => void; onAssessment: () => void; onCourses: () => void}) {
  return <View style={styles.screen}>
    <TitleBar title="Grades" onBack={onBack} />
    {gradeItems.length === 0 ? <EmptyState icon="chart" title="No grades yet" message={'Finish a quiz or assignment\nand your score will appear here.'} actionLabel="Go to my courses" onAction={onCourses} /> :
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* A course picker is needed once learners have more than one course with grades. */}
      <View style={styles.picker}>
        <Text style={[font, styles.pickerText]} numberOfLines={1}>{gradeCourse}</Text>
        <Icon name="down" size={18} color={colors.ink} />
      </View>

      <Rise delay={80}><ChalkCard style={styles.overall}>
        <Text style={[font, styles.overallLabel]}>Overall grade</Text>
        <Text style={[font, styles.overallValue]}>{gradeOverall}%</Text>
        <ProgressBar value={gradeOverall} track="rgba(254, 249, 242, 0.25)" fill={colors.sky} height={8} />
      </ChalkCard></Rise>

      <Rise delay={160}><Text style={[font, styles.section]}>Breakdown</Text></Rise>
      {gradeItems.map((item, i) => {
        const pending = item.score === 'Pending';
        const row = <>
          <View style={styles.copy}>
            <Text style={[font, styles.rowTitle]}>{item.title}</Text>
            <Text style={[font, styles.rowKind]}>{item.kind}</Text>
          </View>
          <Text style={[font, styles.score, pending && styles.scorePending]}>{item.score}</Text>
          {item.kind === 'Assignment' && <Icon name="next" size={18} color={colors.muted} />}
        </>;
        return <Rise key={item.id} delay={220 + i * 70}>{item.kind === 'Assignment'
          ? <Pressable key={item.id} onPress={onAssessment} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">{row}</Pressable>
          : <View key={item.id} style={styles.row}>{row}</View>}</Rise>;
      })}
    </ScrollView>}
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  picker: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52, borderRadius: radius.field, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16, marginBottom: 16},
  pickerText: {flex: 1, fontSize: type.label, color: colors.ink, fontFamily: fonts.bold, marginRight: 8},
  overall: {marginBottom: 6},
  overallLabel: {fontSize: type.small, color: colors.chalkText, opacity: 0.85},
  overallValue: {fontSize: 52, color: colors.chalkText, fontFamily: fonts.bold, marginVertical: 6, marginBottom: 14},
  section: {fontSize: type.subheading, color: colors.ink, fontFamily: fonts.display, marginTop: 22, marginBottom: 8},
  row: {flexDirection: 'row', alignItems: 'center', minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 12},
  pressed: {opacity: 0.7},
  copy: {flex: 1},
  rowTitle: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  rowKind: {fontSize: type.caption, color: colors.muted, marginTop: 3},
  score: {fontSize: type.label, color: colors.ink, fontFamily: fonts.bold},
  scorePending: {color: colors.muted},
});
