'use client';

import React from 'react';
import { Box, Button, Surface, Text, Icon } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { dshCatalogMetrics, dshCatalogNodes, dshCatalogPipeline } from './catalog';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type CatalogView = 'master' | 'pipeline';

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const [activeTab, setActiveTab] = React.useState<CatalogView>('master');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(dshCatalogNodes[0]?.id ?? null);

  const selectedNode = dshCatalogNodes.find(n => n.id === selectedNodeId) ?? dshCatalogNodes[0];

  const KPIs = [
    { label: 'طلبات معلقة', value: dshCatalogMetrics.pendingPartnerReviews, trend: '+2', tone: '#F97316' },
    { label: 'مراجعة تسويقية', value: dshCatalogMetrics.pendingMarketingReviews, trend: '-1', tone: '#0ea5e9' },
    { label: 'الفئات السيادية', value: dshCatalogMetrics.mainCategories, trend: '0', tone: '#8b5cf6' },
    { label: 'منتجات نشطة', value: dshCatalogMetrics.approvedProducts, trend: '+12', tone: '#16A34A' },
  ];

  return (
    <div className={styles.operationsCockpit} dir="rtl" style={{
      background: 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #F1F5F9 100%)',
      minHeight: '100vh'
    }}>
      {/* 1. Immersive Command Header */}
      <header style={{
        height: '100px', padding: '0 48px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(10, 47, 92, 0.08)',
        zIndex: 100, position: 'relative',
        display: 'flex', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                width: '60px', height: '60px', backgroundColor: '#0A2F5C', borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                boxShadow: '0 16px 40px rgba(10, 47, 92, 0.25)',
                transform: 'rotate(-4deg)'
              }}>📦</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text role="titleSm" style={{ fontWeight: '950', fontSize: '28px', color: '#0A2F5C', letterSpacing: '-0.03em' }}>غرفة قيادة الكتالوج</Text>
                <Text role="caption" style={{ fontWeight: '800', color: '#64748B', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>النظام السيادي الموحد v2.6</Text>
              </div>
            </div>

            {/* Smart Command Input */}
            <div style={{
              width: '500px', height: '56px', background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px',
              border: '1px solid rgba(10, 47, 92, 0.12)', boxShadow: '0 10px 30px rgba(10, 47, 92, 0.04)'
            }}>
              <span style={{ fontSize: '22px', opacity: 0.5 }}>🔍</span>
              <input
                type="text"
                placeholder="ابحث عن أي فئة، منتج، أو حالة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none', border: 'none', outline: 'none', width: '100%',
                  fontSize: '16px', fontWeight: '700', color: '#0A2F5C'
                }}
              />
            </div>
          </div>

          {/* Action Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
             <Box layoutDirection="row" gap={10}>
                {KPIs.slice(0, 2).map(kpi => (
                  <div key={kpi.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text role="caption" style={{ fontWeight: '900', color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>{kpi.label}</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Text role="titleSm" style={{ fontWeight: '950', fontSize: '26px', color: '#0A2F5C' }}>{kpi.value}</Text>
                      <div style={{
                        padding: '2px 8px', borderRadius: '8px',
                        background: kpi.trend.startsWith('+') ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                      }}>
                        <Text role="caption" style={{ fontWeight: '900', color: kpi.trend.startsWith('+') ? '#16A34A' : '#DC2626' }}>{kpi.trend}</Text>
                      </div>
                    </div>
                  </div>
                ))}
             </Box>
             <div style={{ width: '1px', height: '48px', background: 'rgba(10, 47, 92, 0.1)' }} />
             <Button label="نشر الكتالوج" style={{ borderRadius: '18px', padding: '16px 36px', fontWeight: '950', fontSize: '15px', boxShadow: '0 12px 32px rgba(10, 47, 92, 0.2)' }} />
          </div>
        </div>
      </header>

      {/* 2. Unified Workspace Frame */}
      <main style={{ display: 'flex', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>

        {/* Right Rail: Hierarchy Navigator */}
        <nav style={{
          width: '380px', background: 'rgba(255, 255, 255, 0.5)', borderLeft: '1px solid rgba(10, 47, 92, 0.08)',
          display: 'flex', flexDirection: 'column', padding: '40px 32px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <Text role="titleSm" style={{ fontWeight: '950', color: '#0A2F5C', fontSize: '20px' }}>هيكل التصنيفات</Text>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%', background: '#16A34A',
              boxShadow: '0 0 15px rgba(22, 163, 74, 0.6)',
              animation: 'pulse 2s infinite'
            }} />
          </div>
          <Box gap={4} style={{ overflowY: 'auto', paddingRight: '4px' }}>
            {dshCatalogNodes.map(node => {
              const isActive = node.id === selectedNodeId;
              return (
                <Surface
                  key={node.id}
                  tone={isActive ? 'brand' : 'default'}
                  padding={5}
                  onPress={() => setSelectedNodeId(node.id)}
                  style={{
                    borderRadius: '24px', cursor: 'pointer',
                    border: isActive ? 'none' : '1px solid rgba(10, 47, 92, 0.06)',
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    transform: isActive ? 'translateX(-8px)' : 'translateX(0)',
                    boxShadow: isActive ? '0 20px 48px rgba(10, 47, 92, 0.18)' : '0 4px 12px rgba(0,0,0,0.02)',
                    background: isActive ? '#0A2F5C' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Text role="bodyStrong" tone={isActive ? 'inverse' : 'default'} style={{ fontSize: '17px', fontWeight: '950' }}>{node.label}</Text>
                    <Icon name="chevron-back" size={16} tone={isActive ? 'inverse' : 'muted'} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text role="caption" tone={isActive ? 'inverse' : 'muted'} style={{ fontWeight: '800', opacity: 0.8 }}>{node.owner.toUpperCase()}</Text>
                    <div style={{
                      padding: '4px 12px', borderRadius: '10px',
                      background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(10, 47, 92, 0.04)'
                    }}>
                      <Text role="caption" tone={isActive ? 'inverse' : 'default'} style={{ fontWeight: '950', fontSize: '12px' }}>{node.countLabel}</Text>
                    </div>
                  </div>
                </Surface>
              );
            })}
          </Box>
        </nav>

        {/* Center Canvas: Dynamic Content */}
        <section style={{ flex: 1, padding: '48px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* Main Content View Tabs */}
          <div style={{
            display: 'inline-flex', background: 'rgba(10, 47, 92, 0.04)',
            padding: '6px', borderRadius: '20px', alignSelf: 'flex-start',
            border: '1px solid rgba(10, 47, 92, 0.06)'
          }}>
            <button onClick={() => setActiveTab('master')} style={{
              padding: '12px 32px', borderRadius: '16px', border: 'none', cursor: 'pointer',
              background: activeTab === 'master' ? '#fff' : 'transparent',
              color: activeTab === 'master' ? '#0A2F5C' : '#64748B',
              boxShadow: activeTab === 'master' ? '0 10px 20px rgba(10, 47, 92, 0.1)' : 'none',
              fontWeight: '950', fontSize: '15px', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>عرض التحكم الرئيسي</button>
            <button onClick={() => setActiveTab('pipeline')} style={{
              padding: '12px 32px', borderRadius: '16px', border: 'none', cursor: 'pointer',
              background: activeTab === 'pipeline' ? '#fff' : 'transparent',
              color: activeTab === 'pipeline' ? '#0A2F5C' : '#64748B',
              boxShadow: activeTab === 'pipeline' ? '0 10px 20px rgba(10, 47, 92, 0.1)' : 'none',
              fontWeight: '950', fontSize: '15px', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>مسار التوريد</button>
          </div>

          {activeTab === 'master' && selectedNode && (
            <>
              {/* Node Hero Card */}
              <Surface tone="raised" padding={10} style={{
                borderRadius: '48px', background: '#fff', border: '1px solid rgba(10, 47, 92, 0.08)',
                boxShadow: '0 32px 80px rgba(10, 47, 92, 0.06)', position: 'relative', overflow: 'hidden'
              }}>
                {/* Visual Accent */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '6px', height: '100%',
                  background: 'linear-gradient(to bottom, #F97316, #0A2F5C)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box gap={3}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '6px 16px', background: '#FFF7ED', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.1)' }}>
                        <Text role="caption" style={{ fontWeight: '950', color: '#EA580C', fontSize: '13px' }}>{selectedNode.kind === 'main-category' ? 'فئة سيادية' : 'فئة فرعية'}</Text>
                      </div>
                      <Text role="caption" style={{ fontWeight: '800', color: '#94A3B8', letterSpacing: '0.05em' }}>ID: {selectedNode.id}</Text>
                    </div>
                    <Text role="hero" style={{ fontWeight: '950', fontSize: '48px', color: '#0A2F5C', margin: '12px 0', letterSpacing: '-0.04em' }}>{selectedNode.label}</Text>
                    <Text role="bodyLg" tone="muted" style={{ maxWidth: '800px', lineHeight: '1.8', fontWeight: '600', fontSize: '18px' }}>{selectedNode.summary}</Text>
                  </Box>
                  <Box layoutDirection="row" gap={4}>
                    <Button label="إدارة القواعد" style={{ borderRadius: '16px', padding: '14px 32px', fontWeight: '950' }} />
                    <Button label="سجل التغييرات" tone="secondary" style={{ borderRadius: '16px', padding: '14px 32px', fontWeight: '950' }} />
                  </Box>
                </div>

                <div style={{ height: '1px', background: 'linear-gradient(to left, rgba(10, 47, 92, 0.1), transparent)', margin: '48px 0' }} />

                <Box layoutDirection="row" gap={12}>
                  <div style={{ flex: 2 }}>
                    <Text role="label" style={{ fontWeight: '950', color: '#94A3B8', marginBottom: '24px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>حوكمة الكتالوج السيادي</Text>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      {[
                        { label: 'سلطة التحكم', value: selectedNode.owner === 'catalog' ? 'الكتالوج المركزي' : 'إدخال خارجي', icon: '🛡️', bg: 'rgba(10, 47, 92, 0.03)' },
                        { label: 'مرحلة الاعتماد', value: selectedNode.stage, icon: '🚥', bg: 'rgba(249, 115, 22, 0.03)' },
                        { label: 'النزاهة الهيكلية', value: 'تم التحقق ✓', icon: '💎', bg: 'rgba(22, 163, 74, 0.03)' },
                        { label: 'المزامنة', value: 'لحظية (Active)', icon: '⚡', bg: 'rgba(14, 165, 233, 0.03)' },
                      ].map(item => (
                        <div key={item.label} style={{
                          padding: '24px', background: item.bg,
                          borderRadius: '24px', border: '1px solid rgba(10, 47, 92, 0.05)',
                          display: 'flex', alignItems: 'center', gap: '20px',
                          transition: 'transform 0.3s',
                          cursor: 'default'
                        }}>
                          <div style={{ fontSize: '32px' }}>{item.icon}</div>
                          <div>
                            <Text role="caption" style={{ fontWeight: '800', color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>{item.label}</Text>
                            <Text role="bodyStrong" style={{ fontWeight: '950', color: '#0A2F5C', fontSize: '17px' }}>{item.value}</Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text role="label" style={{ fontWeight: '950', color: '#94A3B8', marginBottom: '24px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>توزيع العقد</Text>
                    <Surface tone="inset" padding={8} style={{
                      borderRadius: '40px', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '8px', background: 'rgba(10, 47, 92, 0.04)',
                      border: '1px solid rgba(10, 47, 92, 0.06)',
                      height: '100%', justifyContent: 'center'
                    }}>
                      <Text role="hero" style={{ fontWeight: '950', fontSize: '80px', color: '#0A2F5C', lineHeight: '1' }}>{selectedNode.countLabel.split(' ')[0]}</Text>
                      <Text role="bodyStrong" tone="muted" style={{ fontSize: '20px', fontWeight: '800' }}>{selectedNode.countLabel.split(' ')[1]}</Text>
                    </Surface>
                  </div>
                </Box>
              </Surface>

              {/* Related Assets Deck */}
              <WebSectionCard title="الأصول المرتبطة في المسار السيادي">
                <Box gap={6}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {[1, 2, 3].map(i => (
                      <Surface key={i} tone="default" padding={6} style={{
                        borderRadius: '32px', border: '1px solid rgba(10, 47, 92, 0.08)',
                        display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff',
                        transition: 'all 0.3s',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                          <div style={{
                            width: '64px', height: '64px', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
                            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px'
                          }}>🍱</div>
                          <Box gap={0}>
                            <Text role="bodyStrong" style={{ fontWeight: '950', fontSize: '18px' }}>منتج نموذجي {i}</Text>
                            <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>SKU: PRD-00{i} · 24.00 ر.س</Text>
                          </Box>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ padding: '6px 14px', background: '#DCFCE7', borderRadius: '12px' }}>
                            <Text role="caption" style={{ fontWeight: '950', color: '#16A34A', fontSize: '12px' }}>نشط</Text>
                          </div>
                          <Button label="تعديل" tone="ghost" style={{ fontWeight: '950', color: '#0A2F5C' }} />
                        </div>
                      </Surface>
                    ))}
                  </div>
                </Box>
              </WebSectionCard>
            </>
          )}

          {activeTab === 'pipeline' && (
            <Box gap={10}>
              <WebSectionCard title="منطق التوريد الرقمي (Executive Workflow)">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                  {dshCatalogPipeline.map((step, idx) => (
                    <Surface key={step.id} tone="raised" padding={8} gap={6} style={{
                      borderRadius: '40px', borderTop: `10px solid ${idx === 3 ? '#16A34A' : '#0A2F5C'}`,
                      background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text role="caption" style={{ fontWeight: '950', color: '#94A3B8', fontSize: '14px' }}>ST-0{idx + 1}</Text>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: idx === 3 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(10, 47, 92, 0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon name={idx === 3 ? 'checkmark-circle' : 'time'} size={24} tone={idx === 3 ? 'success' : 'muted'} />
                        </div>
                      </div>
                      <Text role="titleSm" style={{ fontWeight: '950', color: '#0A2F5C', fontSize: '22px' }}>{step.title}</Text>
                      <Text role="bodySm" tone="muted" style={{ lineHeight: '1.8', fontWeight: '600', fontSize: '15px' }}>{step.description}</Text>
                      <div style={{
                        padding: '8px 20px', borderRadius: '14px', alignSelf: 'flex-start',
                        background: idx === 3 ? '#DCFCE7' : 'rgba(10, 47, 92, 0.08)'
                      }}>
                        <Text role="caption" style={{ fontWeight: '950', color: idx === 3 ? '#16A34A' : '#0A2F5C', letterSpacing: '0.05em' }}>{step.statusLabel.toUpperCase()}</Text>
                      </div>
                    </Surface>
                  ))}
                </div>
              </WebSectionCard>
            </Box>
          )}
        </section>

        {/* Left Rail: Live Intelligence Panel */}
        <aside style={{
          width: '360px', background: '#F8FAFC', borderRight: '1px solid rgba(10, 47, 92, 0.08)',
          display: 'flex', flexDirection: 'column', padding: '40px 32px',
          boxShadow: 'inset 24px 0 48px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F97316' }} />
            <Text role="titleSm" style={{ fontWeight: '950', color: '#0A2F5C', fontSize: '18px' }}>ذكاء الكتالوج (Live)</Text>
          </div>
          <Box gap={6}>
            {[
              { title: 'تضارب في الأسعار', meta: 'تم اكتشاف 3 حالات شاذة في فئة المقاضي.', tone: 'warning', icon: '⚖️', color: '#F97316' },
              { title: 'تحسين الفئات', meta: 'نقترح دمج فئات "المخبوزات" و "الحلويات".', tone: 'info', icon: '🧠', color: '#0ea5e9' },
              { title: 'الانتشار التشغيلي', meta: 'زيادة 15% في الطلبات على فئة المطاعم.', tone: 'success', icon: '📈', color: '#16A34A' },
            ].map((insight, i) => (
              <Surface key={i} tone="raised" padding={6} style={{
                borderRadius: '32px', background: '#fff', border: '1px solid rgba(10, 47, 92, 0.05)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: insight.color }} />
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '28px' }}>{insight.icon}</div>
                  <Box gap={1}>
                    <Text role="bodyStrong" style={{ fontWeight: '950', fontSize: '16px', color: '#0A2F5C' }}>{insight.title}</Text>
                    <Text role="caption" tone="muted" style={{ lineHeight: '1.6', fontWeight: '600', fontSize: '13px' }}>{insight.meta}</Text>
                  </Box>
                </div>
              </Surface>
            ))}
          </Box>
          <div style={{ flex: 1 }} />
          <Surface tone="brand" padding={6} style={{
            borderRadius: '24px', textAlign: 'center', background: '#0A2F5C',
            boxShadow: '0 16px 32px rgba(10, 47, 92, 0.3)'
          }}>
            <Text role="bodyStrong" tone="inverse" style={{ fontWeight: '950', fontSize: '14px' }}>تم التحقق من جميع العقد السيادية</Text>
            <Text role="caption" tone="inverse" style={{ opacity: 0.7, marginTop: '4px', fontWeight: '700' }}>Last scan: Just now</Text>
          </Surface>
        </aside>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}


export default ControlPanelDshCatalogScreen;
