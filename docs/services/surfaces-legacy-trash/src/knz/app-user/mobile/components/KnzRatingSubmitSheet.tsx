import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { semanticRoles, ScreenWrapper, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface KnzRatingSubmitSheetProps {
  visible: boolean;
  targetType: 'listing' | 'seller';
  targetId: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

const NS = 'surfaces.knzappusermobileKnzRatingSubmitSheet';

export const KnzRatingSubmitSheet: React.FC<KnzRatingSubmitSheetProps> = ({
  visible,
  targetType,
  targetId,
  onClose,
  onSubmitted,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [state, setState] = useState<'content' | 'loading' | 'error'>('content');

  if (!visible) return null;

  const submit = async () => {
    try {
      setState('loading');
      const baseUrl = getBaseUrl();
      const res = await rawFetch(`${baseUrl}/api/knz/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetType,
          targetId,
          score,
          comment: comment.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إرسال التقييم');
      setState('content');
      onSubmitted?.();
      onClose();
    } catch {
      setState('error');
    }
  };

  return (
    <View style={styles.overlay}>
      <ScreenWrapper
        state={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'content'}
        loadingMessage={t(`${NS}.loadingMessage`)}
        errorMessage={t(`${NS}.errorMessage`)}
        onErrorAction={() => setState('content')}
        screenName={t('surfaces.KnzRatingSubmitSheet')}
        operationName="knz_rating_submit"
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{t(`${NS}.title`)}</Text>
          <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>

          <View style={[styles.starsRow, { flexDirection: 'row', direction: layoutDirection }]}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setScore(value)}
                style={styles.starButton}
                accessibilityLabel={`${value} نجوم`}
              >
                <Text style={[styles.star, value <= score ? styles.starActive : styles.starInactive]}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder={t(`${NS}.commentPlaceholder`)}
            placeholderTextColor={semanticRoles.textMuted}
            multiline
            value={comment}
            onChangeText={setComment}
          />

          <View style={[styles.actionsRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryText}>{t(`${NS}.cancel`)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={submit}>
              <Text style={styles.primaryText}>{t(`${NS}.submit`)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    backgroundColor: BTHWANI_COLORS.overlay38,
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.md,
  },
  starButton: {
    flex: 1,
    alignItems: 'center',
  },
  star: {
    fontSize: 26,
  },
  starActive: {
    opacity: 1,
  },
  starInactive: {
    opacity: 0.3,
  },
  input: {
    minHeight: 80,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.text,
    textAlignVertical: 'top',
    marginBottom: BTHWANI_SPACING.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  primaryButton: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
  },
});

