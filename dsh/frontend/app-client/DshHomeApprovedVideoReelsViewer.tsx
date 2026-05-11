import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Modal, Pressable, StatusBar, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { Box, Text, colorPalette } from '@bthwani/ui-kit';
import type { MarketingVideoRecord } from '../shared/video.preview-store';


export type DshHomeApprovedVideoReelsViewerProps = {
  visible: boolean;
  items: MarketingVideoRecord[];
  initialIndex?: number;
  onClose: () => void;
  onCtaPress: (item: MarketingVideoRecord) => void;
  onItemImpression?: (item: MarketingVideoRecord) => void;
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

function applyAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '').trim();
  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

type ExpoVideoProps = {
  source: { uri: string };
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  shouldPlay?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  useNativeControls?: boolean;
  usePoster?: boolean;
  posterSource?: { uri: string };
};

type ExpoAvModule = {
  Video?: React.ComponentType<ExpoVideoProps>;
};

function resolveExpoAv(): ExpoAvModule | null {
  try {
    return require('expo-av') as ExpoAvModule;
  } catch {
    return null;
  }
}

export function DshHomeApprovedVideoReelsViewer({
  visible,
  items,
  initialIndex = 0,
  onClose,
  onCtaPress,
  onItemImpression,
}: DshHomeApprovedVideoReelsViewerProps) {
  const { height } = useWindowDimensions();
  const safeIndex = clampIndex(initialIndex, items.length);
  const listRef = React.useRef<FlatList<MarketingVideoRecord>>(null);
  const impressedIdsRef = React.useRef<Set<string>>(new Set());
  const onItemImpressionRef = React.useRef(onItemImpression);
  const [activeIndex, setActiveIndex] = React.useState(safeIndex);
  const expoAv = React.useMemo(() => resolveExpoAv(), []);
  const ExpoVideo = expoAv?.Video;

  React.useEffect(() => {
    onItemImpressionRef.current = onItemImpression;
  }, [onItemImpression]);

  React.useEffect(() => {
    impressedIdsRef.current.clear();
  }, [visible]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    setActiveIndex(safeIndex);

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: safeIndex, animated: false });
    });
  }, [safeIndex, visible]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const viewabilityConfig = React.useMemo(() => ({ itemVisiblePercentThreshold: 80 }), []);

  const handleViewableItemsChanged = React.useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null; item?: MarketingVideoRecord }> }) => {
    const nextIndex = viewableItems[0]?.index;
    const nextItem = viewableItems[0]?.item;

    if (typeof nextIndex === 'number') {
      setActiveIndex(nextIndex);
    }

    if (!nextItem || impressedIdsRef.current.has(nextItem.id)) {
      return;
    }

    impressedIdsRef.current.add(nextItem.id);
    onItemImpressionRef.current?.(nextItem);
  }).current;

  if (!visible) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Modal visible animationType="slide" presentationStyle="fullScreen" statusBarTranslucent onRequestClose={handleClose}>
        <StatusBar hidden />
        <View style={styles.emptyContainer}>
          <Pressable style={styles.closeButton} onPress={handleClose} accessibilityRole="button" accessibilityLabel="إغلاق">
            <Ionicons name="close" size={20} color={colorPalette.white} />
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
          <Ionicons name="close" size={20} color={colorPalette.white} />
        </Pressable>

        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          initialScrollIndex={safeIndex}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={handleViewableItemsChanged}
          renderItem={({ item, index }) => {
            const videoUri = resolveMediaUri(item.videoUrl);
            const posterUri = resolveMediaUri(item.posterUrl ?? item.videoUrl);
            const isActive = index === activeIndex;

            return (
              <View style={[styles.slideShell, { height }]}>
                <View style={styles.slideCard}>
                  <View style={styles.mediaShell}>
                    {videoUri && ExpoVideo ? (
                      <ExpoVideo
                        source={{ uri: videoUri }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                        shouldPlay={isActive}
                        isLooping
                        isMuted={false}
                        useNativeControls={false}
                        usePoster={Boolean(posterUri)}
                        posterSource={posterUri ? { uri: posterUri } : undefined}
                      />
                    ) : posterUri ? (
                      <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
                    ) : (
                      <View style={styles.posterFallback} />
                    )}

                    <View style={styles.mediaScrim} />

                    <View style={styles.mediaHeader}>
                      <View style={styles.mediaTag}>
                        <Text role="caption" style={styles.mediaTagText}>فيديو معتمد</Text>
                      </View>
                      <Text role="caption" style={styles.mediaSwipeHint}>اسحب للأعلى أو للأسفل</Text>
                    </View>

                    <View style={styles.mediaBody}>
                      <Box gap={2} style={styles.cardBody}>
                        <Text role="titleSm" style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text role="bodySm" style={styles.subtitle} numberOfLines={3}>{item.subtitle}</Text>
                        <Text role="bodySm" style={styles.highlight} numberOfLines={2}>{item.highlight}</Text>

                        <Pressable
                          style={[styles.ctaButton, { backgroundColor: item.accentColor }]}
                          onPress={() => onCtaPress(item)}
                          accessibilityRole="button"
                          accessibilityLabel={item.ctaLabel}
                        >
                          export {
                            DshHomeApprovedVideoReelsViewer,
                            type DshHomeApprovedVideoReelsViewerProps,
                          } from './parts/ApprovedVideoReelsViewer';
                    </View>
