import React from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {PrimaryAction, TitleBar} from '../../components/Layout';
import {Rise} from '../../components/Motion';
import {badges, certificate} from '../../data/learning';
import {learnerName} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};
// Certificate PDFs come from the payments/courses API, which isn't connected yet.
const notConnected = (what: string) => Alert.alert(what, `${what} is not connected yet.`);

export function CertificatesScreen({onBack}: {onBack: () => void}) {
  return <View style={styles.screen}>
    <TitleBar title="Certificates" onBack={onBack} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Rise style={styles.certificate}>
        <Text style={[styles.kicker, font]}>{certificate.title}</Text>
        <Text style={[styles.name, font]}>{learnerName} Nwachukwu</Text>
        <Text style={[styles.course, font]}>has completed {certificate.course}</Text>
        <View style={styles.seal}><Icon name="award" size={26} color={colors.onSky} /></View>
      </Rise>

      <Rise delay={100} style={styles.actions}>
        <View style={styles.half}><PrimaryAction label="Share" outline onPress={() => notConnected('Sharing')} /></View>
        <View style={styles.half}><PrimaryAction label="Download PDF" onPress={() => notConnected('Download')} /></View>
      </Rise>

      <Rise delay={180}><Text style={[styles.section, font]}>Badges</Text></Rise>
      <Rise delay={240} style={styles.grid}>
        {badges.map(badge => <View key={badge.label} style={styles.badge} accessibilityLabel={`${badge.label}, ${badge.earned ? 'earned' : 'locked'}`}>
          <View style={[styles.badgeIcon, badge.earned ? styles.badgeEarned : styles.badgeLocked]}>
            <Icon name={badge.icon as IconName} size={24} color={badge.earned ? colors.blue700 : colors.muted} />
          </View>
          <Text style={[styles.badgeLabel, font, !badge.earned && styles.muted]}>{badge.label}</Text>
        </View>)}
      </Rise>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream},
  content: {padding: spacing.screen, paddingBottom: 28},
  certificate: {borderWidth: 1.5, borderColor: colors.sandLine, borderRadius: radius.card, backgroundColor: colors.white, padding: 24, alignItems: 'center'},
  kicker: {fontSize: type.small, color: colors.muted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase'},
  name: {fontSize: type.title + 4, color: colors.ink, fontWeight: '800', marginTop: 14, textAlign: 'center'},
  course: {fontSize: type.label, color: colors.ink, marginTop: 8, textAlign: 'center', lineHeight: 22},
  seal: {width: 56, height: 56, borderRadius: 28, backgroundColor: colors.marigold, alignItems: 'center', justifyContent: 'center', marginTop: 18},
  actions: {flexDirection: 'row', gap: 12, marginTop: 16},
  half: {flex: 1},
  section: {fontSize: type.subheading, color: colors.ink, fontWeight: '800', marginTop: 26, marginBottom: 12},
  grid: {flexDirection: 'row', flexWrap: 'wrap', rowGap: 18},
  badge: {width: '33.33%', alignItems: 'center', gap: 8},
  badgeIcon: {width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center'},
  badgeEarned: {backgroundColor: colors.blue100},
  badgeLocked: {backgroundColor: colors.sand},
  badgeLabel: {fontSize: type.caption, color: colors.ink, fontWeight: '700', textAlign: 'center'},
  muted: {color: colors.muted},
});
