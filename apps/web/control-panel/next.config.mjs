/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bthwani/app-shells', '@bthwani/ui-kit', '@bthwani/surfaces'],
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      '@expo/vector-icons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Ionicons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialCommunityIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome5': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome6': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Feather': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Entypo': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/AntDesign': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/EvilIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Foundation': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Octicons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/SimpleLineIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Zocial': '@bthwani/app-shells/web/shims/expo-vector-icons',
      'expo-font': '@bthwani/app-shells/web/shims/expo-font',
      'expo-modules-core': '@bthwani/app-shells/web/shims/expo-modules-core',
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
      '@expo/vector-icons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Ionicons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/MaterialCommunityIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome5': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/FontAwesome6': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Feather': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Entypo': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/AntDesign': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/EvilIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Foundation': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Octicons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/SimpleLineIcons': '@bthwani/app-shells/web/shims/expo-vector-icons',
      '@expo/vector-icons/Zocial': '@bthwani/app-shells/web/shims/expo-vector-icons',
      'expo-font': '@bthwani/app-shells/web/shims/expo-font',
      'expo-modules-core': '@bthwani/app-shells/web/shims/expo-modules-core',
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
