import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add the hostname here
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "exploreinn-local.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
