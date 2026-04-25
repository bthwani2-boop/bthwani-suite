import type { ImageSourcePropType } from 'react-native';

import { resolveSeedMediaSource } from '@bthwani/media-fixtures';

export function resolveDshImageSource(source?: string | ImageSourcePropType | null): ImageSourcePropType | undefined {
  if (!source) {
    return undefined;
  }

  if (typeof source !== 'string') {
    return source;
  }

  if (source.startsWith('dsh.')) {
    return resolveSeedMediaSource(source as Parameters<typeof resolveSeedMediaSource>[0]);
  }

  return { uri: source };
}