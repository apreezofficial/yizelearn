import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/tokens';

export type IconName = 'search' | 'filter' | 'back' | 'down' | 'up' | 'heart' | 'heartFilled' | 'check' | 'play' | 'lock' | 'home' | 'book' | 'cart' | 'user' | 'message';

// Line icons drawn with plain views, so the app needs no native icon dependency.
export function Icon({name, size = 22, color = colors.ink}: {name: IconName; size?: number; color?: string}) {
  const s = size; const w = Math.max(1.5, Math.round(s / 11)); const box = {width: s, height: s};
  const line = {borderColor: color, borderWidth: w};
  switch (name) {
    case 'search': return <View style={box}><View style={[line, {width: s * 0.62, height: s * 0.62, borderRadius: s}]} /><View style={{position: 'absolute', left: s * 0.6, top: s * 0.56, width: w, height: s * 0.38, backgroundColor: color, borderRadius: w, transform: [{rotate: '-45deg'}]}} /></View>;
    case 'filter': return <View style={[box, styles.center, {gap: s * 0.16}]}>{[0.8, 0.52, 0.24].map(f => <View key={f} style={{width: s * f, height: w, borderRadius: w, backgroundColor: color}} />)}</View>;
    case 'back': case 'down': case 'up': {
      const rotate = name === 'back' ? '45deg' : name === 'down' ? '-45deg' : '135deg';
      const shift = name === 'back' ? {marginLeft: s * 0.18} : name === 'down' ? {marginTop: -s * 0.18} : {marginTop: s * 0.18};
      return <View style={[box, styles.center]}><View style={[shift, {width: s * 0.42, height: s * 0.42, borderLeftWidth: w, borderBottomWidth: w, borderColor: color, transform: [{rotate}]}]} /></View>;
    }
    case 'heart': case 'heartFilled': return <View style={[box, styles.center]}><Text style={{fontSize: s, lineHeight: s * 1.15, color, includeFontPadding: false}}>{name === 'heart' ? '♡' : '♥'}</Text></View>;
    case 'check': return <View style={[box, styles.center]}><View style={{width: s * 0.55, height: s * 0.3, marginTop: -s * 0.12, borderLeftWidth: w, borderBottomWidth: w, borderColor: color, transform: [{rotate: '-45deg'}]}} /></View>;
    case 'play': return <View style={[box, styles.center]}><View style={{marginLeft: s * 0.1, width: 0, height: 0, borderTopWidth: s * 0.28, borderBottomWidth: s * 0.28, borderLeftWidth: s * 0.44, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: color}} /></View>;
    case 'lock': return <View style={[box, styles.center]}><View style={[line, {width: s * 0.46, height: s * 0.36, borderBottomWidth: 0, borderTopLeftRadius: s, borderTopRightRadius: s, marginBottom: -w}]} /><View style={[line, {width: s * 0.66, height: s * 0.44, borderRadius: w}]} /></View>;
    case 'home': return <View style={[box, styles.center]}><View style={{width: s * 0.56, height: s * 0.56, borderTopWidth: w, borderLeftWidth: w, borderColor: color, transform: [{rotate: '45deg'}], marginBottom: -s * 0.36}} /><View style={[line, {width: s * 0.62, height: s * 0.44, borderTopWidth: 0, borderBottomLeftRadius: w, borderBottomRightRadius: w}]} /></View>;
    case 'book': return <View style={[box, styles.center]}><View style={[line, {width: s * 0.72, height: s * 0.8, borderRadius: w * 1.5, borderLeftWidth: w * 2}]}><View style={{position: 'absolute', left: s * 0.08, right: s * 0.08, bottom: s * 0.14, height: w, backgroundColor: color}} /></View></View>;
    case 'cart': return <View style={[box, styles.center]}><View style={[line, {width: s * 0.66, height: s * 0.42, borderBottomLeftRadius: w * 2, borderBottomRightRadius: w * 2, marginTop: s * 0.06}]} /><View style={{flexDirection: 'row', gap: s * 0.22, marginTop: s * 0.06}}><View style={{width: w * 2, height: w * 2, borderRadius: w, backgroundColor: color}} /><View style={{width: w * 2, height: w * 2, borderRadius: w, backgroundColor: color}} /></View><View style={{position: 'absolute', left: s * 0.02, top: s * 0.14, width: s * 0.18, height: w, backgroundColor: color}} /></View>;
    case 'user': return <View style={[box, styles.center]}><View style={[line, {width: s * 0.4, height: s * 0.4, borderRadius: s}]} /><View style={[line, {width: s * 0.72, height: s * 0.32, borderBottomWidth: 0, borderTopLeftRadius: s, borderTopRightRadius: s, marginTop: s * 0.06}]} /></View>;
    case 'message': return <View style={[box, styles.center]}><View style={[line, {width: s * 0.8, height: s * 0.58, borderRadius: w * 2}]} /><View style={{position: 'absolute', left: s * 0.24, bottom: s * 0.12, width: s * 0.2, height: s * 0.2, borderLeftWidth: w, borderBottomWidth: w, borderColor: color, backgroundColor: 'transparent', transform: [{rotate: '-20deg'}]}} /></View>;
  }
}

const styles = StyleSheet.create({center: {alignItems: 'center', justifyContent: 'center'}});
