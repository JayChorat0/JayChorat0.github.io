
import type {NextConfig} from 'next';

const repoName = 'jay-0k.github.io'; // IMPORTANT: This is your repository name.
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // For a repository named <user>.github.io, basePath and assetPrefix should be empty.
  basePath: isProd ? '' : '',
  assetPrefix: isProd ? '' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [],
  },
};

export default nextConfig;
