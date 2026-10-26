// Safe-area insets come from native measurements, which Jest doesn't have; use the library's mock.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
