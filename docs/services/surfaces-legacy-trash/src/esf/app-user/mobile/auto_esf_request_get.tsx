// ESF Request Get Screen - Blood Donation Request Details
// Surface: app-client | Service: esf
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import { buildEsfRequestGetMock, type EsfRequestDetail } from '../../hooks';
import type { EsfContactMethod, EsfMedicalReasonUi } from '../../uiTypes';
import { EsfRequestCancelConfirmSheet } from './components/EsfRequestCancelConfirmSheet';

function normalizeContactMethod(raw: unknown): EsfContactMethod | undefined {
  if (raw === 'chat') return 'in_app';
  if (raw === 'phone' || raw === 'whatsapp' || raw === 'in_app') return raw;
  return undefined;
}

function getContactMethodMeta(method?: EsfContactMethod): {
  icon: string;
  label: string;
  hint: string;
} {
  switch (method) {
    case 'whatsapp':
      return {
        icon: '📱',
        label: 'واتساب',
        hint: 'يظهر هذا الخيار للطرف المطابق فقط داخل تفاصيل الطلب أو المطابقة.',
      };
    case 'phone':
      return {
        icon: '☎️',
        label: 'اتصال هاتفي',
        hint: 'يظهر رقم التواصل فقط عندما يكون الطلب والمطابقة في السياق الصحيح.',
      };
    case 'in_app':
    default:
      return {
        icon: '💬',
        label: 'دردشة داخلية',
        hint: 'أيقونة الدردشة تظهر للطرفين داخل تفاصيل الطلب أو المطابقة بعد وجود فرصة فعلية.',
      };
  }
}

interface auto_esf_request_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route?: { params?: { requestId?: string } };
}

export const auto_esf_request_get: React.FC<
  auto_esf_request_getProps
> = props => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const { onNavigate, navigation, route } = props;
  const [state, setState] = useState<ScreenState>('loading');
  const requestId = route?.params?.requestId || 'REQ-001';
  const [requestDetail, setRequestDetail] = useState<EsfRequestDetail | null>(
    null
  );

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      const nav = navigation?.navigate as
        | ((s: string, p?: Record<string, unknown>) => void)
        | undefined;
      if (nav) {
        nav(screen, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  const loadRequest = useCallback(async () => {
    if (!requestId) {
      setState('error');
      return;
    }

    try {
      setState('loading');

      const response = await rawFetch(
        `${getBaseUrl()}/api/esf/requests/${encodeURIComponent(requestId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || 'فشل في تحميل تفاصيل الطلب');
      }

      const mock = buildEsfRequestGetMock(t, requestId);
      const data = json?.data || {};
      const matchedDonorsRaw =
        data.matched_donors || data.matchedDonors || data.matches || [];

      setRequestDetail({
        ...mock,
        bloodType:
          data.medical_info?.blood_type || data.blood_type || mock.bloodType,
        units: Number(data.medical_info?.units || data.units || mock.units),
        status: String(data.status || mock.status).toLowerCase(),
        urgency: String(
          data.priority || data.urgency || mock.urgency
        ).toLowerCase(),
        location: {
          address:
            data.location?.address || data.location || mock.location.address,
          coordinates: data.location?.coordinates || mock.location.coordinates,
        },
        hospitalName:
          data.medical_info?.hospital_name ||
          data.hospital_name ||
          mock.hospitalName,
        beneficiary:
          data.medical_info?.beneficiary ||
          data.beneficiary ||
          mock.beneficiary,
        medicalReason: (data.medical_info?.medical_reason ||
          data.medical_reason ||
          mock.medicalReason) as EsfMedicalReasonUi | undefined,
        medicalReasonLabel:
          data.medical_info?.medical_reason_label ||
          data.medical_reason_label ||
          data.patient?.condition ||
          mock.medicalReasonLabel,
        medicalReasonNote:
          data.medical_info?.medical_reason_note ||
          data.medical_reason_note ||
          data.notes ||
          mock.medicalReasonNote,
        contactMethod: normalizeContactMethod(
          data.medical_info?.contact_method ||
            data.contact_method ||
            data.contactPreference ||
            mock.contactMethod
        ),
        contactInfo:
          data.medical_info?.contact_info ||
          data.contact_info ||
          data.requester?.phone ||
          mock.requester.phone,
        requester: {
          name:
            data.requester?.name || data.requester_name || mock.requester.name,
          phone:
            data.requester?.phone || data.contact_info || mock.requester.phone,
        },
        patient: {
          name:
            data.patient?.name ||
            data.medical_info?.patient_name ||
            data.patient_name ||
            mock.patient.name,
          age: Number(data.patient?.age || mock.patient.age),
          condition:
            data.patient?.condition ||
            data.medical_info?.medical_reason_label ||
            mock.patient.condition,
        },
        matchedDonors:
          Array.isArray(matchedDonorsRaw) && matchedDonorsRaw.length > 0
            ? matchedDonorsRaw.map((donor: any, index: number) => ({
                id: donor.match_id || donor.id || `MATCH-${index + 1}`,
                name: donor.name || donor.donor_name || `متبرع ${index + 1}`,
                distance: donor.distance
                  ? `${donor.distance} كم`
                  : mock.matchedDonors[0]?.distance || '—',
                eta: donor.eta
                  ? `${donor.eta} دقيقة`
                  : mock.matchedDonors[0]?.eta || '—',
              }))
            : mock.matchedDonors,
        timeline:
          Array.isArray(data.timeline) && data.timeline.length > 0
            ? data.timeline
            : mock.timeline,
        notes: data.notes || mock.notes,
        createdAt: data.created_at || data.createdAt || mock.createdAt,
        expiresAt: data.expires_at || data.expiresAt || mock.expiresAt,
      });

      setState('content');
    } catch (error) {
      console.error('Failed to load request:', error);
      setState('error');
    }
  }, [requestId, t]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const handleRetry = useCallback(() => {
    void loadRequest();
  }, [loadRequest]);

  const request = useMemo(
    () => requestDetail || buildEsfRequestGetMock(t, requestId),
    [requestDetail, requestId, t]
  );
  const contactMeta = useMemo(
    () => getContactMethodMeta(request.contactMethod),
    [request.contactMethod]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return semanticRoles.stateWarning.icon;
      case 'matched':
        return semanticRoles.stateInfo.icon;
      case 'completed':
        return semanticRoles.stateSuccess.icon;
      case 'cancelled':
        return semanticRoles.stateError.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('esf.app-client.mobile.auto_esf_request_get.pending');
      case 'matched':
        return t('esf.app-client.mobile.auto_esf_request_get.matched');
      case 'completed':
        return t('esf.app-client.mobile.auto_esf_request_get.completed');
      case 'cancelled':
        return t('esf.app-client.mobile.auto_esf_request_get.cancelledAlt');
      default:
        return status;
    }
  };

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
        return t('esf.app-client.mobile.auto_esf_request_get.priorityLow');
      case 'medium':
        return t('esf.app-client.mobile.auto_esf_request_get.priorityMedium');
      case 'high':
        return t('esf.app-client.mobile.auto_esf_request_get.priorityHigh');
      case 'critical':
        return t('esf.app-client.mobile.auto_esf_request_get.priorityCritical');
      default:
        return urgency;
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>تفاصيل طلب التبرع</Text>
            <Text style={styles.requestId}>الطلب: {request.id}</Text>
          </View>

          <View style={styles.statusCard}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(request.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(request.status)}
              </Text>
            </View>
            <View
              style={[
                styles.urgencyBadge,
                { backgroundColor: getUrgencyColor(request.urgency) },
              ]}
            >
              <Text style={styles.urgencyText}>
                ⚠️ {getUrgencyText(request.urgency)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات التبرع</Text>
            <View style={styles.card}>
              <View style={styles.bloodTypeRow}>
                <View
                  style={[
                    styles.bloodTypeBadge,
                    { backgroundColor: semanticRoles.stateError.icon },
                  ]}
                >
                  <Text style={styles.bloodTypeText}>{request.bloodType}</Text>
                </View>
                <View style={styles.bloodTypeInfo}>
                  <Text style={styles.unitsText}>
                    {request.units} وحدة مطلوبة
                  </Text>
                  <Text style={styles.hospitalName}>
                    {request.hospitalName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات المريض</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>الاسم:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.patient.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>العمر:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.patient.age} سنة
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>الحالة الطبية:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.patient.condition}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>سبب الحاجة للدم</Text>
            <View style={styles.card}>
              <View style={styles.reasonBadge}>
                <Text style={styles.reasonBadgeText}>
                  {request.medicalReasonLabel ||
                    request.patient.condition ||
                    'سبب طبي غير محدد'}
                </Text>
              </View>
              {request.medicalReasonNote ? (
                <Text style={[styles.reasonNote, textAlignStart]}>
                  {request.medicalReasonNote}
                </Text>
              ) : null}
              <Text style={styles.reasonHelper}>
                هذا الوصف يظهر للمتبرعين لشرح الحاجة الطبية بسرعة ومن دون سرد
                طويل.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات الطالب</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>الاسم:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.requester.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>الهاتف:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.requester.phone}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التواصل المعتمد</Text>
            <View style={styles.card}>
              <View style={styles.contactMethodCard}>
                <Text style={styles.contactMethodIcon}>{contactMeta.icon}</Text>
                <View style={styles.contactMethodCopy}>
                  <Text style={styles.contactMethodTitle}>
                    {contactMeta.label}
                  </Text>
                  <Text style={[styles.contactMethodHint, textAlignStart]}>
                    {contactMeta.hint}
                  </Text>
                </View>
              </View>
              {request.contactMethod !== 'in_app' && request.contactInfo ? (
                <Text style={[styles.contactValue, textAlignStart]}>
                  {request.contactInfo}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الموقع</Text>
            <View style={styles.card}>
              <Text style={styles.locationText}>
                📍 {request.location.address}
              </Text>
            </View>
          </View>

          {request.matchedDonors && request.matchedDonors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                المتبرعون المتطابقون ({request.matchedDonors.length})
              </Text>
              {request.matchedDonors.map((donor, index) => (
                <View key={index} style={styles.donorCard}>
                  <Text style={styles.donorName}>👤 {donor.name}</Text>
                  <View style={styles.donorDetails}>
                    <Text style={styles.donorDetail}>
                      📏 المسافة: {donor.distance}
                    </Text>
                    <Text style={styles.donorDetail}>
                      ⏱️ الوقت المتوقع: {donor.eta}
                    </Text>
                  </View>
                  {request.contactMethod === 'in_app' ? (
                    <View style={styles.inlineContactBadge}>
                      <Text style={styles.inlineContactBadgeText}>
                        💬 الدردشة الداخلية متاحة داخل تفاصيل التطابق
                      </Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.viewMatchButton}
                    onPress={() =>
                      handleNavigate('EsfMatchGet', { matchId: donor.id })
                    }
                  >
                    <Text style={styles.viewMatchText}>عرض التطابق</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الجدول الزمني</Text>
            <View style={styles.card}>
              {request.timeline.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                    <Text style={styles.timelineEvent}>{item.event}</Text>
                    <Text style={styles.timelineDetails}>{item.details}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {request.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ملاحظات</Text>
              <View style={styles.card}>
                <Text style={styles.notesText}>{request.notes}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات إضافية</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>تاريخ الإنشاء:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.createdAt}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>تاريخ الانتهاء:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>
                  {request.expiresAt}
                </Text>
              </View>
            </View>
          </View>

          {request.status !== 'completed' && request.status !== 'cancelled' && (
            <View style={styles.actionsContainer}>
              <EsfRequestCancelConfirmSheet
                requestId={request.id}
                onViewMyRequests={() =>
                  handleNavigate('EsfHome', { esfFocus: 'myRequests' })
                }
              />
            </View>
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(
        'esf.app-client.mobile.auto_esf_request_get.loadingMessage'
      )}
      errorMessage={t(
        'esf.app-client.mobile.auto_esf_request_get.errorLoadMessage'
      )}
      onErrorAction={handleRetry}
      screenName='auto_esf_request_get'
      operationName='esf_request_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  requestId: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  urgencyBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  urgencyText: {
    color: semanticRoles.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bloodTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodTypeBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: 20,
    fontWeight: '700',
  },
  bloodTypeInfo: {
    flex: 1,
  },
  unitsText: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  hospitalName: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  reasonBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateError.background,
    marginBottom: BTHWANI_SPACING.sm,
  },
  reasonBadgeText: {
    color: semanticRoles.stateError.icon,
    fontSize: 13,
    fontWeight: '800',
  },
  reasonNote: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reasonHelper: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  locationText: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  contactMethodIcon: {
    fontSize: 22,
  },
  contactMethodCopy: {
    flex: 1,
    gap: 2,
  },
  contactMethodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  contactMethodHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    lineHeight: 18,
  },
  contactValue: {
    marginTop: BTHWANI_SPACING.sm,
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  donorCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  donorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  donorDetail: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  inlineContactBadge: {
    alignSelf: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateInfo.background,
  },
  inlineContactBadgeText: {
    fontSize: 12,
    color: semanticRoles.stateInfo.icon,
    fontWeight: '700',
  },
  viewMatchButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  viewMatchText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: semanticRoles.stateError.icon,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.xs,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.stateError.icon,
    marginBottom: BTHWANI_SPACING.xs,
  },
  timelineEvent: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  timelineDetails: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  notesText: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  actionsContainer: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  cancelButton: {
    backgroundColor: semanticRoles.stateError.icon,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: semanticRoles.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.lg,
    borderTopRightRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
    gap: BTHWANI_SPACING.sm,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.sm,
  },
  modalInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    textAlignVertical: 'top',
  },
  modalActions: {
    marginTop: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
    justifyContent: 'space-between',
  },
  modalSecondaryBtn: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  modalSecondaryBtnText: {
    color: semanticRoles.text,
    fontWeight: '600',
  },
  modalDestructiveBtn: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateError.icon,
    alignItems: 'center',
  },
  modalDestructiveBtnText: {
    color: semanticRoles.surface,
    fontWeight: '700',
  },
});

export default auto_esf_request_get;

