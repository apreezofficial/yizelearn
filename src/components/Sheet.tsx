import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View, type ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../theme/tokens';

type Props = {visible: boolean; onClose: () => void; children: React.ReactNode; tall?: boolean; style?: ViewStyle};

/** Bottom sheet that slides up over a dimmed backdrop. Tapping the backdrop or Android's back button closes it. */
export function Sheet({visible, onClose, children, tall, style}: Props) {
  const insets = useSafeAreaInsets();
  const t = useRef(new Animated.Value(0)).current;
  // Stay mounted while the closing animation plays.
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) setMounted(true);
    Animated.timing(t, {toValue: visible ? 1 : 0, duration: visible ? 380 : 240, easing: visible ? Easing.bezier(0.16, 1, 0.3, 1) : Easing.in(Easing.quad), useNativeDriver: true})
      .start(({finished}) => { if (finished && !visible) setMounted(false); });
  }, [visible, t]);

  return <Modal visible={mounted} transparent statusBarTranslucent navigationBarTranslucent animationType="none" onRequestClose={onClose}>
    <Animated.View style={[styles.backdrop, {opacity: t}]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
    </Animated.View>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.anchor} pointerEvents="box-none">
      <Animated.View style={[styles.sheet, tall && {height: '92%'}, {paddingBottom: Math.max(insets.bottom, 16)},
        {transform: [{translateY: t.interpolate({inputRange: [0, 1], outputRange: [600, 0]})}]}, style]}>
        <View style={styles.grabber} />
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  </Modal>;
}

const styles = StyleSheet.create({
  backdrop: {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(23, 28, 38, 0.45)'},
  anchor: {flex: 1, justifyContent: 'flex-end'},
  sheet: {backgroundColor: colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10},
  grabber: {alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.sandLine, marginBottom: 8},
});
