import {useEffect, useState} from 'react';
import {AccessibilityInfo, Platform} from 'react-native';
import {isLiquidGlassSupported} from '@callstack/liquid-glass';
import NetInfo from '@react-native-community/netinfo';
import Haptics, {HapticFeedbackTypes} from 'react-native-haptic-feedback';

// The phone's accessibility settings, kept current while the app is open.
let reduceMotion = false;
let reduceTransparency = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

AccessibilityInfo.isReduceMotionEnabled().then(v => { reduceMotion = v; notify(); }, () => undefined);
AccessibilityInfo.addEventListener('reduceMotionChanged', v => { reduceMotion = v; notify(); });
if (Platform.OS === 'ios') {
  AccessibilityInfo.isReduceTransparencyEnabled().then(v => { reduceTransparency = v; notify(); }, () => undefined);
  AccessibilityInfo.addEventListener('reduceTransparencyChanged', v => { reduceTransparency = v; notify(); });
}

function useSetting<T>(read: () => T): T {
  const [value, setValue] = useState(read);
  useEffect(() => {
    const update = () => setValue(read);
    listeners.add(update);
    update();
    return () => { listeners.delete(update); };
  }, [read]);
  return value;
}

const readMotion = () => reduceMotion;
const readGlass = () => Platform.OS === 'ios' && isLiquidGlassSupported && !reduceTransparency;

/** False while the phone has no internet. Unknown counts as online so nothing flashes at launch. */
export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => NetInfo.addEventListener(s => setOnline(s.isConnected !== false && s.isInternetReachable !== false)), []);
  return online;
}

/** True when Settings > Accessibility > Motion > Reduce Motion is on. */
export const useReduceMotion = () => useSetting(readMotion);
/** True on iOS 26+ unless Reduce Transparency is on, in which case bars fall back to solid colour. */
export const useGlass = () => useSetting(readGlass);

// iOS skips these when System Haptics is off in Settings > Sounds & Haptics; Android follows its touch-feedback setting.
const options = {enableVibrateFallback: false, ignoreAndroidSystemSettings: false};
const play = (kind: keyof typeof HapticFeedbackTypes) => Haptics.trigger(kind, options);
export const haptic = {
  tap: () => play('impactLight'),
  select: () => play('selection'),
  success: () => play('notificationSuccess'),
  warning: () => play('notificationWarning'),
};
