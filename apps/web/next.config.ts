import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@taxcode/shared-types"],
};

export default nextConfig;
