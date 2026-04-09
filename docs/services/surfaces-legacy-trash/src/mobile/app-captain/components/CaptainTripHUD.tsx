/**
 * CaptainTripHUD — Mini Header Under Top Bar
 * §UX-SUPREME-001: Trip context without distraction
 *
 * Features:
 * - Current stage display
 * - Time remaining (ETA)
 * - "View Details" button
 * - Auto-hide during driving (optional)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';

export type TripStage =
  | 'going_to_pickup'
  | 'arrived'
  | 'picked'
  | 'dropped'
  | 'delivered';

interface CaptainTripHUDProps {
  stage: TripStage;
  timeRemaining?: string; // ETA format: t('surfaces.5_دقائق')
  areaName?: string;
  onViewDetails?: () => void;
  visible?: boolean;
}

const STAGE_ICONS: Record<TripStage, string> = {
  going_to_pickup: 'location-on',
  arrived: 'location-on',
  picked: 'check-circle',
  dropped: 'location-on',
  delivered: 'check-circle',
};

export const CaptainTripHUD: React.FC<CaptainTripHUDProps> = ({
  stage,
  timeRemaining,
  areaName,
  onViewDetails,
  visible = true,
}) => {
  const { forwardCaret, rowStyle, t } = useDirection();
  const stageLabels: Record<TripStage, string> = {
    going_to_pickup: t('surfaces.في_الطريق_للمطعم'),
    arrived: t('surfaces.وصلت_للمطعم'),
    picked: t('surfaces.استلمت_الطلب'),
    dropped: t('surfaces.وصلت_للعميل'),
    delivered: t('surfaces.تم_التسليم'),
  };
  if (!visible) {
    return null;
  }

  const stageColor =
    stage === 'picked' || stage === 'delivered'
      ? semanticRoles.stateSuccess
      : semanticRoles.stateWarning;

  return (
    <View style={styles.container}>
      <View style={[styles.content, rowStyle]}>
        {/* Stage Indicator */}
        <View
          style={[
            styles.stageBadge,
            { backgroundColor: stageColor.background },
            rowStyle,
          ]}
        >
          <ServiceIcon
            name={STAGE_ICONS[stage]}
            size={16}
            color={stageColor.icon}
          />
          <Text style={[styles.stageText, { color: stageColor.text }]}>
            {stageLabels[stage]}
          </Text>
        </View>

        {/* Time + Area */}
        {(timeRemaining || areaName) && (
          <View style={styles.infoContainer}>
            {timeRemaining && (
              <Text style={styles.timeText}>{timeRemaining}</Text>
            )}
            {areaName && <Text style={styles.areaText}>{areaName}</Text>}
          </View>
        )}

        {/* View Details Button */}
        {onViewDetails && (
          <TouchableOpacity
            style={[styles.detailsButton, rowStyle]}
            onPress={onViewDetails}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>عرض التفاصيل</Text>
            <Text style={styles.detailsChevron}>{forwardCaret}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageBadge: {
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    gap: BTHWANI_SPACING.xs / 2,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  areaText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  detailsButton: {
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    gap: BTHWANI_SPACING.xs / 2,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  detailsChevron: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    marginStart: BTHWANI_SPACING.xs / 2,
  },
});
