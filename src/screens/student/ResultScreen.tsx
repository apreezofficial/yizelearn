import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChalkCard} from '../../components/Chalkboard';
import {PrimaryAction, TitleBar} from '../../components/Layout';
import {quizResult} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

type Props = {onBack: () => void; onContinue: () => void; onReview: () => void};
const font = {fontFamily: fonts.family};

export function ResultScreen({onBack, onContinue, onReview}: Props) {
  return <View style={styles.screen}>
    <TitleBar title="Result" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ChalkCard style={styles.hero}>
        <Text style={[font, styles.passed]}>You passed</Text>
        <View style={styles.scoreRing}><Text style={[font, styles.score]}>{quizResult.score}%</Text></View>
        <Text style={[font, styles.correct]}>{quizResult.correct} of {quizResult.total} correct</Text>
        <Text style={[font, styles.unlock]}>{quizResult.unlocked} is unlocked</Text>
      </ChalkCard>

      <View style={styles.missed}>
        <Text style={[font, styles.missedTitle]}>Missed questions</Text>
        {quizResult.missed.map(m => <View key={m.number} style={styles.missedRow}>
          <View style={styles.badge}><Text style={[font, styles.badgeText]}>Q{m.number}</Text></View>
          <Text style={[font, styles.topic]}>{m.topic}</Text>
        </View>)}
        <Text style={[font, styles.hint]}>Review these before you continue. Your score is kept either way.</Text>
      </View>

      <PrimaryAction label={`Continue to ${quizResult.unlocked}`} onPress={onContinue} />
      <PrimaryAction label="Review answers" outline onPress={onReview} />
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  hero: {alignItems: 'center', paddingVertical: 28},
  passed: {fontSize: type.title, color: colors.chalkText, fontFamily: fonts.bold, marginBottom: 16},
  scoreRing: {width: 170, height: 170, borderRadius: 85, borderWidth: 5, borderColor: colors.sky, alignItems: 'center', justifyContent: 'center', marginBottom: 16},
  score: {fontSize: 56, color: colors.chalkText, fontFamily: fonts.bold},
  correct: {fontSize: type.label, color: colors.chalkText, fontFamily: fonts.bold},
  unlock: {fontSize: type.small, color: colors.chalkText, opacity: 0.85, marginTop: 6},
  missed: {backgroundColor: colors.sand, borderRadius: radius.card, padding: 18, marginTop: 18, marginBottom: 6},
  missedTitle: {fontSize: type.subheading, color: colors.ink, fontFamily: fonts.bold, marginBottom: 12},
  missedRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10},
  badge: {minWidth: 44, height: 30, borderRadius: 15, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8},
  badgeText: {fontSize: type.caption, color: colors.ink, fontFamily: fonts.bold},
  topic: {fontSize: type.label, color: colors.ink, fontFamily: fonts.semibold},
  hint: {fontSize: type.caption, color: colors.muted, marginTop: 6, lineHeight: 18},
});
