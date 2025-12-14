import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during builds (Render), prevents the requirement to have eslint installed
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;
