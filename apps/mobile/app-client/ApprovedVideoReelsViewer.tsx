import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { FlatList, Image, Modal, Pressable, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Box, Text } from '@bthwani/ui-kit';
import type { DshHomeApprovedVideoReelsViewerProps } from '../../../packages/surfaces/src/service-owned/dsh/app-client/home/components/DshHomeApprovedVideoReelsViewer';

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

export function ApprovedVideoReelsViewer({
  visible,
  items,
  initialIndex = 0,
  onClose,
  onCtaPress,
}: DshHomeApprovedVideoReelsViewerProps) {
  const { height } = useWindowDimensions();
  const listRef = React.useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = React.useState(() => clampIndex(initialIndex, items.length));
  const safeIndex = clampIndex(initialIndex, items.length);

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    setActiveIndex(safeIndex);
  }, [safeIndex, visible]);

  React.useEffect(() => {
    if (!visible || items.length === 0) {
      return;
    }

    listRef.current?.scrollToIndex({ index: safeIndex, animated: false });
  }, [items.length, safeIndex, visible]);

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
          <Box gap={2} style={styles.emptyCard}>
            <Text role="titleSm" style={styles.emptyTitle}>لا توجد فيديوهات معتمدة بعد</Text>
            <Text role="bodySm" style={styles.emptyBody}>
              يرفع الشريك الفيديوهات أولًا، ثم تعتمدها التسويق قبل أن تظهر هنا في تطبيق العميل.
            </Text>
          </Box>
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

        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const videoUri = resolveMediaUri(item.videoUrl);
            const posterUri = resolveMediaUri(item.posterUrl ?? item.videoUrl);
            const isActive = index === activeIndex;

            return (
              <View style={[styles.slide, { height }]}>
                {posterUri ? <Image source={{ uri: posterUri }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : <View style={styles.posterFallback} />}

                {videoUri ? (
                  <Video
                    source={{ uri: videoUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    isMuted
                    shouldPlay={isActive}
                  />
                ) : null}

                <View style={styles.scrim} />

                <View style={styles.content}>
                  <View style={styles.tag}>
                    <Text role="caption" style={styles.tagText}>فيديو معتمد</Text>
                  </View>

                  <Box gap={2} style={styles.copyCard}>
                    <Text role="titleMd" style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text role="bodySm" style={styles.subtitle} numberOfLines={3}>{item.subtitle}</Text>
                    <Text role="bodySm" style={styles.highlight} numberOfLines={2}>{item.highlight}</Text>

                    <Pressable
                      style={[styles.ctaButton, { backgroundColor: item.accentColor }]}
                      onPress={() => onCtaPress(item)}
                      accessibilityRole="button"
                      accessibilityLabel={item.ctaLabel}
                    >
                      <Text role="bodyMd" style={styles.ctaText}>{item.ctaLabel}</Text>
                    </Pressable>
                  </Box>

                  <Text role="caption" style={styles.swipeHint}>اسحب للأعلى أو للأسفل لمشاهدة فيديوهات أخرى</Text>
                </View>
              </View>
            );
          }}
          pagingEnabled
          snapToAlignment="start"
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const nextIndex = clampIndex(Math.round(event.nativeEvent.contentOffset.y / height), items.length);
            setActiveIndex(nextIndex);
          }}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          initialScrollIndex={safeIndex}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  slide: {
    width: '100%',
    backgroundColor: '#020617',
  },
  posterFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.32)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.60)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tagText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  copyCard: {
    alignSelf: 'stretch',
    padding: 16,
    borderRadius: 28,
    backgroundColor: 'rgba(15, 23, 42, 0.66)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
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
    zIndex: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
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

export default ApprovedVideoReelsViewer;