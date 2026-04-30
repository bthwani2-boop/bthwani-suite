/**
 * ESF Request Mini Details Sheet
 * §UX-SUPREME-001: Quick details view with accept gated by a real match.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { EsfBottomSheet } from './EsfBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { EsfRequest } from '../../../uiTypes';

interface EsfRequestMiniDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  request: EsfRequest | null;
  onAccept: (request: EsfRequest) => void;
  mode: 'donor' | 'requester';
}

export const EsfRequestMiniDetailsSheet: React.FC<
  EsfRequestMiniDetailsSheetProps
> = ({ visible, onClose, request, onAccept, mode }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );

  if (!request) return null;

  const canAccept =
    mode === 'donor' &&
    request.status === 'pending' &&
    Boolean(request.matchId);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return semanticRoles.stateSuccess.icon;
      case 'medium':
        return semanticRoles.stateWarning.icon;
      case 'high':
        return semanticRoles.stateError.icon;
      case 'critical':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return t('surfaces.منخفض');
      case 'medium':
        return t('surfaces.متوسط');
      case 'high':
        return t('surfaces.عالي');
      case 'critical':
        return t('surfaces.حرج');
      default:
        return urgency;
    }
  };

  const handleAccept = () => {
    onAccept(request);
    onClose();
  };

  const handleDirections = () => {
    // Open maps with location
    if (request.locationCoords) {
      const url = `https://www.google.com/maps/search/?api=1&query=${request.locationCoords.lat},${request.locationCoords.lng}`;
      Linking.openURL(url).catch(() => {
        // Fallback if maps app not available
      });
    }
  };

  return (
    <EsfBottomSheet
      visible={visible}
      onClose={onClose}
      height='medium'
      title={`طلب ${request.id}`}
      showHandle={true}
      enableSwipeDown={true}
    >
      <View style={styles.container}>
        {/* Blood Type Badge */}
        <View style={styles.header}>
          <View
            style={[
              styles.bloodTypeBadge,
              { backgroundColor: getUrgencyColor(request.urgency) },
            ]}
          >
            <Text style={styles.bloodTypeText}>{request.bloodType}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.unitsText}>{request.units} وحدة مطلوبة</Text>
            <View
              style={[
                styles.urgencyBadge,
                { backgroundColor: getUrgencyColor(request.urgency) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.urgencyText,
                  { color: getUrgencyColor(request.urgency) },
                ]}
              >
                {getUrgencyText(request.urgency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>المستشفى:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>
              {request.hospitalName || request.location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الموقع:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>
              {request.location}
            </Text>
          </View>
          {request.distance !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>المسافة:</Text>
              <Text style={[styles.detailValue, textAlignStart]}>
                {request.distance.toFixed(1)} كم
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>الوقت:</Text>
            <Text style={[styles.detailValue, textAlignStart]}>
              {request.timestamp}
            </Text>
          </View>
        </View>

        {/* Actions */}
        {mode === 'donor' && (canAccept || Boolean(request.locationCoords)) && (
          <View style={styles.actions}>
            {!canAccept && request.status === 'pending' ? (
              <Text style={styles.helperText}>
                سيظهر زر تأكيد التبرع بعد إنشاء تطابق فعلي.
              </Text>
            ) : null}
            {canAccept ? (
              <TouchableOpacity
                style={[
                  styles.acceptButton,
                  { backgroundColor: semanticRoles.stateSuccess.icon },
                ]}
                onPress={handleAccept}
              >
                <Text style={styles.acceptButtonText}>✓ سأتبرع الآن</Text>
              </TouchableOpacity>
            ) : null}
            {request.locationCoords && (
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={handleDirections}
              >
                <Text style={styles.directionsButtonText}>🗺️ اتجاهات</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </EsfBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: BTHWANI_SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  bloodTypeBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: 24,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    gap: BTHWANI_SPACING.xs,
  },
  unitsText: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs / 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  details: {
    gap: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  actions: {
    gap: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  acceptButton: {
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
  directionsButton: {
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsButtonText: {
    color: semanticRoles.primaryCTA,
    fontSize: 14,
    fontWeight: '600',
  },
});
