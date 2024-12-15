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

  reactStrictMode: true, // Enables React Strict Mode
  productionBrowserSourceMaps: true, // Generates source maps in production
  experimental: {
    turbo: false, // Disables Turbopack if needed
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, // Environment variable example
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store" }, // No caching during debugging
      ],
    },
  ],
  swcMinify: false,
};

export default nextConfig;
