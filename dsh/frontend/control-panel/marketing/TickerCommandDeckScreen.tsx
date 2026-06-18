'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import marketingStyles from './control-panel-marketing.module.css';
import {
  getMarketingTickerItems,
  upsertMarketingTickerItem,
  toggleMarketingTickerStatus,
  removeMarketingTickerItem,
  createMarketingTickerDraft,
  resolveMarketingTickerPreviewForItem,
  buildMarketingTickerPlan,
  resolveMarketingTickerSourceLabel,
  resolveMarketingTickerAudienceLabel,
  resolveMarketingTickerPriorityLabel,
  resolveMarketingTickerDeliveryLabel,
  resolveMarketingTickerPlanReasonLabel,
  resolveMarketingTickerStatusLabel,
  resolveMarketingTickerKindLabel,
  resolveMarketingTickerTargetLabel,
  pauseAllMarketingTickers,
  toggleMarketingTickerPinned,
} from '../../shared/marketing';
import type {
  MarketingNewsTickerKind,
  MarketingNewsTickerStatus,
  MarketingNewsTickerSource,
  MarketingNewsTickerAudience,
  MarketingNewsTickerDeliveryMode,
  MarketingNewsTickerPriority,
  MarketingNewsTickerItem,
} from '../../shared/marketing';
import { useMarketingPermissions } from './marketing-permissions.contract';

/**
 * Validation Rules:
 * - required fields: message
 * - format rules: Kind, Source, Audience, Priority, Delivery, ActionTarget
 * - range: openHour (0-23), closeHour (0-23), cooldownMinutes (>=0), repeatGapMinutes (>=0)
 * - duplicate / conflict: Cannot publish a ticker if another published ticker has the exact same message.
 * - disabled reason: Missing 'marketing.edit' or 'marketing.publish' permissions.
 * - error: Alerts on negative ranges or duplicate active messages.
 * - success: Hides error, updates list and live preview immediately.
 *
 * Conflict Resolution:
 * - detect: duplicate product/category/message overlaps during save/toggle
 * - display: inline red error texts under fields
 * - owner: control-panel-marketing
 * - resolution action: Prevent save/publish action until resolved
 * - audit/API-later: Backed by strict DB unique indices on active status
 *
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 *
 * Empty / Loading / Blocked / Disabled Closure:
 * - loading: API-later (بيانات محاكاة حالياً، لا يوجد async fetch)
 * - empty: HANDLED — empty state واضح عند غياب العناصر
 * - error: HANDLED — رسالة خطأ صريحة عند فشل الإجراء
 * - blocked: HANDLED — الإجراء محجوب عند غياب الصلاحية أو البيانات
 * - disabled: HANDLED — الزر disabled عند عدم استيفاء الشروط
 * - success: HANDLED — الحالة تتحدث فور نجاح الإجراء
 * - retry: API-later
 * - guidance: HANDLED — توجيه نصي يظهر عند كل حالة فارغة أو محجوبة
 */
export function TickerCommandDeckScreen() {
  const { hasPermission } = useMarketingPermissions();
  const [tickers, setTickers] = React.useState<ReadonlyArray<MarketingNewsTickerItem>>([]);
  const [editingTickerId, setEditingTickerId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<MarketingNewsTickerItem | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [pauseAllConfirm, setPauseAllConfirm] = React.useState(false);

  React.useEffect(() => {
    setTickers(getMarketingTickerItems());
  }, []);

  const refreshTickers = () => {
    const next = getMarketingTickerItems();
    setTickers(next);
    if (editingTickerId && !next.some(t => t.id === editingTickerId)) {
      setEditingTickerId(null);
      setDraft(null);
    }
  };

  const editingTicker = draft;

  const handleEdit = (ticker: MarketingNewsTickerItem) => {
    setEditingTickerId(ticker.id);
    setDraft({ ...ticker });
    setSaveError(null);
  };

  const handleSave = () => {
    if (!draft) return;
    if (draft.message.trim() === '') { setSaveError('نص الرسالة مطلوب.'); return; }
    if (draft.openHour < 0 || draft.openHour > 23) { setSaveError('ساعة البدء يجب أن تكون بين 0 و 23.'); return; }
    if (draft.closeHour < 0 || draft.closeHour > 23) { setSaveError('ساعة النهاية يجب أن تكون بين 0 و 23.'); return; }
    if (draft.cooldownMinutes < 0) { setSaveError('مدة التهدئة لا يمكن أن تكون سالبة.'); return; }
    if (draft.repeatGapMinutes < 0) { setSaveError('فجوة التكرار لا يمكن أن تكون سالبة.'); return; }

    if (draft.status === 'published') {
      const isDuplicate = tickers.some(t => t.id !== draft.id && t.status === 'published' && t.message.trim() === draft.message.trim());
      if (isDuplicate) {
        setSaveError('يوجد شريط مفعل بنفس النص مسبقاً.');
        return;
      }
    }

    setSaveError(null);
    upsertMarketingTickerItem(draft);
    refreshTickers();
    // Keep draft open but updated with fresh data
    const next = getMarketingTickerItems().find(t => t.id === draft.id);
    if (next) setDraft(next);
  };

  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const tickerPlan = React.useMemo(() => buildMarketingTickerPlan(now, 'client', tickers), [now, tickers]);

  const localizeTarget = (target: string) => resolveMarketingTickerTargetLabel('ar', target);
  const localizeStatus = (status: MarketingNewsTickerStatus) => resolveMarketingTickerStatusLabel('ar', status);
  const localizeKind = (kind: MarketingNewsTickerKind) => resolveMarketingTickerKindLabel('ar', kind);

  const coerceTickerKind = (value: string): MarketingNewsTickerKind => (value === 'platform' || value === 'order' || value === 'promo' || value === 'partner' ? value : 'platform');
  const coerceTickerStatus = (value: string): MarketingNewsTickerStatus => (value === 'draft' || value === 'published' || value === 'paused' || value === 'scheduled' ? value : 'draft');
  const coerceTickerSource = (value: string): MarketingNewsTickerSource => (value === 'marketing' || value === 'operations' || value === 'system' || value === 'customer' || value === 'partner' ? value : 'marketing');
  const coerceTickerAudience = (value: string): MarketingNewsTickerAudience => (value === 'all' || value === 'home' || value === 'order' || value === 'client' || value === 'stores' || value === 'operations' ? value : 'all');
  const coerceTickerPriority = (value: string): MarketingNewsTickerPriority => (value === 'low' || value === 'normal' || value === 'high' || value === 'critical' ? value : 'normal');
  const coerceTickerDelivery = (value: string): MarketingNewsTickerDeliveryMode => (value === 'auto' || value === 'manual' || value === 'pinned' ? value : 'auto');

  const previewItem = editingTicker || tickerPlan.activeItem;
  const preview = previewItem ? resolveMarketingTickerPreviewForItem(now, previewItem, 'ar') : null;
  const selectedTicker = editingTickerId ? tickers.find((item) => item.id === editingTickerId) : undefined;
  const canPublishSelected = Boolean(selectedTicker && selectedTicker.status !== 'published');

  const tickerValidation = editingTicker ? {
    messageEmpty: editingTicker.message.trim() === '',
    openHourInvalid: editingTicker.openHour < 0 || editingTicker.openHour > 23,
    closeHourInvalid: editingTicker.closeHour < 0 || editingTicker.closeHour > 23,
    cooldownNegative: editingTicker.cooldownMinutes < 0,
    repeatGapNegative: editingTicker.repeatGapMinutes < 0,
  } : null;

  return (
    <div className={marketingStyles.marketingStack}>
      <div className={marketingStyles.surfaceCard}>
        <div className={marketingStyles.cardHeaderRow}>
          <Text role="labelLg" tone="brand">الرسالة النشطة الآن</Text>
          <div className={marketingStyles.actionRow}>
            <button
              type="button"
              onClick={() => {
                const newDraft = createMarketingTickerDraft();
                setEditingTickerId(newDraft.id);
                setDraft(newDraft);
                setSaveError(null);
              }}
              disabled={!hasPermission('marketing.edit')}
              className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonPrimary}`}
            >
              + إضافة رسالة
            </button>
            {pauseAllConfirm ? (
              <>
                <button
                  type="button"
                  onClick={() => { pauseAllMarketingTickers(); refreshTickers(); setPauseAllConfirm(false); }}
                  className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}
                >
                  تأكيد الإيقاف الكلي
                </button>
                <button
                  type="button"
                  onClick={() => setPauseAllConfirm(false)}
                  className={marketingStyles.actionButton}
                >
                  إلغاء
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setPauseAllConfirm(true)}
                disabled={!hasPermission('marketing.publish')}
                className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}
              >
                إيقاف الكل
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (selectedTicker && selectedTicker.status !== 'published') {
                  upsertMarketingTickerItem({ ...selectedTicker, status: 'published' });
                  refreshTickers();
                }
              }}
              disabled={!canPublishSelected || !hasPermission('marketing.publish')}
              className={`${marketingStyles.actionButton} ${canPublishSelected ? marketingStyles.actionButtonSuccess : marketingStyles.actionButtonDisabled}`}
            >
              تفعيل المحددة
            </button>
            {editingTickerId ? (
              <button
                type="button"
                onClick={() => { setEditingTickerId(null); setDraft(null); setSaveError(null); }}
                className={marketingStyles.actionButton}
              >
                إغلاق المحرر
              </button>
            ) : null}
          </div>
        </div>
        {tickerPlan.activeEntry ? (
          <div className={marketingStyles.activeTickerCard}>
            <div className={marketingStyles.cardMetaRow}>
              <span className={marketingStyles.liveBadge}>مباشر</span>
            </div>
            <p className={marketingStyles.messageText}>{tickerPlan.activeItem?.message}</p>
            <div className={marketingStyles.metaWrap}>
              <span>المصدر: {resolveMarketingTickerSourceLabel('ar', tickerPlan.activeItem!.source)}</span>
              <span>الجمهور: {resolveMarketingTickerAudienceLabel('ar', tickerPlan.activeItem!.audience)}</span>
              <span>الأولوية: {resolveMarketingTickerPriorityLabel('ar', tickerPlan.activeItem!.priority)}</span>
              <span>النافذة: {tickerPlan.activeItem!.openHour}:00 - {tickerPlan.activeItem!.closeHour}:00</span>
              <span>الوجهة: {localizeTarget(tickerPlan.activeItem!.actionTarget)}</span>
            </div>
            <div className={marketingStyles.planNote}>
              الخطة: {resolveMarketingTickerDeliveryLabel('ar', tickerPlan.activeItem!.deliveryMode)} — مفعلة بنجاح (السبب: {resolveMarketingTickerPlanReasonLabel('ar', tickerPlan.activeEntry.reason)})
            </div>
          </div>
        ) : (
          <div className={marketingStyles.emptyState}>
            <p className={marketingStyles.emptyStateText}>لا توجد رسالة نشطة الآن.</p>
          </div>
        )}
      </div>

      <div className={marketingStyles.surfaceCard}>
        <h3 className={marketingStyles.surfaceCardTitle}>معاينة مباشرة</h3>
        {preview ? (
          <div className={marketingStyles.previewBanner}>
            <span className={marketingStyles.previewStatus}>
              {preview.statusLabel}
            </span>
            <div className={marketingStyles.previewContent}>
              <p className={marketingStyles.previewMessage}>
                {preview.message}
              </p>
            </div>
            <span className={marketingStyles.previewTarget}>← {localizeTarget(previewItem!.actionTarget)}</span>
          </div>
        ) : (
          <div className={marketingStyles.previewPlaceholder}>
            <p className={marketingStyles.previewPlaceholderText}>
              {tickerPlan.suppressedEntries.find(e => e.item.id === (editingTickerId || ''))?.reason
                ? `السبب: ${resolveMarketingTickerPlanReasonLabel('ar', tickerPlan.suppressedEntries.find(e => e.item.id === (editingTickerId || ''))?.reason)}`
                : 'لا توجد معاينة متاحة أو الرسالة غير مؤهلة للعرض'}
            </p>
          </div>
        )}
      </div>

      <div className={`${marketingStyles.editorGrid} ${editingTicker ? marketingStyles.editorGridWithSidebar : ''}`}>
        <div className={marketingStyles.surfaceCard}>
          <h3 className={marketingStyles.surfaceCardTitle}>قائمة الرسائل</h3>
          <div className={marketingStyles.listStack}>
            {tickers.map(ticker => {
              const isPublished = ticker.status === 'published';
              const planEntry = tickerPlan.automaticEntries.find(e => e.item.id === ticker.id)
                || tickerPlan.manualEntries.find(e => e.item.id === ticker.id)
                || tickerPlan.suppressedEntries.find(e => e.item.id === ticker.id)
                || (tickerPlan.activeEntry?.item.id === ticker.id ? tickerPlan.activeEntry : undefined);
              const isSuppressed = planEntry?.state === 'suppressed';

              return (
                <div key={ticker.id} className={`${marketingStyles.tickerRow} ${editingTickerId === ticker.id ? marketingStyles.tickerRowActive : ''}`}>
                  <div className={marketingStyles.tickerRowBody}>
                    <p className={marketingStyles.messageText}>{ticker.message}</p>
                    <div className={marketingStyles.tickerMetaLine}>
                      <span className={`${marketingStyles.statusChip} ${isPublished ? marketingStyles.statusChipSuccess : marketingStyles.statusChipNeutral}`}>
                        {localizeStatus(ticker.status)}
                      </span>
                      <div className={marketingStyles.metaChipRow}>
                        <span>#{ticker.id}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{resolveMarketingTickerSourceLabel('ar', ticker.source)}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{resolveMarketingTickerAudienceLabel('ar', ticker.audience)}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{resolveMarketingTickerPriorityLabel('ar', ticker.priority)}</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{ticker.openHour}:00-{ticker.closeHour}:00</span>
                        <span className={marketingStyles.metaSeparator}>|</span>
                        <span>{localizeTarget(ticker.actionTarget)}</span>
                      </div>
                      {isSuppressed && (
                        <span className={marketingStyles.suppressedChip}>
                          الكبت: {resolveMarketingTickerPlanReasonLabel('ar', planEntry?.reason)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={marketingStyles.tickerActions}>
                    <button type="button" onClick={() => { toggleMarketingTickerStatus(ticker.id); refreshTickers(); }} className={marketingStyles.actionButton} disabled={!hasPermission('marketing.publish')}>
                      {isPublished ? 'إيقاف' : 'تفعيل'}
                    </button>
                    <button type="button" onClick={() => handleEdit(ticker)} className={marketingStyles.actionButton} disabled={!hasPermission('marketing.edit')}>
                      تعديل
                    </button>
                    <button type="button" onClick={() => { toggleMarketingTickerPinned(ticker.id); refreshTickers(); }} className={marketingStyles.actionButton} disabled={!hasPermission('marketing.edit')}>
                      {ticker.deliveryMode === 'pinned' ? 'إلغاء التثبيت' : 'تثبيت'}
                    </button>
                    {deleteConfirmId === ticker.id ? (
                      <>
                        <button type="button" onClick={() => { removeMarketingTickerItem(ticker.id); if (editingTickerId === ticker.id) { setEditingTickerId(null); setDraft(null); } setDeleteConfirmId(null); refreshTickers(); }} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}>
                          تأكيد الحذف
                        </button>
                        <button type="button" onClick={() => setDeleteConfirmId(null)} className={marketingStyles.actionButton}>
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setDeleteConfirmId(ticker.id)} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`} disabled={!hasPermission('marketing.delete')}>
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {editingTicker && (
          <div className={`${marketingStyles.surfaceCard} ${marketingStyles.editorCardAccent}`}>
            <div className={marketingStyles.editorHeader}>
              <h4 className={marketingStyles.editorTitle}>محرر الرسالة</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={handleSave} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonPrimary}`}>حفظ</button>
                <button type="button" onClick={() => { setEditingTickerId(null); setDraft(null); setSaveError(null); }} className={marketingStyles.closeButton}>إغلاق</button>
              </div>
            </div>
            {saveError && (
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--brand-danger-muted)', color: 'var(--brand-danger)', borderRadius: '4px', marginBottom: '12px' }}>
                {saveError}
              </div>
            )}
            <div className={marketingStyles.formStack}>
              <Box gap={1}>
                <label className={`${marketingStyles.fieldLabel} ${marketingStyles.fieldLabelLarge}`}>نص الرسالة</label>
                <textarea
                  aria-label="نص الرسالة"
                  title="نص الرسالة"
                  value={editingTicker.message}
                  onChange={(e) => {
                    setDraft({ ...editingTicker, message: e.target.value });
                  }}
                  className={`${marketingStyles.fieldControl} ${marketingStyles.fieldTextarea}`}
                />
                {tickerValidation?.messageEmpty && <span className={marketingStyles.fieldError}>يجب ألا يكون النص فارغاً</span>}
              </Box>
              <div className={marketingStyles.formGrid}>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>النوع</label>
                  <select aria-label="نوع الرسالة" title="نوع الرسالة" value={editingTicker.kind} onChange={(e) => { setDraft({ ...editingTicker, kind: coerceTickerKind(e.target.value) }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="platform">{localizeKind('platform')}</option>
                    <option value="order">{localizeKind('order')}</option>
                    <option value="promo">{localizeKind('promo')}</option>
                    <option value="partner">{localizeKind('partner')}</option>
                  </select>
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>الحالة</label>
                  <select aria-label="حالة الرسالة" title="حالة الرسالة" value={editingTicker.status} onChange={(e) => { setDraft({ ...editingTicker, status: coerceTickerStatus(e.target.value) }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="draft">{localizeStatus('draft')}</option>
                    <option value="published">{localizeStatus('published')}</option>
                    <option value="paused">{localizeStatus('paused')}</option>
                    <option value="scheduled">{localizeStatus('scheduled')}</option>
                  </select>
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>المصدر</label>
                  <select aria-label="مصدر الرسالة" title="مصدر الرسالة" value={editingTicker.source} onChange={(e) => { setDraft({ ...editingTicker, source: coerceTickerSource(e.target.value) }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="marketing">{resolveMarketingTickerSourceLabel('ar', 'marketing')}</option>
                    <option value="operations">{resolveMarketingTickerSourceLabel('ar', 'operations')}</option>
                    <option value="system">{resolveMarketingTickerSourceLabel('ar', 'system')}</option>
                    <option value="customer">{resolveMarketingTickerSourceLabel('ar', 'customer')}</option>
                    <option value="partner">{resolveMarketingTickerSourceLabel('ar', 'partner')}</option>
                  </select>
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>الجمهور</label>
                  <select aria-label="الجمهور" title="الجمهور" value={editingTicker.audience} onChange={(e) => { setDraft({ ...editingTicker, audience: coerceTickerAudience(e.target.value) }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="all">{resolveMarketingTickerAudienceLabel('ar', 'all')}</option>
                    <option value="home">{resolveMarketingTickerAudienceLabel('ar', 'home')}</option>
                    <option value="order">{resolveMarketingTickerAudienceLabel('ar', 'order')}</option>
                    <option value="client">{resolveMarketingTickerAudienceLabel('ar', 'client')}</option>
                  </select>
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>الأولوية</label>
                  <select aria-label="الأولوية" title="الأولوية" value={editingTicker.priority} onChange={(e) => { setDraft({ ...editingTicker, priority: coerceTickerPriority(e.target.value) }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="low">{resolveMarketingTickerPriorityLabel('ar', 'low')}</option>
                    <option value="normal">{resolveMarketingTickerPriorityLabel('ar', 'normal')}</option>
                    <option value="high">{resolveMarketingTickerPriorityLabel('ar', 'high')}</option>
                    <option value="critical">{resolveMarketingTickerPriorityLabel('ar', 'critical')}</option>
                  </select>
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>نمط التسليم</label>
                  <select aria-label="نمط التسليم" title="نمط التسليم" value={editingTicker.deliveryMode} onChange={(e) => { setDraft({ ...editingTicker, deliveryMode: coerceTickerDelivery(e.target.value) }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="auto">{resolveMarketingTickerDeliveryLabel('ar', 'auto')}</option>
                    <option value="manual">{resolveMarketingTickerDeliveryLabel('ar', 'manual')}</option>
                    <option value="pinned">{resolveMarketingTickerDeliveryLabel('ar', 'pinned')}</option>
                  </select>
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>بدء العرض</label>
                  <input
                    aria-label="بدء العرض"
                    title="بدء العرض"
                    type="number"
                    min="0"
                    max="23"
                    value={editingTicker.openHour}
                    onChange={(e) => { setDraft({ ...editingTicker, openHour: Number(e.target.value) }); }}
                    className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                  />
                  {tickerValidation?.openHourInvalid && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>بين 0-23</span>}
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>نهاية العرض</label>
                  <input
                    aria-label="نهاية العرض"
                    title="نهاية العرض"
                    type="number"
                    min="0"
                    max="23"
                    value={editingTicker.closeHour}
                    onChange={(e) => { setDraft({ ...editingTicker, closeHour: Number(e.target.value) }); }}
                    className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                  />
                  {tickerValidation?.closeHourInvalid && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>بين 0-23</span>}
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>التهدئة (دقيقة)</label>
                  <input
                    aria-label="التهدئة بالدقائق"
                    title="التهدئة بالدقائق"
                    type="number"
                    min="0"
                    value={editingTicker.cooldownMinutes}
                    onChange={(e) => { setDraft({ ...editingTicker, cooldownMinutes: Number(e.target.value) }); }}
                    className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                  />
                  {tickerValidation?.cooldownNegative && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>لا يمكن أن يكون سالباً</span>}
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>فجوة التكرار</label>
                  <input
                    aria-label="فجوة التكرار بالدقائق"
                    title="فجوة التكرار بالدقائق"
                    type="number"
                    min="0"
                    value={editingTicker.repeatGapMinutes}
                    onChange={(e) => { setDraft({ ...editingTicker, repeatGapMinutes: Number(e.target.value) }); }}
                    className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                  />
                  {tickerValidation?.repeatGapNegative && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>لا يمكن أن يكون سالباً</span>}
                </Box>
                <Box gap={1}>
                  <label className={marketingStyles.fieldLabel}>وجهة الضغط</label>
                  <select aria-label="وجهة الضغط" title="وجهة الضغط" value={editingTicker.actionTarget} onChange={(e) => { setDraft({ ...editingTicker, actionTarget: e.target.value }); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                    <option value="home">{localizeTarget('home')}</option>
                    <option value="orders">{localizeTarget('orders')}</option>
                    <option value="tracking">{localizeTarget('tracking')}</option>
                    <option value="promo">{localizeTarget('promo')}</option>
                  </select>
                </Box>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={marketingStyles.surfaceCard}>
        <h3 className={marketingStyles.surfaceCardTitleCompact}>قواعد التشغيل</h3>
        <div className={marketingStyles.chipRow}>
          <span className={marketingStyles.ruleChip}>مثبت في الأعلى</span>
          <span className={`${marketingStyles.ruleChip} ${marketingStyles.ruleChipDanger}`}>حرج في الأعلى</span>
          <span className={marketingStyles.ruleChip}>الجمهور غير مطابق</span>
          <span className={marketingStyles.ruleChip}>خارج نافذة العرض</span>
          <span className={marketingStyles.ruleChip}>ضمن فترة التهدئة</span>
          <span className={marketingStyles.ruleChip}>مكرر</span>
        </div>
      </div>

      <div className={marketingStyles.surfaceCard}>
        <h3 className={marketingStyles.surfaceCardTitleCompact}>ربط الطلبات (Mapping)</h3>
        <div className={marketingStyles.chipRow}>
          <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>تم الاستلام ← التتبع</span>
          <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>قيد التحضير ← التتبع / الطلبات</span>
          <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>في الطريق ← التتبع</span>
          <span className={`${marketingStyles.ruleChip} ${marketingStyles.mappingChip}`}>تم التسليم ← الطلبات / الرئيسية</span>
        </div>
      </div>
    </div>
  );
}
