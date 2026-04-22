/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  }
};

export default nextConfig;
