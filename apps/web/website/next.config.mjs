/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bthwani/ui-kit', '@bthwani/surfaces'],
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react-native$': 'react-native-web',
    };

    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      ...(config.resolve.extensions ?? []),
    ];

    return config;
  },
};

export default nextConfig;
