import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // missingSuspenseWithCSRBailout: false,
  poweredByHeader: false,                 // <— penting
  productionBrowserSourceMaps: false,     // jangan kirim sourcemap ke client
  swcMinify: true,
};

// module.exports = nextConfig
export default nextConfig;