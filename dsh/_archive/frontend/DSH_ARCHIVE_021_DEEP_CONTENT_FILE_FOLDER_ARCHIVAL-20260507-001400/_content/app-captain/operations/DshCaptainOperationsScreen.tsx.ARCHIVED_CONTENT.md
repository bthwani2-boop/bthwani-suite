# Archived Content Blocks from DshCaptainOperationsScreen.tsx

## Block 1: DshCaptainOperationsScreen component + dead helpers + demoSnapshot

- **Original file**: `dsh/frontend/app-captain/operations/DshCaptainOperationsScreen.tsx`
- **Approximate lines**: 5-122, 293
- **Block name/type**: `DshCaptainOperationsScreen` main component + `DshCaptainOperationsScreenProps` type + `CaptainSupportScreenId` type (moved, not removed) + `demoSnapshot` const + `AvailabilitySection`, `RouteReadinessSection`, `SafetySection`, `renderOperationsState` helpers + default export
- **Classification**: CONTENT_ARCHIVE_READY (component) + CONTENT_NOISE_REMOVE (demoSnapshot with "متاح" demo labels + "بدون أي backend أو mutation" user-facing noise)
- **Reason**: `DshCaptainOperationsScreen` has zero external consumers. No shell renders it. No route references it. The `demoSnapshot` contains demo/preview labels. The subtitle text "بدون أي backend أو mutation" is user-facing noise.
- **Reference/import/render count**: 0 external consumers for DshCaptainOperationsScreen; 0 renders; 0 route refs; 0 screenId refs
- **Why safe to remove**: Only self-referential. The ACTIVE exports (`DshCaptainChatReadAckScreen`, `DshCaptainChatSendScreen`, `DshCaptainSupportDirectoryScreen`, `CaptainSupportScreenId`, `SimpleSupportScreen`) remain in the file.

### Original snippet (lines 5-122):
```tsx
export type CaptainSupportScreenId =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-balance'
  | 'order-accept'
  | 'order-deliver'
  | 'order-details'
  | 'order-get'
  | 'order-pickup'
  | 'orders-list'
  | 'orders-offers-list'
  | 'profile-get'
  | 'proof-upload'
  | 'tier-evaluate'
  | 'tier-info';

export type DshCaptainOperationsScreenProps = {
  section?: 'availability' | 'route-readiness' | 'safety';
  state?: DshCaptainOperationsScreenState;
  snapshot?: DshCaptainOperationsSnapshot;
  onBack?: () => void;
  onRetry?: () => void;
};

const demoSnapshot: DshCaptainOperationsSnapshot = {
  availabilityLabel: 'متاح',
  routeReadinessLabel: 'جاهز للمسار',
  safetyLabel: 'سلامة مستقرة',
};

function AvailabilitySection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainOperationsSnapshot }) {
  return (
    <Surface tone="brand" gap={3}>
      <SectionHeader title="إتاحة الكابتن" subtitle="تشغيل الكابتن نفسه، وليس الطلب." />
      <KeyValueList
        items={[
          { label: 'الحالة', value: snapshot.availabilityLabel, tone: 'success' },
          { label: 'الاستعداد', value: 'متابعة الطلبات مباشرة' },
        ]}
      />
    </Surface>
  );
}

function RouteReadinessSection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainOperationsSnapshot }) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="جاهزية المسار" subtitle="تأكد من جاهزية الطريق قبل الإرسال أو التوجيه." />
      <KeyValueList
        items={[
          { label: 'الملخص', value: snapshot.routeReadinessLabel, tone: 'brand' },
          { label: 'التوجيه', value: 'محدد محليًا' },
        ]}
      />
    </Surface>
  );
}

function SafetySection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainOperationsSnapshot }) {
  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="السلامة" subtitle="مؤشرات السلامة يجب أن تبقى قصيرة وواضحة." />
      <Text role="bodySm" tone="muted">
        {snapshot.safetyLabel}
      </Text>
    </Surface>
  );
}

function renderOperationsState(state: DshCaptainOperationsScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تحميل العمليات" description="تبقى الجاهزية ظاهرة عند وصول البيانات." />;
  }
  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد بيانات تشغيلية" description="أعد التحميل عند توفر إشارات الإتاحة أو السلامة." actionLabel={onRetry ? 'إعادة التحميل' : undefined} onActionPress={onRetry} />;
  }
  if (state === 'error') {
    return <StateView stateId="recoverableError" title="تعذر تحميل العمليات" description="حاول مرة أخرى من دون مغادرة مسار التشغيل." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }
  return null;
}

export function DshCaptainOperationsScreen({
  section = 'availability',
  state = 'ready',
  snapshot = demoSnapshot,
  onBack,
  onRetry,
}: DshCaptainOperationsScreenProps) {
  if (state !== 'ready') {
    return (
      <MobileScrollView padding={4} gap={4}>
        {renderOperationsState(state, onRetry)}
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Text role="titleLg">التشغيل</Text>
      <Text role="bodyMd" tone="muted">
        جاهزية الكابتن، المسار، والسلامة بدون أي backend أو mutation.
      </Text>

      {section === 'availability' ? <AvailabilitySection snapshot={snapshot} /> : null}
      {section === 'route-readiness' ? <RouteReadinessSection snapshot={snapshot} /> : null}
      {section === 'safety' ? <SafetySection snapshot={snapshot} /> : null}

      {section === 'availability' ? <RouteReadinessSection snapshot={snapshot} /> : null}
      {section === 'availability' ? <SafetySection snapshot={snapshot} /> : null}

      <Button label="العودة" tone="ghost" onPress={onBack} />
    </MobileScrollView>
  );
}
```

### Original default export (line 293):
```tsx
export default DshCaptainOperationsScreen;
```

### Rollback snippet:
Restore lines 3-122 and line 293 from this archived content file back into `dsh/frontend/app-captain/operations/DshCaptainOperationsScreen.tsx`. Re-add `import type { DshCaptainOperationsScreenState, DshCaptainOperationsSnapshot } from './dshCaptainOperationsModel';` and `import { Button, KeyValueList, ... StateView, ... } from '@bthwani/ui-kit';`.

## Block 2: User-facing noise "بدون أي backend أو mutation"

- **Original file**: `dsh/frontend/app-captain/operations/DshCaptainOperationsScreen.tsx`
- **Line**: 109
- **Classification**: CONTENT_NOISE_REMOVE
- **Reason**: User-facing text explicitly mentions "backend" and "mutation" — internal dev jargon that should not appear in production UI
- **Reference count**: rendered inside DshCaptainOperationsScreen which itself is dead (0 consumers)
- **Why safe**: The entire containing component is dead — removing the whole component removes this noise automatically
