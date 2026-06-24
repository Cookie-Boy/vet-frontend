import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8888',
        pathname: '/api/profile/pets/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.114:8888/api/:path*', // Gateway
      },
      {
        source: '/auth/:path*',
        destination: 'http://192.168.1.114:8080/:path*', // Keycloak
      },
    ];
  },
};

export default nextConfig;