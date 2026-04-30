/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every API route is a serverless function by default in Next.js.
  // Setting runtime to 'edge' on individual routes is opt-in for cold-start perf.
  experimental: {
    typedRoutes: false,
  },
  transpilePackages: ['@ecosystem/types', '@ecosystem/shared'],
};

module.exports = nextConfig;
