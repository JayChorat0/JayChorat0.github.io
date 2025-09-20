
import type {NextConfig} from 'next';

// For a user/organization site, the repo name is not needed in the path.
const repoName = ''; 
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // basePath and assetPrefix should be empty for a user page repository
  basePath: isProd ? repoName : '',
  assetPrefix: isProd ? repoName : '',
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
  webpack: (config, { isServer }) => {
    // These modules are server-side only and should not be included in the client-side bundle.
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            '@genkit-ai/firebase': false,
            'firebase-admin': false,
            // Add other server-only packages here
        };
    }

    return config;
  },
};

export default nextConfig;
