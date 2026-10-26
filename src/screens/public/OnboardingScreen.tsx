import React, {useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Easing, Image, Pressable, StyleSheet, Text, useWindowDimensions, View, type ImageSourcePropType} from 'react-native';
import {colors, fonts, radius, type} from '../../theme/tokens';

type Slide = {key: string; title: string; body: string; image: ImageSourcePropType};
const slides: Slide[] = [
  {key: 'pace', title: 'Learn at your own pace', body: 'Get lifetime access to the courses you buy, anytime, any day.', image: require('../../assets/onboarding/learn.jpg')},
  {key: 'live', title: 'Take live courses', body: 'Join live classes with your instructor and learn together with others.', image: require('../../assets/onboarding/live.jpg')},
  {key: 'skills', title: 'Gain real-life skills', body: 'Practical lessons you can put to work straight away.', image: require('../../assets/onboarding/skills.jpg')},
];
const ART_RATIO = 1024 / 1536; // the illustrations' own aspect ratio

export function OnboardingScreen({onBrowse, onLogin}: {onBrowse: () => void; onLogin: () => void}) {
  const {width, height} = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const list = useRef<Animated.FlatList<Slide>>(null);
  const artWidth = Math.min(width - 40, 420);

  // A slow, continuous bob so the illustration feels alive without pulling focus.
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (reduced) return;
      loop = Animated.loop(Animated.sequence([
        Animated.timing(float, {toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: false}),
        Animated.timing(float, {toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: false}),
      ]));
      loop.start();
    }, () => undefined);
    return () => loop?.stop();
  }, [float]);

  const goTo = (i: number) => { setIndex(i); list.current?.scrollToOffset({offset: i * width, animated: true}); };
  const range = (i: number) => [(i - 1) * width, i * width, (i + 1) * width];

  return <View style={styles.screen}>
    {/* Soft brand circles that drift against the swipe for depth. */}
    <Animated.View pointerEvents="none" style={[styles.glow, styles.glowTop, {transform: [{translateX: scrollX.interpolate({inputRange: [0, width * 2], outputRange: [0, -60]})}]}]} />
    <Animated.View pointerEvents="none" style={[styles.glow, styles.glowBottom, {transform: [{translateX: scrollX.interpolate({inputRange: [0, width * 2], outputRange: [0, 50]})}]}]} />

    <Animated.FlatList ref={list} data={slides} horizontal pagingEnabled bounces={false} showsHorizontalScrollIndicator={false} keyExtractor={s => s.key}
      getItemLayout={(_, i) => ({length: width, offset: width * i, index: i})}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false})} scrollEventThrottle={16}
      onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      renderItem={({item, index: i}) => {
        const r = range(i);
        return <View style={[styles.slide, {width, paddingTop: height * 0.16}]}>
          {/* The illustrations have a white background, so they sit on a matching card. */}
          <Animated.View style={[styles.card, {width: artWidth, height: artWidth * ART_RATIO,
            opacity: scrollX.interpolate({inputRange: r, outputRange: [0, 1, 0], extrapolate: 'clamp'}),
            transform: [
              {translateX: scrollX.interpolate({inputRange: r, outputRange: [width * 0.45, 0, -width * 0.45], extrapolate: 'clamp'})},
              {translateY: float.interpolate({inputRange: [0, 1], outputRange: [0, -10]})},
              {scale: scrollX.interpolate({inputRange: r, outputRange: [0.82, 1, 0.82], extrapolate: 'clamp'})},
            ]}]}>
            <Image source={item.image} resizeMode="cover" accessibilityIgnoresInvertColors style={styles.art} />
          </Animated.View>
          <Animated.View style={[styles.copy, {
            opacity: scrollX.interpolate({inputRange: r, outputRange: [0, 1, 0], extrapolate: 'clamp'}),
            transform: [{translateX: scrollX.interpolate({inputRange: r, outputRange: [width * 0.25, 0, -width * 0.25], extrapolate: 'clamp'})}],
          }]}>
            <Text style={[styles.title, font]}>{item.title}</Text>
            <Text style={[styles.body, font]}>{item.body}</Text>
          </Animated.View>
        </View>;
      }} />

    <View style={styles.footer}>
      <View style={styles.dots}>{slides.map((s, i) => {
        const r = range(i);
        return <Pressable key={s.key} onPress={() => goTo(i)} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Slide ${i + 1} of ${slides.length}`} accessibilityState={{selected: i === index}}>
          <Animated.View style={[styles.dot, {
            width: scrollX.interpolate({inputRange: r, outputRange: [12, 32, 12], extrapolate: 'clamp'}),
            opacity: scrollX.interpolate({inputRange: r, outputRange: [0.45, 1, 0.45], extrapolate: 'clamp'}),
          }]} />
        </Pressable>;
      })}</View>
      <ActionBar onBrowse={onBrowse} onLogin={onLogin} />
    </View>
  </View>;
}

function ActionBar({onBrowse, onLogin}: {onBrowse: () => void; onLogin: () => void}) {
  return <View style={styles.bar}>
    <Pressable onPress={onBrowse} style={({pressed}) => [styles.action, pressed && styles.actionPressed]} accessibilityRole="button"><Text style={[styles.actionText, font]}>Browse</Text></Pressable>
    <View style={styles.divider} />
    <Pressable onPress={onLogin} style={({pressed}) => [styles.action, styles.actionEnd, pressed && styles.actionPressed]} accessibilityRole="button"><Text style={[styles.actionText, font]}>Log in</Text></Pressable>
  </View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.sky, overflow: 'hidden'},
  glow: {position: 'absolute', borderRadius: radius.pill, backgroundColor: 'rgba(255, 255, 255, 0.09)'},
  glowTop: {width: 280, height: 280, top: -90, right: -110},
  glowBottom: {width: 340, height: 340, bottom: 90, left: -190},
  slide: {flex: 1, alignItems: 'center'},
  card: {borderRadius: 28, backgroundColor: colors.white, overflow: 'hidden', elevation: 10, shadowColor: colors.blue900, shadowOpacity: 0.22, shadowRadius: 24, shadowOffset: {width: 0, height: 12}},
  art: {width: '100%', height: '100%'},
  copy: {alignItems: 'center', paddingHorizontal: 32, marginTop: 36},
  title: {fontSize: type.title, color: colors.heroText, fontWeight: '600', textAlign: 'center', marginBottom: 10},
  body: {fontSize: type.body, lineHeight: 23, color: colors.white, textAlign: 'center', maxWidth: 320, opacity: 0.95},
  footer: {paddingHorizontal: 20, paddingBottom: 24},
  dots: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 44},
  dot: {height: 12, borderRadius: 6, backgroundColor: colors.white},
  bar: {flexDirection: 'row', alignItems: 'center', height: 60, borderRadius: radius.button, backgroundColor: 'rgba(255, 255, 255, 0.28)', overflow: 'hidden'},
  action: {flex: 1, height: '100%', justifyContent: 'center', paddingHorizontal: 20},
  actionEnd: {alignItems: 'flex-end'},
  actionPressed: {backgroundColor: 'rgba(255, 255, 255, 0.18)'},
  actionText: {fontSize: type.subheading + 2, color: colors.white, fontWeight: '500'},
  divider: {width: 1, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.4)'},
});
