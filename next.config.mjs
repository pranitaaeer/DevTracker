/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build ke waqt ESLint warnings/errors ignore karne ke liye:
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Build ke waqt TypeScript errors ignore karne ke liye:
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;