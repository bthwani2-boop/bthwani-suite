import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'app-field',
  slug: 'app-field',
  scheme: 'bthwani-field',
  plugins: [...(config.plugins ?? []), 'expo-dev-client'],
  android: {
    ...(config.android ?? {}),
    package: 'com.bthwani.field.dev',
  },
  ios: {
    ...(config.ios ?? {}),
    bundleIdentifier: 'com.bthwani.field.dev',
  },
  extra: {
    ...(config.extra ?? {}),
    appKey: 'app-field',
    appVariant: 'development',
  },
});
