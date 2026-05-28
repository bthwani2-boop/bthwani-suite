import React from 'react';
import Image from 'next/image';
import { Box, Surface, useTheme } from '@bthwani/ui-kit';
import { getActualPublicMediaPath } from '../../../shared/resolve-dsh-public-media-path';

const WATERMARK_URL = getActualPublicMediaPath('dsh.brand.logo.v1');

function getPremiumEmoji(name: string, fallback?: string): string {
  const n = name.toLowerCase();
  if (n.includes('تفاح')) return '🍎';
  if (n.includes('حليب')) return '🥛';
  if (n.includes('خبز') || n.includes('كرواسون')) return '🍞';
  if (n.includes('دجاج')) return '🍗';
  if (n.includes('برجر') || n.includes('برغر')) return '🍔';
  if (n.includes('باستا')) return '🍝';
  if (n.includes('شوكولاتة') || n.includes('شوكولاته') || n.includes('كيك') || n.includes('حلا') || n.includes('شريحة')) return '🍰';
  if (n.includes('عصير') || n.includes('ليمون') || n.includes('برتقال')) return '🍊';
  if (n.includes('تمر')) return '🌴';
  if (n.includes('عسل')) return '🍯';
  if (n.includes('ايفون') || n.includes('جوال') || n.includes('بروك ماكس')) return '📱';
  if (n.includes('شاحن')) return '🔌';
  if (n.includes('زيت')) return '🛢️';
  if (n.includes('بطارية')) return '🔋';
  return fallback || '📦';
}

export function WatermarkedImage({ src, mediaKey, fallback, size = 32, productName = '' }: { src?: string, mediaKey?: string, fallback?: string, size?: number, productName?: string }) {
  const { theme } = useTheme();

  // For Next.js, we use the static public URL resolver instead of React Native's require resolver
  const keyToResolve = mediaKey || src || '';
  let imagePath = keyToResolve.startsWith('http') || keyToResolve.startsWith('//') || keyToResolve.startsWith('/')
    ? keyToResolve
    : getActualPublicMediaPath(keyToResolve);

  const hasValidRealImage = !!imagePath;
  const emoji = getPremiumEmoji(productName || '', fallback);

  return (
    <Surface
      tone="inset"
      padding={0}
      border
      radiusToken="xs"
      style={{
        width: size,
        height: size,
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: theme.surfaceInset,
      }}
    >
      {hasValidRealImage && imagePath ? (
        <Image src={imagePath} fill style={{ objectFit: 'cover' }} alt="صورة المنتج" />
      ) : (
        <span style={{ fontSize: `${size * 0.55}px`, lineHeight: 1, userSelect: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
          {emoji}
        </span>
      )}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', opacity: 0.12 }}>
        <Image src={WATERMARK_URL} width={size * 0.8} height={size * 0.8} style={{ objectFit: 'contain' }} alt="شعار المنصة" />
      </Box>
    </Surface>
  );
}
