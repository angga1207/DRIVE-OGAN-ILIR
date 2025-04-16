import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // missingSuspenseWithCSRBailout: false,
};

// module.exports = nextConfig
export default nextConfig;