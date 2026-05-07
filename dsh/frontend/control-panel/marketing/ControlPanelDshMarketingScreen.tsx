'use client';

import React from 'react';
import { Box } from '@bthwani/ui-kit';
import {
  ControlPanelDshMarketingScreen as SmartSignalLayerScreen,
  type ControlPanelDshMarketingScreenProps as SmartSignalLayerScreenProps,
} from './SmartSignalLayerScreen';
import { BannersCommandDeckScreen } from './BannersCommandDeckScreen';
import { GrowthCommandDeckScreen } from './GrowthCommandDeckScreen';
import styles from '../operations/dsh-surface.module.css';
import {
  getMarketingTickerItems,
  upsertMarketingTickerItem,
  toggleMarketingTickerStatus,
  removeMarketingTickerItem,
  createMarketingTickerDraft,
  resolveMarketingTickerPreviewForItem,
  type MarketingNewsTickerItem,
  type MarketingNewsTickerAudience,
  type MarketingNewsTickerPriority,
  type MarketingNewsTickerSource,
  type MarketingNewsTickerStatus,
} from '../../shared/news-ticker-store';
import { dshPromotionCandidates } from '../../shared/workflow';

export type ControlPanelDshMarketingScreenProps = SmartSignalLayerScreenProps;

type MarketingControlView = 'ticker' | 'banners' | 'growth' | 'partners' | 'signals' | 'loyalty';

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

  const PRIMARY_TABS = [
    { id: 'ticker', label: 'الشريط الذكي', icon: '📢' },
    { id: 'banners', label: 'البنرات والكارسول', icon: '🖼️' },
    { id: 'growth', label: 'الفيديو والنمو', icon: '⚡' },
    { id: 'partners', label: 'عروض الشركاء', icon: '🤝' },
    { id: 'loyalty', label: 'الولاء الذكي', icon: '💎' },
    { id: 'signals', label: 'الإشارات والقياس', icon: '📊' },
  ] as const;

  const SECONDARY_TABS: Record<MarketingControlView, { id: string; label: string }[]> = {
    ticker: [],
    banners: [
      { id: 'list', label: 'البنرات' },
      { id: 'preview', label: 'المعاينة' },
      { id: 'audience', label: 'الجمهور والوجهة' },
      { id: 'quality', label: 'الجودة' },
    ],
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
        const preview = editingTicker
          ? resolveMarketingTickerPreviewForItem(new Date(), editingTicker, 'ar')
          : resolveMarketingTickerPreviewForItem(new Date(), tickers[0] || createMarketingTickerDraft(), 'ar');

        return (
          <Box gap={4} style={{ paddingBottom: '32px' }}>
            {/* A) Top command bar / summary strip & B) Live Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                      <button onClick={() => { tickers.forEach(t => { if(t.status === 'published') toggleMarketingTickerStatus(t.id); }); refreshTickers(); }} style={{ padding: '4px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                        إيقاف الكل
                      </button>
                      <button onClick={() => refreshTickers()} style={{ padding: '4px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                        حفظ
                      </button>
                  </div>
                </div>
                {tickers.length > 0 ? (
                  <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>مباشر</span>
                       <button onClick={() => { if(tickers[0].status !== 'published') toggleMarketingTickerStatus(tickers[0].id); refreshTickers(); }} style={{ padding: '2px 8px', backgroundColor: '#DCFCE7', color: '#16A34A', borderRadius: '4px', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>تفعيل المحددة</button>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '800', color: '#0A2F5C', margin: '0 0 8px 0' }}>{tickers[0].message}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#64748B', flexWrap: 'wrap' }}>
                      <span>المصدر: {tickers[0].source}</span>
                      <span>الجمهور: {tickers[0].audience}</span>
                      <span>الأولوية: {tickers[0].priority}</span>
                      <span>النافذة: {tickers[0].openHour}:00 - {tickers[0].closeHour}:00</span>
                      <span>الوجهة: {tickers[0].actionTarget}</span>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E2E8F0', fontSize: '11px', color: '#0369A1', fontWeight: '600' }}>
                      سبب الاختيار: أعلى أولوية ومطابق لوقت العرض.
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#64748B', fontSize: '12px' }}>لا توجد رسائل نشطة حالياً.</p>
                )}
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#0A2F5C', fontWeight: '800', fontSize: '14px', margin: '0 0 12px 0' }}>معاينة حية (Live Preview)</h3>
                <div style={{ backgroundColor: '#FF500D', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', marginBottom: 'auto' }}>
                   <span style={{ fontSize: '10px', fontWeight: '900', backgroundColor: '#fff', color: '#FF500D', padding: '4px 8px', borderRadius: '4px' }}>
                     {preview.statusLabel}
                   </span>
                   <div style={{ flex: 1, overflow: 'hidden' }}>
                     <p style={{ color: '#fff', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                       {preview.message}
                     </p>
                   </div>
                   <span style={{ fontSize: '10px', color: '#fff', opacity: 0.8 }}>← {editingTicker?.actionTarget || tickers[0]?.actionTarget || 'home'}</span>
                </div>
              </div>
            </div>

            {/* C) Message list & D) Message editor */}
            <div style={{ display: 'grid', gridTemplateColumns: editingTicker ? '1fr 350px' : '1fr', gap: '20px' }}>
               <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
                 <h3 style={{ color: '#0A2F5C', fontSize: '14px', fontWeight: '800', margin: '0 0 12px 0' }}>قائمة الرسائل</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   {tickers.map(ticker => (
                     <div key={ticker.id} style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: editingTickerId === ticker.id ? '1px solid #FF500D' : '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Box gap={1}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                           <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: ticker.status === 'published' ? '#DCFCE7' : '#F1F5F9', color: ticker.status === 'published' ? '#16A34A' : '#64748B', fontWeight: '800' }}>
                             {ticker.status === 'published' ? 'منشور' : 'مسودة'}
                           </span>
                           <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>#{ticker.id}</span>
                           <span style={{ fontSize: '10px', color: '#64748B' }}>{ticker.source}</span>
                           <span style={{ fontSize: '10px', color: '#64748B' }}>{ticker.audience}</span>
                           <span style={{ fontSize: '10px', color: '#64748B' }}>{ticker.priority}</span>
                           <span style={{ fontSize: '10px', color: '#64748B' }}>{ticker.openHour}:00-{ticker.closeHour}:00</span>
                           <span style={{ fontSize: '10px', color: '#64748B' }}>{ticker.actionTarget}</span>
                           {ticker.status !== 'published' && <span style={{ fontSize: '10px', color: '#DC2626' }}>سبب الكبت: غير مفعل</span>}
                         </div>
                         <p style={{ fontSize: '13px', fontWeight: '700', color: '#0A2F5C', margin: 0 }}>{ticker.message}</p>
                       </Box>
                       <div style={{ display: 'flex', gap: '6px' }}>
                         <button onClick={() => { toggleMarketingTickerStatus(ticker.id); refreshTickers(); }} style={{ padding: '4px 8px', backgroundColor: '#fff', color: '#0A2F5C', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                           {ticker.status === 'published' ? 'إيقاف' : 'تفعيل'}
                         </button>
                         <button onClick={() => setEditingTickerId(ticker.id)} style={{ padding: '4px 8px', backgroundColor: '#fff', color: '#0A2F5C', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                           تعديل
                         </button>
                         <button onClick={() => { /* assume pin toggle if we had it, keeping it simple */ }} style={{ padding: '4px 8px', backgroundColor: '#fff', color: '#0A2F5C', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                           تثبيت
                         </button>
                         <button onClick={() => { removeMarketingTickerItem(ticker.id); if (editingTickerId === ticker.id) setEditingTickerId(null); refreshTickers(); }} style={{ padding: '4px 8px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '4px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                           حذف
                         </button>
                       </div>
                     </div>
                   ))}
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
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>النص</label>
                        <textarea value={editingTicker.message} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, message: e.target.value }); refreshTickers(); }} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', minHeight: '50px', fontFamily: 'inherit' }} />
                      </Box>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>المصدر</label>
                          <select value={editingTicker.source} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, source: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                            <option value="marketing">marketing</option><option value="operations">operations</option><option value="system">system</option><option value="customer">customer</option><option value="partner">partner</option>
                          </select>
                        </Box>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>الجمهور</label>
                          <select value={editingTicker.audience} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, audience: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                            <option value="all">all</option><option value="home">home</option><option value="order">order</option><option value="client">client</option>
                          </select>
                        </Box>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>الأولوية</label>
                          <select value={editingTicker.priority} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, priority: e.target.value as any }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                            <option value="low">low</option><option value="normal">normal</option><option value="high">high</option><option value="critical">critical</option>
                          </select>
                        </Box>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>الوجهة (Target)</label>
                          <select value={editingTicker.actionTarget} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, actionTarget: e.target.value }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                            <option value="home">home</option><option value="orders">orders</option><option value="tracking">tracking</option><option value="promo">promo</option>
                          </select>
                        </Box>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>بدء العرض</label>
                          <input type="number" value={editingTicker.openHour} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, openHour: Number(e.target.value) }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                        </Box>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>نهاية العرض</label>
                          <input type="number" value={editingTicker.closeHour} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, closeHour: Number(e.target.value) }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                        </Box>
                        <Box gap={1}>
                          <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>تهدئة (دقائق)</label>
                          <input type="number" value={editingTicker.cooldownMinutes} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, cooldownMinutes: Number(e.target.value) }); refreshTickers(); }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                        </Box>
                      </div>
                    </div>
                 </div>
               )}
            </div>

            {/* E) Rules summary block & F) Order lifecycle mapping */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
                <h3 style={{ color: '#0A2F5C', fontSize: '13px', fontWeight: '800', margin: '0 0 8px 0' }}>قواعد التشغيل</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>📌 Pinned أعلى</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', color: '#DC2626' }}>🔥 Critical أعلى</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>🚫 Audience mismatch suppress</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>⏳ Outside window suppress</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>⏱️ Cooldown suppress</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569' }}>🔄 Duplicate suppress</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '16px' }}>
                <h3 style={{ color: '#0A2F5C', fontSize: '13px', fontWeight: '800', margin: '0 0 8px 0' }}>ربط الطلبات (Mapping)</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>تم الاستلام ← tracking</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>قيد التحضير ← tracking / orders</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>في الطريق ← tracking</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', color: '#475569' }}>تم التسليم ← orders / home</span>
                </div>
              </div>
            </div>
          </Box>
        );
      }
      case 'banners':
        return <BannersCommandDeckScreen activeSubTab={activeSubTab} hubHref={props.hubHref} operationsHref={props.operationsHref} />;
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
                PLANNED FOR NEXT PHASE
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
            <h1 style={{ letterSpacing: '-0.02em', fontSize: '20px', fontWeight: '900', color: '#0A2F5C' }}>تسويق DSH</h1>
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
