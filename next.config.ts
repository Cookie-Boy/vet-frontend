import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  devIndicators: {
    position: undefined,
  },
  poweredByHeader: false,
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
  allowedDevOrigins: ['vet-platform.cloudpub.ru', 'vet-gateway.cloudpub.ru'],
};

export default nextConfig;