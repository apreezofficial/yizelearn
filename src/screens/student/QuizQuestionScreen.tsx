import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChalkCard} from '../../components/Chalkboard';
import {PrimaryAction, TitleBar} from '../../components/Layout';
import {quiz} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

type Props = {onBack: () => void; onNext: () => void};
const font = {fontFamily: fonts.family};

export function QuizQuestionScreen({onBack, onNext}: Props) {
  const [selected, setSelected] = useState<string>();
  return <View style={styles.screen}>
    <TitleBar title={quiz.title} onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ChalkCard>
        <Text style={[styles.count, font]}>Question {quiz.current} of {quiz.total}</Text>
        <View style={styles.dots} accessibilityLabel={`${quiz.answeredCount} of ${quiz.total} answered`}>
          {Array.from({length: quiz.total}, (_, i) => {
            const state = i < quiz.answeredCount ? 'answered' : i === quiz.current - 1 ? 'current' : 'open';
            return <View key={i} style={[styles.dot, state === 'answered' && styles.dotAnswered, state === 'current' && styles.dotCurrent]} />;
          })}
        </View>
        <Text style={[styles.question, font]}>{quiz.question}</Text>
      </ChalkCard>

      <View style={styles.options}>
        {quiz.options.map(option => {
          const on = selected === option;
          return <Pressable key={option} onPress={() => setSelected(option)} style={[styles.option, on && styles.optionOn]} accessibilityRole="radio" accessibilityState={{selected: on}}>
            <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioDot} />}</View>
            <Text style={[styles.optionText, font, on && styles.optionTextOn]}>{option}</Text>
          </Pressable>;
        })}
      </View>

      <PrimaryAction label="Next question" onPress={onNext} />
      <Pressable onPress={onBack} style={styles.exit} accessibilityRole="button"><Text style={[styles.exitText, font]}>Save and exit</Text></Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  count: {fontSize: type.small, color: colors.chalkText, fontWeight: '700', marginBottom: 12},
  dots: {flexDirection: 'row', gap: 6, marginBottom: 18},
  dot: {flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(254, 249, 242, 0.25)'},
  dotAnswered: {backgroundColor: colors.sky},
  dotCurrent: {backgroundColor: colors.chalkText},
  question: {fontSize: type.title, lineHeight: 32, color: colors.chalkText, fontWeight: '700'},
  options: {gap: 12, marginTop: 22},
  option: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: spacing.target + 8, borderRadius: radius.card, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, paddingHorizontal: 16},
  optionOn: {borderColor: colors.blue700, borderWidth: 2, backgroundColor: colors.blue50},
  radio: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center'},
  radioOn: {borderColor: colors.blue700},
  radioDot: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.blue700},
  optionText: {fontSize: type.body, color: colors.ink, fontWeight: '600'},
  optionTextOn: {fontWeight: '800'},
  exit: {alignSelf: 'center', padding: 12, marginTop: 6},
  exitText: {fontSize: type.label, color: colors.blue700, fontWeight: '700'},
});
