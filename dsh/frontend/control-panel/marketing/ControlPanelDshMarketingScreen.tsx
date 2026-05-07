'use client';

import React from 'react';
import { Box } from '@bthwani/ui-kit';
import {
  ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
  type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayerScreen';
import { BannersCommandDeckScreen } from './BannersCommandDeckScreen';
import { GrowthCommandDeckScreen } from './GrowthCommandDeckScreen';
import { PromosCommandDeckScreen } from './PromosCommandDeckScreen';
import styles from '../operations/dsh-surface.module.css';
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
} from '../../shared/news-ticker-store';
import { dshPromotionCandidates } from '../../shared/workflow';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps;

type MarketingControlView = 'ticker' | 'banners' | 'promos' | 'growth' | 'partners' | 'signals' | 'loyalty';

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

  const PRIMARY_TABS = [
    { id: 'ticker', label: 'الشريط الذكي', icon: '📢' },
    { id: 'banners', label: 'البنرات والكارسول', icon: '🖼️' },
    { id: 'promos', label: 'بروموهات Home', icon: '📱' },
    { id: 'growth', label: 'الفيديو والنمو', icon: '⚡' },
    { id: 'partners', label: 'عروض الشركاء', icon: '🤝' },
    { id: 'loyalty', label: 'الولاء الذكي', icon: '💎' },
    { id: 'signals', label: 'الإشارات والقياس', icon: '📊' },
  ] as const;

  const SECONDARY_TABS: Record<MarketingControlView, { id: string; label: string }[]> = {
    ticker: [],
    banners: [],
    promos: [],
    growth: [
      { id: 'programs', label: 'البرامج' },
      { id: 'video', label: 'الفيديو' },
      { id: 'campaigns', label: 'الحملات' },
    ],
    partners: [
      { id: 'inbound', label: 'واردة' },
      { id: 'review', label: 'مراجعة' },
      { id: 'ready', label: 'جاهز للتسويق' },
      { id: 'published', label: 'منشور' },
    ],
    signals: [
      { id: 'reach', label: 'الوصول' },
      { id: 'clicks', label: 'النقرات' },
      { id: 'conversion', label: 'التحويل' },
      { id: 'health', label: 'الصحة' },
    ],
    loyalty: [
      { id: 'programs', label: 'البرامج' },
      { id: 'tiers', label: 'المستويات' },
      { id: 'rewards', label: 'المكافآت' },
    ],
  };

  const PULSE_METRICS = [
    { label: 'الوصول', value: '1.2M', trend: '+12%', trendTone: 'success' },
    { label: 'البنرات', value: '3/5', trend: 'متاح', trendTone: 'info' },
    { label: 'التحويل', value: '4.8%', trend: '+0.4%', trendTone: 'success' },
  ];

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

        return (
          <Box gap={4} style={{ paddingBottom: '32px' }}>
            {/* 1) Top command bar / summary strip */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ color: '#0A2F5C', fontSize: '14px', fontWeight: '800', margin: 0 }}>الرسالة النشطة الآن</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const draft = createMarketingTickerDraft();
                      upsertMarketingTickerItem(draft);
                      setEditingTickerId(draft.id);
                      refreshTickers();
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#0A2F5C', color: '#fff', borderRadius: '6px', border: 'none', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}
                  >
                    + إضافة رسالة
                  </button>
                  <button
                    onClick={() => {
                      pauseAllMarketingTickers();
                      refreshTickers();
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    إيقاف الكل
                  </button>
                  <button
                    onClick={() => {
                      if (editingTickerId) {
                        const t = tickers.find(x => x.id === editingTickerId);
                        if (t && t.status !== 'published') {
                          upsertMarketingTickerItem({ ...t, status: 'published' });
                          refreshTickers();
                        }
                      }
                    }}
                    disabled={!editingTickerId || (tickers.find(x => x.id === editingTickerId)?.status === 'published')}
                    style={{ padding: '4px 12px', backgroundColor: (editingTickerId && tickers.find(x => x.id === editingTickerId)?.status !== 'published') ? '#DCFCE7' : '#F1F5F9', color: (editingTickerId && tickers.find(x => x.id === editingTickerId)?.status !== 'published') ? '#16A34A' : '#94A3B8', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: (editingTickerId && tickers.find(x => x.id === editingTickerId)?.status !== 'published') ? 'pointer' : 'not-allowed' }}
                  >
                    تفعيل المحددة
                  </button>
                  <div style={{ padding: '4px 12px', backgroundColor: '#F1F5F9', color: '#64748B', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                    تم الحفظ تلقائياً
                  </div>
                </div>
              </div>
              {tickerPlan.activeEntry ? (
                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>مباشر</span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '800', color: '#0A2F5C', margin: '0 0 8px 0' }}>{tickerPlan.activeItem?.message}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#64748B', flexWrap: 'wrap' }}>
                    <span>المصدر: {resolveMarketingTickerSourceLabel('ar', tickerPlan.activeItem!.source)}</span>
                    <span>الجمهور: {resolveMarketingTickerAudienceLabel('ar', tickerPlan.activeItem!.audience)}</span>
                    <span>الأولوية: {resolveMarketingTickerPriorityLabel('ar', tickerPlan.activeItem!.priority)}</span>
                    <span>النافذة: {tickerPlan.activeItem!.openHour}:00 - {tickerPlan.activeItem!.closeHour}:00</span>
                    <span>الوجهة: {localizeTarget(tickerPlan.activeItem!.actionTarget)}</span>
                  </div>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E2E8F0', fontSize: '11px', color: '#0369A1', fontWeight: '600' }}>
                    الخطة: {resolveMarketingTickerDeliveryLabel('ar', tickerPlan.activeItem!.deliveryMode)} — مفعلة بنجاح (السبب: {resolveMarketingTickerPlanReasonLabel('ar', tickerPlan.activeEntry.reason)})
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                  <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', margin: 0 }}>لا توجد رسالة نشطة الآن.</p>
                </div>
              )}
            </div>

            {/* 2) Orange Preview Bar */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
              <h3 style={{ color: '#0A2F5C', fontWeight: '800', fontSize: '14px', margin: '0 0 12px 0' }}>معاينة مباشرة</h3>
              {preview ? (
                <div style={{ backgroundColor: '#FF500D', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', backgroundColor: '#fff', color: '#FF500D', padding: '4px 8px', borderRadius: '4px' }}>
                    {preview.statusLabel}
                  </span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ color: '#fff', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {preview.message}
                    </p>
                  </div>
                  <span style={{ fontSize: '10px', color: '#fff', opacity: 0.8 }}>← {localizeTarget(previewItem!.actionTarget)}</span>
                </div>
              ) : (
                <div style={{ height: '40px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
                   <p style={{ color: '#94A3B8', fontSize: '12px', margin: 0, fontWeight: '700' }}>
                     {tickerPlan.suppressedEntries.find(e => e.item.id === (editingTickerId || ''))?.reason
                        ? `السبب: ${resolveMarketingTickerPlanReasonLabel('ar', tickerPlan.suppressedEntries.find(e => e.item.id === (editingTickerId || ''))?.reason)}`
                        : 'لا توجد معاينة متاحة أو الرسالة غير مؤهلة للعرض'}
                   </p>
                </div>
              )}
            </div>

            {/* 3) Message list & 4) Message editor */}
            <div style={{ display: 'grid', gridTemplateColumns: editingTicker ? '1fr 350px' : '1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
                <h3 style={{ color: '#0A2F5C', fontSize: '14px', fontWeight: '800', margin: '0 0 12px 0' }}>قائمة الرسائل</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tickers.map(ticker => {
                    const isPublished = ticker.status === 'published';
                    const planEntry = tickerPlan.automaticEntries.find(e => e.item.id === ticker.id)
                                   || tickerPlan.manualEntries.find(e => e.item.id === ticker.id)
                                   || tickerPlan.suppressedEntries.find(e => e.item.id === ticker.id)
                                   || (tickerPlan.activeEntry?.item.id === ticker.id ? tickerPlan.activeEntry : undefined);
                    const isSuppressed = planEntry?.state === 'suppressed';

                    return (
                      <div key={ticker.id} style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: editingTickerId === ticker.id ? '1px solid #FF500D' : '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: '800', color: '#0A2F5C', margin: '0 0 4px 0', lineHeight: '1.4' }}>{ticker.message}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: isPublished ? '#DCFCE7' : '#F1F5F9', color: isPublished ? '#16A34A' : '#64748B', fontWeight: '900' }}>
                              {localizeStatus(ticker.status)}
                            </span>
                            <div style={{ display: 'flex', gap: '6px', fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
                              <span>#{ticker.id}</span>
                              <span style={{ opacity: 0.4 }}>|</span>
                              <span>{resolveMarketingTickerSourceLabel('ar', ticker.source)}</span>
                              <span style={{ opacity: 0.4 }}>|</span>
                              <span>{resolveMarketingTickerAudienceLabel('ar', ticker.audience)}</span>
                              <span style={{ opacity: 0.4 }}>|</span>
                              <span>{resolveMarketingTickerPriorityLabel('ar', ticker.priority)}</span>
                              <span style={{ opacity: 0.4 }}>|</span>
                              <span>{ticker.openHour}:00-{ticker.closeHour}:00</span>
                              <span style={{ opacity: 0.4 }}>|</span>
                              <span>{localizeTarget(ticker.actionTarget)}</span>
                            </div>
                            {isSuppressed && (
                              <span style={{ fontSize: '10px', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                                الكبت: {resolveMarketingTickerPlanReasonLabel('ar', planEntry?.reason)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button onClick={() => {
                              toggleMarketingTickerStatus(ticker.id);
                              refreshTickers();
                            }} style={{ padding: '6px 10px', backgroundColor: '#fff', color: '#0A2F5C', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                            {isPublished ? 'إيقاف' : 'تفعيل'}
                          </button>
                          <button onClick={() => setEditingTickerId(ticker.id)} style={{ padding: '6px 10px', backgroundColor: '#fff', color: '#0A2F5C', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                            تعديل
                          </button>
                          <button onClick={() => {
                              toggleMarketingTickerPinned(ticker.id);
                              refreshTickers();
                            }} style={{ padding: '6px 10px', backgroundColor: '#fff', color: '#0A2F5C', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                            {ticker.deliveryMode === 'pinned' ? 'إلغاء التثبيت' : 'تثبيت'}
                          </button>
                          <button onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                                removeMarketingTickerItem(ticker.id);
                                if (editingTickerId === ticker.id) setEditingTickerId(null);
                                refreshTickers();
                              }
                            }} style={{ padding: '6px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {editingTicker && (
                <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #FF500D' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ color: '#0A2F5C', fontWeight: '800', margin: 0 }}>محرر الرسالة</h4>
                    <button onClick={() => setEditingTickerId(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '12px' }}>✕ إغلاق</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Box gap={1}>
                      <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>نص الرسالة</label>
                      <textarea
                        value={editingTicker.message}
                        onChange={(e) => {
                          upsertMarketingTickerItem({ ...editingTicker, message: e.target.value });
                          refreshTickers();
                        }}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', minHeight: '50px', fontFamily: 'inherit' }}
                      />
                      {editingTicker.message.trim() === '' && <span style={{ color: '#DC2626', fontSize: '10px' }}>يجب ألا يكون النص فارغاً</span>}
                    </Box>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>النوع</label>
                        <select value={editingTicker.kind} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, kind: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                          <option value="platform">{localizeKind('platform')}</option>
                          <option value="order">{localizeKind('order')}</option>
                          <option value="promo">{localizeKind('promo')}</option>
                          <option value="partner">{localizeKind('partner')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>الحالة</label>
                        <select value={editingTicker.status} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, status: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                          <option value="draft">{localizeStatus('draft')}</option>
                          <option value="published">{localizeStatus('published')}</option>
                          <option value="paused">{localizeStatus('paused')}</option>
                          <option value="scheduled">{localizeStatus('scheduled')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>المصدر</label>
                        <select value={editingTicker.source} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, source: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                          <option value="marketing">{resolveMarketingTickerSourceLabel('ar', 'marketing')}</option>
                          <option value="operations">{resolveMarketingTickerSourceLabel('ar', 'operations')}</option>
                          <option value="system">{resolveMarketingTickerSourceLabel('ar', 'system')}</option>
                          <option value="customer">{resolveMarketingTickerSourceLabel('ar', 'customer')}</option>
                          <option value="partner">{resolveMarketingTickerSourceLabel('ar', 'partner')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>الجمهور</label>
                        <select value={editingTicker.audience} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, audience: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                          <option value="all">{resolveMarketingTickerAudienceLabel('ar', 'all')}</option>
                          <option value="home">{resolveMarketingTickerAudienceLabel('ar', 'home')}</option>
                          <option value="order">{resolveMarketingTickerAudienceLabel('ar', 'order')}</option>
                          <option value="client">{resolveMarketingTickerAudienceLabel('ar', 'client')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>الأولوية</label>
                        <select value={editingTicker.priority} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, priority: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                          <option value="low">{resolveMarketingTickerPriorityLabel('ar', 'low')}</option>
                          <option value="normal">{resolveMarketingTickerPriorityLabel('ar', 'normal')}</option>
                          <option value="high">{resolveMarketingTickerPriorityLabel('ar', 'high')}</option>
                          <option value="critical">{resolveMarketingTickerPriorityLabel('ar', 'critical')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>نمط التسليم</label>
                        <select value={editingTicker.deliveryMode} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, deliveryMode: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                          <option value="auto">{resolveMarketingTickerDeliveryLabel('ar', 'auto')}</option>
                          <option value="manual">{resolveMarketingTickerDeliveryLabel('ar', 'manual')}</option>
                          <option value="pinned">{resolveMarketingTickerDeliveryLabel('ar', 'pinned')}</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>بدء العرض</label>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={editingTicker.openHour}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, openHour: Number(e.target.value) }); refreshTickers(); }}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                        />
                        {(editingTicker.openHour < 0 || editingTicker.openHour > 23) && <span style={{ color: '#DC2626', fontSize: '9px' }}>بين 0-23</span>}
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>نهاية العرض</label>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={editingTicker.closeHour}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, closeHour: Number(e.target.value) }); refreshTickers(); }}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                        />
                        {(editingTicker.closeHour < 0 || editingTicker.closeHour > 23) && <span style={{ color: '#DC2626', fontSize: '9px' }}>بين 0-23</span>}
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>التهدئة (دقيقة)</label>
                        <input
                          type="number"
                          min="0"
                          value={editingTicker.cooldownMinutes}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, cooldownMinutes: Number(e.target.value) }); refreshTickers(); }}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                        />
                        {editingTicker.cooldownMinutes < 0 && <span style={{ color: '#DC2626', fontSize: '9px' }}>لا يمكن أن يكون سالباً</span>}
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>فجوة التكرار</label>
                        <input
                          type="number"
                          min="0"
                          value={editingTicker.repeatGapMinutes}
                          onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, repeatGapMinutes: Number(e.target.value) }); refreshTickers(); }}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                        />
                        {editingTicker.repeatGapMinutes < 0 && <span style={{ color: '#DC2626', fontSize: '9px' }}>لا يمكن أن يكون سالباً</span>}
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>وجهة الضغط</label>
                        <select value={editingTicker.actionTarget} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, actionTarget: e.target.value }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
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

            {/* 5) Rules summary block */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
              <h3 style={{ color: '#0A2F5C', fontSize: '13px', fontWeight: '800', margin: '0 0 8px 0' }}>قواعد التشغيل</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>📌 مثبت في الأعلى</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', color: '#DC2626' }}>🔥 حرج في الأعلى</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>🚫 الجمهور غير مطابق</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>⏳ خارج نافذة العرض</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>⏱️ ضمن فترة التهدئة</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>🔄 مكرر</span>
              </div>
            </div>

            {/* 6) Order lifecycle mapping */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
              <h3 style={{ color: '#0A2F5C', fontSize: '13px', fontWeight: '800', margin: '0 0 8px 0' }}>ربط الطلبات (Mapping)</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>تم الاستلام ← التتبع</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>قيد التحضير ← التتبع / الطلبات</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>في الطريق ← التتبع</span>
                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>تم التسليم ← الطلبات / الرئيسية</span>
              </div>
            </div>
          </Box>
        );
      }
      case 'banners':
        return <BannersCommandDeckScreen activeSubTab={activeSubTab} hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'promos':
        return <PromosCommandDeckScreen />;
      case 'growth':
        return <GrowthCommandDeckScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'signals':
        return <SmartSignalLayerScreen hubHref={props.hubHref} operationsHref={props.operationsHref} />;
      case 'partners': {
        const readyItems = dshPromotionCandidates.filter((item) => item.status === 'marketing-ready');

        return (
          <Box gap={4}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
              <Box gap={3}>
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '20px' }}>
                  <h3 style={{ color: '#0A2F5C', fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>نوايا الترويج الجاهزة للتسويق (Intent Queue)</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '16px' }}>العناصر التالية تمت مراجعتها واعتماد أهليتها من قبل الشركاء، وهي جاهزة للتحويل إلى بنرات تسويقية (Handoff).</p>

                  {readyItems.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                      <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600' }}>لا توجد عناصر جاهزة للتسويق حالياً.</p>
                    </div>
                  ) : (
                    <Box gap={2}>
                      {readyItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <Box gap={1}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '800', color: '#0A2F5C' }}>{item.title}</span>
                              <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>{item.kind === 'product' ? 'منتج' : 'متجر'}</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>{item.subtitle}</span>
                            <span style={{ fontSize: '11px', color: '#0369A1', marginTop: '4px' }}>ملاحظة النية: {item.offerHint}</span>
                          </Box>

                          <button
                            onClick={() => {
                              setActiveTab('banners');
                              setActiveSubTab('list');
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#0A2F5C',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            إنشاء بنر
                          </button>
                        </div>
                      ))}
                    </Box>
                  )}
                </div>
              </Box>

              <Box gap={3}>
                <div style={{ backgroundColor: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                  <h4 style={{ color: '#166534', fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>معايير التسليم (Handoff)</h4>
                  <ul style={{ color: '#166534', fontSize: '12px', paddingInlineStart: '20px', margin: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
                    <li>لا نقوم بتوليد البنر تلقائياً دون تصميم.</li>
                    <li>العناصر هنا مؤهلة (Eligible) من الناحية التشغيلية.</li>
                    <li>دور قسم التسويق الآن هو تحويل "النية" إلى "محتوى بصري" عبر Banner Studio.</li>
                  </ul>
                </div>
              </Box>
            </div>
          </Box>
        );
      }
      case 'loyalty':
        return (
          <Box padding={10} alignItems="center" justifyContent="center" style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px dashed rgba(10,47,92,0.1)', minHeight: '300px' }}>
            <Box gap={2} alignItems="center">
              <span style={{ fontSize: '40px' }}>💎</span>
              <h2 style={{ color: '#0A2F5C', fontSize: '20px', fontWeight: '800' }}>نظام الولاء الذكي</h2>
              <p style={{ color: '#64748B', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
                سيتم دمج نظام المكافآت والمستويات للعملاء هنا لمنح الشركاء القدرة على بناء ولاء طويل المدى.
              </p>
              <div style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', borderRadius: '8px', color: '#0A2F5C', fontWeight: '700', fontSize: '12px', marginTop: '10px' }}>
                مخطط للمرحلة القادمة
              </div>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area - Compact & Professional */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`} style={{ padding: '4px 16px' }}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#0A2F5C',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)'
          }}>
            🎯
          </div>
          <Box gap={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ letterSpacing: '-0.02em', fontSize: '20px', fontWeight: '900', color: '#0A2F5C' }}>تسويق DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: '4px', fontWeight: '800' }}>NEEDS_BACKEND_BINDING</span>
            </div>
            <p style={{ fontWeight: 600, color: '#64748B', fontSize: '11px' }}>إدارة الشريط الذكي، البنرات، النمو، وعروض الشركاء.</p>
          </Box>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact} style={{ gap: '8px' }}>
            {PULSE_METRICS.map((metric) => (
              <div key={metric.label} className={styles.operationsPulseItem} style={{ padding: '4px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px' }}>{metric.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className={styles.operationsPulseValue} style={{ fontSize: '12px' }}>{metric.value}</span>
                  <span style={{
                    fontSize: '9px',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    backgroundColor: metric.trendTone === 'success' ? '#DCFCE7' : metric.trendTone === 'warning' ? '#FEF3C7' : '#E0F2FE',
                    color: metric.trendTone === 'success' ? '#16A34A' : metric.trendTone === 'warning' ? '#D97706' : '#0369A1',
                    fontWeight: 800
                  }}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Primary Tabs */}
      <nav className={styles.operationsTabs} style={{ padding: '8px 16px', backgroundColor: '#fff', borderBottom: '1px solid rgba(10,47,92,0.06)' }}>
        {PRIMARY_TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                fontSize: '13px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Secondary Tabs */}
      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '24px',
          padding: '8px 24px',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid rgba(10,47,92,0.08)',
          overflowX: 'auto',
          minHeight: '48px',
        }}>
          {SECONDARY_TABS[activeTab].map((sub) => {
            const isSelected = sub.id === activeSubTab;
            return (
              <div
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 4px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '60px',
                }}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? '#FF500D' : '#64748B',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                }}>
                  {sub.label}
                </span>
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#FF500D',
                    borderRadius: '3px 3px 0 0'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Content Area */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          {renderActiveLane()}
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshMarketingScreen;
