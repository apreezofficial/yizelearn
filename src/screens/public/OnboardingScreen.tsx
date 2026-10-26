import React, {useRef, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, useWindowDimensions, View, type ImageSourcePropType} from 'react-native';
import {colors, fonts} from '../../theme/tokens';

type Slide = {key: string; title: string; body: string; image: ImageSourcePropType};
const slides: Slide[] = [
  {key: 'pace', title: 'Learn at your own pace', body: 'Get lifetime access to the courses you buy, anytime, any day.', image: require('../../assets/onboarding/learn.png')},
  {key: 'live', title: 'Take live courses', body: 'Join live classes with your instructor and learn together with others.', image: require('../../assets/onboarding/live.png')},
  {key: 'skills', title: 'Gain real-life skills', body: 'Practical lessons you can put to work straight away.', image: require('../../assets/onboarding/skills.png')},
];

export function OnboardingScreen({onBrowse, onLogin}: {onBrowse: () => void; onLogin: () => void}) {
  const {width} = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList<Slide>>(null);
  const goTo = (i: number) => { setIndex(i); list.current?.scrollToOffset({offset: i * width, animated: true}); };
  return <View style={styles.screen}>
    <FlatList ref={list} data={slides} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={s => s.key} getItemLayout={(_, i) => ({length: width, offset: width * i, index: i})}
      onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      renderItem={({item}) => <View style={[styles.slide, {width}]}>
        <Image source={item.image} resizeMode="contain" style={[styles.art, {width: width - 48, height: (width - 48) * 0.67}]} accessibilityIgnoresInvertColors />
        <Text style={[styles.title, font]}>{item.title}</Text>
        <Text style={[styles.body, font]}>{item.body}</Text>
      </View>} />
    <View style={styles.dots}>{slides.map((s, i) => <Pressable key={s.key} onPress={() => goTo(i)} hitSlop={8} accessibilityLabel={`Slide ${i + 1} of ${slides.length}`}><View style={[styles.dot, i === index && styles.dotActive]} /></Pressable>)}</View>
    <View style={styles.actions}>
      <Pressable onPress={onBrowse} style={styles.action} hitSlop={4}><Text style={[styles.actionText, font]}>Browse</Text></Pressable>
      <Pressable onPress={onLogin} style={[styles.action, styles.actionEnd]} hitSlop={4}><Text style={[styles.actionText, font]}>Log in</Text></Pressable>
    </View>
  </View>;
}

const font = {fontFamily: fonts.family};
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.sky},
  slide: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24},
  art: {marginBottom: 32},
  title: {fontSize: 22, color: colors.heroText, textAlign: 'center', marginBottom: 8},
  body: {fontSize: 14, lineHeight: 20, color: colors.white, textAlign: 'center', maxWidth: 300},
  dots: {flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 56},
  dot: {width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255, 255, 255, 0.45)'},
  dotActive: {backgroundColor: colors.white},
  actions: {flexDirection: 'row', marginHorizontal: 20, marginBottom: 32, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.3)'},
  action: {flex: 1, height: 48, justifyContent: 'center', paddingHorizontal: 12},
  actionEnd: {alignItems: 'flex-end'},
  actionText: {fontSize: 18, color: colors.white},
});
