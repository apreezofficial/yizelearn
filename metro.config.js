const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// The Next.js website lives in web/ with its own packages; keep Metro out of it.
const config = {resolver: {blockList: [new RegExp(`^${path.join(__dirname, 'web').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/.*`)]}};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
