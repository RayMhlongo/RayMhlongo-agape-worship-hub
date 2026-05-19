import type { NextConfig } from "next";

const isCapacitorExport = process.env.CAPACITOR_EXPORT === "1";

const nextConfig: NextConfig = {
  output: isCapacitorExport ? "export" : undefined,
  trailingSlash: isCapacitorExport,
  images: {
    unoptimized: isCapacitorExport,
    remotePatterns: []
  }
};

export default nextConfig;
