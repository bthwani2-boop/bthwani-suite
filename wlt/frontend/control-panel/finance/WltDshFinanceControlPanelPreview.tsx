'use client';

import React from 'react';
import { Badge, Button, Icon, KeyValueList, StateView, Surface, useDirection } from '@bthwani/ui-kit';
import {
  WebControlDisclosureItem,
  WebControlSurfaceHeader,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  getWltControlPanelFinancePreview,
  type WltDshFinancePreviewRecord,
  type WltDshFinanceStatusTone,
} from '../../shared/finance/dshFinancePreview';

const BTH_BLUE = '#0A2F5C';
const BTH_ORANGE = '#FF500D';
const BTH_WHITE = '#FFFFFF';
const BTH_BACKGROUND = '#F1F5F9';
const BTH_LINE = 'rgba(10, 47, 92, 0.08)';
const BTH_SOFT = 'rgba(255, 80, 13, 0.08)';

const financeControlRoomCss = `
.finance-control-room-root {
  display: grid;
  gap: 16px;
  direction: rtl;
  text-align: start;
  min-width: 0;
}

.finance-control-room-root,
.finance-control-room-root * {
  box-sizing: border-box;
}

.finance-control-room-hero {
  display: grid;
  gap: 16px;
}

.finance-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.finance-status-banner {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 80, 13, 0.18);
  background:
    radial-gradient(circle at top right, rgba(255, 80, 13, 0.11), transparent 26%),
    linear-gradient(180deg, rgba(255, 250, 245, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
  box-shadow: 0 10px 24px rgba(10, 47, 92, 0.06);
}

.finance-status-banner__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.finance-status-banner__title-block {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.finance-status-banner__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #B45309;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.finance-status-banner__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(180deg, #FFEDD5 0%, #FFE7D7 100%);
  color: #C2410C;
  box-shadow: 0 8px 18px rgba(255, 80, 13, 0.12);
}

.finance-status-banner__title {
  margin: 0;
  color: #0A2F5C;
  font-size: 18px;
  line-height: 1.24;
  font-weight: 900;
}

.finance-status-banner__description {
  margin: 0;
  color: #52687f;
  font-size: 14px;
  line-height: 1.84;
}

.finance-status-banner__badge-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.finance-status-banner__matrix {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.finance-status-banner__column {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(10, 47, 92, 0.08);
}

.finance-status-banner__column-title {
  margin: 0;
  color: #0A2F5C;
  font-size: 13px;
  font-weight: 900;
}

.finance-status-banner__chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.finance-status-banner__note {
  margin: 0;
  color: #64748B;
  font-size: 12px;
  line-height: 1.7;
}

.finance-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(10, 47, 92, 0.08);
  box-shadow: 0 8px 20px rgba(10, 47, 92, 0.04);
}

.finance-tab {
  appearance: none;
  border: 1px solid rgba(10, 47, 92, 0.1);
  background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
  color: #64748B;
  padding: 11px 14px;
  border-radius: 14px;
  min-width: 126px;
  display: grid;
  gap: 3px;
  justify-items: start;
  text-align: start;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  box-shadow: 0 6px 16px rgba(10, 47, 92, 0.04);
}

.finance-tab:hover {
  transform: translateY(-1px);
  border-color: rgba(10, 47, 92, 0.16);
  color: #334155;
}

.finance-tab--active {
  background: linear-gradient(180deg, #fff5ee 0%, #ffffff 100%);
  border-color: rgba(255, 80, 13, 0.24);
  color: #0A2F5C;
  box-shadow: 0 12px 24px rgba(255, 80, 13, 0.1);
  transform: translateY(-1px);
}

.finance-tab__label {
  font-size: 13px;
  font-weight: 900;
  line-height: 1.25;
}

.finance-tab__meta {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: rgba(10, 47, 92, 0.06);
  color: #0A2F5C;
  font-size: 10px;
  font-weight: 900;
}

.finance-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.85fr);
  gap: 14px;
  align-items: start;
  min-width: 0;
}

.finance-workspace__main,
.finance-workspace__rail {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.finance-overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.finance-record-list {
  display: grid;
  gap: 10px;
}

.finance-record-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  direction: rtl;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(245, 249, 252, 0.96) 100%);
  box-shadow: 0 8px 18px rgba(10, 47, 92, 0.04);
}

.finance-record-row__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: rgba(10, 47, 92, 0.05);
  color: #0A2F5C;
  flex-shrink: 0;
}

.finance-record-row__body {
  display: grid;
  gap: 6px;
  min-width: 0;
  align-items: start;
}

.finance-record-row__title {
  margin: 0;
  color: #0A2F5C;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.42;
  text-align: end;
}

.finance-record-row__subtitle {
  margin: 0;
  color: #52687f;
  font-size: 13px;
  line-height: 1.8;
  text-align: end;
}

.finance-record-row__meta-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.finance-record-row__meta-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: rgba(10, 47, 92, 0.03);
  color: #51677E;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.finance-record-row__side {
  display: grid;
  gap: 6px;
  justify-items: end;
  min-width: 96px;
  text-align: end;
}

.finance-record-row__amount {
  color: #0A2F5C;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.18;
}

.finance-record-row__amount--positive {
  color: #0F7A4B;
}

.finance-record-row__amount--negative {
  color: #B42318;
}

.finance-record-row__amount--neutral {
  color: #0A2F5C;
}

.finance-record-section__note {
  margin: 0;
  color: #64748B;
  font-size: 12px;
  line-height: 1.8;
}

.finance-record-list__empty {
  padding: 8px;
}

.finance-disclosure-stack {
  display: grid;
  gap: 10px;
}

.finance-summary-footer {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(244, 248, 252, 0.95) 100%);
  box-shadow: 0 10px 22px rgba(10, 47, 92, 0.04);
}

.finance-preview-shell {
  min-height: 100%;
  background-color: #F1F5F9;
}

.finance-preview-shell__content {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 24px 120px;
}

.finance-preview-shell__back {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

@media (max-width: 1180px) {
  .finance-workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .finance-kpi-grid,
  .finance-overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .finance-kpi-grid,
  .finance-overview-grid,
  .finance-status-banner__matrix {
    grid-template-columns: 1fr;
  }

  .finance-tab {
    min-width: 100%;
  }

  .finance-record-row {
    grid-template-columns: 1fr;
  }

  .finance-record-row__side {
    justify-items: end;
    min-width: 0;
  }

  .finance-status-banner__top {
    flex-direction: column;
  }
}
`;

type FinanceTabId =
  | 'overview'
  | 'client'
  | 'partners'
  | 'captains'
  | 'field'
  | 'reconciliation'
  | 'alerts';

type FinanceTabConfig = {
  id: FinanceTabId;
  label: string;
  metaLabel: string;
  description: string;
};

type FinanceDisclosureItem = {
  id: string;
  label: string;
  description: string;
  badge: string;
  onAction?: () => void;
};

function FinanceControlRoomStyles() {
  return <style>{financeControlRoomCss}</style>;
}

function resolveRecordIconName(record: WltDshFinancePreviewRecord) {
  if (record.kind === 'reconciliation-export') {
    return 'document-attach-outline';
  }

  if (record.kind === 'platform-commission') {
    return 'pie-chart-outline';
  }

  if (
    record.kind === 'partner-settlement' ||
    record.kind === 'refund-adjustment'
  ) {
    return 'swap-horizontal-outline';
  }

  if (
    record.kind === 'captain-earning' ||
    record.kind === 'captain-cod-balance'
  ) {
    return 'bicycle-outline';
  }

  if (
    record.kind === 'field-commission' ||
    record.kind === 'field-payout'
  ) {
    return 'map-outline';
  }

  return 'wallet-outline';
}

function resolveRecordSourceLabel(record: WltDshFinancePreviewRecord) {
  if (record.sourceOrderId) return `طلب ${record.sourceOrderId}`;
  if (record.settlementCycleId) return `دورة ${record.settlementCycleId}`;
  if (record.sourceStoreId) return `متجر ${record.sourceStoreId}`;
  if (record.sourceCaptainId) return `كابتن ${record.sourceCaptainId}`;
  if (record.sourceFieldAgentId) return `مندوب ${record.sourceFieldAgentId}`;
  return 'Preview';
}

function resolveRecordActorLabel(record: WltDshFinancePreviewRecord) {
  switch (record.actor) {
    case 'client':
      return 'عملاء';
    case 'partner':
      return 'شركاء';
    case 'captain':
      return 'كباتن';
    case 'field':
      return 'ميدانيون';
    case 'control-panel':
      return 'مركز التحكم';
    default:
      return 'Preview';
  }
}

function resolveAmountToneClass(record: WltDshFinancePreviewRecord) {
  if (record.tone === 'positive') return 'finance-record-row__amount--positive';
  if (record.tone === 'negative') return 'finance-record-row__amount--negative';
  return 'finance-record-row__amount--neutral';
}

function resolveStatusBadgeTone(statusTone: WltDshFinanceStatusTone): React.ComponentProps<typeof Badge>['tone'] {
  if (statusTone === 'success') return 'success';
  if (statusTone === 'warning') return 'warning';
  if (statusTone === 'info') return 'info';
  return 'danger';
}

function getFinanceTabConfigs(preview = getWltControlPanelFinancePreview()): ReadonlyArray<FinanceTabConfig> {
  const warningRecords = preview.allRecords.filter((record) => record.statusTone === 'warning');

  return [
    {
      id: 'overview',
      label: 'نظرة عامة',
      metaLabel: String(preview.allRecords.length),
      description: 'قراءة أولية لنبض التدفقات والتسويات، مع ترك الحقيقة المالية خارج هذا preview.',
    },
    {
      id: 'client',
      label: 'تدفقات العملاء',
      metaLabel: String(preview.clientRecords.length),
      description: 'مدفوعات التحصيل والتحويل المرتبطة بالطلبات والالتزامات المباشرة.',
    },
    {
      id: 'partners',
      label: 'تسويات الشركاء',
      metaLabel: String(preview.partnerRecords.length),
      description: 'قراءة دورة التسوية الخاصة بالشركاء وما يسبق الإغلاق النهائي.',
    },
    {
      id: 'captains',
      label: 'مالية الكباتن',
      metaLabel: String(preview.captainRecords.length),
      description: 'رصيد التحصيل والمستحقات والمحافظ الخاصة بالكباتن.',
    },
    {
      id: 'field',
      label: 'عمولات الميدانيين',
      metaLabel: String(preview.fieldRecords.length),
      description: 'عمولات فرق التوسع والصرف الدوري المرتبط بالميدان.',
    },
    {
      id: 'reconciliation',
      label: 'المطابقة',
      metaLabel: '1',
      description: 'مساحة مراجعة التصدير والمطابقة قبل أي اعتماد نهائي.',
    },
    {
      id: 'alerts',
      label: 'التنبيهات',
      metaLabel: String(warningRecords.length),
      description: 'إجراءات محجوبة وإشارات مراجعة لا تتحول إلى تنفيذ حقيقي.',
    },
  ];
}

function FinanceTabStrip({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: ReadonlyArray<FinanceTabConfig>;
  activeTab: FinanceTabId;
  onTabChange: (tabId: FinanceTabId) => void;
}) {
  return (
    <div className="finance-tabs" role="tablist" aria-label="أقسام غرفة التحكم المالي">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`finance-tab ${isActive ? 'finance-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="finance-tab__label">{tab.label}</span>
            <span className="finance-tab__meta">{tab.metaLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

function FinanceRecordRow({ record }: { record: WltDshFinancePreviewRecord }) {
  const iconName = resolveRecordIconName(record);
  const statusTone = resolveStatusBadgeTone(record.statusTone);

  return (
    <article className="finance-record-row">
      <div className="finance-record-row__icon" aria-hidden="true">
        <Icon name={iconName as any} size={18} style={{ color: BTH_BLUE }} />
      </div>

      <div className="finance-record-row__body">
        <h3 className="finance-record-row__title">{record.title}</h3>
        <p className="finance-record-row__subtitle">{record.subtitle}</p>
        <div className="finance-record-row__meta-line">
          <span className="finance-record-row__meta-chip">{resolveRecordSourceLabel(record)}</span>
          <span className="finance-record-row__meta-chip">{record.timeLabel}</span>
          <span className="finance-record-row__meta-chip">{resolveRecordActorLabel(record)}</span>
        </div>
      </div>

      <div className="finance-record-row__side">
        <div className={`finance-record-row__amount ${resolveAmountToneClass(record)}`}>{record.amountLabel}</div>
        <Badge label={record.statusLabel} tone={statusTone} />
      </div>
    </article>
  );
}

function FinanceRecordListSection({
  title,
  description,
  records,
  note,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  records: ReadonlyArray<WltDshFinancePreviewRecord>;
  note?: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <WebSectionCard title={title} description={description}>
      <div className="finance-record-list">
        {records.length > 0 ? (
          records.map((record) => <FinanceRecordRow key={record.id} record={record} />)
        ) : (
          <div className="finance-record-list__empty">
            <StateView stateId="empty" title={emptyTitle} description={emptyDescription} />
          </div>
        )}
      </div>
      {note ? <p className="finance-record-section__note">{note}</p> : null}
    </WebSectionCard>
  );
}

function FinanceDisclosurePanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ReadonlyArray<FinanceDisclosureItem>;
}) {
  return (
    <WebSectionCard title={title} description={description}>
      <div className="finance-disclosure-stack">
        {items.map((item) => (
          <WebControlDisclosureItem
            key={item.id}
            label={item.label}
            description={item.description}
            badge={item.badge}
            onAction={item.onAction}
          />
        ))}
      </div>
    </WebSectionCard>
  );
}

function FinanceStatusBanner({
  contractState,
  availableItems,
  blockedItems,
}: {
  contractState: string;
  availableItems: ReadonlyArray<string>;
  blockedItems: ReadonlyArray<string>;
}) {
  return (
    <section className="finance-status-banner" aria-label="حالة العقد والجاهزية التشغيلية">
      <div className="finance-status-banner__top">
        <div className="finance-status-banner__title-block">
          <div className="finance-status-banner__eyebrow">
            <span className="finance-status-banner__icon" aria-hidden="true">
              <Icon name="shield-checkmark-outline" size={20} style={{ color: '#C2410C' }} />
            </span>
            <span>Operational finance status</span>
          </div>
          <h2 className="finance-status-banner__title">العقد غير مفعّل بعد</h2>
          <p className="finance-status-banner__description">
            المتاح الآن: قراءة الحركات، مراجعة الصفوف، وتصدير preview. المحجوب: التسوية الحقيقية، الصرف المباشر، وأي truth مالي نهائي.
          </p>
        </div>

        <Badge label={contractState} tone="warning" />
      </div>

      <div className="finance-status-banner__matrix">
        <div className="finance-status-banner__column">
          <p className="finance-status-banner__column-title">متاح الآن</p>
          <div className="finance-status-banner__chip-row">
            {availableItems.map((item) => (
              <Badge key={item} label={item} tone="success" />
            ))}
          </div>
        </div>

        <div className="finance-status-banner__column">
          <p className="finance-status-banner__column-title">محجوب بالعقد</p>
          <div className="finance-status-banner__chip-row">
            {blockedItems.map((item) => (
              <Badge key={item} label={item} tone="danger" />
            ))}
          </div>
        </div>
      </div>

      <p className="finance-status-banner__note">هذا السطح preview / monitoring فقط، ولا ينتج أي ledger truth أو settlement حقيقي.</p>
    </section>
  );
}

function FinanceTabPanel({
  tabId,
  preview,
}: {
  tabId: FinanceTabId;
  preview: ReturnType<typeof getWltControlPanelFinancePreview>;
}) {
  const clientDescription = 'مدفوعات التحصيل والتحويل التي تبدأ من الطلبات وتخدم مرحلة القرار المالي.';
  const partnerDescription = 'تسويات الشركاء قبل الإغلاق النهائي، مع إبقاء الحقيقة المالية خارج هذا preview.';
  const captainDescription = 'قراءة مالية مركزة على تحصيلات الكباتن والمستحقات الجاهزة للمراجعة.';
  const fieldDescription = 'عمولات الميدانيين والصرف الدوري كما يظهران في سياق التشغيل التجريبي.';
  const reconciliationDescription = 'هذه المساحة تلتقط التصدير والمطابقة على أنها معاينة، لا كحقيقة مالية.';
  const alertsDescription = 'المسارات التي يجب ألا تتحول إلى تنفيذ حقيقي حتى يخرج CONTRACT_TBD من المشهد.';

  switch (tabId) {
    case 'overview':
      return (
        <div className="finance-overview-grid">
          <FinanceRecordListSection
            title="أحدث العمليات"
            description="آخر تدفقات مرئية تُقرأ هنا بترتيب عملي مختصر وواضح."
            records={preview.allRecords.slice(0, 5)}
            note="السطور هنا تُعامل كقراءة تشغيلية فقط، وليست ledger truth."
            emptyTitle="لا توجد عمليات مرئية"
            emptyDescription="لم تصل أي حركات إلى طبقة preview بعد."
          />
          <FinanceRecordListSection
            title="عمولة المنصة والاستقطاعات"
            description="قراءة مركزة على رسوم المنصة وتصدير المطابقة المحجوب حتى الآن."
            records={preview.platformRecords}
            note="هذا المقطع يوضح أين ينتهي preview وأين يبدأ الحظر التشغيلي."
            emptyTitle="لا توجد عمولات مرئية"
            emptyDescription="لا توجد رسوم منصة أو ملفات مطابقة ضمن هذا النموذج التجريبي."
          />
        </div>
      );
    case 'client':
      return (
        <FinanceRecordListSection
          title="تدفقات العملاء"
          description={clientDescription}
          records={preview.clientRecords}
          note="تفاعل العملاء هنا لا يفتح أي اعتماد مالي حقيقي."
          emptyTitle="لا توجد تدفقات عملاء"
          emptyDescription="لا توجد مدفوعات عميل في هذه العينة التجريبية."
        />
      );
    case 'partners':
      return (
        <FinanceRecordListSection
          title="تسويات الشركاء"
          description={partnerDescription}
          records={preview.partnerRecords}
          note="أي تحويل حقيقي يبقى محجوبًا حتى تفعيل العقد."
          emptyTitle="لا توجد تسويات للشركاء"
          emptyDescription="لا توجد تسويات جاهزة للعرض في هذه الدورة."
        />
      );
    case 'captains':
      return (
        <FinanceRecordListSection
          title="مالية الكباتن"
          description={captainDescription}
          records={preview.captainRecords}
          note="المجال هنا للمراجعة والقراءة فقط، لا للصرف الفعلي."
          emptyTitle="لا توجد بيانات للكباتن"
          emptyDescription="لا توجد حركة مالية خاصة بالكباتن داخل هذا preview."
        />
      );
    case 'field':
      return (
        <FinanceRecordListSection
          title="عمولات الميدانيين"
          description={fieldDescription}
          records={preview.fieldRecords}
          note="تظهر العمولات هنا كمرجع تشغيلي، وليس كعملية مالية حية."
          emptyTitle="لا توجد عمولات ميدانية"
          emptyDescription="لا توجد دفعات ميدانية ضمن هذه العينة التجريبية."
        />
      );
    case 'reconciliation':
      return (
        <FinanceRecordListSection
          title="مراجعة المطابقة / preview"
          description={reconciliationDescription}
          records={preview.allRecords.filter((record) => record.kind === 'reconciliation-export' || record.kind === 'platform-commission')}
          note="المطابقة الحالية تعرض المخرجات المرئية فقط، ولا تغلق دورة مالية حقيقية."
          emptyTitle="لا توجد طبقة مطابقة"
          emptyDescription="لا توجد ملفات reconciliation preview جاهزة للقراءة الآن."
        />
      );
    case 'alerts':
      return (
        <FinanceRecordListSection
          title="التنبيهات / blocked actions"
          description={alertsDescription}
          records={preview.allRecords.filter((record) => record.statusTone === 'warning' || record.kind === 'reconciliation-export')}
          note="كل عنصر هنا يحتاج مراجعة، ولا يتحول إلى تنفيذ مالي حقيقي حتى يزول القيد."
          emptyTitle="لا توجد تنبيهات"
          emptyDescription="لا توجد عناصر محجوبة أو إشارات مراجعة في هذه العينة التجريبية."
        />
      );
    default:
      return null;
  }
}

export function WltDshFinanceControlPanelContent() {
  const { direction } = useDirection();
  const preview = React.useMemo(() => getWltControlPanelFinancePreview(), []);
  const [activeTab, setActiveTab] = React.useState<FinanceTabId>('overview');

  const tabConfigs = React.useMemo(() => getFinanceTabConfigs(preview), [preview]);
  const activeTabConfig = tabConfigs.find((tab) => tab.id === activeTab) ?? tabConfigs[0];

  const availableItems = React.useMemo(() => [
    'قراءة الحركات',
    'مراجعة الصفوف',
    'تصدير preview',
  ], []);

  const blockedItems = React.useMemo(() => [
    'تسوية حقيقية',
    'صرف مباشر',
    'truth ledger',
  ], []);

  const warningRecords = preview.allRecords.filter((record) => record.statusTone === 'warning');
  const heroActions = React.useMemo(() => {
    if (activeTab === 'overview') {
      return [
        {
          id: 'finance-go-reconciliation',
          label: 'فتح المطابقة',
          tone: 'primary' as const,
          onAction: () => setActiveTab('reconciliation'),
        },
        {
          id: 'finance-go-alerts',
          label: 'عرض التنبيهات',
          tone: 'secondary' as const,
          onAction: () => setActiveTab('alerts'),
        },
      ];
    }

    return [
      {
        id: 'finance-go-overview',
        label: 'النظرة العامة',
        tone: 'primary' as const,
        onAction: () => setActiveTab('overview'),
      },
      {
        id: 'finance-go-alerts',
        label: 'عرض التنبيهات',
        tone: 'secondary' as const,
        onAction: () => setActiveTab('alerts'),
      },
    ];
  }, [activeTab]);

  return (
    <>
      <FinanceControlRoomStyles />
      <div className="finance-control-room-root" dir={direction} lang="ar">
        <WebControlSurfaceHeader
          chips={[
            { label: 'WLT / Preview', tone: 'brand' },
            { label: activeTabConfig?.label ?? 'المالية', tone: 'accent' },
            { label: preview.contractState, tone: 'neutral' },
          ]}
          title="النبض المالي اليومي"
          description={`مراقبة التدفقات والتسويات في وضع preview فقط. ${activeTabConfig?.description ?? 'القراءة هنا تشغيلية وليست truth مالية.'}`}
          actions={heroActions}
        />

        <div className="finance-kpi-grid">
          <WebSignalCard
            title="إجمالي الدخل المحقق"
            value={preview.totalInflowLabel}
            description="+12.5% عن الدورة السابقة · تدفقات العميل والمحفظة والتحصيل النقدي"
            tone="best"
          />
          <WebSignalCard
            title="إجمالي المصروفات"
            value={preview.totalOutflowLabel}
            description="-2.1% عن الدورة السابقة · مصروفات منظورة فقط داخل preview"
            tone="danger"
          />
          <WebSignalCard
            title="صافي السيولة"
            value={preview.netLabel}
            description="خلاصة القراءة الحالية بعد المقاصة الحسابية داخل العينة"
            tone="info"
          />
          <WebSignalCard
            title="محجوب بالعقد"
            value={String(warningRecords.length + 1)}
            description="CONTRACT_TBD · التسوية الحقيقية والصرف والمطابقة النهائية محجوبة"
            tone="warning"
          />
        </div>

        <FinanceStatusBanner
          contractState={preview.contractState}
          availableItems={availableItems}
          blockedItems={blockedItems}
        />

        <FinanceTabStrip tabs={tabConfigs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="finance-workspace">
          <div className="finance-workspace__main">
            <FinanceTabPanel tabId={activeTab} preview={preview} />
          </div>

          <div className="finance-workspace__rail">
            <FinanceDisclosurePanel
              title="متاح الآن"
              description="القراءة والتحليل مسموحان، لكن لا يوجد تنفيذ مالي حقيقي في هذا السطح."
              items={[
                {
                  id: 'available-overview',
                  label: 'قراءة الحركات',
                  description: 'افتح النظرة العامة لقراءة التسلسل الحالي بسرعة.',
                  badge: 'متاح',
                  onAction: () => setActiveTab('overview'),
                },
                {
                  id: 'available-reconciliation',
                  label: 'مراجعة المطابقة',
                  description: 'انتقل إلى طبقة المطابقة preview لمراجعة التصدير.',
                  badge: 'متاح',
                  onAction: () => setActiveTab('reconciliation'),
                },
                {
                  id: 'available-alerts',
                  label: 'قراءة التنبيهات',
                  description: 'افتح صفوف blocked actions دون تنفيذ أي تغيير.',
                  badge: 'متاح',
                  onAction: () => setActiveTab('alerts'),
                },
              ]}
            />

            <FinanceDisclosurePanel
              title="محجوب بالعقد"
              description="المسارات التالية تبقى مقفلة حتى لا يتحول preview إلى truth مالي مبكر."
              items={[
                {
                  id: 'blocked-settlement',
                  label: 'تسوية حقيقية',
                  description: 'محجوبة حتى CONTRACT_TBD يخرج من الحالة الحالية.',
                  badge: 'محجوب',
                  onAction: () => setActiveTab('alerts'),
                },
                {
                  id: 'blocked-disbursement',
                  label: 'صرف مباشر',
                  description: 'لا يوجد صرف فعلي أو settlement live في هذا السطح.',
                  badge: 'محجوب',
                  onAction: () => setActiveTab('alerts'),
                },
                {
                  id: 'blocked-ledger',
                  label: 'ledger truth',
                  description: 'المخرجات الحالية قراءة preview فقط وليست ledger نهائي.',
                  badge: 'محجوب',
                  onAction: () => setActiveTab('reconciliation'),
                },
              ]}
            />
          </div>
        </div>

        <Surface
          tone="raised"
          padding={4}
          style={{
            borderRadius: 18,
            backgroundColor: BTH_WHITE,
            border: '1px solid rgba(10, 47, 92, 0.08)',
          }}
        >
          <KeyValueList
            items={[
              { label: 'حالة العقد', value: preview.contractState, tone: 'warning' },
              { label: 'الحركات الظاهرة', value: String(preview.allRecords.length), tone: 'info' },
              { label: 'جاهز الآن', value: String(availableItems.length), tone: 'success' },
              { label: 'محجوب', value: String(blockedItems.length), tone: 'danger' },
            ]}
          />
        </Surface>
      </div>
    </>
  );
}

export function WltDshFinanceControlPanelPreview({
  onBack,
}: {
  onBack?: () => void;
}) {
  return (
    <div className="finance-preview-shell">
      <div className="finance-preview-shell__content">
        {onBack ? (
          <div className="finance-preview-shell__back">
            <Button
              label="العودة"
              tone="ghost"
              icon="arrow-forward"
              onPress={onBack}
              style={{ borderRadius: 10 }}
            />
          </div>
        ) : null}

        <WltDshFinanceControlPanelContent />
      </div>
    </div>
  );
}

export default WltDshFinanceControlPanelPreview;
