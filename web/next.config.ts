import path from 'node:path';
import type {NextConfig} from 'next';

// The yizelearn API has no CORS headers, so the browser talks to it through this same-origin proxy (/yz/...).
// Server code calls it directly. Set API_URL to point at another environment.
const API_URL = process.env.API_URL ?? 'https://16-170-53-222.sslip.io';

const nextConfig: NextConfig = {
  async rewrites() { return [{source: '/yz/:path*', destination: `${API_URL}/v1/:path*`}]; },
  // The React Native app's lockfile sits one folder up; build from web/ only.
  turbopack: {root: path.join(__dirname)},
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
