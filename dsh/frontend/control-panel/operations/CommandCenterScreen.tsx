'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelRecommendation,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import {
  OPERATIONS_PULSE_METRICS,
} from './operations.preview-data';
import styles from '../shared/control-panel-surface.module.css';

export type CommandCenterScreenProps = { hubHref: string; subGroup?: string; };

const TOP_SUGGESTIONS = [
  {
    id: 'sug-1',
    label: 'تكدس شمال الرياض — فعّل الحافز فورًا',
    reason: '45 طلب بدون كابتن في منطقة الشمال',
    confidence: 'high' as const,
    action: 'تفعيل وضع الذروة',
    href: `?workspace=area-capacity`,
    risk: 'critical' as const,
  },
  {
    id: 'sug-2',
    label: '32 طلب بدون إسناد — تدخّل الآن',
    reason: 'قائمة الإسناد تتراكم وكباتن متاحون غير مستغلين',
    confidence: 'high' as const,
    action: 'فتح الإسناد',
    href: `?workspace=dispatch-assignment`,
    risk: 'high' as const,
  },
  {
    id: 'sug-3',
    label: '12 استثناء مفتوح — راجع قائمة الإسناد',
    reason: 'استثناءات بدون مالك تزيد من خطر خرق SLA',
    confidence: 'medium' as const,
    action: 'فتح الاستثناءات',
    href: `?workspace=exceptions-escalations`,
    risk: 'medium' as const,
  },
] as const;

const QUICK_ACTIONS = [
  { id: 'QA-1', label: 'إعادة إسناد 12 طلب متأخر', time: 'منذ 5 دقائق', workspace: 'dispatch-assignment' },
  { id: 'QA-2', label: 'تواصل مع المتجر رقم 402', time: 'منذ 12 دقيقة', workspace: 'partner-stores' },
  { id: 'QA-3', label: 'تصعيد شكوى عميل (تأخير)', time: 'منذ 18 دقيقة', workspace: 'audit-support-sla' },
] as const;

export function CommandCenterScreen({ hubHref, subGroup }: CommandCenterScreenProps) {
  const router = useRouter();

  return (
    <div className={styles.surfaceCockpitContent}>
      {/* 1. Header — Compact Title */}
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>نبض العمليات</h2>
        <p className={styles.surfaceSectionSubtitle}>متابعة الأداء العام والتدخلات السريعة</p>
      </div>

      <div className={styles.surfaceGridTwoCol}>
        {/* 2. Top System Recommendations */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>أعلى توصيات النظام الآن</h3>
          <div className={styles.surfaceStackSmall}>
            {TOP_SUGGESTIONS.map((s) => (
              <WebControlPanelRecommendation
                key={s.id}
                title={s.label}
                reason={s.reason}
                confidence={s.confidence}
                auditTag={s.risk === 'critical' ? 'خطر حرج' : undefined}
                primaryAction={{
                  id: `action-${s.id}`,
                  label: s.action,
                  onAction: () => router.push(`${hubHref}${s.href}`)
                }}
              />
            ))}
          </div>
        </div>

        {/* 3. Urgent Interventions */}
        <div className={styles.surfaceCompactPanel}>
          <h3 className={styles.surfacePanelTitle}>تدخل سريع مطلوب</h3>
          <div className={styles.surfaceStackSmall}>
            {QUICK_ACTIONS.map((action) => (
              <WebControlPanelDecisionRow
                key={action.id}
                entityId={action.id}
                entityLabel={action.label}
                sla={action.time}
                status="مطلوب"
                statusTone="warning"
                primaryAction={{
                  id: `go-${action.id}`,
                  label: 'انتقل',
                  onAction: () => router.push(`${hubHref}?workspace=${action.workspace}`)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandCenterScreen;
