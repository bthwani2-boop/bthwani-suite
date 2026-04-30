/**
 * ESF My Requests Sheet
 * §UX-SUPREME-001: Bottom Sheet for managing user's own requests
 * 
 * Features:
 * - Compact list of user's requests
 * - Status indicators (open/matched/closed)
 * - Response count
 * - Quick actions: Edit / Cancel
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { EsfBottomSheet } from './EsfBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { EsfRequest } from '../../../uiTypes';

interface EsfMyRequestsSheetProps {
  visible: boolean;
  onClose: () => void;
  requests: EsfRequest[];
  onEdit: (request: EsfRequest) => void;
  onCancel: (request: EsfRequest) => void;
  /** Opens full request detail (canonical EsfRequestGet route). */
  onViewDetail?: (request: EsfRequest) => void;
}

export const EsfMyRequestsSheet: React.FC<EsfMyRequestsSheetProps> = ({
  visible,
  onClose,
  requests,
  onEdit,
  onCancel,
  onViewDetail,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.icon;
      case 'matched': return semanticRoles.stateSuccess.icon;
      case 'completed': return semanticRoles.stateSuccess.icon;
      case 'cancelled': return semanticRoles.textMuted;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('surfaces.مفتوح');
      case 'matched': return t('surfaces.تمت_الاستجابة');
      case 'completed': return t('surfaces.مكتمل');
      case 'cancelled': return t('surfaces.مغلق');
      default: return status;
    }
  };

  const handleCancel = (request: EsfRequest) => {
    Alert.alert(
      t('surfaces.إلغاء_الطلب'),
      t('surfaces.هل_أنت_متأكد_من_إلغاء_هذا_الطلب؟'),
      [
        { text: t('surfaces.لا'), style: 'cancel' },
        {
          text: t('surfaces.نعم،_إلغاء'),
          style: 'destructive',
          onPress: () => onCancel(request),
        },
      ]
    );
  };

  const renderRequest = ({ item }: { item: EsfRequest }) => {
    const statusColor = getStatusColor(item.status);
    const statusText = getStatusText(item.status);

    const header = (
      <View style={[styles.requestHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={[styles.bloodTypeBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.bloodTypeText}>{item.bloodType}</Text>
        </View>
        <View style={styles.requestInfo}>
          <Text style={styles.requestUnits}>{item.units} وحدة</Text>
          <Text style={styles.requestHospital}>{item.hospitalName || item.location}</Text>
          <View style={[styles.requestMeta, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
            {item.responsesCount !== undefined && item.responsesCount > 0 && (
              <Text style={styles.responsesCount}>
                {item.responsesCount} استجابة
              </Text>
            )}
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.requestCard}>
        {onViewDetail ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onViewDetail(item)}
            accessibilityRole='button'
          >
            {header}
          </TouchableOpacity>
        ) : (
          header
        )}

        {item.status === 'pending' && (
          <View style={[styles.requestActions, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => {
                onEdit(item);
                onClose();
              }}
            >
              <Text style={styles.editButtonText}>✏️ تعديل</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancel(item)}
            >
              <Text style={styles.cancelButtonText}>✕ إلغاء</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <EsfBottomSheet
      visible={visible}
      onClose={onClose}
      height="large"
      title={`طلباتي (${requests.length})`}
      showHandle={true}
      enableSwipeDown={true}
    >
      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>لا توجد طلبات</Text>
          <Text style={styles.emptySubtitle}>لم تقم بإنشاء أي طلبات بعد</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </EsfBottomSheet>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: BTHWANI_SPACING.xl,
  },
  requestCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  bloodTypeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  requestInfo: {
    flex: 1,
  },
  requestUnits: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  requestHospital: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  requestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs / 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  responsesCount: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  requestActions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    paddingTop: BTHWANI_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  editButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: semanticRoles.stateError.background,
    borderWidth: 1,
    borderColor: semanticRoles.stateError.icon,
  },
  cancelButtonText: {
    color: semanticRoles.stateError.icon,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
});
