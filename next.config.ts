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
  allowedDevOrigins: ['drdwut-95-104-185-219.ru.tuna.am'],
}

export default nextConfig;