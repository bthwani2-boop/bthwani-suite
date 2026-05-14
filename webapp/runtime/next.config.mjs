import path from 'node:path';
import { fileURLToPath } from 'node:url';

const runtimeRoot = fileURLToPath(new URL('.', import.meta.url));
const shellShimPath = (name) => path.resolve(runtimeRoot, '../shell/shims', name);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bthwani/ui-kit', '@bthwani/surfaces'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      '@expo/vector-icons$': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Ionicons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/build/Ionicons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/MaterialIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/build/MaterialIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/MaterialCommunityIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/build/MaterialCommunityIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/FontAwesome': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/FontAwesome5': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/FontAwesome6': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Feather': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Entypo': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/AntDesign': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/EvilIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Foundation': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Octicons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/SimpleLineIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Zocial': shellShimPath('expo-vector-icons.tsx'),
      'expo-font': shellShimPath('expo-font.ts'),
      'expo-modules-core': shellShimPath('expo-modules-core.ts'),
      'react-native-safe-area-context': shellShimPath('react-native-safe-area-context.tsx'),
    },
    resolveExtensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
    rules: {
      '*.ttf': {
        type: 'asset',
      },
      '*.otf': {
        type: 'asset',
      },
      '*.woff': {
        type: 'asset',
      },
      '*.woff2': {
        type: 'asset',
      },
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react-native': 'react-native-web',
      '@expo/vector-icons$': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Ionicons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/build/Ionicons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/MaterialIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/build/MaterialIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/MaterialCommunityIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/build/MaterialCommunityIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/FontAwesome': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/FontAwesome5': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/FontAwesome6': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Feather': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Entypo': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/AntDesign': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/EvilIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Foundation': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Octicons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/SimpleLineIcons': shellShimPath('expo-vector-icons.tsx'),
      '@expo/vector-icons/Zocial': shellShimPath('expo-vector-icons.tsx'),
      'expo-font': shellShimPath('expo-font.ts'),
      'expo-modules-core': shellShimPath('expo-modules-core.ts'),
      'react-native-safe-area-context': shellShimPath('react-native-safe-area-context.tsx'),
    };

    config.module = config.module ?? {};
    config.module.rules = config.module.rules ?? [];
    config.module.rules.push({
      test: /\.(ttf|otf|woff|woff2)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
