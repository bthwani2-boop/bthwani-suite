import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useI18n, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { EsfRequest } from '../../../../uiTypes';

interface EsfRequestCardContentProps {
  item: EsfRequest;
  index: number;
  rowDirection: 'row' | 'row-reverse';
  canAccept: boolean;
  isProcessing: boolean;
  onAccept: (request: EsfRequest) => void;
}

export const EsfRequestCardContent: React.FC<EsfRequestCardContentProps> = ({
  item,
  index,
  rowDirection,
  canAccept,
  isProcessing,
  onAccept,
}) => {
  const { t } = useI18n();

  const isTopMatch = index === 0;
  const needsReviewFirst = item.status === 'pending' && !item.matchId;

  const urgencyColor = useMemo(() => {
    switch (item.urgency) {
      case 'low':
        return semanticRoles.stateSuccess.icon;
      case 'medium':
        return semanticRoles.stateWarning.icon;
      case 'high':
      case 'critical':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  }, [item.urgency]);

  const urgencyText = useMemo(() => {
    switch (item.urgency) {
      case 'low':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityLow');
      case 'medium':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityMedium');
      case 'high':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityHigh');
      case 'critical':
        return t('esf.app-client.mobile.auto_esf_home_get.priorityCritical');
      default:
        return item.urgency;
    }
  }, [item.urgency, t]);

  return (
    <View style={styles.cardContent}>
      <View style={[styles.topRow, { flexDirection: rowDirection }]}>
        {isTopMatch ? (
          <View style={styles.topMatchBadge}>
            <Text style={styles.topMatchText}>
              {t('esf.app-client.mobile.auto_esf_home_get.topMatchBadge')}
            </Text>
          </View>
        ) : (
          <View />
        )}

        <View
          style={[
            styles.urgencyBadge,
            { backgroundColor: urgencyColor + '16' },
          ]}
        >
          <Text style={[styles.urgencyText, { color: urgencyColor }]}>
            {urgencyText}
          </Text>
        </View>
      </View>

      <View style={[styles.cardHeader, { flexDirection: rowDirection }]}>
        <View
          style={[styles.bloodTypeBadge, { backgroundColor: urgencyColor }]}
        >
          <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardUnits}>
            {t('esf.app-client.mobile.auto_esf_home_get.unitsRequired', {
              count: item.units,
            })}
          </Text>
          <Text style={styles.cardHospital} numberOfLines={1}>
            {item.hospitalName || 'مركز طبي قريب'}
          </Text>
          <View style={[styles.metaRow, { flexDirection: rowDirection }]}>
            <Text style={styles.cardLocation} numberOfLines={1}>
              {item.location}
            </Text>
            {item.distance !== undefined ? (
              <Text style={styles.cardDistance}>
                {item.distance.toFixed(1)} كم
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={[styles.cardFooter, { flexDirection: rowDirection }]}>
        <Text style={styles.cardTime}>{item.timestamp}</Text>

        {canAccept && (
          <TouchableOpacity
            style={[
              styles.acceptButton,
              isProcessing && styles.acceptButtonDisabled,
            ]}
            onPress={e => {
              e?.stopPropagation?.();
              onAccept(item);
            }}
            disabled={isProcessing}
          >
            <Text style={styles.acceptButtonText}>
              {isProcessing ? 'جارٍ...' : 'قبول سريع'}
            </Text>
          </TouchableOpacity>
        )}

        {!canAccept && needsReviewFirst && (
          <Text style={styles.reviewHint}>راجع التفاصيل أولاً</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    padding: BTHWANI_SPACING.sm + 2,
    gap: BTHWANI_SPACING.xs + 2,
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.sm,
  },
  bloodTypeBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_SPACING.md,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
    gap: BTHWANI_SPACING.xs / 2,
  },
  topMatchBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs / 2,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.stateWarning.icon + '20',
    marginBottom: BTHWANI_SPACING.xs,
  },
  topMatchText: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.stateWarning.icon,
    fontWeight: '700',
  },
  cardUnits: {
    fontSize: BTHWANI_SPACING.md,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  cardHospital: {
    fontSize: BTHWANI_SPACING.sm + 2,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  metaRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.sm,
  },
  cardLocation: {
    flex: 1,
    fontSize: BTHWANI_SPACING.sm,
    color: semanticRoles.textMuted,
  },
  cardDistance: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.stateInfo.icon,
    fontWeight: '600',
    paddingHorizontal: BTHWANI_SPACING.xs + 2,
    paddingVertical: BTHWANI_SPACING.xs / 2,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateInfo.background,
  },
  urgencyBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  urgencyText: {
    fontSize: BTHWANI_SPACING.sm - 1,
    fontWeight: '700',
  },
  cardFooter: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: BTHWANI_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  cardTime: {
    fontSize: BTHWANI_SPACING.sm - 1,
    color: semanticRoles.textMuted,
  },
  acceptButton: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateSuccess.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  acceptButtonText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_SPACING.sm + 1,
    fontWeight: '700',
  },
  reviewHint: {
    fontSize: BTHWANI_SPACING.sm,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
});

