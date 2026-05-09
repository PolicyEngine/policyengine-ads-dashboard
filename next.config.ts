import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Mantine ships CJS interop; transpile through Next's pipeline to avoid
  // ESM/CJS mismatch errors during build.
  transpilePackages: ['@mantine/core', '@mantine/hooks'],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
