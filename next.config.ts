import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tordillafood.com",
      },
      {
        protocol: "https",
        hostname: "www.tordilla.ir",
      },
    ],
  },
};

export default nextConfig;
