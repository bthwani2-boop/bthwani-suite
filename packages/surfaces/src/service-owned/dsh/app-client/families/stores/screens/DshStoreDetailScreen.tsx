import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthChip,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
  useUiText,
} from '@bthwani/ui-kit';

export type DshStoreDetailData = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  etaLabel: string;
  deliveryFeeLabel: string;
  highlights: string[];
  categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
  deliveryModes?: Array<{ id: 'delivery' | 'pickup'; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
  tags?: string[];
  followersLabel?: string;
  priceMatchLabel?: string;
};

export type DshStoreDetailScreenProps = {
  state?: 'ready' | 'loading' | 'error';
  store?: DshStoreDetailData;
  onOpenMenu?: (storeId: string) => void;
  onStartDelivery?: (storeId: string) => void;
  onOpenTracking?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(
  state: 'loading' | 'error',
  storeText: ReturnType<typeof useUiText>['storeScreen'],
  onRetry?: () => void,
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title={storeText.states.storeErrorTitle}
      description={storeText.states.storeErrorDescription}
      actionLabel={storeText.states.retry}
      onActionPress={onRetry}
    />
  );
}

export function DshStoreDetailScreen({
  state = 'ready',
  store,
  onOpenMenu,
  onStartDelivery,
  onOpenTracking,
  onRetry,
}: DshStoreDetailScreenProps) {
  const uiText = useUiText();
  const storeText = uiText.storeScreen;

  if (state !== 'ready') {
    return renderNonReadyState(state, storeText, onRetry);
  }

  if (!store) {
    return (
      <BthStateView
        stateId="blockingError"
        title={storeText.states.contextMissingTitle}
        description={storeText.states.contextMissingDescription}
      />
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title={store.name}
          subtitle={store.subtitle}
          trailing={<BthChip label={store.statusLabel} selected />}
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthChip label={store.etaLabel} selected />
          <BthChip label={store.deliveryFeeLabel} />
          {store.followersLabel ? <BthChip label={store.followersLabel} /> : null}
          {store.priceMatchLabel ? <BthChip label={store.priceMatchLabel} /> : null}
        </BthBox>
      </BthSurface>

      {store.tags?.length ? (
        <BthSurface tone="inset" gap={2}>
          <BthSectionHeader title={storeText.get.subscriptionsTitle} subtitle="تظهر كشرائح مضغوطة وسريعة القراءة." />
          <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {store.tags.map((tag) => (
              <BthChip key={`${store.id}-${tag}`} label={tag} />
            ))}
          </BthBox>
        </BthSurface>
      ) : null}

      {store.categories?.length ? (
        <BthSurface tone="raised" gap={2}>
          <BthSectionHeader title={storeText.get.availableCategories} subtitle="الأقسام الأساسية تبقى ظاهرة قبل الدخول في التفاصيل." count={store.categories.length} />
          <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {store.categories.map((category) => (
              <BthChip
                key={category.id}
                label={`${category.label} (${category.itemCount})`}
                selected={Boolean(category.isPopular)}
              />
            ))}
          </BthBox>
        </BthSurface>
      ) : null}

      {store.deliveryModes?.length ? (
        <BthSurface tone="raised" gap={2}>
          <BthSectionHeader title="أوضاع التوصيل" subtitle="الخيارات المتاحة يجب أن تبقى واضحة قبل إتمام الطلب." count={store.deliveryModes.length} />
          <BthBox gap={2}>
            {store.deliveryModes.map((mode) => (
              <BthCard
                key={mode.id}
                title={mode.name}
                subtitle={`${mode.isAvailable ? 'متاح' : 'غير متاح'}${mode.estimatedTime ? ` · ${mode.estimatedTime}` : ''}${mode.fee != null ? ` · ${mode.fee} ر.س` : ''}`}
              />
            ))}
          </BthBox>
        </BthSurface>
      ) : null}

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="مزايا المتجر"
          subtitle="تفاصيل قصيرة تبني الثقة وتوضح نقاط القوة بسرعة."
        />
        <BthBox gap={2}>
          {store.highlights.map((highlight, index) => (
            <BthCard
              key={`${store.id}-highlight-${index}`}
              title={highlight}
              subtitle="تفصيلة داعمة لقرار الطلب السريع." 
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="الإجراء التالي"
          subtitle="زر رئيسي واضح ومسار بديل آمن بدون تشتيت."
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton
            label={storeText.get.fullMenu}
            tone="secondary"
            onPress={() => onOpenMenu?.(store.id)}
          />
          <BthButton
            label={storeText.get.platformDelivery}
            onPress={() => onStartDelivery?.(store.id)}
          />
        </BthBox>
        <BthButton
          label="فتح التتبع"
          tone="ghost"
          onPress={onOpenTracking}
        />
        <BthText role="caption" tone="muted">
          هذه الشاشة تركز على التجربة والتنقل فقط دون منطق تشغيلي مباشر.
        </BthText>
      </BthSurface>
    </BthMobileScrollView>
  );
}