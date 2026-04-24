import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'app-client',
  slug: 'app-client',
  scheme: 'bthwani-client',
  plugins: [...(config.plugins ?? []), 'expo-dev-client'],
  android: {
    ...(config.android ?? {}),
    package: 'com.bthwani.client.dev',
  },
  ios: {
    ...(config.ios ?? {}),
    bundleIdentifier: 'com.bthwani.client.dev',
  },
  extra: {
    ...(config.extra ?? {}),
    appKey: 'app-client',
    appVariant: 'development',
  },
});
