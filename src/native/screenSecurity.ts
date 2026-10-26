import {useEffect, useRef} from 'react';
import {DeviceEventEmitter, Platform, TurboModuleRegistry, type TurboModule} from 'react-native';

/**
 * How a screen may be captured:
 * - allow: screenshots and screen recordings work as normal
 * - warn:  capture works, and the user is warned after taking a screenshot (Android 14+)
 * - block: screenshots and recordings come out black (Android only; iOS cannot block capture)
 */
export type CapturePolicy = 'allow' | 'warn' | 'block';

interface ScreenSecurity extends TurboModule {
  setSecure(secure: boolean): void;
  setScreenshotWatch(enabled: boolean): void;
}

// Android-only native module (android/app/src/main/java/com/cathedtech/ScreenSecurityModule.kt).
const native = Platform.OS === 'android' ? TurboModuleRegistry.get<ScreenSecurity>('ScreenSecurity') : null;

export function useScreenCapturePolicy(policy: CapturePolicy, onScreenshot: () => void) {
  const handler = useRef(onScreenshot);
  handler.current = onScreenshot;

  useEffect(() => {
    native?.setSecure(policy === 'block');
    native?.setScreenshotWatch(policy === 'warn');
  }, [policy]);

  useEffect(() => {
    if (policy !== 'warn') return;
    const sub = DeviceEventEmitter.addListener('ScreenshotTaken', () => handler.current());
    return () => sub.remove();
  }, [policy]);
}
