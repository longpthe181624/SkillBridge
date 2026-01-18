import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Completely disable ESLint during build for staging/production
  eslint: {
    // Set to empty array to disable ESLint completely during build
    dirs: [],
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (optional, can be enabled later)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Experimental: Disable ESLint completely
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
