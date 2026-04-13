import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'app-partner',
  slug: 'app-partner',
  scheme: 'bthwani-partner',
  plugins: [...(config.plugins ?? []), 'expo-dev-client'],
  android: {
    ...(config.android ?? {}),
    package: 'com.bthwani.partner.dev',
  },
  ios: {
    ...(config.ios ?? {}),
    bundleIdentifier: 'com.bthwani.partner.dev',
  },
  extra: {
    ...(config.extra ?? {}),
    appKey: 'app-partner',
    appVariant: 'development',
  },
});
