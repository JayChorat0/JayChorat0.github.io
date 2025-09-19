
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
    // This is to fix the error: Module not found: Can't resolve '@opentelemetry/exporter-jaeger'
    config.externals.push('@opentelemetry/exporter-jaeger');
    config.externals.push('@opentelemetry/resources');
    
    // This is to fix the error: Module not found: Can't resolve '@genkit-ai/firebase'
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            '@genkit-ai/firebase': false,
        };
    }

    return config;
  },
};

export default nextConfig;
