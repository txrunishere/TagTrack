import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.ORIGIN_IP!],
};

export default nextConfig;
