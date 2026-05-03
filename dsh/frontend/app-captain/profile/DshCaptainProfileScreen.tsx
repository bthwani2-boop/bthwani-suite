import React from 'react';
import { Button, KeyValueList, MobileScrollView, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';
import type { DshCaptainProfileScreenState, DshCaptainProfileSnapshot } from './dshCaptainProfileModel';

export type DshCaptainProfileScreenProps = {
  section?: 'profile-get' | 'tier-info' | 'tier-evaluate';
  state?: DshCaptainProfileScreenState;
  snapshot?: DshCaptainProfileSnapshot;
  onBack?: () => void;
  onRetry?: () => void;
};

const demoSnapshot: DshCaptainProfileSnapshot = {
  displayName: 'الكابتن عبدالله السبيعي',
  tierLabel: 'Elite 3',
  readinessLabel: 'متصل وجاهز',
};

function ProfileSummarySection({ snapshot = demoSnapshot }: { snapshot?: DshCaptainProfileSnapshot }) {
  return (
    <Surface tone="brand" gap={3}>
      <SectionHeader title="ملف الكابتن" subtitle="اقرأ ملف الكابتن الحالي وحالة الجاهزية للمسار." />
      <KeyValueList
        items={[
          { label: 'الكابتن', value: snapshot.displayName, tone: 'brand' },
          { label: 'المستوى', value: snapshot.tierLabel, tone: 'success' },
          { label: 'الجاهزية', value: snapshot.readinessLabel, tone: 'success' },
        ]}
      />
    </Surface>
  );
}

function TierSection({ snapshot = demoSnapshot, mode }: { snapshot?: DshCaptainProfileSnapshot; mode: 'tier-info' | 'tier-evaluate' }) {
  if (mode === 'tier-info') {
    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="معلومات الطبقة" subtitle="اقرأ مزايا ومتطلبات الطبقة الحالية." />
        <KeyValueList
          items={[
            { label: 'الطبقة الحالية', value: snapshot.tierLabel, tone: 'brand' },
            { label: 'مكافأة الأجر', value: '+8%' },
            { label: 'عتبة الطبقة التالية', value: '120 مسارًا مكتملًا' },
          ]}
        />
      </Surface>
    );
  }

  return (
    <Surface tone="raised" gap={3}>
      <SectionHeader title="تقييم الطبقة" subtitle="راجع ما إذا كان الكابتن جاهزًا للطبقة التالية." />
      <KeyValueList
        items={[
          { label: 'معدل الإكمال', value: '97%', tone: 'success' },
          { label: 'معدل الإلغاء', value: '1.2%', tone: 'info' },
          { label: 'الحوادث', value: '0', tone: 'success' },
        ]}
      />
    </Surface>
  );
}

function renderProfileState(state: DshCaptainProfileScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تحميل الملف" description="تبقى لقطة الملف مرئية عند وصول البيانات." />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا توجد بيانات ملف" description="أعد التحميل عند توفر ملف الكابتن." actionLabel={onRetry ? 'إعادة التحميل' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'error') {
    return <StateView stateId="recoverableError" title="تعذر تحميل الملف" description="حاول مرة أخرى من دون مغادرة مساحة الملف." actionLabel="إعادة المحاولة" onActionPress={onRetry} />;
  }

  return null;
}

export function DshCaptainProfileScreen({
  section = 'profile-get',
  state = 'ready',
  snapshot = demoSnapshot,
  onBack,
  onRetry,
}: DshCaptainProfileScreenProps) {
  if (state !== 'ready') {
    return (
      <MobileScrollView padding={4} gap={4}>
        {renderProfileState(state, onRetry)}
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <ProfileSummarySection snapshot={snapshot} />
      {section === 'tier-info' ? <TierSection snapshot={snapshot} mode="tier-info" /> : null}
      {section === 'tier-evaluate' ? <TierSection snapshot={snapshot} mode="tier-evaluate" /> : null}
      {section === 'profile-get' ? <TierSection snapshot={snapshot} mode="tier-info" /> : null}
      <Button label="العودة" tone="ghost" onPress={onBack} />
    </MobileScrollView>
  );
}

export function DshCaptainProfileGetScreen(props: Omit<DshCaptainProfileScreenProps, 'section'> = {}) {
  return <DshCaptainProfileScreen {...props} section="profile-get" />;
}

export function DshCaptainTierInfoScreen(props: Omit<DshCaptainProfileScreenProps, 'section'> = {}) {
  return <DshCaptainProfileScreen {...props} section="tier-info" />;
}

export function DshCaptainTierEvaluateScreen(props: Omit<DshCaptainProfileScreenProps, 'section'> = {}) {
  return <DshCaptainProfileScreen {...props} section="tier-evaluate" />;
}

export default DshCaptainProfileScreen;
