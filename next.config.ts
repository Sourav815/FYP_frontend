import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ✅ This disables type checking during production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
