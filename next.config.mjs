/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://143.198.199.248/:path*", // External HTTP API
      },
    ];
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    DEV: process.env.DEV,
  },
};

export default nextConfig;
