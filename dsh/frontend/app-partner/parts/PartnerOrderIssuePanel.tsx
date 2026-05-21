import React from 'react';
import { Pressable } from 'react-native';
import { Box, Button, Chip, SectionHeader, Surface, Text, TextField } from '@bthwani/ui-kit';
import type { DshPartnerOperationalFlowId, DshPartnerSupportIssueCategoryId } from '../dsh-partner.types';

export type PartnerOrderIssueFlowId = 'order-issue-queue' | 'order-reject';

export type PartnerOrderIssueCategorySpec = {
  id: DshPartnerSupportIssueCategoryId;
  title: string;
  description: string;
  owner: 'شريك' | 'كابتن' | 'عميل' | 'دعم' | 'ميداني' | 'دعم / WLT';
  severity: 'warning' | 'danger' | 'info';
  allowedActions: readonly string[];
  forbiddenActions: readonly string[];
  nextFlowId: DshPartnerOperationalFlowId;
};

export const PARTNER_ORDER_ISSUE_CATEGORY_SPECS: Record<
  DshPartnerSupportIssueCategoryId,
  PartnerOrderIssueCategorySpec
> = {
  'delayed-preparation': {
    id: 'delayed-preparation',
    title: 'تأخر التحضير',
    description: 'الطلب ما زال داخل الفرع وتأخر عن وقت التحضير المتوقع ويحتاج قرارًا تشغيليًا سريعًا.',
    owner: 'شريك',
    severity: 'warning',
    allowedActions: ['تحديث حالة التحضير', 'طلب مهلة قصيرة', 'فتح محادثة مع الدعم'],
    forbiddenActions: ['إغلاق المشكلة دون تحديث الطلب', 'تحويلها إلى استرداد مالي محلي'],
    nextFlowId: 'order-prepare',
  },
  'item-unavailable': {
    id: 'item-unavailable',
    title: 'نفاد صنف مؤثر',
    description: 'عنصر غير متاح يهدد استمرار الطلب أو يتطلب بديلًا واضحًا قبل الحفظ.',
    owner: 'شريك',
    severity: 'danger',
    allowedActions: ['تعديل المخزون', 'اقتراح بديل', 'طلب قرار سريع من الدعم'],
    forbiddenActions: ['تأكيد الجاهزية مع بقاء الصنف ناقصًا', 'رفض الطلب تلقائيًا بلا توثيق'],
    nextFlowId: 'inventory-adjust',
  },
  'partner-reject-request': {
    id: 'partner-reject-request',
    title: 'طلب رفض من الشريك',
    description: 'رفض الطلب لا يتم إلا لسبب تشغيلي صريح مع توثيق واضح داخل نفس السياق.',
    owner: 'شريك',
    severity: 'danger',
    allowedActions: ['فتح مسار الرفض', 'إضافة سبب تشغيلي', 'تصعيد للمراجعة عند الشك'],
    forbiddenActions: ['رفض صامت', 'إخفاء سبب الرفض', 'تحويله إلى رد مالي محلي'],
    nextFlowId: 'order-reject',
  },
  'courier-not-arrived': {
    id: 'courier-not-arrived',
    title: 'الكابتن / الموصل لم يصل',
    description: 'الطلب جاهز أو قريب من الجاهزية لكن نقطة الاستلام لم تكتمل بعد.',
    owner: 'كابتن',
    severity: 'warning',
    allowedActions: ['مراجعة handoff', 'طلب إثبات وصول', 'فتح محادثة متابعة'],
    forbiddenActions: ['إغلاق الحالة كأنها تسليم ناجح', 'تأكيد تسليم بدون وصول فعلي'],
    nextFlowId: 'order-handoff',
  },
  'customer-not-responding': {
    id: 'customer-not-responding',
    title: 'العميل غير متجاوب',
    description: 'المحادثة أو الاتصال مطلوبان لإكمال الطلب أو تعديل الاستلام.',
    owner: 'عميل',
    severity: 'info',
    allowedActions: ['فتح محادثة', 'طلب إثبات محاولة التواصل', 'رفع الحالة للتصعيد'],
    forbiddenActions: ['إلغاء الطلب مباشرةً', 'تحميل الكابتن المسؤولية دون محاولة تواصل'],
    nextFlowId: 'order-chat-send',
  },
  'handoff-mismatch': {
    id: 'handoff-mismatch',
    title: 'عدم تطابق في handoff',
    description: 'هناك تضارب بين الجهة المستلمة، زمن التسليم، أو حالة الطلب عند نقطة handoff.',
    owner: 'شريك',
    severity: 'danger',
    allowedActions: ['مراجعة handoff', 'طلب إثبات', 'فتح محادثة مشتركة'],
    forbiddenActions: ['تأكيد الخروج للتوصيل قبل تثبيت handoff', 'تجاوز إثبات التسليم'],
    nextFlowId: 'order-handoff',
  },
  'wrong-item': {
    id: 'wrong-item',
    title: 'عنصر خاطئ أو غير مطابق',
    description: 'الطلب أو الدفعة تحتاج مراجعة لأن العنصر المجهز لا يطابق المرجع المطلوب.',
    owner: 'شريك',
    severity: 'warning',
    allowedActions: ['فتح queue المشكلة', 'مراجعة العنصر', 'طلب إثبات بصري'],
    forbiddenActions: ['إرسال الطلب كما هو', 'إغلاق الحالة دون مطابقة'],
    nextFlowId: 'order-issue-queue',
  },
  'payment-refund-review': {
    id: 'payment-refund-review',
    title: 'مراجعة دفع / استرداد',
    description: 'هذه الحالة Preview فقط؛ تظهر لإشارة تشغيلية ولا تملك أي منطق مالي محلي داخل DSH.',
    owner: 'دعم / WLT',
    severity: 'info',
    allowedActions: ['إضافة Preview tag', 'تحويل للمراجعة', 'فتح bridge مالي للقراءة فقط'],
    forbiddenActions: ['بدء استرداد', 'تسوية عمولة', 'تعديل رصيد أو ledger'],
    nextFlowId: 'partner-finance-bridge',
  },
};

function resolveCategoryFlowId(categoryId: DshPartnerSupportIssueCategoryId): PartnerOrderIssueFlowId {
  return categoryId === 'partner-reject-request' ? 'order-reject' : 'order-issue-queue';
}

export function resolvePartnerOrderIssueDefaultCategory(
  activeFlowId?: PartnerOrderIssueFlowId
): DshPartnerSupportIssueCategoryId {
  if (activeFlowId === 'order-reject') {
    return 'partner-reject-request';
  }

  return 'delayed-preparation';
}

export function getPartnerOrderIssueCategorySpec(
  categoryId: DshPartnerSupportIssueCategoryId
): PartnerOrderIssueCategorySpec {
  return PARTNER_ORDER_ISSUE_CATEGORY_SPECS[categoryId];
}

type IssueCategoryCardProps = {
  category: PartnerOrderIssueCategorySpec;
  selected: boolean;
};

function IssueCategoryCard({ category, selected }: IssueCategoryCardProps) {
  const severityTone =
    category.severity === 'danger'
      ? 'danger'
      : category.severity === 'warning'
        ? 'warning'
        : 'info';

  return (
    <Surface
      tone={selected ? 'default' : 'raised'}
      padding={3}
      gap={2}
    >
      <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap' }} gap={2}>
        <Text role="bodyStrong">{category.title}</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Chip label={category.owner} tone="brand" />
          <Chip
            label={category.severity === 'danger' ? 'حرجة' : category.severity === 'warning' ? 'تحتاج قرار' : 'متابعة'}
            tone={severityTone}
            selected={selected}
          />
        </Box>
      </Box>

      <Text role="bodySm" tone="muted">
        {category.description}
      </Text>

      <Text role="caption" tone="soft">
        {`المسار التالي: ${category.nextFlowId}`}
      </Text>
    </Surface>
  );
}

export type DshPartnerOrderIssuePanelProps = {
  activeFlowId?: PartnerOrderIssueFlowId;
  selectedCategoryId?: DshPartnerSupportIssueCategoryId;
  onSelectFlow?: (flowId: PartnerOrderIssueFlowId) => void;
  onSelectCategory?: (categoryId: DshPartnerSupportIssueCategoryId) => void;
};

export function DshPartnerOrderIssuePanel({
  activeFlowId,
  selectedCategoryId,
  onSelectFlow,
  onSelectCategory,
}: DshPartnerOrderIssuePanelProps) {
  const [issueNote, setIssueNote] = React.useState('');
  const [internalCategoryId, setInternalCategoryId] = React.useState<DshPartnerSupportIssueCategoryId>(
    selectedCategoryId ?? resolvePartnerOrderIssueDefaultCategory(activeFlowId),
  );

  React.useEffect(() => {
    if (selectedCategoryId) {
      setInternalCategoryId(selectedCategoryId);
      return;
    }

    setInternalCategoryId(resolvePartnerOrderIssueDefaultCategory(activeFlowId));
  }, [activeFlowId, selectedCategoryId]);

  const selectedCategory = PARTNER_ORDER_ISSUE_CATEGORY_SPECS[internalCategoryId];

  function handleSelectCategory(categoryId: DshPartnerSupportIssueCategoryId) {
    setInternalCategoryId(categoryId);
    onSelectCategory?.(categoryId);
  }

  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader
        title="معالجة الاستثناءات"
        subtitle="تعريف الاستثناءات أصبح أوسع من طابور المشكلة والرفض فقط، مع مالك وإجراءات وممنوعات واضحة لكل حالة."
      />

      <Box gap={2}>
        {(Object.values(PARTNER_ORDER_ISSUE_CATEGORY_SPECS) as PartnerOrderIssueCategorySpec[]).map((category) => (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={category.title}
            onPress={() => handleSelectCategory(category.id)}
            style={{ width: '100%' }}
          >
            <IssueCategoryCard
              category={category}
              selected={internalCategoryId === category.id}
            />
          </Pressable>
        ))}
      </Box>

      <Surface tone="default" padding={3} gap={2}>
        <Text role="bodyStrong">{selectedCategory.title}</Text>
        <Text role="bodySm" tone="muted">
          {selectedCategory.description}
        </Text>
        <Text role="caption" tone="soft">{`المالك الحالي: ${selectedCategory.owner}`}</Text>
        <Text role="caption" tone="soft">{`المسار التالي: ${selectedCategory.nextFlowId}`}</Text>
        <Text role="caption" tone="success">
          {`الإجراءات المسموحة: ${selectedCategory.allowedActions.join(' · ')}`}
        </Text>
        <Text role="caption" tone="warning">
          {`الإجراءات الممنوعة: ${selectedCategory.forbiddenActions.join(' · ')}`}
        </Text>
      </Surface>

      <TextField
        label="ملاحظة تشغيلية مختصرة"
        value={issueNote}
        onChangeText={setIssueNote}
        hint="اكتب سبب المعالجة أو الإجراء التالي. هذه الملاحظة Preview فقط ولا تنشئ mutation."
      />

      <Button
        label="تأكيد المتابعة"
        tone="secondary"
        onPress={() => onSelectFlow?.(resolveCategoryFlowId(internalCategoryId))}
      />
    </Surface>
  );
}

export default DshPartnerOrderIssuePanel;
