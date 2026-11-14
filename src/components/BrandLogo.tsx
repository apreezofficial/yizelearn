import React from 'react';
import {Image, type ImageStyle, type StyleProp, useColorScheme} from 'react-native';

/** The logo without its dark pill on light screens; the original, light lettering on dark, in dark mode. */
export function BrandMark({style}: {style?: StyleProp<ImageStyle>}) {
  const dark = useColorScheme() === 'dark';
  return <Image source={dark ? require('../assets/brand/logo.png') : require('../assets/brand/logo-light.png')} style={style} resizeMode="contain" accessibilityLabel="yizelearn" />;
}
