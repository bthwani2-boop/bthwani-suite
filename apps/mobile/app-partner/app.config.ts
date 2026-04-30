import { ExpoConfig, ConfigContext } from 'expo/config';

// NOTE (example-only): Example config entries must not contain runtime secrets. Use `process.env.*` placeholders
// or a secure configuration loader. Placeholder proposals live under kdt/merge-run/.../proposed/remediations/.

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
