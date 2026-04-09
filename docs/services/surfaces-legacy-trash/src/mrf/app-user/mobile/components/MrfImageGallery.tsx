/**
 * MRF Image Gallery Component
 * Displays attached images in a beautiful grid layout with fullscreen modal
 * Features:
 * - Responsive grid (2-3 columns)
 * - Fullscreen modal with swipe navigation
 * - Lazy loading with placeholders
 * - Error handling with fallback icons
 * - Image counter badge
 */

import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { useMrfAdaptiveLayout } from './_mrfAdaptive';

interface Attachment {
  attachmentId?: string;
  url?: string;
  type?: string;
}

interface MrfImageGalleryProps {
  attachments: Attachment[] | string[];
  title?: string;
}

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

export const MrfImageGallery: React.FC<MrfImageGalleryProps> = ({
  attachments,
  title: titleProp,
}) => {
  const { t, isRTL } = useI18n();
  const { width: screenWidth } = useMrfAdaptiveLayout();
  const imageSize = (screenWidth - BTHWANI_SPACING.contentH * 2 - BTHWANI_SPACING.md) / 2;
  const title = titleProp ?? t('mrf.app-client.mobile.components.MrfImageGallery.attachedPhotos');
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Normalize attachments - handle both string arrays and object arrays
  const normalizedAttachments: Attachment[] = attachments.map((att) => {
    if (typeof att === 'string') {
      // If it's a string, check if it's a URL or attachment ID
      if (att.startsWith('http://') || att.startsWith('https://')) {
        return { url: att, type: 'image' };
      }
      return { attachmentId: att, type: 'image' };
    }
    return att;
  });

  // Filter only image attachments
  const imageAttachments = normalizedAttachments.filter(
    (att) => {
      if (att.type === 'image') return true;
      if (att.url) {
        return att.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      }
      return true; // Assume image if no type specified
    }
  );

  if (imageAttachments.length === 0) {
    return null;
  }

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const getImageUrl = (attachment: Attachment): string | null => {
    if (attachment.url) {
      // If URL is absolute, use it directly
      if (attachment.url.startsWith('http://') || attachment.url.startsWith('https://')) {
        return attachment.url;
      }
      // If relative, construct full URL
      const baseUrl = getBaseUrl();
      return `${baseUrl}${attachment.url.startsWith('/') ? '' : '/'}${attachment.url}`;
    }
    // If only attachmentId, construct URL
    if (attachment.attachmentId) {
      const baseUrl = getBaseUrl();
      return `${baseUrl}/api/platform/attachments/${attachment.attachmentId}`;
    }
    return null;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title} ({imageAttachments.length})</Text>
      
      <View style={[styles.grid, { flexDirection: 'row', direction: layoutDirection }]}>
        {imageAttachments.map((attachment, index) => {
          const imageUrl = getImageUrl(attachment);
          const hasError = imageErrors.has(index);

          if (!imageUrl || hasError) {
            return (
              <View key={index} style={[styles.imageContainer, styles.errorContainer, { width: imageSize, height: imageSize }]}>
                <Text style={styles.errorIcon}>📷</Text>
                <Text style={styles.errorText}>{t('mrf.app-client.mobile.MrfImageGallery.loadFailed')}</Text>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.imageContainer, { width: imageSize, height: imageSize }]}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
                onError={() => handleImageError(index)}
              />
              {index === 0 && imageAttachments.length > 1 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>+{imageAttachments.length - 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Fullscreen Modal */}
      {selectedImageIndex !== null && (
        <Modal
          visible={selectedImageIndex !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseText}>✕ إغلاق</Text>
            </TouchableOpacity>
            
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: selectedImageIndex * screenWidth, y: 0 }}
            >
              {imageAttachments.map((attachment, index) => {
                const imageUrl = getImageUrl(attachment);
                if (!imageUrl) return null;

                return (
                  <View key={index} style={[styles.fullscreenImageContainer, { width: screenWidth }]}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.fullscreenImage}
                      resizeMode="contain"
                    />
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {imageAttachments.length}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: BTHWANI_SPACING.md,
  },
  imageContainer: {
    borderRadius: BTHWANI_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: semanticRoles.surfaceSubtle,
    position: 'relative',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: BTHWANI_SPACING.xs,
    end: BTHWANI_SPACING.xs,
    backgroundColor: 'BTHWANI_COLORS.overlay70',
    borderRadius: BTHWANI_RADIUS.full,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  badgeText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  errorIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['3xl'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  errorText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'BTHWANI_COLORS.overlay95',
  },
  modalCloseButton: {
    position: 'absolute',
    top: BTHWANI_SPACING.lg,
    end: BTHWANI_SPACING.lg,
    zIndex: 10,
    backgroundColor: 'BTHWANI_COLORS.overlay',
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.full,
  },
  modalCloseText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  fullscreenImageContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.lg,
    alignSelf: 'center',
    backgroundColor: 'BTHWANI_COLORS.overlay',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
  },
  imageCounterText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
});


