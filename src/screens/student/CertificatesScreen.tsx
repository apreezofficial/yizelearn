import React from 'react';
import {ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {PrimaryAction, TitleBar} from '../../components/Layout';
import {CertificateTemplate} from '../../components/CertificateTemplate';
import {Rise} from '../../components/Motion';
import {EmptyState} from '../../components/States';
import {badges, certificate} from '../../data/learning';
import {learner} from '../../data/learning';
import {colors, fonts, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

export function CertificatesScreen({onBack, onLearn}: {onBack: () => void; onLearn: () => void}) {
  return <View style={styles.screen}>
    <TitleBar title="Certificates" onBack={onBack} />
    {!certificate ? <EmptyState icon="award" title="No certificates yet" message="Complete a course to earn your first one." actionLabel="Continue learning" onAction={onLearn} /> :
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Rise>
        <CertificateTemplate learnerName={learner.fullName} course={certificate.course} />
      </Rise>

      <Rise delay={100} style={styles.actions}>
        <View style={styles.full}><PrimaryAction label="Share" onPress={() => Share.share({message: `I completed ${certificate?.course} on yizelearn.`})} /></View>
      </Rise>

      <Rise delay={180}><Text style={[font, styles.section]}>Badges</Text></Rise>
      <Rise delay={240} style={styles.grid}>
        {badges.map(badge => <View key={badge.label} style={styles.badge} accessibilityLabel={`${badge.label}, ${badge.earned ? 'earned' : 'locked'}`}>
          <View style={[styles.badgeIcon, badge.earned ? styles.badgeEarned : styles.badgeLocked]}>
            <Icon name={badge.icon as IconName} size={24} color={badge.earned ? colors.blue700 : colors.muted} />
          </View>
          <Text style={[font, styles.badgeLabel, !badge.earned && styles.muted]}>{badge.label}</Text>
        </View>)}
      </Rise>
    </ScrollView>}
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  actions: {flexDirection: 'row', gap: 12, marginTop: 16},
  full: {flex: 1},
  half: {flex: 1},
  section: {fontSize: type.subheading, color: colors.ink, fontFamily: fonts.display, marginTop: 26, marginBottom: 12},
  grid: {flexDirection: 'row', flexWrap: 'wrap', rowGap: 18},
  badge: {width: '33.33%', alignItems: 'center', gap: 8},
  badgeIcon: {width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center'},
  badgeEarned: {backgroundColor: colors.blue100},
  badgeLocked: {backgroundColor: colors.sand},
  badgeLabel: {fontSize: type.caption, color: colors.ink, fontFamily: fonts.bold, textAlign: 'center'},
  muted: {color: colors.muted},
});
