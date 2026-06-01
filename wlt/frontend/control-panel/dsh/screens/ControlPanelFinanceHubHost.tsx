'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlPanelWorkspaceTabs, WebControlPanelSubTabs } from '@bthwani/ui-kit/web';
import {
  buildFinanceHref,
  getFinanceGroupMeta,
  FINANCE_CANONICAL_GROUPS,
  normalizeFinanceLocation,
} from '../constants/finance.registry';
import type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState } from '../models/financeRouting.types';
import { getDshControlPanelGovernanceEntry } from '../../../../../dsh/frontend/control-panel/shared';
import { getWltControlPanelFinancePreview, buildWltFinancialCenter } from '../financeContracts';

import { FinancialCenterScreen } from './FinancialCenterScreen';
import { LedgerScreen } from './LedgerScreen';
import { AuditCloseScreen } from './AuditCloseScreen';
import { DailyReconciliationWorkbench } from './DailyReconciliationWorkbench';
import {
  ControlPanelDshCodReconciliationScreen,
  ControlPanelDshSettlementScreen,
  ControlPanelDshRefundQueueScreen,
  ControlPanelDshRiskAuditScreen,
} from './FinanceHubScreens';
import { WltDshAccountStatement } from '../components/WltDshAccountStatement';
import { WltDshRefundLedger } from '../components/WltDshRefundLedger';
import { WltDshSettlementCalendar } from '../components/WltDshSettlementCalendar';
import { WltDshStoreSettlementStatement } from '../components/WltDshStoreSettlementStatement';

import styles from '../../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

export type ControlPanelDshFinanceScreenProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

export function ControlPanelFinanceHubHost({
  group = 'financial-command-center',
  subGroup,
  panel,
  state = 'ready',
}: ControlPanelDshFinanceScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active state from URL parameter (?state=...) or fallback to state prop
  const activeState = (searchParams?.get('state') as FinanceViewState) || state;

  // Normalize group and subGroup from incoming props (ensuring backward compatibility)
  const normalized = React.useMemo(() => {
    return normalizeFinanceLocation(group, panel);
  }, [group, panel]);

  const [activeGroup, setActiveGroup] = React.useState<CanonicalFinanceGroupId>(normalized.group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(subGroup || normalized.subGroup);
  const [technicalAuditMode, setTechnicalAuditMode] = React.useState(false);

  // Sync state if props change
  React.useEffect(() => {
    const norm = normalizeFinanceLocation(group, panel);
    setActiveGroup(norm.group);
    setActiveSubGroup(subGroup || norm.subGroup);
  }, [group, subGroup, panel]);

  const financePreview = React.useMemo(() => getWltControlPanelFinancePreview(), []);

  // Daily center metrics calculation
  const center = React.useMemo(() => {
    return buildWltFinancialCenter(new Date().toISOString().split('T')[0]!, financePreview.allRecords);
  }, [financePreview]);

  const pendingCount = React.useMemo(
    () => financePreview.allRecords.filter((r) => r.statusTone === 'warning' || r.isPending).length,
    [financePreview],
  );

  const openRisksCount = React.useMemo(
    () => financePreview.allRecords.filter((r) => r.statusTone === 'error' || r.risk === 'danger').length,
    [financePreview],
  );

  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { subGroup: activeSubGroup, panel });

  // Calculate Operational readiness fields
  const affectedSurfaces = React.useMemo(() => {
    const list = new Set<string>();
    financePreview.allRecords.forEach((r) => {
      if (r.isPending || r.statusTone === 'error') {
        if (r.actorType === 'client') list.add('العملاء');
        if (r.actorType === 'partner') list.add('الشركاء');
        if (r.actorType === 'captain') list.add('الكباتن');
        if (r.actorType === 'field') list.add('الميدانيين');
      }
    });
    if (list.size === 0) return 'لا يوجد طرف متأثر حالياً';
    return Array.from(list).join(' · ');
  }, [financePreview]);

  const affectedMoney = React.useMemo(() => {
    let disputed = 0;
    let pending = 0;
    financePreview.allRecords.forEach((r) => {
      if (r.statusTone === 'error' || r.risk === 'danger') {
        disputed += r.actualMinorUnits;
      } else if (r.isPending || r.statusTone === 'warning') {
        pending += r.expectedMinorUnits;
      }
    });
    return `نزاع: ${(disputed / 100).toLocaleString('ar-YE')} ر.ي · معلق: ${(pending / 100).toLocaleString('ar-YE')} ر.ي`;
  }, [financePreview]);

  const requiredAction = React.useMemo(() => {
    if (center.blockingVariances.length > 0) return 'تحقيق ومطابقة الفوارق يدوياً';
    if (financePreview.allRecords.some((r) => r.allowedAction === 'prepare_decision')) return 'اعتماد وصرف المستحقات مع WLT';
    return 'مراقبة وتدقيق الأرصدة اليومية';
  }, [financePreview, center]);

  const operationalRisk = React.useMemo(() => {
    if (center.blockingVariances.length > 0) {
      return `يوجد فوارق معلقة (${center.blockingVariances.length} فارق نشط)`;
    }
    if (financePreview.allRecords.some(r => r.risk === 'danger')) {
      return 'مخاطر حرج عالية (High Risk)';
    }
    if (financePreview.allRecords.some(r => r.risk === 'warning')) {
      return 'تنبيه تدقيق متوسط (Medium Risk)';
    }
    return 'لا توجد مخاطر مالية مكشوفة';
  }, [center, financePreview]);

  const holdsStatus = React.useMemo(() => {
    if (center.blockingVariances.length > 0) {
      return '🔒 معلق بالكامل (تسوية وصرف محجوبة)';
    }
    if (financePreview.allRecords.some(r => r.statusTone === 'error')) {
      return '⚠️ تعليق جزئي (حظر تسوية متأثرة)';
    }
    return '✓ لا يوجد حظر (جاهز للتسوية)';
  }, [center, financePreview]);

  const renderActiveScreen = (groupId: CanonicalFinanceGroupId, subGroupId: string | undefined, techMode: boolean, currentHref: string) => {
    const activeSub = subGroupId || getFinanceGroupMeta(groupId).subGroups?.[0]?.id;

    switch (groupId) {
      case 'financial-command-center':
        if (activeSub === 'position') {
          return <FinancialCenterScreen hubHref={currentHref} subGroup={activeSub} technicalAuditMode={techMode} />;
        }
        return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} technicalAuditMode={techMode} />;

      case 'ledger-order-finance':
        if (activeSub === 'order-lifecycle') {
          return <DailyReconciliationWorkbench />;
        }
        if (activeSub === 'audit-trail') {
          return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} technicalAuditMode={techMode} />;
        }
        return <LedgerScreen hubHref={currentHref} subGroup={activeSub} technicalAuditMode={techMode} />;

      case 'payments-wallets':
        if (activeSub === 'payments') {
          return <ControlPanelDshCodReconciliationScreen subGroup={activeSub} technicalAuditMode={techMode} />;
        }
        return <WltDshAccountStatement />;

      case 'settlements-payouts':
        if (activeSub === 'partners') {
          return <WltDshStoreSettlementStatement technicalAuditMode={techMode} />;
        }
        if (activeSub === 'bank-transfers') {
          return <WltDshSettlementCalendar />;
        }
        return <ControlPanelDshSettlementScreen subGroup={activeSub} technicalAuditMode={techMode} />;

      case 'refunds-disputes-holds':
        if (activeSub === 'cancellations') {
          return <ControlPanelDshRefundQueueScreen subGroup={activeSub} technicalAuditMode={techMode} />;
        }
        return <WltDshRefundLedger />;

      case 'commissions-fees-promo':
        return <ControlPanelDshSettlementScreen subGroup={activeSub} technicalAuditMode={techMode} />;

      case 'reconciliation-risk':
        if (activeSub === 'risk-fraud') {
          return <ControlPanelDshRiskAuditScreen subGroup={activeSub} technicalAuditMode={techMode} />;
        }
        return <DailyReconciliationWorkbench />;

      case 'reports-policies-approvals':
        if (activeSub === 'policies') {
          return <WltDshSettlementCalendar />;
        }
        return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} technicalAuditMode={techMode} />;

      default:
        return <FinancialCenterScreen hubHref={currentHref} subGroup={activeSub} technicalAuditMode={techMode} />;
    }
  };

  const renderStateView = () => {
    if (activeState === 'loading') {
      return (
        <div className={`${styles.surfaceCockpit} ${wltStyles.loadingWrapper}`}>
          <Text role="titleLg" className={wltStyles.loadingText}>جاري تحميل البيانات المالية...</Text>
        </div>
      );
    }

    if (activeState === 'empty') {
      return (
        <div className={wltStyles.stateScreen}>
          <div className={wltStyles.stateIcon} aria-hidden="true">📭</div>
          <h2 className={wltStyles.stateTitle}>لا توجد سجلات مالية</h2>
          <p className={wltStyles.stateDesc}>لم يتم العثور على أي قيود أو حركات مالية في هذه الغرفة حالياً.</p>
          <div className={wltStyles.stateActions}>
            <button
              onClick={() => router.refresh()}
              style={{
                padding: '8px 16px',
                background: 'var(--bth-brand-primary)',
                color: 'var(--bth-text-inverse)',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              تحديث البيانات
            </button>
          </div>
        </div>
      );
    }

    if (activeState === 'error') {
      return (
        <div className={wltStyles.stateScreen}>
          <div className={wltStyles.stateIcon} aria-hidden="true">🚨</div>
          <h2 className={wltStyles.stateTitle} style={{ color: 'var(--bth-danger-text)' }}>خطأ في الاتصال بالخادم المالي</h2>
          <p className={wltStyles.stateDesc}>فشل تحميل البيانات المالية من WLT Engine. يرجى التحقق من اتصال الخادم المالي ومحاولة إعادة التحميل.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, width: '100%', background: 'var(--bth-control-panel-surface-raised)', padding: 12, borderRadius: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚠️ الخطر:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bth-danger-text)' }}>عطل الاتصال بالخادم الرئيسي</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>👥 المتأثر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>لوحة القيادة بالكامل</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚙️ الإجراء:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>إعادة محاولة الاتصال بالخادم</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>🔒 الحظر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>محجوب بالكامل لعدم توفر البيانات</span>
            </div>
          </div>
          <div className={wltStyles.stateActions}>
            <button
              onClick={() => router.refresh()}
              style={{
                padding: '8px 16px',
                background: 'var(--bth-brand-primary)',
                color: 'var(--bth-text-inverse)',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    if (activeState === 'offline') {
      return (
        <div className={wltStyles.stateScreen}>
          <div className={wltStyles.stateIcon} aria-hidden="true">🌐</div>
          <h2 className={wltStyles.stateTitle}>أنت تعمل خارج الاتصال</h2>
          <p className={wltStyles.stateDesc}>يتعذر تحميل البيانات المالية من WLT Engine لأنك غير متصل بالإنترنت حالياً.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, width: '100%', background: 'var(--bth-control-panel-surface-raised)', padding: 12, borderRadius: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚠️ الخطر:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bth-danger-text)' }}>عمل دون مزامنة الشبكة</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>👥 المتأثر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>العمليات المالية الفورية</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚙️ الإجراء:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>التحقق من الشبكة وإعادة الاتصال</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>🔒 الحظر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>حظر جزئي للعمليات الحية</span>
            </div>
          </div>
          <div className={wltStyles.stateActions}>
            <button
              onClick={() => router.refresh()}
              style={{
                padding: '8px 16px',
                background: 'var(--bth-brand-primary)',
                color: 'var(--bth-text-inverse)',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              الاتصال بالخادم
            </button>
          </div>
        </div>
      );
    }

    if (activeState === 'disabled') {
      return (
        <div className={wltStyles.stateScreen}>
          <div className={wltStyles.stateIcon} aria-hidden="true">🔒</div>
          <h2 className={wltStyles.stateTitle}>غرفة القيادة موقوفة</h2>
          <p className={wltStyles.stateDesc}>تم إيقاف صلاحية الوصول إلى غرفة القيادة المالية لهذه المنصة مؤقتاً بناءً على إعدادات الأمان والسياسات المالية للمنصة.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, width: '100%', background: 'var(--bth-control-panel-surface-raised)', padding: 12, borderRadius: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚠️ الخطر:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bth-danger-text)' }}>إيقاف أمني للوحة التحكم</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>👥 المتأثر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>كافة أسطح التحكم المالي</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚙️ الإجراء:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>مراجعة مدير النظام (Admin)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>🔒 الحظر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>محجوب بالكامل بناءً على السياسة</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeState === 'blocked') {
      return (
        <div className={wltStyles.stateScreen}>
          <div className={wltStyles.stateIcon} aria-hidden="true">🚫</div>
          <h2 className={wltStyles.stateTitle} style={{ color: 'var(--bth-danger-text)' }}>الوصول محجوب لدواعي التدقيق</h2>
          <p className={wltStyles.stateDesc}>تم حجب لوحة التحكم لوجود فوارق مالية حرجة غير مطابقة تمنع إغلاق اليوم المالي الحالي بشكل آمن.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, width: '100%', background: 'var(--bth-control-panel-surface-raised)', padding: 12, borderRadius: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚠️ الخطر:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bth-danger-text)' }}>فوارق حادة غير مطابقة</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>👥 المتأثر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>الشركاء والكباتن</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>⚙️ الإجراء:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>مراجعة الفوارق والتدقيق المباشر</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>🔒 الحظر:</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>محجوب بالكامل حتى حل الفوارق</span>
            </div>
          </div>
          <div className={wltStyles.stateActions}>
            <button
              onClick={() => {
                setActiveGroup('reconciliation-risk');
                setActiveSubGroup('reconciliation');
              }}
              style={{
                padding: '8px 16px',
                background: 'var(--bth-brand-primary)',
                color: 'var(--bth-text-inverse)',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              مراجعة الفوارق الحرجة
            </button>
          </div>
        </div>
      );
    }

    return renderActiveScreen(activeGroup, activeSubGroup, technicalAuditMode, hubHref);
  };

  return (
    <div className={styles.surfaceCockpit}>
      {/* Header Bar */}
      <header className={styles.surfaceTopBar} style={{ padding: '8px 16px', borderBottom: '1px solid var(--bth-control-panel-border)' }}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={wltStyles.headerTextRow}>
              <h1 className={styles.surfaceHeaderTitle} style={{ fontSize: 16, fontWeight: 800 }}>غرفة القيادة المالية</h1>
              <Box paddingX={2} paddingY={0.5} background="brandSurface" radiusToken="xs">
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--bth-brand-primary)' }}>مصدر الحقيقة: WLT</span>
              </Box>
            </div>
            <p className={wltStyles.readinessDesc} style={{ margin: 0 }}>
              العملة: <strong>ر.ي (ريال يمني)</strong> · نظام الرقابة المركزي
            </p>
          </Box>
        </div>

        <div className={wltStyles.headerActionsArea} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <div className={wltStyles.technicalToggleContainer} style={{ margin: 0 }}>
            <span className={wltStyles.technicalToggleLabel}>التدقيق التقني</span>
            <button
              onClick={() => setTechnicalAuditMode(!technicalAuditMode)}
              aria-label="تغيير وضع العرض"
              className={wltStyles.technicalToggleButton}
              style={{ background: technicalAuditMode ? 'var(--bth-brand-primary)' : 'var(--bth-control-panel-border)' }}
            >
              <div className={wltStyles.technicalToggleKnob} style={{ left: technicalAuditMode ? 18 : 2 }} />
            </button>
          </div>
          <button
            onClick={() => router.refresh()}
            style={{
              padding: '6px 12px',
              background: 'var(--bth-brand-primary)',
              color: 'var(--bth-text-inverse)',
              border: 'none',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            تحديث فوري
          </button>
        </div>
      </header>

      {/* Signal Strip */}
      <section style={{ padding: '12px 16px', borderBottom: '1px solid var(--bth-control-panel-border)' }}>
        <div className={wltStyles.signalStrip}>
          <div className={`${wltStyles.signalCard} ${wltStyles.signalCardInfo}`}>
            <span className={wltStyles.signalLabel}>صافي المركز المالي</span>
            <span className={wltStyles.signalValue} style={{ color: center.netPosition >= 0 ? 'var(--bth-success-text)' : 'var(--bth-danger-text)' }}>
              {center.netPositionLabel}
            </span>
          </div>
          <div className={`${wltStyles.signalCard} ${wltStyles.signalCardSuccess}`}>
            <span className={wltStyles.signalLabel}>مبالغ معلقة</span>
            <span className={wltStyles.signalValue}>
              {pendingCount.toLocaleString('ar-YE')} ذمة
            </span>
          </div>
          <div className={`${wltStyles.signalCard} ${center.blockingVariances.length > 0 ? wltStyles.signalCardDanger : wltStyles.signalCardSuccess}`}>
            <span className={wltStyles.signalLabel}>فوارق مطابقة</span>
            <span className={wltStyles.signalValue} style={{ color: center.blockingVariances.length > 0 ? 'var(--bth-danger-text)' : 'var(--bth-success-text)' }}>
              {center.blockingVariances.length.toLocaleString('ar-YE')} فوارق
            </span>
          </div>
          <div className={`${wltStyles.signalCard} ${openRisksCount > 0 ? wltStyles.signalCardDanger : wltStyles.signalCardSuccess}`}>
            <span className={wltStyles.signalLabel}>مخاطر مفتوحة</span>
            <span className={wltStyles.signalValue} style={{ color: openRisksCount > 0 ? 'var(--bth-danger-text)' : 'var(--bth-success-text)' }}>
              {openRisksCount.toLocaleString('ar-YE')} مخاطر
            </span>
          </div>
        </div>
      </section>

      {/* Navigation and Subtabs */}
      <nav className={styles.navigationDock}>
        <WebControlPanelWorkspaceTabs
          items={FINANCE_CANONICAL_GROUPS.map((item) => ({ id: item.id, label: item.label, active: item.id === activeGroup }))}
          onSelect={(id) => {
            const groupId = id as CanonicalFinanceGroupId;
            const meta = getFinanceGroupMeta(groupId);
            const defaultSub = meta.subGroups?.[0]?.id;
            setActiveGroup(groupId);
            setActiveSubGroup(defaultSub);
            router.push(buildFinanceHref(groupId, { subGroup: defaultSub, panel }));
          }}
          ariaLabel="أقسام الرئيسية للمالية"
        />
      </nav>

      {activeGroupMeta.subGroups && activeGroupMeta.subGroups.length > 0 ? (
        <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
          <WebControlPanelSubTabs
            items={activeGroupMeta.subGroups.map((sub) => ({ id: sub.id, label: sub.label, active: (activeSubGroup ?? activeGroupMeta.subGroups?.[0]?.id) === sub.id }))}
            onSelect={(subId) => {
              setActiveSubGroup(subId);
              router.push(buildFinanceHref(activeGroup, { subGroup: subId, panel }));
            }}
            ariaLabel="التبويبات الفرعية"
          />
        </div>
      ) : null}

      {/* Operational Readiness Strip */}
      {activeState === 'ready' && (
        <section style={{ padding: '12px 16px 0 16px' }}>
          <div className={wltStyles.readinessPanel}>
            <div className={wltStyles.readinessInfo}>
              <div className={`${wltStyles.readinessIndicator} ${
                center.blockingVariances.length > 0 ? wltStyles.readinessIndicatorBlocked :
                pendingCount > 0 ? wltStyles.readinessIndicatorAction : wltStyles.readinessIndicatorReady
              }`} />
              <div className={wltStyles.readinessText}>
                <span className={wltStyles.readinessTitle}>
                  حالة الجاهزية التشغيلية: {
                    center.blockingVariances.length > 0 ? 'محجوب / يوجد مخاطر (Blocked / Risk)' :
                    pendingCount > 0 ? 'يحتاج إجراء (Needs action)' : 'جاهز للمطابقة (Ready)'
                  }
                </span>
                <span className={wltStyles.readinessDesc}>
                  الجهد المالي للمنصة في بيئة المعاينة
                </span>
              </div>
            </div>
            {/* 4-column Operational readiness layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, width: '100%', marginTop: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className={wltStyles.readinessDesc}>⚠️ <strong>الخطر المالي:</strong></span>
                <span className={wltStyles.readinessTitle} style={{ fontSize: 12, color: center.blockingVariances.length > 0 ? 'var(--bth-danger-text)' : 'var(--bth-control-panel-text)' }}>
                  {operationalRisk}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className={wltStyles.readinessDesc}>👥 <strong>الجهة المتأثرة:</strong></span>
                <span className={wltStyles.readinessTitle} style={{ fontSize: 12 }}>{affectedSurfaces}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className={wltStyles.readinessDesc}>⚙️ <strong>الإجراء المطلوب:</strong></span>
                <span className={wltStyles.readinessTitle} style={{ fontSize: 12, color: 'var(--bth-brand-primary)' }}>{requiredAction}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className={wltStyles.readinessDesc}>🔒 <strong>حظر الصرف/التسوية:</strong></span>
                <span className={wltStyles.readinessTitle} style={{ fontSize: 12 }}>{holdsStatus}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Technical Audit Drawer */}
      {technicalAuditMode && (
        <section style={{ padding: '12px 16px 0 16px' }}>
          <div className={wltStyles.techDrawer}>
            <div className={wltStyles.techDrawerHeader}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--bth-info-text)' }}>بوابة التدقيق المالي التقني (WLT/DSH API matrix)</span>
              <span style={{ fontSize: 10, background: 'var(--bth-warning-surface)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'var(--bth-warning-text)' }}>
                وضع معاينة العقد المالي
              </span>
            </div>
            <div className={wltStyles.techGrid}>
              <div className={wltStyles.techItem}>
                <span className={wltStyles.techLabel}>مصدر البيانات الأساسي</span>
                <span className={wltStyles.techValue}>WLT Ledger Engine (SSoT)</span>
              </div>
              <div className={wltStyles.techItem}>
                <span className={wltStyles.techLabel}>حالة العقد المالي</span>
                <span className={wltStyles.techValue} style={{ color: 'var(--bth-warning-text)' }}>{financePreview.contractState}</span>
              </div>
              <div className={wltStyles.techItem}>
                <span className={wltStyles.techLabel}>طابع تدفق البيانات</span>
                <span className={wltStyles.techValue}>مستمر ومطابق بالكامل (Real-time Mock)</span>
              </div>
              <div className={wltStyles.techItem}>
                <span className={wltStyles.techLabel}>طبيعة المعاينة</span>
                <span className={wltStyles.techValue}>DSH UI preview contract scaffold</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Panel */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          {renderStateView()}
        </div>
      </main>
    </div>
  );
}

export { ControlPanelFinanceHubHost as ControlPanelDshFinanceHubScreen };
export default ControlPanelFinanceHubHost;
