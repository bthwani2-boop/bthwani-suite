'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
  type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayerScreen';
import { BannersCommandDeckScreen } from './BannersCommandDeckScreen';
import { GrowthCommandDeckScreen } from './GrowthCommandDeckScreen';
import { VideosCommandDeckScreen } from './VideosCommandDeckScreen';
import { LoyaltyCommandDeckScreen } from './LoyaltyCommandDeckScreen';
import { PromosCommandDeckScreen } from './PromosCommandDeckScreen';
import { CampaignsCommandDeckScreen } from './CampaignsCommandDeckScreen';
import { PartnerOffersCommandDeckScreen } from './PartnerOffersCommandDeckScreen';
import { MarketingMediaReviewCommandDeckScreen } from './MarketingMediaReviewCommandDeckScreen';
import styles from '../shared/control-panel-surface.module.css';
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
  type MarketingNewsTickerItem,
  type MarketingNewsTickerAudience,
  type MarketingNewsTickerPriority,
  type MarketingNewsTickerSource,
  type MarketingNewsTickerStatus,
  type MarketingNewsTickerDeliveryMode,
  type MarketingNewsTickerKind,
} from '../../shared/news-ticker.preview-store';
import { dshPromotionCandidates } from '../../shared/workflow';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps;

type MarketingControlView = 'ticker' | 'banners' | 'promos' | 'video' | 'campaigns' | 'partners' | 'loyalty' | 'growth' | 'signals' | 'media-review';

export function ControlPanelDshMarketingScreen(props: ControlPanelDshMarketingScreenProps) {
  const [activeTab, setActiveTab] = React.useState<MarketingControlView>('banners');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('');
  const [tickers, setTickers] = React.useState<ReadonlyArray<MarketingNewsTickerItem>>([]);
  const [editingTickerId, setEditingTickerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTickers(getMarketingTickerItems());
  }, []);

  const refreshTickers = () => setTickers(getMarketingTickerItems());

  const editingTicker = editingTickerId ? tickers.find(t => t.id === editingTickerId) : null;

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

  const PRIMARY_TABS = [
    { id: 'ticker', label: 'الشريط الذكي', icon: '' },
    { id: 'banners', label: 'البنرات والكارسول', icon: '' },
    { id: 'promos', label: 'بروموهات الرئيسية', icon: '' },
    { id: 'video', label: 'استوديو الفيديو', icon: '' },
    { id: 'campaigns', label: 'الحملات', icon: '' },
    { id: 'partners', label: 'عروض الشركاء', icon: '' },
    { id: 'media-review', label: 'مراجعة الصور والمنتجات', icon: '' },
    { id: 'loyalty', label: 'الولاء والاشتراكات', icon: '' },
    { id: 'growth', label: 'النمو', icon: '' },
    { id: 'signals', label: 'الإشارات والقياس', icon: '' },
  ] as const;

  const SECONDARY_TABS: Record<MarketingControlView, { id: string; label: string }[]> = {
    ticker: [],
    banners: [],
    promos: [],
    video: [],
    campaigns: [],
    partners: [],
    'media-review': [],
    growth: [],
    signals: [
      { id: 'reach', label: 'الوصول' },
      { id: 'clicks', label: 'النقرات' },
      { id: 'conversion', label: 'التحويل' },
      { id: 'health', label: 'الصحة' },
    ],
    loyalty: [
      { id: 'overview', label: 'نظرة عامة' },
      { id: 'builder', label: 'المصمم' },
      { id: 'sync', label: 'المزامنة' },
    ],
  };


  // Set default sub-tab when primary tab changes
  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab].length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const renderActiveLane = () => {
    switch (activeTab) {
      case 'ticker': {
        const previewItem = editingTicker || tickerPlan.activeItem;
        const preview = previewItem ? resolveMarketingTickerPreviewForItem(now, previewItem, 'ar') : null;
        const selectedTicker = editingTickerId ? tickers.find((item) => item.id === editingTickerId) : undefined;
        const canPublishSelected = Boolean(selectedTicker && selectedTicker.status !== 'published');

        return (
          <div className={marketingStyles.marketingStack}>
            <div className={marketingStyles.surfaceCard}>
              <div className={marketingStyles.cardHeaderRow}>
                <Text role="titleXs" tone="brand">الرسالة النشطة الآن</Text>
                <div className={marketingStyles.actionRow}>
                  <button
                    onClick={() => {
                      const draft = createMarketingTickerDraft();
                      upsertMarketingTickerItem(draft);
                      setEditingTickerId(draft.id);
                      refreshTickers();
                    }}
                    className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonPrimary}`}
                  >
                    + إضافة رسالة
                  </button>
                  <button
                    onClick={() => {
                      pauseAllMarketingTickers();
                      refreshTickers();
                    }}
                    className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}
                  >
                    إيقاف الكل
                  </button>
                  <button
                    onClick={() => {
                      if (selectedTicker && selectedTicker.status !== 'published') {
                        upsertMarketingTickerItem({ ...selectedTicker, status: 'published' });
                          refreshTickers();
                      }
                    }}
                    disabled={!canPublishSelected}
                    className={`${marketingStyles.actionButton} ${canPublishSelected ? marketingStyles.actionButtonSuccess : marketingStyles.actionButtonDisabled}`}
                  >
                    تفعيل المحددة
                  </button>
                  <div className={marketingStyles.statusNote}>
                    تم الحفظ تلقائياً
                  </div>
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
                          <button onClick={() => {
                              toggleMarketingTickerStatus(ticker.id);
                              refreshTickers();
                            }} className={marketingStyles.actionButton}>
                            {isPublished ? 'إيقاف' : 'تفعيل'}
                          </button>
                          <button onClick={() => setEditingTickerId(ticker.id)} className={marketingStyles.actionButton}>
                            تعديل
                          </button>
                          <button onClick={() => {
                              toggleMarketingTickerPinned(ticker.id);
                              refreshTickers();
                            }} className={marketingStyles.actionButton}>
                            {ticker.deliveryMode === 'pinned' ? 'إلغاء التثبيت' : 'تثبيت'}
                          </button>
                          <button onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                                removeMarketingTickerItem(ticker.id);
                                if (editingTickerId === ticker.id) setEditingTickerId(null);
                                refreshTickers();
                              }
                            }} className={`${marketingStyles.actionButton} ${marketingStyles.actionButtonDanger}`}>
                            حذف
                          </button>
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
                    <button onClick={() => setEditingTickerId(null)} className={marketingStyles.closeButton}>إغلاق</button>
                  </div>
                  <div className={marketingStyles.formStack}>
                    <Box gap={1}>
                      <label className={`${marketingStyles.fieldLabel} ${marketingStyles.fieldLabelLarge}`}>نص الرسالة</label>
                      <textarea
                        aria-label="نص الرسالة"
                        title="نص الرسالة"
                        value={editingTicker.message}
                        onChange={(e) => {
                          upsertMarketingTickerItem({ ...editingTicker, message: e.target.value });
                          refreshTickers();
                        }}
                        className={`${marketingStyles.fieldControl} ${marketingStyles.fieldTextarea}`}
                      />
                      {editingTicker.message.trim() === '' && <span className={marketingStyles.fieldError}>يجب ألا يكون النص فارغاً</span>}
                    </Box>
                    <div className={marketingStyles.formGrid}>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>النوع</label>
                        <select aria-label="نوع الرسالة" title="نوع الرسالة" value={editingTicker.kind} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, kind: coerceTickerKind(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="platform">{localizeKind('platform')}</option>
                          <option value="order">{localizeKind('order')}</option>
                          <option value="promo">{localizeKind('promo')}</option>
                          <option value="partner">{localizeKind('partner')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>الحالة</label>
                        <select aria-label="حالة الرسالة" title="حالة الرسالة" value={editingTicker.status} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, status: coerceTickerStatus(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="draft">{localizeStatus('draft')}</option>
                          <option value="published">{localizeStatus('published')}</option>
                          <option value="paused">{localizeStatus('paused')}</option>
                          <option value="scheduled">{localizeStatus('scheduled')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>المصدر</label>
                        <select aria-label="مصدر الرسالة" title="مصدر الرسالة" value={editingTicker.source} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, source: coerceTickerSource(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="marketing">{resolveMarketingTickerSourceLabel('ar', 'marketing')}</option>
                          <option value="operations">{resolveMarketingTickerSourceLabel('ar', 'operations')}</option>
                          <option value="system">{resolveMarketingTickerSourceLabel('ar', 'system')}</option>
                          <option value="customer">{resolveMarketingTickerSourceLabel('ar', 'customer')}</option>
                          <option value="partner">{resolveMarketingTickerSourceLabel('ar', 'partner')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>الجمهور</label>
                        <select aria-label="الجمهور" title="الجمهور" value={editingTicker.audience} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, audience: coerceTickerAudience(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="all">{resolveMarketingTickerAudienceLabel('ar', 'all')}</option>
                          <option value="home">{resolveMarketingTickerAudienceLabel('ar', 'home')}</option>
                          <option value="order">{resolveMarketingTickerAudienceLabel('ar', 'order')}</option>
                          <option value="client">{resolveMarketingTickerAudienceLabel('ar', 'client')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>الأولوية</label>
                        <select aria-label="الأولوية" title="الأولوية" value={editingTicker.priority} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, priority: coerceTickerPriority(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
                          <option value="low">{resolveMarketingTickerPriorityLabel('ar', 'low')}</option>
                          <option value="normal">{resolveMarketingTickerPriorityLabel('ar', 'normal')}</option>
                          <option value="high">{resolveMarketingTickerPriorityLabel('ar', 'high')}</option>
                          <option value="critical">{resolveMarketingTickerPriorityLabel('ar', 'critical')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>نمط التسليم</label>
                        <select aria-label="نمط التسليم" title="نمط التسليم" value={editingTicker.deliveryMode} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, deliveryMode: coerceTickerDelivery(e.target.value) }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
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
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, openHour: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {(editingTicker.openHour < 0 || editingTicker.openHour > 23) && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>بين 0-23</span>}
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
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, closeHour: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {(editingTicker.closeHour < 0 || editingTicker.closeHour > 23) && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>بين 0-23</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>التهدئة (دقيقة)</label>
                        <input
                          aria-label="التهدئة بالدقائق"
                          title="التهدئة بالدقائق"
                          type="number"
                          min="0"
                          value={editingTicker.cooldownMinutes}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, cooldownMinutes: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {editingTicker.cooldownMinutes < 0 && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>لا يمكن أن يكون سالباً</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>فجوة التكرار</label>
                        <input
                          aria-label="فجوة التكرار بالدقائق"
                          title="فجوة التكرار بالدقائق"
                          type="number"
                          min="0"
                          value={editingTicker.repeatGapMinutes}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, repeatGapMinutes: Number(e.target.value) }); refreshTickers(); }}
                          className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}
                        />
                        {editingTicker.repeatGapMinutes < 0 && <span className={`${marketingStyles.fieldError} ${marketingStyles.fieldErrorSmall}`}>لا يمكن أن يكون سالباً</span>}
                      </Box>
                      <Box gap={1}>
                        <label className={marketingStyles.fieldLabel}>وجهة الضغط</label>
                        <select aria-label="وجهة الضغط" title="وجهة الضغط" value={editingTicker.actionTarget} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, actionTarget: e.target.value }); refreshTickers(); }} className={`${marketingStyles.fieldControl} ${marketingStyles.fieldControlCompact}`}>
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
      case 'banners':
        return <BannersCommandDeckScreen activeSubTab={activeSubTab} hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'promos':
        return <PromosCommandDeckScreen />;
      case 'video':
        return <VideosCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'campaigns':
        return <CampaignsCommandDeckScreen />;
      case 'media-review':
        return <MarketingMediaReviewCommandDeckScreen />;
      case 'partners':
        return <PartnerOffersCommandDeckScreen activeSubTab={activeSubTab} />;
      case 'growth':
        return <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} setActiveTab={(tab) => setActiveTab(tab as MarketingControlView)} />;
      case 'signals':
        return <SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'loyalty':
        return <LoyaltyCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.surfaceCockpit} dir="rtl">
      {/* 1. Header Area - Marketing Command Deck */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <span className={marketingStyles.headerLetter}>ت</span>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>تسويق DSH</h1>
              <Box paddingX={1.5} paddingY={0.5} background="brandAlt" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>اعتماد الأداء</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>حوكمة المحتوى التسويقي والنمو الاستراتيجي</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'الوصول اليومي', value: '١٢٤,٥٠٠', trend: '+١٢٪', trendTone: 'success' },
              { label: 'نسبة النقر', value: '٣.٨٪', trend: '-٠.٥٪', trendTone: 'warning' },
              { label: 'التحويل', value: '١.٢٪', trend: '+٠.٢٪', trendTone: 'success' }
            ].map((metric) => (
              <div key={metric.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{metric.label}</span>
                <div className={styles.commandKpiTrend}>
                  <span className={styles.commandKpiValue}>{metric.value}</span>
                  <span className={`${styles.commandKpiTrendValue} ${metric.trendTone === 'success' ? marketingStyles.metricToneSuccess : marketingStyles.metricToneWarning}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Primary Tabs - Navigation Cockpit */}
      <nav className={styles.navigationDock}>
        {PRIMARY_TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.surfaceTab} ${isSelected ? styles.surfaceTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Secondary Tabs - Sub-Navigation Dock */}
      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div className={`${styles.filterDock} ${styles.filterDockTint} ${marketingStyles.subTabDock}`}>
          {SECONDARY_TABS[activeTab].map((sub) => {
            const isSelected = sub.id === activeSubTab;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={`${styles.surfaceTab} ${marketingStyles.subTabButton} ${isSelected ? marketingStyles.selectedSubTab : ''}`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Content Area */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          {renderActiveLane()}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshMarketingScreen;
