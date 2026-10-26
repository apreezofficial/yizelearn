module.exports = {
  preset: '@react-native/jest-preset',
  // The first render compiles the whole app, which can take longer than the 5s default on slow machines.
  testTimeout: 60000,
};
