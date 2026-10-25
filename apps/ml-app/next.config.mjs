/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  transpilePackages: [
    "@super-app/shared",
    "@super-app/features-chat-core",
    "@super-app/features-ai-chat",
    "@super-app/features-assistant-chat",
  ],

  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    // optimizePackageImports: ['@super-app/shared'],
  },

  async rewrites() {
    return [
      {
        source: "/token/:path*",
        destination: "http://172.16.0.245:9301/token/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
