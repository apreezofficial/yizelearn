import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, fonts} from '../theme/tokens';
import {RoundButton} from './Catalog';

const font = {fontFamily: fonts.family};

/** Back chevron with a centred title, as on the Cart and Checkout designs. */
export function TitleBar({title, onBack}: {title: string; onBack?: () => void}) {
  return <View style={styles.bar}>{onBack ? <RoundButton icon="back" onPress={onBack} style={styles.plain} /> : <View style={styles.spacer} />}<Text style={[styles.title, font]}>{title}</Text><View style={styles.spacer} /></View>;
}

/** Full-width action pinned to the bottom of a screen. */
export function BottomButton({label, onPress, disabled, busy}: {label: string; onPress: () => void; disabled?: boolean; busy?: boolean}) {
  return <View style={styles.bottom}><Pressable onPress={onPress} disabled={disabled || busy} style={({pressed}) => [styles.button, (disabled || pressed) && styles.dim]} accessibilityState={{disabled: disabled || busy, busy}}>{busy ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.buttonText, font]}>{label}</Text>}</Pressable></View>;
}

export function PrimaryAction({label, onPress, outline}: {label: string; onPress?: () => void; outline?: boolean}) {
  return <Pressable onPress={onPress} style={({pressed}) => [styles.action, outline && styles.outline, pressed && styles.dim]}><Text style={[styles.buttonText, font, outline && styles.outlineText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  bar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 8, paddingBottom: 4},
  plain: {backgroundColor: 'transparent'},
  spacer: {width: 40},
  title: {fontSize: 17, color: colors.ink, fontWeight: '800'},
  bottom: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: '#F7F6FA', borderTopWidth: 1, borderTopColor: colors.line},
  button: {height: 52, borderRadius: 10, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center'},
  dim: {opacity: 0.6},
  buttonText: {fontSize: 15, color: colors.white, fontWeight: '700'},
  action: {height: 52, borderRadius: 10, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center', marginTop: 12},
  outline: {backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sandLine},
  outlineText: {color: colors.ink},
});
