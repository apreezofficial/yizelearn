import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import Svg, {Rect, Text as SvgText} from 'react-native-svg';

export type CertificateDesign = 'gold' | 'yellow';
type Props = {
  design?: CertificateDesign;
  learnerName?: string;
  course?: string;
  hours?: number;
  completedAt?: string;
  signerName?: string;
  signerTitle?: string;
};

// The supplied artwork is retained at its original 1080 × 816 aspect ratio.
// Only the sample completion paragraph is covered when rendering learner data.
export function CertificateTemplate({design = 'gold', learnerName, course = '', hours, completedAt, signerName, signerTitle}: Props) {
  const family = Platform.OS === 'ios' ? 'Georgia' : 'serif';
  const lines = learnerName ? [
    `This is to certify that ${learnerName}`,
    hours == null ? 'successfully completed the' : `successfully completed ${hours} total hours of`,
    `${course} online course${completedAt ? ' on' : ''}`,
    ...(completedAt ? [completedAt] : []),
  ] : [];
  return <View style={styles.paper} accessibilityRole="image" accessibilityLabel={learnerName ? `Certificate of Completion. ${learnerName} completed ${course}${completedAt ? ` on ${completedAt}` : ''}.` : `${design === 'gold' ? 'Gold' : 'Yellow'} certificate template preview`}>
    <Image source={design === 'yellow' ? require('../../assets/certificates/yellow.jpeg') : require('../../assets/certificates/gold.jpeg')} style={styles.art} resizeMode="contain" />
    {(learnerName || signerName || signerTitle) && <Svg viewBox="0 0 1080 816" style={StyleSheet.absoluteFill}>
      {learnerName && <>
        <Rect x="158" y="242" width="766" height="164" rx="2" fill="#fcfefe" />
        {lines.map((line, i) => <SvgText key={i} x="540" y={281 + i * 38} textAnchor="middle" fontFamily={family} fontStyle="italic" fontWeight="bold" fontSize={Math.min(34, 1210 / Math.max(line.length, 1))} fill="#151515">{line}</SvgText>)}
      </>}
      {signerName && <SvgText x="348" y="463" textAnchor="middle" fontFamily={family} fontStyle="italic" fontSize="26" fill="#151515">{signerName}</SvgText>}
      {signerTitle && <SvgText x="348" y="515" textAnchor="middle" fontFamily={family} fontSize="19" fill="#151515">{signerTitle}</SvgText>}
    </Svg>}
  </View>;
}
const styles = StyleSheet.create({
  paper: {width: '100%', aspectRatio: 1080 / 816, backgroundColor: '#fcfefe', overflow: 'hidden'},
  art: {width: '100%', height: '100%'},
});
