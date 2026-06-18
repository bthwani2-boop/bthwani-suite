import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import type { VideoDraft } from './video-types';
import { TARGET_TYPE_OPTIONS } from './video-types';

interface VideoViewerProps {
  draft: VideoDraft;
  theme: any;
  styles: any;
  isRtl: boolean;
  rtlText: any;
}

export function VideoViewer({ draft, theme, styles, isRtl, rtlText }: VideoViewerProps) {
  return (
    <Surface tone="inset" style={styles.previewPanel}>
      <View style={[styles.panelHeader]}>
        <Text role="titleSm" weight="black" style={[{ color: theme.textInverse }, rtlText]}>
          المعاينة الحية
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.previewFrame}>
          {draft.posterUrl ? (
            <Image source={{ uri: draft.posterUrl }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View
              style={[
                styles.previewImage,
                {
                  backgroundColor: theme.surfaceSecondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Text weight="black" style={{ fontSize: 12, color: theme.textSoft }}>
                مساحة معاينة الفيديو
              </Text>
            </View>
          )}

          <View style={styles.previewOverlay}>
            <View style={[styles.previewTopBar]}>
              <View style={styles.previewBadge}>
                <Text weight="black" style={[{ color: theme.textInverse, fontSize: 10 }, rtlText]}>
                  {draft.highlight || 'عرض جديد'}
                </Text>
              </View>
              <View style={styles.previewTime}>
                <Text weight="bold" style={[{ color: theme.textInverse, fontSize: 9 }, rtlText]}>
                  {draft.durationSeconds} ث
                </Text>
              </View>
            </View>

            <View style={styles.previewBottomContent}>
              <Box gap={1}>
                <Text role="titleSm" weight="black" style={[{ color: theme.textInverse }, rtlText]}>
                  {draft.title || 'عنوان الفيديو يظهر هنا'}
                </Text>
                <Text role="caption" style={[{ color: theme.textInverse, opacity: 0.9 }, rtlText]}>
                  {draft.subtitle || 'وصف الفيديو يظهر هنا بشكل مختصر وجذاب'}
                </Text>
              </Box>
              <View style={[styles.previewCta, isRtl ? { alignSelf: 'flex-end' } : null]}>
                <Text weight="black" style={[{ color: theme.brandHeaderBackground, fontSize: 12 }, rtlText]}>
                  {draft.ctaLabel}
                </Text>
                <Text style={[{ color: theme.brandHeaderBackground, fontSize: 12 }, rtlText]}>
                  {isRtl ? '←' : '→'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.previewControls}>
            <View style={styles.previewProgress} />
            <View style={[styles.headerRow, { gap: 6, justifyContent: 'flex-start' }]}>
              <View style={styles.previewIndicator} />
              <View style={[styles.previewIndicator, { opacity: 0.3 }]} />
              <View style={[styles.previewIndicator, { opacity: 0.3 }]} />
            </View>
          </View>
        </View>
        <Text role="caption" style={[{ color: theme.textSoft, marginTop: 12, textAlign: 'center' }, rtlText]}>
          {TARGET_TYPE_OPTIONS.find((o) => o.value === draft.targetType)?.label} · {draft.targetId}
        </Text>
      </View>
    </Surface>
  );
}
