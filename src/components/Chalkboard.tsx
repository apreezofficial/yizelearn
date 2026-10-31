import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {colors, radius} from '../theme/tokens';

/** The dark chalkboard panel used for highlights, such as the continue card and "On the board". */
export function ChalkCard({children, style}: {children: React.ReactNode; style?: ViewStyle}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ProgressBar({value, track = colors.sandLine, fill = colors.sky, height = 6}: {value: number; track?: string; fill?: string; height?: number}) {
  const clamped = Math.max(0, Math.min(100, value));
  return <View style={[styles.track, {height, backgroundColor: track, borderRadius: height / 2}]} accessibilityRole="progressbar" accessibilityValue={{min: 0, max: 100, now: clamped}}>
    <View style={{width: `${clamped}%`, height: '100%', backgroundColor: fill, borderRadius: height / 2}} />
  </View>;
}

const styles = StyleSheet.create({
  card: {backgroundColor: colors.chalk, borderRadius: radius.card + 6, padding: 18},
  track: {overflow: 'hidden', width: '100%'},
});
