import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, fonts, radius, spacing, type} from '../theme/tokens';
import {Icon} from './Icon';
import {Sheet} from './Sheet';

const font = {fontFamily: fonts.family};

/** Confirms logging out: an icon that nudges toward the door, a reassurance that progress is kept, and two clear choices. */
export function LogoutSheet({visible, name, onCancel, onConfirm}: {visible: boolean; name: string; onCancel: () => void; onConfirm: () => void}) {
  const nudge = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    nudge.setValue(0);
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(nudge, {toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
      Animated.timing(nudge, {toValue: 0, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
      Animated.delay(700),
    ]));
    loop.start();
    return () => loop.stop();
  }, [visible, nudge]);

  return <Sheet visible={visible} onClose={onCancel}>
    <View style={styles.body}>
      <View style={styles.art}>
        <View style={styles.outer}><View style={styles.inner}>
          <Animated.View style={{transform: [{translateX: nudge.interpolate({inputRange: [0, 1], outputRange: [0, 5]})}]}}>
            <Icon name="logout" size={30} color={colors.danger} />
          </Animated.View>
        </View></View>
        <View style={styles.dotGold} />
        <View style={styles.dotBlue} />
      </View>
      <Text style={[styles.title, font]}>Log out, {name}?</Text>
      <Text style={[styles.message, font]}>Your courses and progress are saved. You’ll need a new code to log back in.</Text>
      <Pressable onPress={onConfirm} style={({pressed}) => [styles.confirm, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.confirmText, font]}>Log out</Text>
      </Pressable>
      <Pressable onPress={onCancel} style={({pressed}) => [styles.cancel, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={[styles.cancelText, font]}>Stay logged in</Text>
      </Pressable>
    </View>
  </Sheet>;
}

const styles = StyleSheet.create({
  body: {alignItems: 'center', paddingTop: 12, paddingBottom: 4},
  art: {width: 130, height: 116, alignItems: 'center', justifyContent: 'center', marginBottom: 14},
  outer: {width: 104, height: 104, borderRadius: 52, backgroundColor: '#FBE6E6', alignItems: 'center', justifyContent: 'center'},
  inner: {width: 70, height: 70, borderRadius: 35, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  dotGold: {position: 'absolute', top: 6, right: 14, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.marigold},
  dotBlue: {position: 'absolute', bottom: 14, left: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blue700},
  title: {fontSize: type.heading + 2, color: colors.ink, fontWeight: '800', textAlign: 'center'},
  message: {fontSize: type.label, color: colors.muted, textAlign: 'center', lineHeight: 22, marginTop: 8, marginBottom: 24, paddingHorizontal: 12},
  confirm: {alignSelf: 'stretch', height: spacing.button, borderRadius: radius.button, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  confirmText: {fontSize: type.subheading, color: colors.white, fontWeight: '700'},
  cancel: {alignSelf: 'stretch', height: spacing.button, borderRadius: radius.button, borderWidth: 1, borderColor: colors.sandLine, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 10},
  cancelText: {fontSize: type.subheading, color: colors.ink, fontWeight: '700'},
  pressed: {opacity: 0.8},
});
