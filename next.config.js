/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export mode (Next.js 14+)
  output: 'export',
  
  // Configure base path and asset prefix for GitHub Pages
  basePath: '/polarisWebsiteV2',
  assetPrefix: '/polarisWebsiteV2/',
  
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,

  eslint: {
    // We use biome for linting – ignore during builds
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
