import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Proxy to your backend API
        destination: 'https://nehaz-aura-api.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
