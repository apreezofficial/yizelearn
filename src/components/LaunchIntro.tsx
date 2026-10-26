import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const BLUE = '#74A7E3';
const WORDMARK_WIDTH = 240;

/** A connected signature reveal, soft pulse, then a curved curtain exit. */
export function LaunchIntro({children}: {children: React.ReactNode}) {
  const {height, width} = useWindowDimensions();
  const [visible, setVisible] = useState(true);
  const reveal = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const curve = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    let completed = false;
    let animation: Animated.CompositeAnimation | undefined;
    const finish = () => {
      if (!mounted || completed) {return;}
      completed = true;
      animation?.stop();
      entrance.setValue(1);
      setVisible(false);
    };
    // A failed animation must never block access to the app.
    const failsafe = setTimeout(finish, 5500);
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', reduced => {
      if (reduced) {finish();}
    });
    const start = (reduced: boolean) => {
      if (!mounted || completed) {return;}
      if (reduced) {
        finish();
        return;
      }
      animation = Animated.sequence([
        Animated.delay(180),
        // Reveal one connected word rather than separating its cursive letters.
        Animated.timing(reveal, {
          toValue: 1, duration: 1570, easing: Easing.out(Easing.quad), useNativeDriver: false,
        }),
        Animated.delay(100),
        Animated.sequence([
          Animated.timing(pulse, {toValue: 1.13, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
          Animated.timing(pulse, {toValue: 1, duration: 200, easing: Easing.inOut(Easing.cubic), useNativeDriver: true}),
        ]),
        Animated.parallel([
          Animated.timing(exit, {toValue: 1, duration: 850, easing: Easing.bezier(0.65, 0, 0.2, 1), useNativeDriver: true}),
          Animated.timing(curve, {toValue: 1, duration: 850, easing: Easing.bezier(0.65, 0, 0.2, 1), useNativeDriver: false}),
          Animated.timing(entrance, {toValue: 1, duration: 850, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true}),
        ]),
      ]);
      animation.start(({finished}) => {if (finished) {finish();}});
    };
    AccessibilityInfo.isReduceMotionEnabled().then(start, () => start(false));
    return () => {
      mounted = false;
      clearTimeout(failsafe);
      preference.remove();
      animation?.stop();
    };
  }, [reveal, pulse, exit, curve, entrance]);

  return (
    <View style={styles.root}>
      <Animated.View
        style={[styles.content, visible && {
          opacity: entrance.interpolate({inputRange: [0, 1], outputRange: [0.6, 1]}),
          transform: [
            {translateY: entrance.interpolate({inputRange: [0, 1], outputRange: [36, 0]})},
            {scale: entrance.interpolate({inputRange: [0, 1], outputRange: [0.985, 1]})},
          ],
        }]}
        pointerEvents={visible ? 'none' : 'auto'}
        accessibilityElementsHidden={visible}
        importantForAccessibility={visible ? 'no-hide-descendants' : 'auto'}>
        {children}
      </Animated.View>
      {visible && (
        <Animated.View
          accessibilityLabel="jizelearn is opening"
          accessibilityRole="text"
          style={[styles.curtain, {
            transform: [{translateY: exit.interpolate({inputRange: [0, 1], outputRange: [0, -height * 1.12]})}],
            borderBottomLeftRadius: curve.interpolate({inputRange: [0, 0.45, 1], outputRange: [0, width * 0.5, width * 0.35]}),
            borderBottomRightRadius: curve.interpolate({inputRange: [0, 0.45, 1], outputRange: [0, width * 0.12, width * 0.35]}),
          }]}>
          <StatusBar barStyle="light-content" />
          <Animated.View style={[styles.signature, {transform: [{scale: pulse}]}]} accessible={false}>
            <Animated.View style={[styles.reveal, {width: reveal.interpolate({inputRange: [0, 1], outputRange: [0, WORDMARK_WIDTH]})}]}>
              <Text allowFontScaling={false} style={styles.wordmark}>jizelearn</Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: BLUE},
  content: {flex: 1},
  curtain: {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 100},
  signature: {width: WORDMARK_WIDTH, height: 100},
  reveal: {height: 100, overflow: 'hidden'},
  wordmark: {width: WORDMARK_WIDTH, height: 100, textAlign: 'center', color: '#FFFFFF', fontFamily: 'Allura-Regular', fontSize: 60, lineHeight: 90, includeFontPadding: false},
});
