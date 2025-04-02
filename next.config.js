/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve the site from the /polarisWebsiteV2 subpath
  basePath: '/polarisWebsiteV2',
  assetPrefix: '/polarisWebsiteV2/',
  
  // Enable static export mode (Next.js 14+)
  output: 'export',

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
