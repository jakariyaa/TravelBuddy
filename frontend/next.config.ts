import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://travelbuddy-server.jakariya.eu.org/api/:path*",
      },
    ];
  },
};

export default nextConfig;
