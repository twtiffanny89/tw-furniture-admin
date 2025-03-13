/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    DEV: process.env.DEV,
  },
  reactStrictMode: true,
  swcMinify: true, // Enable minification
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
