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
    ticker: [
      { id: 'live', label: 'مباشر' },
      { id: 'messages', label: 'الرسائل' },
      { id: 'rules', label: 'قواعد التشغيل' },
      { id: 'orders', label: 'ربط الطلبات' },
    ],
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

        if (activeSubTab === 'live') {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
              <Box gap={4}>
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)', padding: '20px' }}>
                  <h3 style={{ color: '#0A2F5C', fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>الرسالة النشطة الآن (Active Item)</h3>
                  {tickers.length > 0 ? (
                    <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', marginBottom: '8px', display: 'inline-block' }}>
                        مباشر
                      </span>
                      <p style={{ fontSize: '16px', fontWeight: '800', color: '#0A2F5C', margin: '0 0 12px 0' }}>{tickers[0].message}</p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748B' }}>
                        <span>المصدر: {tickers[0].source}</span>
                        <span>الجمهور: {tickers[0].audience}</span>
                        <span>الأولوية: {tickers[0].priority}</span>
                      </div>
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', fontSize: '12px', color: '#0369A1' }}>
                        سبب الاختيار: أعلى أولوية ومطابق لوقت العرض.
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: '#64748B', fontSize: '13px' }}>لا توجد رسائل نشطة حالياً.</p>
                  )}
                </div>
              </Box>
              <Box gap={3}>
                <h3 style={{ color: '#0A2F5C', fontWeight: '800', fontSize: '14px' }}>معاينة حية (Client App)</h3>
                <div style={{ backgroundColor: '#000', borderRadius: '30px', padding: '12px', width: '320px', height: '500px', border: '8px solid #334155', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ height: '24px', display: 'flex', justifyContent: 'space-between', padding: '0 16px', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '10px' }}>9:41</span>
                    <div style={{ display: 'flex', gap: '4px', color: '#fff', fontSize: '10px' }}>📶 🔋</div>
                  </div>
                  <div style={{ backgroundColor: '#0A2F5C', height: '90px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#fff', fontSize: '16px', fontWeight: '900' }}>BThwani</div>
                      <div style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '32px', display: 'flex', alignItems: 'center', padding: '0 10px', overflow: 'hidden', gap: '8px' }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', backgroundColor: preview.isOpen ? '#FF500D' : '#64748B', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                        {preview.statusLabel}
                      </span>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ color: '#fff', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', margin: 0, animation: 'marquee 10s linear infinite' }}>
                          {preview.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#F8FAFC', padding: '16px' }}>
                    <div style={{ width: '100%', height: '120px', backgroundColor: '#E2E8F0', borderRadius: '16px', marginBottom: '16px' }} />
                    <div style={{ width: '100%', height: '80px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }} />
                  </div>
                  <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
                </div>
              </Box>
            </div>
          );
        }

        if (activeSubTab === 'messages') {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              <Box gap={4}>
                <Box gap={2}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ color: '#0A2F5C', fontWeight: '800' }}>إدارة الرسائل</h3>
                    <button
                      onClick={() => {
                        const draft = createMarketingTickerDraft();
                        upsertMarketingTickerItem(draft);
                        setEditingTickerId(draft.id);
                        refreshTickers();
                      }}
                      style={{ padding: '6px 12px', backgroundColor: '#0A2F5C', color: '#fff', borderRadius: '6px', border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                    >
                      + إضافة رسالة جديدة
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tickers.map(ticker => (
                      <div key={ticker.id} style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid rgba(10,47,92,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box gap={1}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: ticker.status === 'published' ? '#DCFCE7' : '#F1F5F9', color: ticker.status === 'published' ? '#16A34A' : '#64748B', fontWeight: '800' }}>
                              {ticker.status === 'published' ? 'منشور' : 'مسودة'}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>{ticker.id}</span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>| المصدر: {ticker.source}</span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>| الجمهور: {ticker.audience}</span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>| النافذة: {ticker.openHour}:00 - {ticker.closeHour}:00</span>
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: '#0A2F5C', margin: 0 }}>{ticker.message}</p>
                        </Box>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { toggleMarketingTickerStatus(ticker.id); refreshTickers(); }} style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            {ticker.status === 'published' ? 'إيقاف' : 'تفعيل'}
                          </button>
                          <button onClick={() => setEditingTickerId(ticker.id)} style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#0A2F5C', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            تعديل
                          </button>
                          <button onClick={() => { removeMarketingTickerItem(ticker.id); if (editingTickerId === ticker.id) setEditingTickerId(null); refreshTickers(); }} style={{ padding: '6px 12px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>

                {editingTicker && (
                  <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)' }}>
                    <h4 style={{ color: '#0A2F5C', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>تعديل الرسالة</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Box gap={1} style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>نص الرسالة (بالعربية)</label>
                        <textarea value={editingTicker.message} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, message: e.target.value }); refreshTickers(); }} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '60px', fontFamily: 'inherit' }} />
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>نطاق الظهور (Scope)</label>
                        <select value={editingTicker.audience} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, audience: e.target.value as MarketingNewsTickerAudience }); refreshTickers(); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                          <option value="all">الكل</option>
                          <option value="home">الرئيسية</option>
                          <option value="order">الطلب النشط</option>
                          <option value="client">العملاء</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>الأولوية</label>
                        <select value={editingTicker.priority} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, priority: e.target.value as MarketingNewsTickerPriority }); refreshTickers(); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                          <option value="low">منخفضة</option>
                          <option value="normal">عادية</option>
                          <option value="high">عالية</option>
                          <option value="critical">حرجة</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>المصدر</label>
                        <select value={editingTicker.source} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, source: e.target.value as MarketingNewsTickerSource }); refreshTickers(); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                          <option value="marketing">تسويق</option>
                          <option value="customer">طلبات / عملاء</option>
                          <option value="operations">عمليات</option>
                          <option value="system">نظام</option>
                          <option value="partner">شريك</option>
                        </select>
                      </Box>
                      <Box gap={1}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B' }}>وجهة الضغط (Action)</label>
                        <select value={editingTicker.actionTarget} onChange={(e) => { upsertMarketingTickerItem({ ...editingTicker, actionTarget: e.target.value }); refreshTickers(); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                          <option value="home">home</option>
                          <option value="orders">orders</option>
                          <option value="tracking">tracking</option>
                          <option value="promo">promo</option>
                        </select>
                      </Box>
                    </div>
                  </div>
                )}
              </Box>
            </div>
          );
        }

        if (activeSubTab === 'rules') {
          return (
            <Box gap={3} style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)' }}>
              <h3 style={{ color: '#0A2F5C', fontSize: '16px', fontWeight: '800' }}>قواعد التشغيل وأولويات الظهور</h3>
              <ul style={{ color: '#64748B', fontSize: '14px', paddingInlineStart: '20px', lineHeight: '1.8' }}>
                <li><strong>الأولوية (Priority):</strong> الرسائل الحرجة (Critical) تظهر دائماً وتتجاوز أي رسالة أخرى. تليها العالية ثم العادية.</li>
                <li><strong>الجمهور (Audience):</strong> يتم كبت الرسالة (Suppress) إذا كان المستخدم غير مشمول ضمن الجمهور المستهدف (مثل رسائل الطلبات للمستخدمين الجدد).</li>
                <li><strong>نافذة العرض (Window):</strong> الرسائل تظهر فقط ضمن ساعات العمل المحددة (openHour إلى closeHour) ما لم تكن مجدولة للظهور اليدوي أو مثبتة (Pinned).</li>
                <li><strong>التهدئة (Cooldown):</strong> يتم كبت الرسائل المكررة مؤقتاً لتجنب إزعاج المستخدم، بناءً على `cooldownMinutes`.</li>
                <li><strong>عدم التكرار:</strong> الخوارزمية تمنع ظهور أكثر من رسالة تسويقية في نفس الوقت.</li>
              </ul>
            </Box>
          );
        }

        if (activeSubTab === 'orders') {
          return (
            <Box gap={3} style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(10,47,92,0.08)' }}>
              <h3 style={{ color: '#0A2F5C', fontSize: '16px', fontWeight: '800' }}>ربط الطلبات (Order Lifecycle)</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>يتم جلب حالة الطلب النشط وعرض رسالة مناسبة للمستخدم تلقائياً عند تغيير الحالة. وجهة الضغط لرسائل الطلبات هي <code>tracking</code>.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontWeight: '800', color: '#0A2F5C', fontSize: '13px' }}>تم الاستلام</span> - سيظهر التنبيه للمستخدم ليؤكد بدء التحضير.
                </div>
                <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontWeight: '800', color: '#0A2F5C', fontSize: '13px' }}>في الطريق</span> - يتم ربطه بزر تتبع الكابتن مباشرة.
                </div>
              </div>
            </Box>
          );
        }

        return null;
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
