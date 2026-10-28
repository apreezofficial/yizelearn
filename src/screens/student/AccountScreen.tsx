import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon, type IconName} from '../../components/Icon';
import {learnerName} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

type Props = {onGrades: () => void; onCertificates: () => void; onNotifications: () => void; onLogout: () => void};

export function AccountScreen({onGrades, onCertificates, onNotifications, onLogout}: Props) {
  const rows: {label: string; icon: IconName; onPress: () => void}[] = [
    {label: 'Grades', icon: 'award', onPress: onGrades},
    {label: 'Certificates', icon: 'medal', onPress: onCertificates},
    {label: 'Notifications', icon: 'bell', onPress: onNotifications},
  ];
  return <View style={styles.screen}>
    <Text style={[styles.title, font]}>Account</Text>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={[styles.avatarText, font]}>{learnerName.slice(0, 1)}</Text></View>
        <Text style={[styles.name, font]}>{learnerName} Nwachukwu</Text>
      </View>
      {rows.map(row => <Pressable key={row.label} onPress={row.onPress} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
        <Icon name={row.icon} size={22} color={colors.blue700} />
        <Text style={[styles.rowText, font]}>{row.label}</Text>
        <Icon name="next" size={18} color={colors.muted} />
      </Pressable>)}
      <Pressable onPress={onLogout} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
        <Icon name="logout" size={22} color={colors.danger} />
        <Text style={[styles.rowText, font, styles.danger]}>Log out</Text>
      </Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream, paddingTop: 12},
  title: {fontSize: type.display, color: colors.ink, fontWeight: '800', paddingHorizontal: spacing.screen, marginBottom: 16},
  content: {paddingHorizontal: spacing.screen, paddingBottom: 28},
  profile: {alignItems: 'center', gap: 10, paddingVertical: 20},
  avatar: {width: 72, height: 72, borderRadius: 36, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  avatarText: {fontSize: type.heading, color: colors.blue900, fontWeight: '800'},
  name: {fontSize: type.subheading, color: colors.ink, fontWeight: '800'},
  row: {flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 60, paddingHorizontal: 16, borderRadius: radius.card, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine, marginBottom: 10},
  rowText: {flex: 1, fontSize: type.label, color: colors.ink, fontWeight: '700'},
  danger: {color: colors.danger},
  pressed: {opacity: 0.8},
});
