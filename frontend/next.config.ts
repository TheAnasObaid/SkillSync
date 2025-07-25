import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thispersondoesnotexist.com",
      },
    ],
  },
};

export default nextConfig;
