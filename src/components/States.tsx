import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon, type IconName} from './Icon';
import {colors, fonts} from '../theme/tokens';

const font = {fontFamily: fonts.family};

// Illustrations from the Figma, keyed by the icon they show.
const art: Partial<Record<IconName, number>> = {
  search: require('../assets/empty/search.png'),
  cart: require('../assets/empty/cart.png'),
  heart: require('../assets/empty/heart.png'),
  book: require('../assets/empty/course.png'),
  message: require('../assets/empty/message.png'),
};

type Props = {title: string; message: string; icon?: IconName; actionLabel?: string; onAction?: () => void; secondaryLabel?: string; onSecondary?: () => void};

/** The illustrated empty state from the Figma: an icon in two soft rings with orbiting dots, a title, a line of help and a sky button. */
export function EmptyState({title, message, icon = 'book', actionLabel, onAction, secondaryLabel, onSecondary}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(enter, {toValue: 1, friction: 6, tension: 60, useNativeDriver: true}).start();
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(float, {toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(float, {toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ]));
    loop.start();
    return () => loop.stop();
  }, [enter, float]);
  const drift = (px: number) => ({transform: [{translateY: float.interpolate({inputRange: [0, 1], outputRange: [0, px]})}]});
  const fade = {opacity: enter, transform: [{translateY: enter.interpolate({inputRange: [0, 1], outputRange: [12, 0]})}]};
  return <View style={styles.state}>
    <Animated.View style={[styles.art, {opacity: enter, transform: [{scale: enter.interpolate({inputRange: [0, 1], outputRange: [0.6, 1]})}]}]}>
      {art[icon] ? <Animated.Image source={art[icon]} style={[styles.picture, drift(-6)]} resizeMode="contain" accessibilityIgnoresInvertColors /> : <>
        <View style={styles.outer}><View style={styles.inner}><Icon name={icon} size={30} color={colors.blue700} /></View></View>
        <Animated.View style={[styles.dotGold, drift(-5)]} />
        <Animated.View style={[styles.dotBlue, drift(4)]} />
        <Animated.View style={[styles.dotSky, drift(-3)]} />
        <Animated.View style={[styles.ring, drift(5)]} />
      </>}
    </Animated.View>
    <Animated.View style={[styles.copy, fade]}>
      <Text style={[styles.title, font]}>{title}</Text>
      <Text style={[styles.message, font]}>{message}</Text>
      {actionLabel && <Pressable onPress={onAction} style={({pressed}) => [styles.button, pressed && styles.pressed]} accessibilityRole="button"><Text style={[styles.buttonText, font]}>{actionLabel}</Text></Pressable>}
      {secondaryLabel && <Pressable onPress={onSecondary} hitSlop={10} style={styles.secondary} accessibilityRole="button"><Text style={[styles.secondaryText, font]}>{secondaryLabel}</Text></Pressable>}
    </Animated.View>
  </View>;
}
export function ErrorState(props: Props) { return <EmptyState {...props} title={props.title || 'Something went wrong'} actionLabel={props.actionLabel || 'Try again'} />; }
export function LoadingState() { return <View style={styles.state}><View style={styles.spinner}><Text style={styles.markText}>...</Text></View><Text style={styles.message}>Loading</Text></View>; }

const styles = StyleSheet.create({
  state: {flex: 1, minHeight: 360, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40},
  picture: {width: 210, height: 210, marginVertical: -24, mixBlendMode: 'multiply'},
  art: {minWidth: 150, minHeight: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 22},
  outer: {width: 116, height: 116, borderRadius: 58, backgroundColor: colors.blue50, alignItems: 'center', justifyContent: 'center'},
  inner: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center'},
  dotGold: {position: 'absolute', top: 6, right: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.marigold},
  dotBlue: {position: 'absolute', top: 4, left: 22, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.blue700},
  dotSky: {position: 'absolute', bottom: 30, left: 6, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.sky},
  ring: {position: 'absolute', bottom: 22, right: 4, width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.blue700},
  copy: {alignItems: 'center', alignSelf: 'stretch'},
  spinner: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center', marginBottom: 16},
  markText: {fontSize: 22, color: colors.blue700, fontWeight: '800'},
  title: {fontSize: 20, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  message: {fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 21, maxWidth: 300},
  button: {height: 48, alignSelf: 'stretch', marginHorizontal: 24, backgroundColor: colors.sky, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 24},
  buttonText: {fontSize: 15, color: colors.white, fontWeight: '700'},
  pressed: {opacity: 0.8},
  secondary: {marginTop: 14},
  secondaryText: {fontSize: 14, color: colors.blue700, fontWeight: '700'},
});
