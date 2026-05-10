/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bthwani/ui-kit', '@bthwani/surfaces'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      '@expo/vector-icons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Ionicons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialCommunityIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome5': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome6': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Feather': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Entypo': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/AntDesign': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/EvilIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Foundation': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Octicons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/SimpleLineIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Zocial': '../shell/shims/expo-vector-icons',
      'expo-font': '../shell/shims/expo-font',
      'expo-modules-core': '../shell/shims/expo-modules-core',
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
      '@expo/vector-icons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Ionicons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialCommunityIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome5': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome6': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Feather': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Entypo': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/AntDesign': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/EvilIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Foundation': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Octicons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/SimpleLineIcons': '../shell/shims/expo-vector-icons',
      '@expo/vector-icons/Zocial': '../shell/shims/expo-vector-icons',
      'expo-font': '../shell/shims/expo-font',
      'expo-modules-core': '../shell/shims/expo-modules-core',
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
