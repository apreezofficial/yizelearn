import React, {useEffect, useRef} from 'react';
import {AccessibilityInfo, Animated, Easing, StyleSheet} from 'react-native';
import {motion} from '../theme/tokens';

const outExpo = Easing.bezier(...motion.outExpo);

/**
 * Eases each new screen in with the launch intro's curve instead of swapping instantly.
 * Give it a `key` that changes per screen so it remounts and plays on every navigation.
 */
export function ScreenTransition({children, distance = 18}: {children: React.ReactNode; distance?: number}) {
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (reduced) { enter.setValue(1); return; }
      animation = Animated.timing(enter, {toValue: 1, duration: motion.base, easing: outExpo, useNativeDriver: true});
      animation.start();
    }, () => enter.setValue(1));
    return () => animation?.stop();
  }, [enter]);
  return <Animated.View style={[styles.fill, {
    opacity: enter.interpolate({inputRange: [0, 1], outputRange: [0, 1]}),
    transform: [{translateY: enter.interpolate({inputRange: [0, 1], outputRange: [distance, 0]})}, {scale: enter.interpolate({inputRange: [0, 1], outputRange: [0.985, 1]})}],
  }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({fill: {flex: 1}});
