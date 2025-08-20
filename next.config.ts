import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable optimizeCss to avoid requiring optional 'critters' package that is currently missing
    optimizeCss: false,
  },
  images: {
    unoptimized: true, // 🚀 disables Vercel optimization service
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
