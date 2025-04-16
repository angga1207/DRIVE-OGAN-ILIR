import type { NextConfig } from "next";

module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

const nextConfig: NextConfig = {
  /* config options here */
  // devIndicators: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;