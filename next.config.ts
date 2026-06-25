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
      }
    ];
  },
};

module.exports = {
  allowedDevOrigins: ['vet-platform.cloudpub.ru'],
}

export default nextConfig;