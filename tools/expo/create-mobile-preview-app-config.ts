import type { ExpoConfig } from 'expo/config';

type CreateMobilePreviewAppConfigOptions = {
  name: string;
  slug: string;
  scheme: string;
  surface: string;
};

export function createMobilePreviewAppConfig({ name, slug, scheme, surface }: CreateMobilePreviewAppConfigOptions): ExpoConfig {
  return {
    name,
    slug,
    scheme,
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    platforms: ['android', 'ios'],
    experiments: {
      autolinkingModuleResolution: true,
    },
    extra: {
      surface,
      previewMode: 'fixtures-only',
    },
  };
}