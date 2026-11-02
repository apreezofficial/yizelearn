import path from 'node:path';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // The React Native app's lockfile sits one folder up; build from web/ only.
  turbopack: {root: path.join(__dirname)},
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
