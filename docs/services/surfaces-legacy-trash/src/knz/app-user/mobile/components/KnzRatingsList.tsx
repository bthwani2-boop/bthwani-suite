import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';

export interface KnzRatingItem {
  id: string;
  score: number;
  comment?: string;
  createdAt?: string;
  ratorUserId?: string;
}

interface KnzRatingsListProps {
  items: KnzRatingItem[];
}

export const KnzRatingsList: React.FC<KnzRatingsListProps> = ({ items }) => {
  const { isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  if (!items?.length) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>لا توجد تقييمات بعد لهذه الصفحة.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={[styles.headerRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.scoreText}>
              {item.score} <Text style={styles.star}>⭐</Text>
            </Text>
            {item.createdAt ? (
              <Text style={styles.dateText}>{item.createdAt.slice(0, 10)}</Text>
            ) : null}
          </View>
          {item.comment ? (
            <Text style={styles.commentText}>{item.comment}</Text>
          ) : (
            <Text style={styles.commentMuted}>لا يوجد تعليق نصي.</Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  emptyWrap: {
    paddingVertical: BTHWANI_SPACING.md,
  },
  emptyText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  separator: {
    height: BTHWANI_SPACING.sm,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
  },
  headerRow: {
        justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  star: {
    color: BTHWANI_COLORS.warning,
  },
  dateText: {
    fontSize: 11,
    color: semanticRoles.textMuted,
  },
  commentText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  commentMuted: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
});

