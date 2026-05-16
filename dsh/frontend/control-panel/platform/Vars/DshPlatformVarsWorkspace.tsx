'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebControlPanelWorkspaceTabs } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

type HumanVarCardProps = {
  humanName: string;
  technicalKey: string;
  currentValue: string;
  proposedValue: string;
  scope: string;
  impact: string;
  risk: string;
  tone: 'brand' | 'warning' | 'danger' | 'success' | 'default';
};

function HumanVarCard({
  humanName,
  technicalKey,
  currentValue,
  proposedValue,
  scope,
  impact,
  risk,
  tone,
}: HumanVarCardProps) {
  const { addAuditEvent } = useDemoPlatformState();
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);
  const [activeValue, setActiveValue] = React.useState(currentValue);

  const handleConfirm = (action: string) => {
    if (action === 'محاكاة (Simulation)') {
      setActiveValue(proposedValue);
      addAuditEvent({
        action: `محاكاة متغير: ${humanName}`,
        operator: 'Demo Admin',
        status: 'success',
        oldValue: activeValue,
        newValue: proposedValue,
        reason: 'تجربة التغيير محلياً',
        scope,
        impact,
        rollbackAvailable: true,
      });
    } else {
      addAuditEvent({
        action: `طلب إجراء: ${action} - ${humanName}`,
        operator: 'Demo Admin',
        status: 'warning',
        oldValue: activeValue,
        newValue: proposedValue,
        reason: 'طلب تم حفظه كمسودة تجريبية',
        scope,
        impact,
        rollbackAvailable: true,
      });
    }
    setShowConfirm(null);
  };

  return (
    <Surface tone="raised" border padding={4} radiusToken="xl">
      <Box gap={3}>
        <Box layoutDirection="row" justify="space-between" align="center">
          <Text role="titleMd">{humanName}</Text>
          <Surface tone={tone} padding={1} radiusToken="pill" border={false}>
            <Text role="caption" tone={tone === 'default' ? 'muted' : 'inverse'}>{risk}</Text>
          </Surface>
        </Box>

        <Surface tone="default" border padding={3} radiusToken="md">
          <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
            <Box gap={1} style={{ flexGrow: 1 }}>
              <Text role="caption" tone="muted">القيمة الحالية (المطبقة محلياً)</Text>
              <Text role="bodyLg" weight="bold">{activeValue}</Text>
            </Box>
            <Box gap={1} style={{ flexGrow: 1 }}>
              <Text role="caption" tone="muted">القيمة المقترحة</Text>
              <Text role="bodyLg" weight="bold" tone="brand">{proposedValue}</Text>
            </Box>
          </Box>
        </Surface>

        <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
          <Box gap={1} style={{ flexGrow: 1 }}>
            <Text role="caption" tone="muted">النطاق</Text>
            <Text role="bodySm">{scope}</Text>
          </Box>
          <Box gap={1} style={{ flexGrow: 1 }}>
            <Text role="caption" tone="muted">الأثر المتوقع</Text>
            <Text role="bodySm">{impact}</Text>
          </Box>
        </Box>

        {showAdvanced && (
          <Box gap={1} style={{ marginTop: 8 }}>
            <Text role="caption" tone="muted">تفاصيل متقدمة (Technical Key):</Text>
            <Text role="caption" style={{ fontFamily: 'monospace' }}>{technicalKey}</Text>
          </Box>
        )}

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', marginTop: 8 }}>
          <Button variant="secondary" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? 'إخفاء التفاصيل المتقدمة' : 'عرض التفاصيل المتقدمة'}
          </Button>
          <Box style={{ flexGrow: 1 }} />
          {!showConfirm && (
            <>
              <Button variant="secondary" onClick={() => setShowConfirm('محاكاة (Simulation)')}>محاكاة (Simulation)</Button>
              <Button variant="primary" onClick={() => setShowConfirm('طلب اعتماد تجريبي')}>طلب اعتماد تجريبي</Button>
              <Button variant="secondary" onClick={() => setShowConfirm('تطبيق لاحقًا Demo')}>تطبيق لاحقًا Demo</Button>
              <Button variant="danger" onClick={() => setShowConfirm('تراجع')}>Rollback</Button>
            </>
          )}
        </Box>

        {showConfirm && (
          <Surface tone="warning" border padding={3} radiusToken="md" style={{ marginTop: 8 }}>
            <Box gap={2}>
              <Text role="titleSm">تأكيد الإجراء التجريبي: {showConfirm}</Text>
              <Text role="bodySm">هل أنت متأكد من تنفيذ الإجراء التجريبي؟ سيتم محاكاة التحديث محلياً وتوثيقه في سجل التدقيق.</Text>
              <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                <Button variant="primary" onClick={() => handleConfirm(showConfirm)}>تأكيد المحاكاة</Button>
                <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
              </Box>
            </Box>
          </Surface>
        )}
      </Box>
    </Surface>
  );
}

export function DshPlatformVarsWorkspace() {
  const [activeDomain, setActiveDomain] = React.useState('dsh');
  const [activeCategory, setActiveCategory] = React.useState('captain');

  const domainTabs = [
    { id: 'dsh', label: 'DSH', badge: '', active: activeDomain === 'dsh' },
    { id: 'wlt', label: 'WLT bridge', badge: '', active: activeDomain === 'wlt' },
    { id: 'amn', label: 'AMN', badge: '', active: activeDomain === 'amn' },
    { id: 'platform', label: 'Platform', badge: '', active: activeDomain === 'platform' },
  ];

  const categoryTabs = [
    { id: 'availability', label: 'التوفر والظهور', badge: '', active: activeCategory === 'availability' },
    { id: 'regions', label: 'المناطق والمدن', badge: '', active: activeCategory === 'regions' },
    { id: 'captain', label: 'أهلية الكابتن', badge: '', active: activeCategory === 'captain' },
    { id: 'dispatch', label: 'الإسناد', badge: '', active: activeCategory === 'dispatch' },
    { id: 'capabilities', label: 'القدرات والأنماط', badge: '', active: activeCategory === 'capabilities' },
    { id: 'settlements', label: 'التسويات', badge: '', active: activeCategory === 'settlements' },
    { id: 'refunds', label: 'الاستردادات', badge: '', active: activeCategory === 'refunds' },
    { id: 'escalation', label: 'التصعيد', badge: '', active: activeCategory === 'escalation' },
  ];

  return (
    <Box gap={4}>
      <WebSectionCard
        title="المتغيرات السيادية"
        description="إدارة المتغيرات التشغيلية الحساسة. كل تغيير يتطلب مراجعة للأثر واعتماد قبل التطبيق الفعلي."
      >
        <Box gap={4}>
          <Box gap={2}>
            <Text role="titleMd">1. اختر الخدمة / المجال:</Text>
            <WebControlPanelWorkspaceTabs
              ariaLabel="المجال"
              items={domainTabs}
              onSelect={(id) => setActiveDomain(id)}
            />
          </Box>

          <Box gap={2}>
            <Text role="titleMd">2. اختر التصنيف التشغيلي:</Text>
            <WebControlPanelWorkspaceTabs
              ariaLabel="التصنيف"
              items={categoryTabs}
              onSelect={(id) => setActiveCategory(id)}
            />
          </Box>

          <Box gap={3} style={{ marginTop: 16 }}>
            {activeCategory === 'captain' && activeDomain === 'dsh' && (
              <>
                <HumanVarCard
                  humanName="الحد الأدنى لرصيد محفظة الكابتن لتلقي الطلبات"
                  technicalKey="VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE"
                  currentValue="1,500 ريال"
                  proposedValue="1,000 ريال"
                  scope="الجمهورية اليمنية"
                  impact="متوقع زيادة عدد الكباتن المتاحين بنسبة 15%"
                  risk="مخاطرة مالية منخفضة"
                  tone="warning"
                />
                <HumanVarCard
                  humanName="الحد الأقصى للمديونية قبل إيقاف الكابتن"
                  technicalKey="VAR_DSH_CAPTAIN_MAX_NEGATIVE_BALANCE"
                  currentValue="-500 ريال"
                  proposedValue="-1,000 ريال"
                  scope="Global"
                  impact="تحسين معدل قبول طلبات الدفع النقدي"
                  risk="مخاطرة مالية متوسطة"
                  tone="brand"
                />
              </>
            )}
            {activeCategory === 'dispatch' && activeDomain === 'dsh' && (
              <HumanVarCard
                humanName="نصف قطر البحث عن الكباتن (Dispatch Radius)"
                technicalKey="VAR_DSH_DISPATCH_SEARCH_RADIUS_KM"
                currentValue="3 كم"
                proposedValue="5 كم"
                scope="أمانة العاصمة"
                impact="تغطية أوسع وتقليل زمن رفض الطلبات"
                risk="مخاطرة عالية"
                tone="danger"
              />
            )}

            {/* DSH sub-capabilities — these are NOT top-level services; they are modes/capabilities inside DSH */}
            {activeCategory === 'capabilities' && activeDomain === 'dsh' && (
              <>
                <Surface tone="default" border padding={3} radiusToken="md">
                  <Text role="caption" tone="muted">
                    هذه القدرات والأنماط تعمل داخل DSH وتُضبط هنا — وليست خدمات منصة عليا.
                  </Text>
                </Surface>
                <HumanVarCard
                  humanName="قدرة عونك (Awnak — DSH Capability)"
                  technicalKey="DSH_CAPABILITY_AWNAK_ENABLED"
                  currentValue="مفعّل"
                  proposedValue="موقوف"
                  scope="محافظة صنعاء"
                  impact="إيقاف نمط التوصيل من النظير إلى النظير عبر DSH في نطاق الخدمة"
                  risk="متوسط"
                  tone="brand"
                />
                <HumanVarCard
                  humanName="قدرة شي إن (Shein — DSH Capability)"
                  technicalKey="DSH_CAPABILITY_SHEIN_ENABLED"
                  currentValue="مفعّل"
                  proposedValue="موقوف"
                  scope="Global"
                  impact="إيقاف معالجة طلبات التوصيل الواردة من شي إن عبر DSH"
                  risk="عالي"
                  tone="warning"
                />
                <HumanVarCard
                  humanName="نمط الاستلام من المتجر (Store Pickup — DSH Mode)"
                  technicalKey="DSH_MODE_STORE_PICKUP_ENABLED"
                  currentValue="تجريبي — داخلي فقط"
                  proposedValue="مفعّل للعملاء (Alpha)"
                  scope="محافظة عدن"
                  impact="فتح خيار الاستلام من المتجر لشريحة Alpha ضمن DSH"
                  risk="منخفض"
                  tone="brand"
                />
                <HumanVarCard
                  humanName="نمط الطلبات المجدولة (Scheduled Orders — DSH Mode)"
                  technicalKey="DSH_MODE_SCHEDULED_ORDERS_ENABLED"
                  currentValue="صيانة"
                  proposedValue="مفعّل"
                  scope="Global"
                  impact="إعادة تفعيل الطلبات المجدولة في DSH بعد تحديث خوارزمية التعيين"
                  risk="عالي"
                  tone="danger"
                />
              </>
            )}
            {activeCategory === 'settlements' && activeDomain === 'wlt' && (
              <HumanVarCard
                humanName="جدول التسويات المالية للمتاجر"
                technicalKey="wlt.settlement.schedule.frequency"
                currentValue="أسبوعي"
                proposedValue="يومي"
                scope="Global"
                impact="تسريع التدفق المالي للشركاء، زيادة الضغط على WLT"
                risk="مخاطرة مالية (يحتاج Contract)"
                tone="danger"
              />
            )}

            {/* Fallback for empty states */}
            {!(['captain', 'dispatch', 'capabilities'].includes(activeCategory) && activeDomain === 'dsh') &&
             !(activeCategory === 'settlements' && activeDomain === 'wlt') && (
              <Surface tone="default" border padding={4} radiusToken="xl">
                <Text role="bodySm" tone="muted" align="center">لا توجد متغيرات معرّفة في هذا التصنيف والمجال حاليًا.</Text>
              </Surface>
            )}
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}
