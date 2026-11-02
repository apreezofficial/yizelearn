import React, {useEffect, useRef} from 'react';
import {Animated, Easing, type StyleProp, type ViewStyle} from 'react-native';
import {useReduceMotion} from '../theme/system';

/** Fades and lifts its content in after `delay` ms. With Reduce Motion on, it simply appears. */
export function Rise({children, delay = 0, style}: {children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle>}) {
  const still = useReduceMotion();
  const t = useRef(new Animated.Value(still ? 1 : 0)).current;
  useEffect(() => {
    if (still) { t.setValue(1); return; }
    Animated.timing(t, {toValue: 1, duration: 520, delay, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true}).start();
  }, [delay, still, t]);
  return <Animated.View style={[style, {opacity: t, transform: [{translateY: t.interpolate({inputRange: [0, 1], outputRange: [16, 0]})}]}]}>{children}</Animated.View>;
}
