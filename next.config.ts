import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : '/us/ads-dashboard';


const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Mantine ships CJS interop; transpile through Next's pipeline to avoid
  // ESM/CJS mismatch errors during build.
  transpilePackages: ['@mantine/core', '@mantine/hooks'],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
