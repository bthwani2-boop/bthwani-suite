import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'app-captain',
  slug: 'app-captain',
  scheme: 'bthwani-captain',
  plugins: [...(config.plugins ?? []), 'expo-dev-client'],
  android: {
    ...(config.android ?? {}),
    package: 'com.bthwani.captain.dev',
  },
  ios: {
    ...(config.ios ?? {}),
    bundleIdentifier: 'com.bthwani.captain.dev',
  },
  extra: {
    ...(config.extra ?? {}),
    appKey: 'app-captain',
    appVariant: 'development',
  },
});
