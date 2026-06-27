import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@taxcode/shared-types"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
