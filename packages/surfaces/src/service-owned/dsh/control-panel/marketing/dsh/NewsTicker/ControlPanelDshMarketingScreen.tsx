'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthNewsTickerBar, BthText, useDirection, useUiText } from '@bthwani/ui-kit';
import { BthWebMissionHeroCard, BthWebSectionCard, BthWebSignalCard } from '@bthwani/ui-kit/web';
import { resolveMarketingTickerPreview, type MarketingNewsTickerLocale } from './news-ticker-fixtures';

export type ControlPanelDshMarketingScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

function buildTickerActions(
  hubHref: string,
  operationsHref: string,
  openDashboardLabel: string,
  openOperationsLabel: string,
) {
  return [
    { id: 'dashboard', label: openDashboardLabel, href: hubHref },
    { id: 'operations', label: openOperationsLabel, href: operationsHref },
  ] as const;
}

export function ControlPanelDshMarketingScreen({
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
}: ControlPanelDshMarketingScreenProps) {
  const router = useRouter();
  const uiText = useUiText();
  const { language } = useDirection();
  const marketingCopy = uiText.controlPanel.marketing;
  const locale: MarketingNewsTickerLocale = String(language).toLowerCase().startsWith('en') ? 'en' : 'ar';
  const [currentTime, setCurrentTime] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const tickerPreview = React.useMemo(
    () => resolveMarketingTickerPreview(currentTime, locale),
    [currentTime, locale]
  );

  const tickerActions = buildTickerActions(
    hubHref,
    operationsHref,
    marketingCopy.openDashboard,
    marketingCopy.openOperations
  );

  const marketingSignals = [
    {
      id: 'ticker',
      title: marketingCopy.tickerTitle,
      description: marketingCopy.tickerDescription,
      value: tickerPreview.statusLabel,
      tone: tickerPreview.isOpen ? 'best' : 'neutral',
    },
    {
      id: 'preview',
      title: marketingCopy.previewTitle,
      description: marketingCopy.previewDescription,
      value: tickerPreview.isOpen ? marketingCopy.openDashboard : marketingCopy.openOperations,
      tone: 'neutral' as const,
    },
    {
      id: 'schedule',
      title: marketingCopy.scheduleTitle,
      description: marketingCopy.scheduleDescription,
      value: tickerPreview.windowLabel,
      tone: 'neutral' as const,
    },
    {
      id: 'assets',
      title: marketingCopy.assetsTitle,
      description: marketingCopy.assetsDescription,
      value: String(tickerActions.length + 2),
      tone: 'neutral' as const,
    },
  ] as const;

  return (
    <BthBox gap={4}>
      <BthWebMissionHeroCard
        badges={[marketingCopy.heroEyebrow, tickerPreview.statusLabel, marketingCopy.previewTitle]}
        eyebrow={marketingCopy.heroEyebrow}
        title={marketingCopy.heroTitle}
        description={marketingCopy.heroDescription}
        metaItems={[
          `${marketingCopy.scheduleTitle}: ${tickerPreview.windowLabel}`,
          `${marketingCopy.tickerTitle}: ${tickerPreview.statusLabel}`,
          `${marketingCopy.assetsTitle}: ${tickerActions.length + 2}`,
        ]}
        primaryAction={{ label: marketingCopy.openDashboard, href: hubHref }}
        secondaryAction={{ label: marketingCopy.openOperations, href: operationsHref }}
      />

      <BthBox gap={2}>
        {marketingSignals.map((signal) => (
          <BthWebSignalCard
            key={signal.id}
            title={signal.title}
            value={signal.value}
            description={signal.description}
            tone={signal.tone}
          />
        ))}
      </BthBox>

      <BthWebSectionCard title={marketingCopy.tickerTitle} description={marketingCopy.tickerDescription}>
        <BthBox gap={3}>
          <BthNewsTickerBar
            statusLabel={tickerPreview.statusLabel}
            message={tickerPreview.message}
            onPress={() => router.push(hubHref)}
          />
          <BthText role="bodySm" tone="muted">
            {tickerPreview.message}
          </BthText>
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title={marketingCopy.scheduleTitle} description={marketingCopy.scheduleDescription}>
        <BthBox gap={2}>
          <BthText role="bodySm" tone="muted">
            {`${marketingCopy.scheduleTitle}: ${tickerPreview.windowLabel}`}
          </BthText>
          <BthText role="bodySm" tone="muted">
            {tickerPreview.message}
          </BthText>
          <BthBox gap={2}>
            <BthButton label={marketingCopy.openDashboard} onPress={() => router.push(hubHref)} />
            <BthButton label={marketingCopy.openOperations} tone="secondary" onPress={() => router.push(operationsHref)} />
          </BthBox>
        </BthBox>
      </BthWebSectionCard>

      <BthWebSectionCard title={marketingCopy.assetsTitle} description={marketingCopy.assetsDescription}>
        <BthBox gap={2}>
          <BthText role="bodySm" tone="muted">
            {marketingCopy.assetsDescription}
          </BthText>
          <BthBox gap={1}>
            <BthText role="bodySm">- {marketingCopy.tickerTitle}</BthText>
            <BthText role="bodySm">- {marketingCopy.scheduleTitle}</BthText>
            <BthText role="bodySm">- {marketingCopy.previewTitle}</BthText>
            <BthText role="bodySm">- {marketingCopy.openOperations}</BthText>
          </BthBox>
          <BthBox gap={2}>
            <BthButton label={marketingCopy.openDashboard} onPress={() => router.push(hubHref)} />
            <BthButton label={marketingCopy.openOperations} tone="secondary" onPress={() => router.push(operationsHref)} />
          </BthBox>
        </BthBox>
      </BthWebSectionCard>
    </BthBox>
  );
}

export default ControlPanelDshMarketingScreen;