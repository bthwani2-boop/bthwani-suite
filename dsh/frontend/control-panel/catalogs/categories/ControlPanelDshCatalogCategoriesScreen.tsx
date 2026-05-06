'use client';

import React from 'react';
import { Box, Text, Surface, Button } from '@bthwani/ui-kit';
import { dshCatalogNodes } from '../catalog';

function resolveCategoryOwnerLabel(owner: 'catalog' | 'partner' | 'marketing') {
  if (owner === 'partner') return 'الشركاء';
  if (owner === 'marketing') return 'التسويق';
  return 'الكتالوج';
}

export function ControlPanelDshCatalogCategoriesScreen() {
  const categoryNodes = dshCatalogNodes.filter((node) => node.kind !== 'approved-product');
  const [activeCategoryId, setActiveCategoryId] = React.useState(categoryNodes[0]?.id ?? null);

  return (
    <Box gap={4}>
      {/* Executive Command Deck */}
      <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '32px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(10, 47, 92, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Title on the Right (First in DOM) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text role="titleSm" style={{ letterSpacing: '-0.01em', fontWeight: '950', textAlign: 'right' }}>لوحة التحكم في الفئات</Text>
            <Text role="caption" tone="muted" style={{ fontWeight: '800', letterSpacing: '0.01em', textAlign: 'right' }}>الحوكمة السيادية اللحظية</Text>
          </div>
          {/* Status on the Left (Second in DOM) */}
          <div style={{ padding: '6px 16px', backgroundColor: '#0A2F5C', borderRadius: '12px' }}>
            <Text role="caption" tone="inverse" style={{ fontWeight: '900' }}>الذكاء التشغيلي نشط</Text>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categoryNodes.map((node) => {
            const isActive = node.id === activeCategoryId;
            return (
              <Surface
                key={node.id}
                tone={isActive ? 'brand' : 'inset'}
                padding={4}
                gap={2}
                onPress={() => setActiveCategoryId(node.id)}
                style={{ 
                  flexGrow: 1, 
                  minWidth: 240, 
                  borderRadius: '24px', 
                  cursor: 'pointer',
                  border: isActive ? 'none' : '1px solid rgba(10, 47, 92, 0.05)',
                  boxShadow: isActive ? '0 12px 32px rgba(10, 47, 92, 0.2)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="bodyStrong" tone={isActive ? 'inverse' : 'default'} style={{ textAlign: 'right' }}>{node.label}</Text>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActive ? '#fff' : '#16A34A' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text role="caption" tone={isActive ? 'inverse' : 'muted'} style={{ fontWeight: '800', textAlign: 'right' }}>{resolveCategoryOwnerLabel(node.owner)}</Text>
                  <Text role="caption" tone={isActive ? 'inverse' : 'default'} style={{ fontWeight: '900' }}>{node.countLabel}</Text>
                </div>
              </Surface>
            );
          })}
        </div>

        {activeCategoryId && (
          <Surface tone="inset" padding={5} gap={4} style={{ borderRadius: '24px', border: '1px solid rgba(10, 47, 92, 0.08)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Node Info on the Right */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text role="caption" tone="muted" style={{ fontWeight: '800', textAlign: 'right' }}>ذكاء العقدة المحددة</Text>
                <Text role="titleSm" style={{ fontWeight: '900', textAlign: 'right' }}>{categoryNodes.find(n => n.id === activeCategoryId)?.label}</Text>
                <Text role="bodySm" tone="muted" style={{ maxWidth: '400px', textAlign: 'right' }}>{categoryNodes.find(n => n.id === activeCategoryId)?.summary}</Text>
              </div>
              {/* Actions on the Left */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button label="اعتماد العقدة" style={{ borderRadius: '14px', padding: '10px 24px', fontWeight: '900' }} />
                <Button label="طلب تعديل" tone="secondary" style={{ borderRadius: '14px', padding: '10px 24px', fontWeight: '900' }} />
              </div>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'rgba(10, 47, 92, 0.05)', width: '100%' }} />
            
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>المرحلة الحالية</Text>
                <Text role="bodyStrong" style={{ color: '#0A2F5C', textAlign: 'right' }}>{categoryNodes.find(n => n.id === activeCategoryId)?.stage}</Text>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>سلطة التحكم</Text>
                <Text role="bodyStrong" style={{ color: '#0A2F5C', textAlign: 'right' }}>الكتالوج - أساسي</Text>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>حالة المزامنة</Text>
                <Text role="bodyStrong" style={{ color: '#16A34A', textAlign: 'right' }}>تم التحقق ✓</Text>
              </div>
            </div>
          </Surface>
        )}
      </Surface>
    </Box>
  );
}

export default ControlPanelDshCatalogCategoriesScreen;
