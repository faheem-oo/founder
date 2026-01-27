import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure Next.js treats this folder as the workspace root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
