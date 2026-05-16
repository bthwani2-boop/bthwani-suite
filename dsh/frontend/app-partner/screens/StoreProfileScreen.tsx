import React from 'react';
import {
  Box,
  Button,
  Chip,
  KeyValueList,
  ListItem,
  MobileStickyPrimaryAction,
  Surface,
  Text,
  TextField,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';

export type StoreProfileScreenProps = {
  storeName: string;
  branchLabel: string;
  cityLabel: string;
  managerLabel: string;
  todayHoursLabel: string;
  activeZoneLabel: string;
  storeOpen: boolean;
  listingEnabled: boolean;
  canonicalStoreId?: string;
  sourceRecordId?: string;
  deliveryReadinessLabel?: string;
  coverageSummary?: string;
  publishStage?: string;
  onOpenStoreScope?: () => void;
};

type MetricTileProps = {
  label: string;
  value: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

type SectionBlockProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const identityDocuments = [
  { id: 'license', title: 'الرخصة التجارية', subtitle: 'الهوية القانونية الأساسية للفرع.', meta: 'مكتملة', badgeLabel: 'معتمد' },
  { id: 'tax', title: 'الرقم الضريبي', subtitle: 'متوافق مع متطلبات النشر.', meta: 'مراجع اليوم', badgeLabel: 'جاهز' },
  { id: 'bank', title: 'الحساب المرتبط', subtitle: 'مصدر التسويات والمدفوعات.', meta: 'مرتبط', badgeLabel: 'نشط' },
] as const;

function MetricTile({ label, value, tone = 'default' }: MetricTileProps) {
  const { theme } = useTheme();
  const borderColor = {
    default: theme.lineStrong,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info,
  }[tone];

  return (
    <Surface tone="default" padding={3} gap={1} style={{ flex: 1, minWidth: 118, borderWidth: 1, borderColor }}>
      <Text role="caption" tone="muted" numberOfLines={1}>
        {label}
      </Text>
      <Text role="bodyStrong" tone={tone} numberOfLines={2}>
        {value}
      </Text>
    </Surface>
  );
}

function SectionBlock({ title, subtitle, actionLabel, expanded, onToggle, children }: SectionBlockProps) {
  const { direction } = useDirection();

  return (
    <Surface tone="default" padding={3} gap={3}>
      <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: 12 }}>
        <Box style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>
            {title}
          </Text>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
            {subtitle}
          </Text>
        </Box>
        <Button label={actionLabel} tone="secondary" fullWidth={false} onPress={onToggle} />
      </Box>
      {expanded ? children : null}
    </Surface>
  );
}

export function StoreProfileScreen({
  storeName,
  branchLabel,
  cityLabel,
  managerLabel,
  todayHoursLabel,
  activeZoneLabel,
  storeOpen,
  listingEnabled,
  canonicalStoreId,
  sourceRecordId,
  deliveryReadinessLabel,
  coverageSummary,
  publishStage,
  onOpenStoreScope,
}: StoreProfileScreenProps) {
  const { direction } = useDirection();
  const [branchSectionOpen, setBranchSectionOpen] = React.useState(true);
  const [identitySectionOpen, setIdentitySectionOpen] = React.useState(false);
  const [visibilitySectionOpen, setVisibilitySectionOpen] = React.useState(false);
  const [branchName, setBranchName] = React.useState(storeName);
  const [branchAddress, setBranchAddress] = React.useState(`${cityLabel}، الياسمين، شارع الندى`);
  const [branchContact, setBranchContact] = React.useState('011 555 0123');
  const [lastSavedLabel, setLastSavedLabel] = React.useState<string | null>(null);

  const storeStateLabel = storeOpen ? 'مفتوح الآن' : 'مغلق الآن';
  const visibilityLabel = listingEnabled ? 'مفعّل' : 'موقوف';
  const canonicalReferenceLabel = canonicalStoreId ? 'تم الربط بالمتجر الموحّد.' : undefined;

  const onSave = React.useCallback(() => {
    setLastSavedLabel(new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  return (
    <Box gap={4}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          الحالة المختصرة
        </Text>
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
          <MetricTile label="حالة المتجر" value={storeStateLabel} tone={storeOpen ? 'success' : 'warning'} />
          <MetricTile label="الظهور" value={visibilityLabel} tone={listingEnabled ? 'success' : 'warning'} />
          <MetricTile label="الهوية" value="معتمد" tone="brand" />
          <MetricTile label="الفرع" value={branchLabel} tone="info" />
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          معلومات المتجر
        </Text>
        <KeyValueList
          dense
          items={[
            { label: 'اسم المتجر', value: storeName },
            { label: 'الفرع', value: branchLabel },
            { label: 'المدينة', value: cityLabel },
            { label: 'المدير', value: managerLabel },
            { label: 'ساعات اليوم', value: todayHoursLabel },
            { label: 'منطقة التغطية', value: activeZoneLabel },
            ...(coverageSummary ? [{ label: 'ملخص التغطية', value: coverageSummary }] : []),
            ...(deliveryReadinessLabel ? [{ label: 'جاهزية التوصيل', value: deliveryReadinessLabel }] : []),
            ...(sourceRecordId ? [{ label: 'مرجع المصدر', value: sourceRecordId }] : []),
            ...(publishStage ? [{ label: 'مرحلة النشر', value: publishStage }] : []),
            ...(canonicalReferenceLabel ? [{ label: 'مرجع موحد', value: canonicalReferenceLabel, tone: 'brand' as const }] : []),
            { label: 'حالة المتجر', value: storeStateLabel, tone: storeOpen ? 'success' : 'warning' },
            { label: 'الظهور في القائمة', value: visibilityLabel, tone: listingEnabled ? 'success' : 'warning' },
          ]}
        />
      </Surface>

      <SectionBlock
        title="بيانات الفرع"
        subtitle="تعديل الاسم والعنوان والاتصال من نفس المساحة، بدون قفزات خارجية."
        actionLabel="تعديل بيانات الفرع"
        expanded={branchSectionOpen}
        onToggle={() => setBranchSectionOpen((current) => !current)}
      >
        <Box gap={3}>
          <TextField label="اسم الفرع" value={branchName} onChangeText={setBranchName} placeholder="اسم الفرع الحالي" />
          <TextField label="العنوان" value={branchAddress} onChangeText={setBranchAddress} placeholder="عنوان الفرع" multiline />
          <TextField label="رقم التواصل" value={branchContact} onChangeText={setBranchContact} placeholder="رقم الهاتف" keyboardType="phone-pad" />
          <Text role="caption" tone="muted">
            التعديلات تبقى محلية حتى الضغط على زر الحفظ الأساسي أسفل الصفحة.
          </Text>
        </Box>
      </SectionBlock>

      <SectionBlock
        title="الهوية والاعتماد"
        subtitle="حالة الاعتماد والوثائق والسجل في مراجعة واحدة مضغوطة."
        actionLabel="إدارة الهوية"
        expanded={identitySectionOpen}
        onToggle={() => setIdentitySectionOpen((current) => !current)}
      >
        <Box gap={3}>
          <KeyValueList
            dense
            items={[
              { label: 'حالة الاعتماد', value: 'معتمد', tone: 'success' },
              { label: 'حالة الوثائق', value: 'مكتملة', tone: 'success' },
              { label: 'آخر مراجعة', value: 'اليوم 09:12', tone: 'brand' },
              { label: 'التجهيز للنشر', value: 'جاهز', tone: 'info' },
            ]}
          />

          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
            <Chip label="الرخصة مكتملة" tone="success" />
            <Chip label="التحقق الضريبي جاهز" tone="brand" />
            <Chip label="المراجعة اليومية نشطة" tone="info" />
          </Box>

          <Surface tone="inset" padding={3} gap={2}>
            {identityDocuments.map((document) => (
              <ListItem
                key={document.id}
                title={document.title}
                subtitle={document.subtitle}
                meta={document.meta}
                badgeLabel={document.badgeLabel}
              />
            ))}
          </Surface>
        </Box>
      </SectionBlock>

      <SectionBlock
        title="الظهور والنطاق"
        subtitle="الظهور في القائمة ونطاق الخدمة الحالي من نفس الصفحة."
        actionLabel="اختيار النطاق"
        expanded={visibilitySectionOpen}
        onToggle={() => {
          setVisibilitySectionOpen((current) => !current);
          onOpenStoreScope?.();
        }}
      >
        <Box gap={3}>
          <KeyValueList
            dense
            items={[
              { label: 'الظهور في القائمة', value: visibilityLabel, tone: listingEnabled ? 'success' : 'warning' },
              { label: 'النطاق الحالي', value: branchLabel },
              { label: 'المنطقة', value: activeZoneLabel },
              { label: 'المعروض للعملاء', value: storeOpen ? 'مؤهل للنشر' : 'موقوف مؤقتًا', tone: storeOpen ? 'success' : 'warning' },
            ]}
          />
          <Text role="caption" tone="muted">
            يظل اختيار النطاق محليًا داخل نفس السطح، ويمكن ضمه إلى تحديث الهوية والفرع في حفظ واحد.
          </Text>
        </Box>
      </SectionBlock>

      <MobileStickyPrimaryAction
        label="حفظ تغييرات ملف المتجر"
        helperText={lastSavedLabel ? `آخر حفظ: ${lastSavedLabel}` : 'التعديلات تحفظ محليًا حتى المزامنة التالية.'}
        onPress={onSave}
      />
    </Box>
  );
}

export default StoreProfileScreen;
