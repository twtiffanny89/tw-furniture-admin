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
      bodySizeLimit: "10mb", // Set the desired size limit (e.g., '10mb', '20mb', etc.)
    },
  },
};

export default nextConfig;
