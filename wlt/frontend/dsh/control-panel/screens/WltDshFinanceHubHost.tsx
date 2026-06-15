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
} from '../../shared';
import type { CanonicalFinanceGroupId, FinancePanelId, FinanceViewState } from '../../shared';
import { buildWltFinancialCenter } from '../../shared';
import {
  buildWltRuntimeFinancialCenter,
  loadWltDshFinanceRuntimeReadModel,
  type WltDshFinanceRuntimeResult,
} from '../../shared';
import { FinancialCenterScreen } from './FinancialCenterScreen';
import { LedgerScreen } from './LedgerScreen';
import { AuditCloseScreen } from './AuditCloseScreen';
import { DailyReconciliationWorkbench } from './DailyReconciliationWorkbench';
import { CommissionBreakdownWorkspace } from './CommissionBreakdownWorkspace';
import { PlatformFeeAuditWorkspace } from './PlatformFeeAuditWorkspace';
import { WltDshAccountStatement } from '../components/WltDshAccountStatement';
import { WltDshRefundLedger } from '../components/WltDshRefundLedger';
import { WltDshSettlementCalendar } from '../components/WltDshSettlementCalendar';
import { WltDshStoreSettlementStatement } from '../components/WltDshStoreSettlementStatement';
import { WltDshPartnerStatement } from '../components/WltDshPartnerStatement';
import { WltDshFieldCommissionStatement } from '../components/WltDshFieldCommissionStatement';
import { WltDshCaptainStatement } from '../components/WltDshCaptainStatement';
import { WltDshWalletControlCenter } from '../components/WltDshWalletControlCenter';

import styles from '../../../../../dsh/frontend/control-panel/shared/control-panel-surface.module.css';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

export type WltDshFinanceHubHostProps = {
  group?: CanonicalFinanceGroupId;
  subGroup?: string;
  panel?: FinancePanelId;
  state?: FinanceViewState;
  fallbackHref?: string;
};

export type ControlPanelDshFinanceScreenProps = WltDshFinanceHubHostProps;

interface OperationalImpactGridProps {
  risk?: string;
  affected?: string;
  action?: string;
  blocking?: string;
}

function OperationalImpactGrid({ risk, affected, action, blocking }: OperationalImpactGridProps) {
  if (!risk && !affected && !action && !blocking) return null;
  return (
    <div className={wltStyles.operationalImpactGrid}>
      {risk && (
        <div className={wltStyles.operationalImpactCard}>
          <span className={wltStyles.operationalImpactLabel}>⚠️ الخطر:</span>
          <span className={`${wltStyles.operationalImpactValue} ${wltStyles.operationalImpactValueDanger}`}>
            {risk}
          </span>
        </div>
      )}
      {affected && (
        <div className={wltStyles.operationalImpactCard}>
          <span className={wltStyles.operationalImpactLabel}>👥 المتأثر:</span>
          <span className={wltStyles.operationalImpactValue}>{affected}</span>
        </div>
      )}
      {action && (
        <div className={wltStyles.operationalImpactCard}>
          <span className={wltStyles.operationalImpactLabel}>⚙️ الإجراء:</span>
          <span className={wltStyles.operationalImpactValue}>{action}</span>
        </div>
      )}
      {blocking && (
        <div className={wltStyles.operationalImpactCard}>
          <span className={wltStyles.operationalImpactLabel}>🔒 الحظر:</span>
          <span className={wltStyles.operationalImpactValue}>{blocking}</span>
        </div>
      )}
    </div>
  );
}

interface StatePrimaryActionProps {
  label: string;
  onClick: () => void;
}

function StatePrimaryAction({ label, onClick }: StatePrimaryActionProps) {
  return (
    <button className={wltStyles.statePrimaryAction} onClick={onClick}>
      {label}
    </button>
  );
}

interface FinanceStateScreenProps {
  icon: string;
  title: string;
  titleDanger?: boolean;
  desc: string;
  impact?: OperationalImpactGridProps;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function FinanceStateScreen({ icon, title, titleDanger, desc, impact, action }: FinanceStateScreenProps) {
  return (
    <div className={wltStyles.stateScreen}>
      <div className={wltStyles.stateIcon} aria-hidden="true">{icon}</div>
      <h2 className={`${wltStyles.stateTitle} ${titleDanger ? wltStyles.stateTitleDanger : ''}`}>
        {title}
      </h2>
      <p className={wltStyles.stateDesc}>{desc}</p>
      {impact && <OperationalImpactGrid {...impact} />}
      {action && (
        <div className={wltStyles.stateActions}>
          <StatePrimaryAction label={action.label} onClick={action.onClick} />
        </div>
      )}
    </div>
  );
}

export function WltDshFinanceHubHost({
  group = 'financial-command-center',
  subGroup,
  panel,
  state = 'ready',
}: WltDshFinanceHubHostProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active state from URL parameter (?state=...) or fallback to state prop
  const activeState = (searchParams?.get('state') as FinanceViewState) || state;

  // subGroup can arrive from: URL ?subGroup=... (direct link / refresh), then prop, then normalized default
  const urlSubGroup = searchParams?.get('subGroup') ?? undefined;

  // Normalize group and subGroup from incoming props (ensuring backward compatibility)
  const normalized = React.useMemo(() => {
    return normalizeFinanceLocation(group, panel);
  }, [group, panel]);

  const [activeGroup, setActiveGroup] = React.useState<CanonicalFinanceGroupId>(normalized.group);
  const [activeSubGroup, setActiveSubGroup] = React.useState<string | undefined>(
    urlSubGroup ?? subGroup ?? normalized.subGroup,
  );

  // Sync state if props or URL params change
  React.useEffect(() => {
    const norm = normalizeFinanceLocation(group, panel);
    setActiveGroup(norm.group);
    setActiveSubGroup(urlSubGroup ?? subGroup ?? norm.subGroup);
  }, [group, subGroup, panel, urlSubGroup]);

  const [runtimeFinance, setRuntimeFinance] = React.useState<WltDshFinanceRuntimeResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void loadWltDshFinanceRuntimeReadModel().then((result) => {
      if (!cancelled) setRuntimeFinance(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Daily center metrics calculation
  const center = React.useMemo(() => {
    const businessDate = new Date().toISOString().split('T')[0]!;
    if (runtimeFinance?.state === 'runtime') {
      return buildWltRuntimeFinancialCenter(businessDate, runtimeFinance.data);
    }

    return buildWltFinancialCenter(businessDate, []);
  }, [runtimeFinance]);

  const runtimeSourceLabel = React.useMemo(() => {
    if (!runtimeFinance) return 'WLT runtime: loading';
    if (runtimeFinance.state === 'runtime') return `WLT runtime: ${runtimeFinance.data.baseUrl}`;
    return `WLT runtime blocked: ${runtimeFinance.baseUrl}`;
  }, [runtimeFinance]);

  const pendingCount = React.useMemo(
    () => center.allEntries.filter((e) => e.isPending).length,
    [center],
  );

  const openRisksCount = React.useMemo(
    () => center.allEntries.filter((e) => e.status === 'blocked' || e.status === 'disputed').length,
    [center],
  );

  const activeGroupMeta = getFinanceGroupMeta(activeGroup);
  const hubHref = buildFinanceHref(activeGroup, { subGroup: activeSubGroup, panel });

  // Calculate Operational readiness fields
  const affectedSurfaces = React.useMemo(() => {
    const list = new Set<string>();
    center.allEntries.forEach((e) => {
      if (e.isPending || e.status === 'blocked' || e.status === 'disputed') {
        if (e.partyKind === 'client') list.add('العملاء');
        if (e.partyKind === 'partner') list.add('الشركاء');
        if (e.partyKind === 'captain') list.add('الكباتن');
        if (e.partyKind === 'field') list.add('الميدانيين');
      }
    });
    if (list.size === 0) return 'لا يوجد طرف متأثر حالياً';
    return Array.from(list).join(' · ');
  }, [center]);

  const requiredAction = React.useMemo(() => {
    if (center.blockingVariances.length > 0) return 'تحقيق ومطابقة الفوارق يدوياً';
    if (center.allEntries.some((e) => e.status === 'pending')) return 'اعتماد وصرف المستحقات مع WLT';
    return 'مراقبة وتدقيق الأرصدة اليومية';
  }, [center]);

  const operationalRisk = React.useMemo(() => {
    if (center.blockingVariances.length > 0) {
      return `يوجد فوارق معلقة (${center.blockingVariances.length} فارق نشط)`;
    }
    if (center.allEntries.some((e) => e.status === 'blocked')) {
      return 'مخاطر حرج عالية (High Risk)';
    }
    if (center.allEntries.some((e) => e.status === 'disputed' || e.status === 'pending')) {
      return 'تنبيه تدقيق متوسط (Medium Risk)';
    }
    return 'لا توجد مخاطر مالية مكشوفة';
  }, [center]);

  const holdsStatus = React.useMemo(() => {
    if (center.blockingVariances.length > 0) {
      return '🔒 معلق بالكامل (تسوية وصرف محجوبة)';
    }
    if (center.allEntries.some((entry) => entry.status === 'blocked' || entry.status === 'disputed')) {
      return '⚠️ تعليق جزئي (حظر تسوية متأثرة)';
    }
    return '✓ لا يوجد حظر (جاهز للتسوية)';
  }, [center]);

  const renderActiveScreen = (groupId: CanonicalFinanceGroupId, subGroupId: string | undefined, currentHref: string) => {
    const activeSub = subGroupId || getFinanceGroupMeta(groupId).subGroups?.[0]?.id;

    switch (groupId) {
      case 'financial-command-center':
        if (activeSub === 'position') {
          return <FinancialCenterScreen hubHref={currentHref} subGroup={activeSub} />;
        }
        return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} />;

      case 'ledger-order-finance':
        if (activeSub === 'order-lifecycle') {
          return <DailyReconciliationWorkbench />;
        }
        if (activeSub === 'audit-trail') {
          return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} />;
        }
        return <LedgerScreen hubHref={currentHref} subGroup={activeSub} />;

      case 'payments-wallets':
        if (activeSub === 'wallet-control-center') {
          return <WltDshWalletControlCenter runtimeFinance={runtimeFinance} />;
        }
        if (activeSub === 'payments') {
          return <WltDshWalletControlCenter runtimeFinance={runtimeFinance} />;
        }
        if (activeSub === 'client-wallets') {
          return <WltDshAccountStatement actorId="CUS-553" runtimeFinance={runtimeFinance} />;
        }
        if (activeSub === 'partner-wallets') {
          return <WltDshAccountStatement actorId="STORE-99" runtimeFinance={runtimeFinance} />;
        }
        if (activeSub === 'captain-wallets') {
          return <WltDshAccountStatement actorId="CAP-42" runtimeFinance={runtimeFinance} />;
        }
        if (activeSub === 'platform-wallet') {
          return <WltDshAccountStatement actorId="DSH-PLATFORM" runtimeFinance={runtimeFinance} />;
        }
        return <WltDshAccountStatement runtimeFinance={runtimeFinance} />;

      case 'settlements-payouts':
        if (activeSub === 'partners') {
          return <WltDshPartnerStatement />;
        }
        if (activeSub === 'stores') {
          return <WltDshStoreSettlementStatement />;
        }
        if (activeSub === 'captains') {
          return <WltDshCaptainStatement />;
        }
        if (activeSub === 'field') {
          return <WltDshFieldCommissionStatement />;
        }
        if (activeSub === 'bank-transfers') {
          return <WltDshSettlementCalendar runtimeFinance={runtimeFinance} />;
        }
        return <WltDshSettlementCalendar runtimeFinance={runtimeFinance} />;

      case 'refunds-disputes-holds':
        return <WltDshRefundLedger subGroup={activeSub} />;

      case 'commissions-fees-promo':
        if (activeSub === 'commissions') {
          return <CommissionBreakdownWorkspace />;
        }
        if (activeSub === 'fees') {
          return <PlatformFeeAuditWorkspace />;
        }
        return <WltDshFieldCommissionStatement />;

      case 'reconciliation-risk':
        if (activeSub === 'risk-fraud') {
          return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} />;
        }
        return <DailyReconciliationWorkbench />;

      case 'reports-policies-approvals':
        if (activeSub === 'policies') {
          return <WltDshSettlementCalendar runtimeFinance={runtimeFinance} />;
        }
        return <AuditCloseScreen hubHref={currentHref} subGroup={activeSub} />;

      default:
        return <FinancialCenterScreen hubHref={currentHref} subGroup={activeSub} />;
    }
  };

  const renderStateView = () => {
    if (activeState === 'loading') {
      return (
        <div className={`${styles.surfaceCockpit} ${wltStyles.loadingWrapper}`}>
          <Text role="titleLg">جاري تحميل البيانات المالية...</Text>
        </div>
      );
    }

    if (activeState === 'empty') {
      return (
        <FinanceStateScreen
          icon="📭"
          title="لا توجد سجلات مالية"
          desc="لم يتم العثور على أي قيود أو حركات مالية في هذه الغرفة حالياً."
          action={{
            label: "تحديث البيانات",
            onClick: () => router.refresh(),
          }}
        />
      );
    }

    if (activeState === 'error') {
      return (
        <FinanceStateScreen
          icon="🚨"
          title="خطأ في الاتصال بالخادم المالي"
          titleDanger
          desc="فشل تحميل البيانات المالية. يرجى التحقق من اتصال الخادم المالي ومحاولة إعادة التحميل."
          impact={{
            risk: "عطل الاتصال بالخادم الرئيسي",
            affected: "لوحة القيادة بالكامل",
            action: "إعادة محاولة الاتصال بالخادم",
            blocking: "محجوب بالكامل لعدم توفر البيانات",
          }}
          action={{
            label: "إعادة المحاولة",
            onClick: () => router.refresh(),
          }}
        />
      );
    }

    if (activeState === 'offline') {
      return (
        <FinanceStateScreen
          icon="🌐"
          title="أنت تعمل خارج الاتصال"
          desc="يتعذر تحميل البيانات المالية لأنك غير متصل بالإنترنت حالياً."
          impact={{
            risk: "عمل دون مزامنة الشبكة",
            affected: "العمليات المالية الفورية",
            action: "التحقق من الشبكة وإعادة الاتصال",
            blocking: "حظر جزئي للعمليات الحية",
          }}
          action={{
            label: "الاتصال بالخادم",
            onClick: () => router.refresh(),
          }}
        />
      );
    }

    if (activeState === 'disabled') {
      return (
        <FinanceStateScreen
          icon="🔒"
          title="غرفة القيادة موقوفة"
          desc="تم إيقاف صلاحية الوصول إلى غرفة القيادة المالية لهذه المنصة مؤقتاً بناءً على إعدادات الأمان والسياسات المالية للمنصة."
          impact={{
            risk: "إيقاف أمني للوحة التحكم",
            affected: "كافة أسطح التحكم المالي",
            action: "مراجعة مدير النظام (Admin)",
            blocking: "محجوب بالكامل بناءً على السياسة",
          }}
        />
      );
    }

    if (activeState === 'blocked') {
      return (
        <FinanceStateScreen
          icon="🚫"
          title="الوصول محجوب لدواعي التدقيق"
          titleDanger
          desc="تم حجب لوحة التحكم لوجود فوارق مالية حرجة غير مطابقة تمنع إغلاق اليوم المالي الحالي بشكل آمن."
          impact={{
            risk: "فوارق حادة غير مطابقة",
            affected: "الشركاء والكباتن",
            action: "مراجعة الفوارق والتدقيق المباشر",
            blocking: "محجوب بالكامل حتى حل الفوارق",
          }}
          action={{
            label: "مراجعة الفوارق الحرجة",
            onClick: () => {
              setActiveGroup('reconciliation-risk');
              setActiveSubGroup('reconciliation');
            },
          }}
        />
      );
    }

    return renderActiveScreen(activeGroup, activeSubGroup, hubHref);
  };

  return (
    <div className={styles.surfaceCockpit}>
      {/* Header Bar */}
      <header className={`${styles.surfaceTopBar} ${wltStyles.hubHeader}`}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={wltStyles.headerTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>غرفة القيادة المالية</h1>
              <Box paddingX={2} paddingY={1} background="brandSurface" radiusToken="xs">
                <span className={wltStyles.headerBadgeLabel}>
                  {runtimeFinance?.state === 'runtime' ? 'WLT runtime' : 'معاينة عند تعذر runtime'}
                </span>
              </Box>
            </div>
            <p className={wltStyles.readinessDesc}>
              العملة: <strong>ر.ي (ريال يمني)</strong> · {runtimeSourceLabel}
            </p>
          </Box>
        </div>

        <div className={wltStyles.headerActionsRow}>
          <button
            onClick={() => router.refresh()}
            className={wltStyles.refreshButton}
          >
            تحديث فوري
          </button>
        </div>
      </header>

      {/* Signal Strip */}
      <section className={wltStyles.hubSection}>
        <div className={wltStyles.signalStrip}>
          <div className={`${wltStyles.signalCard} ${wltStyles.signalCardInfo}`}>
            <span className={wltStyles.signalLabel}>صافي المركز المالي</span>
            <span className={`${wltStyles.signalValue} ${center.netPosition >= 0 ? wltStyles.signalValuePositive : wltStyles.signalValueNegative}`}>
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
            <span className={`${wltStyles.signalValue} ${center.blockingVariances.length > 0 ? wltStyles.signalValueDanger : wltStyles.signalValuePositive}`}>
              {center.blockingVariances.length.toLocaleString('ar-YE')} فوارق
            </span>
          </div>
          <div className={`${wltStyles.signalCard} ${openRisksCount > 0 ? wltStyles.signalCardDanger : wltStyles.signalCardSuccess}`}>
            <span className={wltStyles.signalLabel}>مخاطر مفتوحة</span>
            <span className={`${wltStyles.signalValue} ${openRisksCount > 0 ? wltStyles.signalValueDanger : wltStyles.signalValuePositive}`}>
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
        <section className={wltStyles.hubReadinessSection}>
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
            <div className={wltStyles.readinessColumns}>
              <div className={wltStyles.readinessCol}>
                <span className={wltStyles.readinessDesc}>⚠️ <strong>الخطر المالي:</strong></span>
                <span className={`${wltStyles.readinessVal} ${wltStyles.readinessValBold} ${center.blockingVariances.length > 0 ? wltStyles.readinessValDanger : ''}`}>
                  {operationalRisk}
                </span>
              </div>
              <div className={wltStyles.readinessCol}>
                <span className={wltStyles.readinessDesc}>👥 <strong>الجهة المتأثرة:</strong></span>
                <span className={`${wltStyles.readinessVal} ${wltStyles.readinessValBold}`}>{affectedSurfaces}</span>
              </div>
              <div className={wltStyles.readinessCol}>
                <span className={wltStyles.readinessDesc}>⚙️ <strong>الإجراء المطلوب:</strong></span>
                <span className={`${wltStyles.readinessVal} ${wltStyles.readinessValBold} ${wltStyles.readinessValBrand}`}>{requiredAction}</span>
              </div>
              <div className={wltStyles.readinessCol}>
                <span className={wltStyles.readinessDesc}>🔒 <strong>حظر الصرف/التسوية:</strong></span>
                <span className={`${wltStyles.readinessVal} ${wltStyles.readinessValBold}`}>{holdsStatus}</span>
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

export {
  WltDshFinanceHubHost as ControlPanelDshFinanceHubScreen,
  WltDshFinanceHubHost as ControlPanelFinanceHubHost,
};
export default WltDshFinanceHubHost;
