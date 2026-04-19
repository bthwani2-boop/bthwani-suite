import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Pressable, ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { BthBox, BthText } from '@bthwani/ui-kit';
import type { MarketingGrowthRecord } from '../../../shared/marketing/growth-store';

export type DshHomeApprovedVideoReelsViewerProps = {
  visible: boolean;
  items: MarketingGrowthRecord[];
  initialIndex?: number;
  onClose: () => void;
  onCtaPress: (item: MarketingGrowthRecord) => void;
};

function resolveMediaUri(uri?: string) {
  if (!uri) {
    return undefined;
  }

  if (/^(https?:|file:|content:|data:)/i.test(uri)) {
    return uri;
  }

  const baseUrl = process.env.EXPO_PUBLIC_MEDIA_BASE_URL?.trim();
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, '')}/${uri.replace(/^\/+/, '')}`;
  }

  return uri;
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), length - 1);
}

export function DshHomeApprovedVideoReelsViewer({
  visible,
  items,
  initialIndex = 0,
  onClose,
  onCtaPress,
}: DshHomeApprovedVideoReelsViewerProps) {
  const { height } = useWindowDimensions();
  const safeIndex = clampIndex(initialIndex, items.length);

  React.useEffect(() => {
    if (visible) {
      return undefined;
    }

    return undefined;
  }, [visible]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Modal visible animationType="slide" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={handleClose}>
        <StatusBar hidden />
        <View style={styles.emptyContainer}>
          <Pressable style={styles.closeButton} onPress={handleClose} accessibilityRole="button" accessibilityLabel="إغلاق">
            <Ionicons name="close" size={20} color="#ffffff" />
          </Pressable>
          <BthBox gap={2} style={styles.emptyCard}>
            <BthText role="titleSm" style={styles.emptyTitle}>لا توجد فيديوهات معتمدة بعد</BthText>
            <BthText role="bodySm" style={styles.emptyBody}>
              يرفع الشريك الفيديوهات أولًا، ثم تعتمدها التسويق قبل أن تظهر هنا في تطبيق العميل.
            </BthText>
          </BthBox>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={handleClose}>
      <StatusBar hidden />
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={handleClose} accessibilityRole="button" accessibilityLabel="إغلاق الفيديو">
          <Ionicons name="close" size={20} color="#ffffff" />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={Math.max(height * 0.72, 560)}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
        >
          {items.map((item, index) => {
            const posterUri = resolveMediaUri(item.posterUrl ?? item.videoUrl);

            return (
              <View key={item.id} style={[styles.slideCard, index === safeIndex && styles.slideCardActive]}>
                <View style={styles.slideMediaShell}>
                  {posterUri ? <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" /> : <View style={styles.posterFallback} />}
                  <View style={styles.mediaScrim} />
                  <View style={styles.mediaTag}>
                    <BthText role="caption" style={styles.mediaTagText}>فيديو معتمد</BthText>
                  </View>
                </View>

                <BthBox gap={2} style={styles.cardBody}>
                  <BthText role="titleSm" style={styles.title} numberOfLines={2}>{item.title}</BthText>
                  <BthText role="bodySm" style={styles.subtitle} numberOfLines={3}>{item.subtitle}</BthText>
                  <BthText role="bodySm" style={styles.highlight} numberOfLines={2}>{item.highlight}</BthText>

                  <Pressable
                    style={[styles.ctaButton, { backgroundColor: item.accentColor }]}
                    onPress={() => onCtaPress(item)}
                    accessibilityRole="button"
                    accessibilityLabel={item.ctaLabel}
                  >
                    <BthText role="bodyMd" style={styles.ctaText}>{item.ctaLabel}</BthText>
                    <Ionicons name="arrow-back" size={18} color="#ffffff" />
                  </Pressable>
                </BthBox>

                <BthText role="caption" style={styles.swipeHint}>اسحب للأعلى أو للأسفل لمشاهدة فيديوهات أخرى</BthText>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 28,
    gap: 18,
  },
  slideCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  slideCardActive: {
    borderColor: '#f97316',
  },
  slideMediaShell: {
    aspectRatio: 9 / 16,
    backgroundColor: '#0f172a',
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  posterFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  mediaScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.28)',
  },
  mediaTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  mediaTagText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
    gap: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  title: {
    color: '#ffffff',
    fontWeight: '900',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 22,
  },
  highlight: {
    color: 'rgba(255,255,255,0.86)',
    fontWeight: '700',
  },
  ctaButton: {
    minHeight: 52,
    borderRadius: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  swipeHint: {
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.76)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  emptyTitle: {
    color: '#ffffff',
    fontWeight: '900',
  },
  emptyBody: {
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
  },
});

export default DshHomeApprovedVideoReelsViewer;