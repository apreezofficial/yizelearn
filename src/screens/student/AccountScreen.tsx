import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components/Icon';
import {learnerName} from '../../data/learning';
import {colors, fonts, radius, spacing, type} from '../../theme/tokens';

const font = {fontFamily: fonts.family};

type Props = {
  onGrades: () => void;
  onCertificates: () => void;
  onNotifications: () => void;
  onHelp: () => void;
  onSoon: (title: string) => void;
  onLogout: () => void;
};

export function AccountScreen({onGrades, onCertificates, onNotifications, onHelp, onSoon, onLogout}: Props) {
  const initials = `${learnerName.slice(0, 1)}N`;
  // Grades and certificates are shown in the design's list order; the rest open sections not built yet.
  const rows: {label: string; onPress: () => void}[] = [
    {label: 'Profile', onPress: () => onSoon('Profile')},
    {label: 'Payments and receipts', onPress: () => onSoon('Payments and receipts')},
    {label: 'Notifications', onPress: onNotifications},
    {label: 'Grades', onPress: onGrades},
    {label: 'Certificates', onPress: onCertificates},
    {label: 'Privacy and data', onPress: () => onSoon('Privacy and data')},
    {label: 'Connected accounts', onPress: () => onSoon('Connected accounts')},
    {label: 'Help centre', onPress: onHelp},
  ];
  return <View style={styles.screen}>
    <Text style={[styles.title, font]}>Account</Text>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={[styles.avatarText, font]}>{initials}</Text></View>
        <View style={styles.profileCopy}>
          <Text style={[styles.name, font]}>{learnerName} Nwachukwu</Text>
          <Text style={[styles.role, font]}>Learner</Text>
        </View>
        <Pressable onPress={() => onSoon('Edit profile')} style={({pressed}) => [styles.edit, pressed && styles.pressed]} accessibilityRole="button">
          <Text style={[styles.editText, font]}>Edit</Text>
        </Pressable>
      </View>

      {rows.map(row => <Pressable key={row.label} onPress={row.onPress} style={({pressed}) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.rowText, font]}>{row.label}</Text>
        <Icon name="next" size={18} color={colors.muted} />
      </Pressable>)}

      <Pressable onPress={onLogout} style={({pressed}) => [styles.logout, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.logoutText, font]}>Log out</Text>
      </Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.cream, paddingTop: 12},
  title: {fontSize: type.display, color: colors.ink, fontWeight: '800', paddingHorizontal: spacing.screen, marginBottom: 12},
  content: {paddingHorizontal: spacing.screen, paddingBottom: 28},
  profile: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, marginBottom: 6},
  avatar: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center'},
  avatarText: {fontSize: type.subheading, color: colors.blue900, fontWeight: '800'},
  profileCopy: {flex: 1},
  name: {fontSize: type.subheading, color: colors.ink, fontWeight: '800'},
  role: {fontSize: type.small, color: colors.muted, marginTop: 3},
  edit: {height: 40, paddingHorizontal: 20, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.blue700, justifyContent: 'center'},
  editText: {fontSize: type.small, color: colors.blue700, fontWeight: '700'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.line},
  rowText: {fontSize: type.label, color: colors.ink, fontWeight: '600'},
  logout: {alignSelf: 'center', paddingVertical: 16, marginTop: 14},
  logoutText: {fontSize: type.label, color: colors.danger, fontWeight: '700'},
  pressed: {opacity: 0.7},
});
