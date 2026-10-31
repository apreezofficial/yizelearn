// Safe-area insets come from native measurements, which Jest doesn't have; use the library's mock.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
// Shake detection and screen capture are native-only; stub them so the app renders in Jest.
jest.mock('react-native-shake', () => ({__esModule: true, default: {addListener: () => ({remove: jest.fn()})}}));
jest.mock('react-native-view-shot', () => ({captureScreen: jest.fn(() => Promise.resolve('file://screenshot.png'))}));
