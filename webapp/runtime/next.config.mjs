/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bthwani/ui-kit', '@bthwani/surfaces'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      '@expo/vector-icons$': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Ionicons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/build/Ionicons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/MaterialIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/build/MaterialIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/MaterialCommunityIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/build/MaterialCommunityIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome5': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome6': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Feather': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Entypo': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/AntDesign': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/EvilIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Foundation': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Octicons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/SimpleLineIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Zocial': '../shell/shims/expo-vector-icons.tsx',
      'expo-font': '../shell/shims/expo-font.ts',
      'expo-modules-core': '../shell/shims/expo-modules-core.ts',
      'react-native-safe-area-context': '../shell/shims/react-native-safe-area-context.tsx',
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
      '@expo/vector-icons$': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Ionicons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/build/Ionicons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/MaterialIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/build/MaterialIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/MaterialCommunityIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/build/MaterialCommunityIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome5': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome6': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Feather': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Entypo': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/AntDesign': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/EvilIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Foundation': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Octicons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/SimpleLineIcons': '../shell/shims/expo-vector-icons.tsx',
      '@expo/vector-icons/Zocial': '../shell/shims/expo-vector-icons.tsx',
      'expo-font': '../shell/shims/expo-font.ts',
      'expo-modules-core': '../shell/shims/expo-modules-core.ts',
      'react-native-safe-area-context': '../shell/shims/react-native-safe-area-context.tsx',
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
